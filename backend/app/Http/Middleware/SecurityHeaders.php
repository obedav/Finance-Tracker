<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Security Headers Middleware
 *
 * Implements comprehensive security headers following OWASP best practices:
 * - Content Security Policy (CSP) - Prevents XSS attacks
 * - Strict-Transport-Security (HSTS) - Forces HTTPS
 * - X-Frame-Options - Prevents clickjacking
 * - X-Content-Type-Options - Prevents MIME sniffing
 * - Referrer-Policy - Controls referrer information
 * - Permissions-Policy - Restricts browser features
 */
class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $isDevelopment = config('app.env') !== 'production';

        // Prevent clickjacking attacks
        $response->headers->set('X-Frame-Options', 'DENY');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection (legacy browsers - modern browsers use CSP)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Prevent browsers from guessing MIME types
        $response->headers->set('X-Download-Options', 'noopen');

        // Referrer policy - strict for production, relaxed for development
        $referrerPolicy = $isDevelopment
            ? 'strict-origin-when-cross-origin'
            : 'strict-origin-when-cross-origin';
        $response->headers->set('Referrer-Policy', $referrerPolicy);

        // Permissions Policy - Restrict powerful browser features
        $response->headers->set('Permissions-Policy', implode(', ', [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
            'autoplay=()',
            'encrypted-media=()',
            'picture-in-picture=()',
            'fullscreen=(self)',  // Allow fullscreen for the app itself
        ]));

        // Cross-Origin Policies
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');

        // Content Security Policy - Environment-based configuration
        $this->setContentSecurityPolicy($response, $isDevelopment);

        // HSTS - Force HTTPS in production
        if (!$isDevelopment) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        return $response;
    }

    /**
     * Set Content Security Policy based on environment
     */
    private function setContentSecurityPolicy(Response $response, bool $isDevelopment): void
    {
        if ($isDevelopment) {
            // Development CSP - Relaxed for hot module replacement and debugging
            $csp = implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:*", // Vue HMR needs this
                "style-src 'self' 'unsafe-inline' http://localhost:* http://127.0.0.1:*",
                "img-src 'self' data: https: http: blob:",
                "font-src 'self' data:",
                "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*", // WebSocket for HMR
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "object-src 'none'",
                "upgrade-insecure-requests",
            ]);
        } else {
            // Production CSP - Strict security policy
            $csp = implode('; ', [
                "default-src 'self'",
                "script-src 'self'",  // NO unsafe-inline or unsafe-eval in production!
                "style-src 'self'",   // Consider using nonces for inline styles if needed
                "img-src 'self' data: https:",
                "font-src 'self' data:",
                "connect-src 'self'",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "object-src 'none'",
                "upgrade-insecure-requests",
                "block-all-mixed-content",
            ]);
        }

        $response->headers->set('Content-Security-Policy', $csp);

        // Also set CSP in report-only mode for testing (optional)
        // $response->headers->set('Content-Security-Policy-Report-Only', $csp);
    }
}
