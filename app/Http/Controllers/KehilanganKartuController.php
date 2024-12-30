<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KehilanganKartuController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->first();
        return Inertia::render("KehilanganKartu/Index", ["mahasiswa" => $mahasiswa]);
    }
    public function update()
    {
        $mahasiswa = Mahasiswa::where('user_id', auth()->id())->first();
        $mahasiswa->update([
            'status' => !$mahasiswa->status,
        ]);
        return redirect()->route('mahasiswa.kehilangan-kartu.index');
    }
}
