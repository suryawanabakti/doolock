<?php

namespace App\Http\Controllers;

use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\RegisterRuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendaftaranJadwalController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = RegisterRuangan::where('is_approve', 0)->orderBy('created_at', 'DESC')->with('ruangan', 'user')->where('ruangan_id', $request->user()->ruangan_id)->get();

        return inertia("Penjaga/Register/Index", ["jadwals" => $jadwals]);
    }

    public function approve(RegisterRuangan $registerRuangan)
    {
        return DB::transaction(function () use ($registerRuangan) {

            $mahasiswa = Mahasiswa::where('user_id', $registerRuangan->user_id)->first();


            $hakAkses = HakAkses::create([
                'ruangan_id' => $registerRuangan->ruangan_id,
                'jam_masuk' => $registerRuangan->jam_masuk,
                'jam_keluar' => $registerRuangan->jam_keluar,
                'day' => $registerRuangan->day,
                'mon' => $registerRuangan->mon,
                'tue' => $registerRuangan->tue,
                'wed' => $registerRuangan->wed,
                'thu' => $registerRuangan->thu,
                'fri' => $registerRuangan->fri,
                'sat' => $registerRuangan->sat,
                'sun' => $registerRuangan->sun,
            ]);

            HakAksesMahasiswa::create([
                'mahasiswa_id' => $mahasiswa->id,
                'hak_akses_id' => $hakAkses->id,
            ]);

            $registerRuangan->update(['is_approve' =>  true]);
            return $registerRuangan->load('user', 'ruangan');
        });
    }
    public function index2(Request $request)
    {
        $jadwals = RegisterRuangan::where('is_approve', 1)->orderBy('created_at', 'DESC')->with('ruangan', 'user')->where('ruangan_id', $request->user()->ruangan_id)->get();

        return inertia("Penjaga/Register/Index2", ["jadwals" => $jadwals]);
    }
}
