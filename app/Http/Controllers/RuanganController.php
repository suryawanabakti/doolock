<?php

namespace App\Http\Controllers;

use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganController extends Controller
{
    public function index()
    {
        $ruangans = Ruangan::whereNot('type', 'kelas')->get();
        return Inertia::render("Admin/Ruangan/Index", ["ruangans" => $ruangans ?? []]);
    }

    public function store(Request $request)
    {
        return Ruangan::create(["nama_ruangan" => $request->nama_ruangan]);
    }

    public function update(Request $request, Ruangan $ruangan)
    {
        $ruangan->update(["nama_ruangan" => $request->nama_ruangan]);
        return $ruangan;
    }

    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();
    }
}
