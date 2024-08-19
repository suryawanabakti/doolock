<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Asumsikan bahwa user memiliki field `role` yang menyimpan peran mereka
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Jika user bukan admin, bisa diarahkan ke halaman lain atau menunjukkan error
        return abort(403);
    }
}
