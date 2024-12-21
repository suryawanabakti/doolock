<?php

namespace App\Http\Controllers;

use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\RegisterRuangan;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendaftaranJadwalController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('mahasiswa', 'hakAkses.ruangan')->orderBy('created_at', 'DESC')
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 0)->where('ruangan_id', $request->id))->get();
        $ruangan = Ruangan::find($request->id);
        return inertia("Penjaga/Register/Index", ["jadwals" => $jadwals, "ruangan" => $ruangan]);
    }

    public function approve(HakAksesMahasiswa $hakAksesMahasiswa)
    {
        return $hakAksesMahasiswa->hakAkses->update(['is_approve' => true]);
    }

    public function unapprove(HakAksesMahasiswa $hakAksesMahasiswa)
    {
        return $hakAksesMahasiswa->hakAkses->update(['is_approve' => false]);
    }
    public function index2(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('mahasiswa', 'hakAkses.ruangan')->orderBy('created_at', 'DESC')
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 1)->where('ruangan_id', $request->id))->get();
        $ruangan = Ruangan::find($request->id);
        return inertia("Penjaga/Register/Index2", ["jadwals" => $jadwals, "ruangan" => $ruangan]);
    }
}
