<?php

namespace App\Http\Controllers;

use App\Http\Resources\IDTagResource;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    public function getDosen()
    {
        return Mahasiswa::where('ket', 'dsn')->get()->map(fn ($data) => [$data->id_tag]);
    }

    public function getMahasiswaByKelas(Request $request)
    {
        echo json_encode(Mahasiswa::where('ket', 'mhs')->where("kelas", $request->kelas)->get()->map(fn ($data) => [$data->id_tag]), JSON_UNESCAPED_UNICODE);
    }
}