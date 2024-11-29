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
        $jadwals = RegisterRuangan::orderBy('created_at', 'DESC')->with('ruangan')->where('user_id', $request->user()->id)
            ->where('is_approve', 0)->get();

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
            'day' => $request->day[0],
            'jam_masuk' => $request->jam_masuk,
            'jam_keluar' => $request->jam_keluar,
            'mon' => in_array('mon', $request->day) ? 1 : 0,
            'tue' => in_array('tue', $request->day) ? 1 : 0,
            'wed' => in_array('wed', $request->day) ? 1 : 0,
            'thu' => in_array('thu', $request->day) ? 1 : 0,
            'fri' => in_array('fri', $request->day) ? 1 : 0,
            'sat' => in_array('sat', $request->day) ? 1 : 0,
            'sun' => in_array('sun', $request->day) ? 1 : 0,
        ]);
        return $data->load('ruangan');
    }

    public function destroy(RegisterRuangan $mahasiswaRegisterRuangan)
    {
        $mahasiswaRegisterRuangan->delete();
    }


    public function index2(Request $request)
    {
        $jadwals = RegisterRuangan::where('is_approve', 1)->orderBy('created_at', 'DESC')->with('ruangan')->where('user_id', $request->user()->id)->get();

        $ruangans = Ruangan::whereIn('type', ['lab'])
            ->get()
            ->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]);

        return Inertia::render("Mahasiswa/Register/Index2", [
            "jadwals" => $jadwals,
            "ruangans" => $ruangans,
        ]);
    }
}
