<?php

namespace App\Http\Controllers;

use App\Models\RegisterRuangan;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaRegisterRuanganController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = RegisterRuangan::orderBy('created_at', 'DESC')->with('ruangan')->where('user_id', $request->user()->id)->get();

        $ruangans = Ruangan::whereIn('type', ['lab'])
            ->get()
            ->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]);

        return Inertia::render("Mahasiswa/Register/Index", [
            "jadwals" => $jadwals,
            "ruangans" => $ruangans,
        ]);
    }

    public function store(Request $request)
    {

        $data = RegisterRuangan::create([
            'user_id' => $request->user()->id,
            'ruangan_id' => $request->ruangan_id,
            'day' => $request->day,
            'jam_masuk' => $request->jam_masuk,
            'jam_keluar' => $request->jam_keluar,
        ]);
        return $data->load('ruangan');
    }

    public function destroy(RegisterRuangan $mahasiswaRegisterRuangan)
    {
        $mahasiswaRegisterRuangan->delete();
    }
}
