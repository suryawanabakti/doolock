<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $mahasiswaCount = Mahasiswa::where('ket', 'mhs')->count();
        $dosenCount = Mahasiswa::where('ket', 'dsn')->count();
        $ruanganCount = Ruangan::count();
        $scannerCount = ScanerStatus::count();
        // Mendapatkan tanggal awal dan akhir bulan ini
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();
        $visits = Absensi::select(
            'ruangans.nama_ruangan as nama_ruangan',
            DB::raw('COUNT(*) as count')
        )
            ->join('ruangans', 'absensis.ruangan_id', '=', 'ruangans.id')
            ->whereBetween('waktu_masuk', [$startOfMonth, $endOfMonth])
            ->groupBy('ruangans.nama_ruangan')
            ->get();
        // Format data untuk grafik
        $data = [
            'labels' => $visits->pluck('nama_ruangan'),
            'series' => [
                [
                    'name' => 'Jumlah Kunjungan',
                    'data' => $visits->pluck('count'),
                ],
            ],
        ];
        
        return Inertia::render('Dashboard', [
            "mahasiswaCount" => $mahasiswaCount,
            "dosenCount" => $dosenCount,
            "ruanganCount" => $ruanganCount,
            "scannerCount" => $scannerCount,
            "data" => $data,
        ]);
    }
}
