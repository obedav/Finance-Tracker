<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware to sanitize user inputs and prevent XSS attacks
 *
 * This middleware:
 * - Strips HTML tags from all string inputs
 * - Prevents script injection attacks
 * - Maintains data integrity while ensuring security
 */
class SanitizeInput
{
    /**
     * Fields that should allow limited HTML (if needed)
     * Currently empty - all fields are sanitized
     */
    protected array $allowedHtmlFields = [
        // Example: 'description' => '<b><i><u>'
    ];

    /**
     * Fields that should never be sanitized (like passwords)
     */
    protected array $excludedFields = [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
        'token',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only sanitize for non-GET requests (POST, PUT, PATCH, DELETE)
        if (!in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
            $input = $request->all();
            $sanitized = $this->sanitizeArray($input);
            $request->merge($sanitized);
        }

        return $next($request);
    }

    /**
     * Recursively sanitize an array of inputs
     */
    protected function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            // Skip excluded fields (passwords, tokens, etc.)
            if (in_array($key, $this->excludedFields)) {
                $sanitized[$key] = $value;
                continue;
            }

            // Recursively sanitize nested arrays
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
                continue;
            }

            // Sanitize string values
            if (is_string($value)) {
                $sanitized[$key] = $this->sanitizeString($key, $value);
                continue;
            }

            // Keep other types as-is (integers, booleans, etc.)
            $sanitized[$key] = $value;
        }

        return $sanitized;
    }

    /**
     * Sanitize a string value
     */
    protected function sanitizeString(string $key, string $value): string
    {
        // Check if this field allows limited HTML
        if (isset($this->allowedHtmlFields[$key])) {
            return strip_tags($value, $this->allowedHtmlFields[$key]);
        }

        // Strip all HTML tags by default
        $sanitized = strip_tags($value);

        // Additional XSS prevention: remove any remaining script-like patterns
        $sanitized = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $sanitized);
        $sanitized = preg_replace('/javascript:/i', '', $sanitized);
        $sanitized = preg_replace('/on\w+\s*=/i', '', $sanitized); // Remove onclick, onload, etc.

        // Trim whitespace
        return trim($sanitized);
    }
}
