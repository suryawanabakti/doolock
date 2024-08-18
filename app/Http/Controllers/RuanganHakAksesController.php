<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHakAksesRequest;
use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\RuanganAkses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RuanganHakAksesController extends Controller
{
    public function getMahasiswa(Request $request)
    {
        if ($request->kelas_id) {
            return Mahasiswa::with(['ruangan'])->where('ket', 'mhs')->where('ruangan_id', $request->kelas_id)->whereDoesntHave('ruanganAkses.hakAkses', fn($query) => $query->where('ruangan_id', $request->ruangan_id)->where('day', $request->day))->where('ket', 'mhs')->get();
        }
        if ($request->tampilkan_semua == 1) {
            return Mahasiswa::with(['ruangan'])->where('ket', 'mhs')->get();
        }
        return Mahasiswa::with(['ruangan'])->whereDoesntHave('ruanganAkses.hakAkses', fn($query) => $query->where('ruangan_id', $request->ruangan_id)->where('day', $request->day))->where('ket', 'mhs')->get();
    }
    public function index(Request $request)
    {
        $ruanganId = $request->id;
        // Filter mahasiswa yang memiliki ruanganAkses sesuai dengan ruangan yang dipilih
        $today = Carbon::now('Asia/Makassar')->format('D');
        if ($request->has('today')) {
            $today = $request->today;
        }
        // Temukan ruangan yang dipilih
        $ruangan = Ruangan::find($ruanganId);

        $hakAkses = HakAkses::with(['ruangan', 'hakAksesMahasiswa.mahasiswa'])->withCount('hakAksesMahasiswa')->where('ruangan_id', $ruanganId)->orderBy('created_at', 'DESC')->get();

        $kelas =  Ruangan::where('type', 'kelas')->get()->map(function ($data) {
            return [
                "id" => $data->id,
                "name" => $data->nama_ruangan
            ];
        });
        return inertia("Admin/RuanganHakAkses/Index", [
            "hakAkses" => $hakAkses,
            "kelas" => $kelas,
            "ruangan" => $ruangan,
            "today" => $today
        ]);
    }

    public function store(StoreHakAksesRequest $request)
    {
        if (!$request->mahasiswa) {
            return response()->json(["message" => "Mahasiswa harus di isi"], 400);
        }
        return DB::transaction(function () use ($request) {
            $checkHakAkses = HakAkses::where('ruangan_id', $request->ruangan_id)->where('day', $request->day)
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('jam_masuk', '<=', $request->jam_masuk)
                            ->where('jam_keluar', '>=', $request->jam_masuk);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('jam_masuk', '<=', $request->jam_keluar)
                            ->where('jam_keluar', '>=', $request->jam_keluar);
                    });
                })
                ->first();
            if ($checkHakAkses) {
                return response()->json(["message" => "Gagal simpan , sudah ada jadwal hari $request->day dari $checkHakAkses->jam_masuk sampai $checkHakAkses->jam_keluar"], 400);
            }



            $hakAkses = HakAkses::create([
                "day" => $request->day,
                "ruangan_id" => $request->ruangan_id,
                "jam_masuk" => $request->jam_masuk,
                "jam_keluar" => $request->jam_keluar,
            ]);

            $data = [];
            foreach ($request->mahasiswa as $row) {
                $data[] = [
                    'hak_akses_id' => $hakAkses->id,
                    'mahasiswa_id' => $row['id'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ];
            }
            HakAksesMahasiswa::insert($data);
            return HakAkses::with(['ruangan', 'hakAksesMahasiswa.mahasiswa'])->withCount('hakAksesMahasiswa')->where('id', $hakAkses->id)->first();
        });
    }

    public function destroy(HakAkses $hakAkses)
    {
        $hakAkses->delete();
    }
}
