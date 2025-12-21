<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $limiter = 'default'): Response
    {
        $key = $this->resolveRequestSignature($request, $limiter);

        // Check if rate limit is exceeded
        if (RateLimiter::tooManyAttempts($key, $this->getMaxAttempts($limiter))) {
            return $this->buildRateLimitResponse($key, $limiter);
        }

        // Increment the number of attempts
        RateLimiter::hit($key, $this->getDecaySeconds($limiter));

        $response = $next($request);

        // Add rate limit headers to response
        return $this->addHeaders(
            $response,
            $this->getMaxAttempts($limiter),
            $this->calculateRemainingAttempts($key, $this->getMaxAttempts($limiter))
        );
    }

    /**
     * Resolve request signature for rate limiting.
     */
    protected function resolveRequestSignature(Request $request, string $limiter): string
    {
        // For auth endpoints, use IP + email combination if available
        if (str_contains($request->path(), 'auth')) {
            $email = $request->input('email', '');
            return 'rate_limit:' . $limiter . ':' . $request->ip() . ':' . $email;
        }

        // For API endpoints, use IP + user ID if authenticated
        if ($request->user()) {
            return 'rate_limit:' . $limiter . ':' . $request->user()->id;
        }

        // Default to IP address
        return 'rate_limit:' . $limiter . ':' . $request->ip();
    }

    /**
     * Get maximum attempts for the limiter.
     */
    protected function getMaxAttempts(string $limiter): int
    {
        return match ($limiter) {
            'auth' => 5,          // 5 attempts for authentication
            'strict' => 3,        // 3 attempts for sensitive operations
            'api' => 60,          // 60 requests per minute for API
            default => 100,       // 100 requests per minute default
        };
    }

    /**
     * Get decay time in seconds for the limiter.
     */
    protected function getDecaySeconds(string $limiter): int
    {
        return match ($limiter) {
            'auth' => 300,        // 5 minutes for authentication
            'strict' => 600,      // 10 minutes for sensitive operations
            'api' => 60,          // 1 minute for API
            default => 60,        // 1 minute default
        };
    }

    /**
     * Calculate remaining attempts.
     */
    protected function calculateRemainingAttempts(string $key, int $maxAttempts): int
    {
        return max(0, $maxAttempts - RateLimiter::attempts($key));
    }

    /**
     * Build rate limit exceeded response.
     */
    protected function buildRateLimitResponse(string $key, string $limiter): Response
    {
        $retryAfter = RateLimiter::availableIn($key);
        $maxAttempts = $this->getMaxAttempts($limiter);

        return response()->json([
            'success' => false,
            'message' => 'Too many attempts. Please try again later.',
            'error' => 'RATE_LIMIT_EXCEEDED',
            'retry_after' => $retryAfter,
            'max_attempts' => $maxAttempts,
        ], 429)
        ->withHeaders([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => 0,
            'Retry-After' => $retryAfter,
            'X-RateLimit-Reset' => now()->addSeconds($retryAfter)->timestamp,
        ]);
    }

    /**
     * Add rate limit headers to response.
     */
    protected function addHeaders(Response $response, int $maxAttempts, int $remainingAttempts): Response
    {
        $response->headers->set('X-RateLimit-Limit', $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', $remainingAttempts);

        return $response;
    }
}
