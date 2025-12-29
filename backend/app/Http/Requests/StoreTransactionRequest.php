<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization checked via middleware
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'description' => [
                'required',
                'string',
                'max:500',
                'regex:/^[a-zA-Z0-9\s\-\_\.\,\!\@\#\$\%\&\*\(\)]+$/', // No HTML allowed
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999999.99',
            ],
            'type' => [
                'required',
                Rule::in(['income', 'expense']),
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],
            'date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'status' => [
                'nullable',
                Rule::in(['pending', 'completed', 'cancelled', 'failed']),
            ],
            'receipt_path' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'description.required' => 'Transaction description is required.',
            'description.regex' => 'Transaction description contains invalid characters. HTML is not allowed.',
            'amount.required' => 'Transaction amount is required.',
            'amount.min' => 'Amount must be at least 0.01.',
            'type.required' => 'Transaction type is required.',
            'type.in' => 'Transaction type must be either income or expense.',
            'category_id.exists' => 'Selected category does not exist.',
            'date.before_or_equal' => 'Transaction date cannot be in the future.',
        ];
    }
}
