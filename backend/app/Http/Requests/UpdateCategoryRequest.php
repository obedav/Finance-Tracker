<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'string',
                'max:100',
                'regex:/^[a-zA-Z0-9\s\-\_]+$/', // Alphanumeric, spaces, hyphens, underscores only
            ],
            'color' => [
                'nullable',
                'string',
                'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', // Valid hex color
            ],
            'icon' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9\-\_]+$/', // Alphanumeric with hyphens/underscores only
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
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
            'name.regex' => 'Category name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'color.regex' => 'Color must be a valid hex color code (e.g., #FF5733).',
            'icon.regex' => 'Icon name contains invalid characters.',
            'is_active.boolean' => 'Is active must be a boolean value.',
        ];
    }
}
