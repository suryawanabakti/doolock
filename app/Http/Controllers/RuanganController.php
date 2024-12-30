<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganController extends Controller
{
    public function index()
    {
        $ruangans = Ruangan::with('first_scanner', 'parent')->whereNot('type', 'kelas')->orderBy('nama_ruangan', 'asc')->get()->map(function ($data) {
            $data['code'] = $data->id;
            return $data;
        });
        return Inertia::render("Admin/Ruangan/Index", ["ruangans" => $ruangans ?? []]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => ['required'],
            'nama_ruangan' => ['required', 'max:100', 'unique:ruangans,nama_ruangan'],
            'jam_buka' => ['required', 'before:jam_tutup'],
            'jam_tutup' => ['required', 'after:jam_buka'],
        ]);

        return Ruangan::create(["nama_ruangan" => $request->nama_ruangan, "jam_buka" => $request->jam_buka, "jam_tutup" => $request->jam_tutup, "type" => "umum", "parent_id" => $request->parent_id ?? null, "type" => $request->type]);
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $request->validate([
            'nama_ruangan' => ['required', 'max:100'],
            'type' => ['required'],
            'jam_buka' => ['required', 'before:jam_tutup'],
            'jam_tutup' => ['required', 'after:jam_buka'],
        ]);

        $ruangan->update(["nama_ruangan" => $request->nama_ruangan, "jam_buka" => $request->jam_buka, "jam_tutup" => $request->jam_tutup, "open_api" => 1, "parent_id" => $request->parent_id, "type" => $request->type]);

        return $ruangan->load('parent');
    }

    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();
    }
}
