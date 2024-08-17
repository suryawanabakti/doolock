<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictIP
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedIps = [
            '127.0.0.1', // Ganti dengan IP yang diizinkan
            '192.168.100.9', // Ganti dengan IP yang diizinkan
        ];

        if (!in_array($request->ip(), $allowedIps)) {
            abort(403);
        }

        return $next($request);
    }
}
