<?php

namespace App\Http\Controllers;

use App\Http\Requests\DosenStoreRequest;
use App\Http\Requests\DosenUpdateRequest;
use App\Http\Requests\MahasiswaStoreRequest;
use App\Http\Requests\MahasiswaUpdateRequest;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;

class DosenController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::orderBy('created_at', 'desc')->where('ket', 'dsn')->get()->map(fn ($data) =>  [
            "id" => $data->id,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
        ]);
        return inertia("Admin/Dosen/Index", [
            "mahasiswa" => $mahasiswa
        ]);
    }

    public function active(Request $request)
    {
        Mahasiswa::whereKey($request->selectedCustomers)->update(['status' => 1]);
        return    $mahasiswa = Mahasiswa::where('ket', 'dsn')->get()->map(fn ($data) =>  [
            "id" => $data->id,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
        ]);
    }

    public function block(Request $request)
    {
        Mahasiswa::whereKey($request->selectedCustomers)->update(['status' => 0]);
        return    $mahasiswa = Mahasiswa::where('ket', 'dsn')->get()->map(fn ($data) =>  [
            "id" => $data->id,
            "id_tag" => $data->id_tag,
            "nama" => $data->nama,
            "nim" => $data->nim,
            "ket" => $data->ket,
            "status" => $data->status == 1 ? 'Active' : 'Block',
        ]);
    }

    public function store(DosenStoreRequest $request)
    {
        $data = $request->validated();
        $data['ket'] = 'dsn';
        $mahasiswa = Mahasiswa::create($data);
        return [
            "id" => $mahasiswa->id,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block"
        ];
    }

    public function update(DosenUpdateRequest $request, Mahasiswa $mahasiswa)
    {
        $mahasiswa->update($request->validated());
        return [
            "id" => $mahasiswa->id,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block"
        ];
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();
    }
}
