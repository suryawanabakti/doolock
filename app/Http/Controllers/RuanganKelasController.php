<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganKelasController extends Controller
{
    public function index()
    {
        $ruangans = Ruangan::where('type', 'kelas')->orderBy('created_at', 'desc')->get();
        return Inertia::render("Admin/RuanganKelas/Index", ["ruangans" => $ruangans ?? []]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_ruangan' => ['required', 'max:100'],
            'jam_buka' => ['required', 'before_or_equal:jam_tutup'],
            'jam_tutup' => ['required', 'after_or_equal:jam_buka']
        ]);
        return Ruangan::create(["nama_ruangan" => $request->nama_ruangan, "jam_buka" => $request->jam_buka, "jam_tutup" => $request->jam_tutup, "type" => "kelas"]);
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $request->validate([
            'nama_ruangan' => ['required', 'max:100'],
            'jam_buka' => ['required', 'before_or_equal:jam_tutup'],
            'jam_tutup' => ['required', 'after_or_equal:jam_buka']
        ]);

        $ruangan->update(["nama_ruangan" => $request->nama_ruangan, "jam_buka" => $request->jam_buka, "jam_tutup" => $request->jam_tutup]);
        return $ruangan;
    }
    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();
    }
}
