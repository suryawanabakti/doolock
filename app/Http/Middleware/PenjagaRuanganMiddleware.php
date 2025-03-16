<?php

namespace App\Http\Middleware;

use App\Models\PenjagaRuangan;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PenjagaRuanganMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $dapatkan = PenjagaRuangan::where('user_id', $request->user()->id)->where('ruangan_id', $request->id ?? $request->ruangan_id)->firstOrFail();

        if (!$dapatkan) {
            return abort(404);
        }
        return $next($request);
    }
}
