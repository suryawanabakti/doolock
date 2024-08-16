<?php

namespace App\Http\Controllers;

use App\Http\Resources\IDTagResource;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    public function getDosen()
    {
        return Mahasiswa::where('ket', 'dsn')->get()->map(fn($data) => [$data->id_tag]);
    }

    public function getMahasiswaByKelas(Request $request)
    {
        $scanner = ScanerStatus::where('kode', $request->kode)->first();

        $dataMahasiswa = json_encode(Mahasiswa::whereHas('ruanganAkses.hakAkses', function ($query) use ($scanner) {
            $query->where('ruangan_id', $scanner->ruangan_id)->where('day', Carbon::now('Asia/Makassar')->format('D'));
        })->where('ket', 'mhs')->where("kelas", $request->kelas)->get()->map(fn($data) => $data->id_tag), JSON_UNESCAPED_UNICODE);

        $dataDosen = json_encode(Mahasiswa::where('ket', 'dsn')->get()->map(fn($data) => $data->id_tag), JSON_UNESCAPED_UNICODE);

        return  $dataMahasiswa . $dataDosen;
    }

    public function getUsers()
    {
        return json_encode(Mahasiswa::where('status', 1)->get()->map(fn($data) => [$data->id_tag]), JSON_UNESCAPED_UNICODE);
    }
}
