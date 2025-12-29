<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
        $userId = $this->user()->id;

        return [
            'first_name' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z\s\-\']+$/', // Only letters, spaces, hyphens, apostrophes
            ],
            'last_name' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z\s\-\']+$/',
            ],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[\d\s\-\+\(\)]+$/', // Phone number format
            ],
            'avatar' => [
                'nullable',
                'string',
                'max:500',
                'url', // Must be valid URL
            ],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'first_name.regex' => 'First name can only contain letters, spaces, hyphens, and apostrophes.',
            'last_name.regex' => 'Last name can only contain letters, spaces, hyphens, and apostrophes.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Please provide a valid phone number.',
            'avatar.url' => 'Avatar must be a valid URL.',
        ];
    }
}
