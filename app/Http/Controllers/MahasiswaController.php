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
        return response()->json(['message' => 'Import berhasil']);
    }

    public function active(Request $request)
    {
        $this->updateMahasiswaStatus($request->selectedCustomers, 1);
        return $this->getFormattedMahasiswaList();
    }

    public function block(Request $request)
    {
        $this->updateMahasiswaStatus($request->selectedCustomers, 0);
        return $this->getFormattedMahasiswaList();
    }

    public function index()
    {
        $mahasiswa = $this->getFormattedMahasiswaList();
        $kelas = Ruangan::where('type', 'kelas')
            ->get()
            ->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]);

        return inertia("Admin/Mahasiswa/Index", [
            "mahasiswa" => $mahasiswa,
            "kelas" => $kelas,
        ]);
    }

    private function updateMahasiswaStatus(array $selectedCustomers, int $status)
    {
        $dataKey = array_column($selectedCustomers, 'id');
        Mahasiswa::whereIn('id', $dataKey)->update(['status' => $status]);
    }

    private function getFormattedMahasiswaList()
    {
        return Mahasiswa::orderBy('created_at', 'desc')
            ->with('ruangan')
            ->where('ket', 'mhs')
            ->get()
            ->map(fn($data) => $this->formatMahasiswaResponse($data));
    }

    private function formatMahasiswaResponse(Mahasiswa $mahasiswa)
    {
        return [
            "id" => $mahasiswa->id,
            "pin" => $mahasiswa->pin,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "kelas" => $mahasiswa->kelas,
            "ruangan" => $mahasiswa->ruangan ?? null,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block",
            "tahun_masuk" => $mahasiswa->tahun_masuk
        ];
    }

    public function store(MahasiswaStoreRequest $request)
    {
        $data = $request->validated();
        $data['ket'] = 'mhs';

        $mahasiswa = Mahasiswa::create($data);

        return $this->formatMahasiswaResponse($mahasiswa);
    }

    public function update(MahasiswaUpdateRequest $request, Mahasiswa $mahasiswa)
    {
        $mahasiswa->update($request->validated());

        return $this->formatMahasiswaResponse($mahasiswa);
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();
    }
}
