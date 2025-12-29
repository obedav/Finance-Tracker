<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class TransactionExportController extends Controller
{
    /**
     * Export transactions to CSV format
     */
    public function exportCsv(Request $request)
    {
        try {
            $user = $request->user();

            // Get filter parameters
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $type = $request->input('type'); // income, expense, or null for all

            // Build query
            $query = Transaction::where('user_id', $user->id)
                ->with('category');

            // Apply date filters
            if ($startDate) {
                $query->where('date', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('date', '<=', $endDate);
            }

            // Apply type filter
            if ($type && in_array($type, ['income', 'expense'])) {
                $query->where('type', $type);
            }

            // Get transactions ordered by date
            $transactions = $query->orderBy('date', 'desc')->get();

            // Generate CSV content
            $csvData = $this->generateCsvContent($transactions);

            // Create filename with timestamp
            $filename = 'transactions_' . date('Y-m-d_His') . '.csv';

            // Return CSV response
            return response($csvData)
                ->header('Content-Type', 'text/csv; charset=utf-8')
                ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate CSV content from transactions
     */
    private function generateCsvContent($transactions)
    {
        // CSV header
        $csv = "Date,Description,Category,Type,Amount,Notes\n";

        // Add transaction rows
        foreach ($transactions as $transaction) {
            $csv .= $this->escapeCsvValue($transaction->date) . ',';
            $csv .= $this->escapeCsvValue($transaction->description) . ',';
            $csv .= $this->escapeCsvValue($transaction->category->name ?? 'Uncategorized') . ',';
            $csv .= $this->escapeCsvValue(ucfirst($transaction->type)) . ',';
            $csv .= $this->escapeCsvValue(number_format($transaction->amount, 2, '.', '')) . ',';
            $csv .= $this->escapeCsvValue($transaction->notes ?? '') . "\n";
        }

        return $csv;
    }

    /**
     * Escape CSV value to handle commas, quotes, and newlines
     */
    private function escapeCsvValue($value)
    {
        // Convert to string
        $value = (string) $value;

        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (strpos($value, ',') !== false || strpos($value, '"') !== false || strpos($value, "\n") !== false) {
            $value = '"' . str_replace('"', '""', $value) . '"';
        }

        return $value;
    }

    /**
     * Import transactions from CSV file
     */
    public function importCsv(Request $request)
    {
        try {
            // Validate file upload
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:csv,txt|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            $file = $request->file('file');

            // Read and parse CSV
            $csvData = array_map('str_getcsv', file($file->getRealPath()));

            // Remove header row
            $header = array_shift($csvData);

            // Validate header format
            $expectedHeaders = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes'];
            $headerValid = count(array_intersect($header, $expectedHeaders)) >= 5; // At least 5 required columns

            if (!$headerValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid CSV format. Expected headers: Date, Description, Category, Type, Amount, Notes'
                ], 422);
            }

            $imported = 0;
            $skipped = 0;
            $errors = [];

            // Process each row
            foreach ($csvData as $index => $row) {
                $rowNumber = $index + 2; // +2 because we removed header and arrays are 0-indexed

                // Skip empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                try {
                    // Parse row data
                    $date = $row[0] ?? null;
                    $description = $row[1] ?? '';
                    $categoryName = $row[2] ?? 'Uncategorized';
                    $type = strtolower($row[3] ?? 'expense');
                    $amount = $row[4] ?? 0;
                    $notes = $row[5] ?? null;

                    // Validate required fields
                    if (empty($date) || empty($amount)) {
                        $errors[] = "Row {$rowNumber}: Missing required fields (Date or Amount)";
                        $skipped++;
                        continue;
                    }

                    // Validate type
                    if (!in_array($type, ['income', 'expense'])) {
                        $errors[] = "Row {$rowNumber}: Invalid type '{$type}'. Must be 'income' or 'expense'";
                        $skipped++;
                        continue;
                    }

                    // Parse amount
                    $amount = (float) str_replace(',', '', $amount);
                    if ($amount <= 0) {
                        $errors[] = "Row {$rowNumber}: Invalid amount '{$amount}'";
                        $skipped++;
                        continue;
                    }

                    // Parse date
                    try {
                        $parsedDate = Carbon::parse($date)->format('Y-m-d');
                    } catch (\Exception $e) {
                        $errors[] = "Row {$rowNumber}: Invalid date format '{$date}'";
                        $skipped++;
                        continue;
                    }

                    // Find or create category
                    $category = \App\Models\Category::firstOrCreate(
                        [
                            'user_id' => $user->id,
                            'name' => $categoryName,
                            'type' => $type
                        ],
                        [
                            'color' => '#' . substr(md5($categoryName), 0, 6), // Generate color from name
                            'icon' => 'tag'
                        ]
                    );

                    // Create transaction
                    Transaction::create([
                        'user_id' => $user->id,
                        'category_id' => $category->id,
                        'type' => $type,
                        'amount' => $amount,
                        'description' => $description,
                        'notes' => $notes,
                        'date' => $parsedDate,
                        'status' => 'completed'
                    ]);

                    $imported++;

                } catch (\Exception $e) {
                    $errors[] = "Row {$rowNumber}: " . $e->getMessage();
                    $skipped++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Import completed: {$imported} transactions imported, {$skipped} skipped",
                'data' => [
                    'imported' => $imported,
                    'skipped' => $skipped,
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download CSV template file
     */
    public function downloadTemplate()
    {
        $csv = "Date,Description,Category,Type,Amount,Notes\n";
        $csv .= "2025-01-15,Grocery Shopping,Food & Dining,expense,125.50,Weekly groceries\n";
        $csv .= "2025-01-20,Monthly Salary,Salary,income,5000.00,January 2025\n";
        $csv .= "2025-01-22,Electricity Bill,Bills & Utilities,expense,85.30,\n";

        $filename = 'transaction_import_template.csv';

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=utf-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
}
