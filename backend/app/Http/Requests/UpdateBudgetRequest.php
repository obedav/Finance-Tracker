<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBudgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'integer',
                'exists:categories,id',
            ],
            'amount' => [
                'sometimes',
                'numeric',
                'min:0.01',
                'max:999999999.99',
            ],
            'period' => [
                'sometimes',
                Rule::in(['daily', 'weekly', 'monthly', 'yearly']),
            ],
            'start_date' => [
                'sometimes',
                'date',
            ],
            'end_date' => [
                'nullable',
                'date',
                'after:start_date',
            ],
            'alert_threshold' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
            'alert_enabled' => [
                'nullable',
                'boolean',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'category_id.exists' => 'Selected category does not exist.',
            'amount.min' => 'Budget amount must be at least 0.01.',
            'period.in' => 'Budget period must be daily, weekly, monthly, or yearly.',
            'end_date.after' => 'End date must be after start date.',
            'alert_threshold.min' => 'Alert threshold must be at least 1%.',
            'alert_threshold.max' => 'Alert threshold cannot exceed 100%.',
            'is_active.boolean' => 'Is active must be a boolean value.',
        ];
    }
}
