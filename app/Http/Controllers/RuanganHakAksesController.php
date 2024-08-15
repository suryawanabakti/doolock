<?php

namespace App\Http\Controllers;

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
            return Mahasiswa::with(['ruangan'])->where('ruangan_id', $request->kelas_id)->get();
        }
        return Mahasiswa::with(['ruangan'])->get();
    }
    public function index(Request $request)
    {
        $ruanganId = $request->id;

        // Dapatkan semua mahasiswa dengan eager loading ruangan dan ruanganAkses
        $mahasiswa = Mahasiswa::with(['ruanganAkses', 'ruangan'])
            ->where('ket', 'mhs')
            ->get();

        // Filter mahasiswa yang memiliki ruanganAkses sesuai dengan ruangan yang dipilih

        $today = Carbon::now('Asia/Makassar')->format('D');
        if ($request->has('today')) {
            $today = $request->today;
        }
        // Temukan ruangan yang dipilih
        $ruangan = Ruangan::find($ruanganId);
        $hakAkses = HakAkses::with(['ruangan'])->withCount('hakAksesMahasiswa')->where('ruangan_id', $ruanganId)->get();

        $kelas =  Ruangan::where('type', 'kelas')->get()->map(function ($data) {
            return [
                "id" => $data->id,
                "name" => $data->nama_ruangan
            ];
        });
        return inertia("Admin/RuanganHakAkses/Index", [
            "hakAkses" => $hakAkses,
            "kelas" => $kelas,
            "mahasiswa" => $mahasiswa,
            "ruangan" => $ruangan,
            "today" => $today
        ]);
    }

    public function store(Request $request)
    {

        DB::transaction(function () use ($request) {
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
        });

        return back();
    }
}
