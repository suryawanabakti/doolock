<?php

namespace App\Http\Controllers;

use App\Http\Requests\MahasiswaStoreRequest;
use App\Http\Requests\MahasiswaUpdateRequest;
use App\Imports\MahasiswaImport;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class MahasiswaController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file_import' => ['required', 'file'],
        ]);
        Excel::import(new MahasiswaImport, $request->file('file_import')->store('temp'));
        return "berhasil";
    }
    public function active(Request $request)
    {
        // Ambil ID dari selectedCustomers dan simpan dalam array $dataKey
        $dataKey = array_column($request->selectedCustomers, 'id');

        Mahasiswa::whereIn('id', $dataKey)->update(['status' => 1]);
        return $mahasiswa = Mahasiswa::orderBy('created_at', 'desc')->with('ruangan')->where('ket', 'mhs')->get()->map(fn($data) =>  [
            "id" => $data->id,
            "ruangan" => $data->ruangan ?? null,
            "kelas" => $data->kelas,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "ruangan" => $data->ruangan,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
            "tahun_masuk" => $data->tahun_masuk
        ]);
        return $mahasiswa = Mahasiswa::orderBy('created_at', 'desc')->with('ruangan')->where('ket', 'mhs')->get()->map(fn($data) =>  [
            "id" => $data->id,
            "pin" => $data->pin,
            "ruangan" => $data->ruangan ?? null,
            "kelas" => $data->kelas,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "ruangan" => $data->ruangan,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
            "tahun_masuk" => $data->tahun_masuk
        ]);
    }

    public function block(Request $request)
    {
        // Ambil ID dari selectedCustomers dan simpan dalam array $dataKey
        $dataKey = array_column($request->selectedCustomers, 'id');

        Mahasiswa::whereIn('id', $dataKey)->update(['status' => 0]);
        return $mahasiswa = Mahasiswa::orderBy('created_at', 'desc')->with('ruangan')->where('ket', 'mhs')->get()->map(fn($data) =>  [
            "id" => $data->id,
            "pin" => $data->pin,
            "ruangan" => $data->ruangan ?? null,
            "kelas" => $data->kelas,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "ruangan" => $data->ruangan,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
            "tahun_masuk" => $data->tahun_masuk
        ]);
    }
    public function index()
    {
        $mahasiswa = Mahasiswa::orderBy('created_at', 'desc')->with('ruangan')->where('ket', 'mhs')->get()->map(fn($data) =>  [
            "id" => $data->id,
            "pin" => $data->pin,
            "ruangan" => $data->ruangan ?? null,
            "kelas" => $data->kelas,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "ruangan" => $data->ruangan,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
            "tahun_masuk" => $data->tahun_masuk
        ]);
        return inertia("Admin/Mahasiswa/Index", [
            "mahasiswa" => $mahasiswa,
            "kelas" => Ruangan::where('type', 'kelas')->get()->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
        ]);
    }

    public function store(MahasiswaStoreRequest $request)
    {
        $data = $request->validated();
        $data['ket'] = 'mhs';
        $mahasiswa = Mahasiswa::create($data);
        return [
            "pin" => $mahasiswa->pin,
            "id" => $mahasiswa->id,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "kelas" => $mahasiswa->kelas,
            "ruangan" => $mahasiswa->ruangan,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block",
            "tahun_masuk" => $mahasiswa->tahun_masuk
        ];
    }

    public function update(MahasiswaUpdateRequest $request, Mahasiswa $mahasiswa)
    {
        $mahasiswa->update($request->validated());
        return [
            "pin" => $mahasiswa->pin,
            "id" => $mahasiswa->id,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "ruangan" => $mahasiswa->ruangan,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block"
        ];
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();
    }
}
