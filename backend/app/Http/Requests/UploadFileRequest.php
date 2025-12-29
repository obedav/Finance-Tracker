<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadFileRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                'max:5120', // 5MB max
                'mimes:jpeg,jpg,png,gif,webp,pdf,csv', // Allowed file types
            ],
            'type' => [
                'sometimes',
                'string',
                'in:receipt,avatar,import',
            ],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.max' => 'File size must not exceed 5MB.',
            'file.mimes' => 'File must be an image (JPEG, PNG, GIF, WebP), PDF, or CSV.',
            'type.in' => 'Invalid file upload type.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $file = $this->file('file');

            if ($file) {
                // Additional security checks
                $this->validateFileContent($file, $validator);
            }
        });
    }

    /**
     * Validate file content for security
     */
    private function validateFileContent($file, $validator): void
    {
        // Check actual file MIME type (not just extension)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->getPathname());
        finfo_close($finfo);

        $allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/csv',
            'text/plain',
        ];

        if (!in_array($mimeType, $allowedMimes)) {
            $validator->errors()->add(
                'file',
                'File type not allowed. Detected MIME type: ' . $mimeType
            );
        }

        // Scan for malicious patterns in filename
        $filename = $file->getClientOriginalName();
        if (preg_match('/\.ph(p|tml|ar)|\.exe|\.sh|\.bat|\.cmd/i', $filename)) {
            $validator->errors()->add(
                'file',
                'Suspicious file extension detected.'
            );
        }
    }
}
