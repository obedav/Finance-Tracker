<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class StrongPassword implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Password must be at least 8 characters
        if (strlen($value) < 8) {
            return false;
        }

        // Must contain at least one lowercase letter
        if (!preg_match('/[a-z]/', $value)) {
            return false;
        }

        // Must contain at least one uppercase letter
        if (!preg_match('/[A-Z]/', $value)) {
            return false;
        }

        // Must contain at least one digit
        if (!preg_match('/\d/', $value)) {
            return false;
        }

        // Must contain at least one special character
        if (!preg_match('/[@$!%*?&#]/', $value)) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The :attribute must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#).';
    }
}
