<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateRequestSize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Maximum request size in MB (configurable via env)
        $maxSizeMB = env('MAX_REQUEST_SIZE_MB', 10);
        $maxSizeBytes = $maxSizeMB * 1024 * 1024;

        // Get content length from headers
        $contentLength = $request->header('Content-Length');

        if ($contentLength && $contentLength > $maxSizeBytes) {
            return response()->json([
                'success' => false,
                'message' => "Request payload too large. Maximum size is {$maxSizeMB}MB.",
                'error' => 'PAYLOAD_TOO_LARGE'
            ], 413);
        }

        // Additional validation for file uploads
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $maxUploadSizeMB = env('MAX_UPLOAD_SIZE_MB', 5);
            $maxUploadSizeBytes = $maxUploadSizeMB * 1024 * 1024;

            if ($file->getSize() > $maxUploadSizeBytes) {
                return response()->json([
                    'success' => false,
                    'message' => "File too large. Maximum upload size is {$maxUploadSizeMB}MB.",
                    'error' => 'FILE_TOO_LARGE'
                ], 413);
            }

            // Validate file type for security
            $allowedMimeTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file type. Only images, PDFs, and CSV files are allowed.',
                    'error' => 'INVALID_FILE_TYPE'
                ], 415);
            }
        }

        return $next($request);
    }
}
