<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force HTTPS Middleware
 *
 * Redirects all HTTP requests to HTTPS in production
 * Ensures all traffic is encrypted and secure
 */
class ForceHttps
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only enforce HTTPS in production
        if (config('app.env') === 'production' && !$request->secure()) {
            // Redirect HTTP to HTTPS
            return redirect()->secure($request->getRequestUri(), 301);
        }

        return $next($request);
    }
}
