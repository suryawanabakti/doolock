<?php

namespace App\Http\Controllers;

use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\RegisterRuangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendaftaranJadwalController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = RegisterRuangan::orderBy('created_at', 'DESC')->with('ruangan', 'user')->where('ruangan_id', $request->user()->ruangan_id)->get();

        return inertia("Penjaga/Register/Index", ["jadwals" => $jadwals]);
    }

    public function approve(RegisterRuangan $registerRuangan)
    {
        return DB::transaction(function () use ($registerRuangan) {

            $mahasiswa = Mahasiswa::where('user_id', $registerRuangan->user_id)->first();

            $hakAkses = HakAkses::where('ruangan_id', $registerRuangan->ruangan_id)
                ->where('day', $registerRuangan->day)->where('jam_masuk', $registerRuangan->jam_masuk)->where('jam_keluar', $registerRuangan->jam_keluar)->first();

            if (empty($hakAkses)) {
                $hakAkses = HakAkses::create([
                    'ruangan_id' => $registerRuangan->ruangan_id,
                    'jam_masuk' => $registerRuangan->jam_masuk,
                    'jam_keluar' => $registerRuangan->jam_keluar,
                    'day' => $registerRuangan->day
                ]);

                HakAksesMahasiswa::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'hak_akses_id' => $hakAkses->id,
                ]);
            } else {
                $hakAksesMahasiswa = HakAksesMahasiswa::where('hak_akses_id', $hakAkses->id)->where('mahasiswa_id', $mahasiswa->id);

                if (!empty($hakAksesMahasiswa)) {
                    return response()->json(['message' => 'Gagal ,mahasiswa ini sudah ada di ruangan'], 422);
                }

                HakAksesMahasiswa::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'hak_akses_id' => $hakAkses->id,
                ]);
            }
            $registerRuangan->update(['is_approve' =>  true]);
            return $registerRuangan->load('user', 'ruangan');
        });
    }
}
