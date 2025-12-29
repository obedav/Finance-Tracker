<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware to read authentication token from httpOnly cookie
 *
 * This middleware:
 * - Reads the auth_token from httpOnly cookie
 * - Adds it to the Authorization header for Sanctum authentication
 * - Maintains backward compatibility with Bearer token headers
 */
class AuthenticateFromCookie
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If Authorization header is already present, don't override it
        // This maintains backward compatibility with API clients using Bearer tokens
        if ($request->hasHeader('Authorization')) {
            return $next($request);
        }

        // Get token from cookie
        $token = $request->cookie('auth_token');

        // If token exists in cookie, add it to Authorization header
        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
