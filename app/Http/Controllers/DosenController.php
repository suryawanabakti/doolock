<?php

namespace App\Http\Controllers;

use App\Http\Requests\DosenStoreRequest;
use App\Http\Requests\DosenUpdateRequest;
use App\Models\DosenRuangan;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Http\Request;

class DosenController extends Controller
{
    public function getDosenRuangan($id)
    {
        // Ambil hanya kolom yang dibutuhkan dari Ruangan
        $ruangans = Ruangan::select('id', 'nama_ruangan')->get();

        // Ambil DosenRuangan dengan eager loading hanya kolom yang dibutuhkan
        $dosenRuangan = DosenRuangan::where('mahasiswa_id', $id)
            ->with(['ruangan:id,nama_ruangan']) // Load relasi ruangan dengan memilih kolom tertentu
            ->get(['id', 'ruangan_id', 'mahasiswa_id'])->map(function ($data) {
                return $data->ruangan;
            }); // Pilih kolom yang dibutuhkan dari DosenRuangan
        return [
            "ruangans" => $ruangans,
            "dosenRuangan" => $dosenRuangan,
        ];
    }

    public function saveRuangan(Request $request)
    {
        // Hapus semua entri yang terkait dengan mahasiswa_id yang diberikan
        DosenRuangan::where('mahasiswa_id', $request->id)->delete();

        // Persiapkan data untuk dimasukkan ke dalam tabel DosenRuangan
        $data = array_map(fn($row) => [
            'ruangan_id' => $row['id'],
            'mahasiswa_id' => $request->id,
        ], $request->selectedRooms);

        // Masukkan data ke dalam tabel DosenRuangan
        DosenRuangan::insert($data);
        return DosenRuangan::where('mahasiswa_id', $request->id)->get();
    }

    public function index()
    {
        $mahasiswa = $this->getFormattedDosenList();
        return inertia("Admin/Dosen/Index", [
            "mahasiswa" => $mahasiswa
        ]);
    }

    public function active(Request $request)
    {
        $this->updateDosenStatus($request->selectedCustomers, 1);
        return $this->getFormattedDosenList();
    }

    public function block(Request $request)
    {
        $this->updateDosenStatus($request->selectedCustomers, 0);
        return $this->getFormattedDosenList();
    }

    public function store(DosenStoreRequest $request)
    {
        $data = $request->validated();
        $data['ket'] = 'dsn';

        $mahasiswa = Mahasiswa::create($data);

        return $this->formatDosenResponse($mahasiswa);
    }

    public function update(DosenUpdateRequest $request, Mahasiswa $mahasiswa)
    {
        $mahasiswa->update($request->validated());

        return $this->formatDosenResponse($mahasiswa);
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();
    }

    private function updateDosenStatus(array $selectedCustomers, int $status)
    {
        Mahasiswa::whereKey($selectedCustomers)->update(['status' => $status]);
    }

    private function getFormattedDosenList()
    {
        return Mahasiswa::orderBy('created_at', 'desc')
            ->where('ket', 'dsn')
            ->get()
            ->map(fn($data) => $this->formatDosenResponse($data));
    }

    private function formatDosenResponse(Mahasiswa $mahasiswa)
    {
        return [
            "id" => $mahasiswa->id,
            "pin" => $mahasiswa->pin,
            "id_tag" => $mahasiswa->id_tag,
            "nim" => $mahasiswa->nim,
            "nama" => $mahasiswa->nama,
            "ket" => $mahasiswa->ket,
            "status" => $mahasiswa->status == 1 ? "Active" : "Block",
        ];
    }
}
