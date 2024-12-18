<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHakAksesRequest;
use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\PenjagaRuangan;
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
            return Mahasiswa::with(['ruangan'])->where('ket', 'mhs')->where('ruangan_id', $request->kelas_id)->where('ket', 'mhs')->get();
        }

        if ($request->tampilkan_semua == 1) {
            return Mahasiswa::with(['ruangan'])->where('ket', 'mhs')->get();
        }

        return Mahasiswa::with(['ruangan'])->where('status', 1)->where('ket', 'mhs')->get();
    }
    public function index(Request $request)
    {

        $ruanganId = $request->id;

        // Filter mahasiswa yang memiliki ruanganAkses sesuai dengan ruangan yang dipilih
        $today = Carbon::now('Asia/Makassar')->format('Y-m-d');
        if ($request->has('today')) {
            $today = $request->today;
        }
        // Temukan ruangan yang dipilih
        $ruangan = Ruangan::find($ruanganId);

        $hakAkses = HakAkses::with(['ruangan', 'hakAksesMahasiswa.mahasiswa'])->withCount('hakAksesMahasiswa')->where('ruangan_id', $ruanganId)->orderBy('created_at', 'DESC')->where('is_approve', 1)->get();

        $kelas =  Ruangan::where('type', 'kelas')->get()->map(function ($data) {
            return [
                "id" => $data->id,
                "name" => $data->nama_ruangan
            ];
        });
        if ($request->user()->role == 'penjaga') {
            return inertia("Penjaga/RuanganHakAkses/Index", [
                "hakAkses" => $hakAkses,
                "kelas" => $kelas,
                "ruangan" => $ruangan,
                "today" => $today
            ]);
        }
        return inertia("Admin/RuanganHakAkses/Index", [
            "hakAkses" => $hakAkses,
            "kelas" => $kelas,
            "ruangan" => $ruangan,
            "today" => $today
        ]);
    }

    public function store(StoreHakAksesRequest $request)
    {
        if ($request->user()->role == 'penjaga') {
            if ($request->user()->ruangan_id !== $request->ruangan_id) {
                abort(403);
            }
        }

        Ruangan::find($request->ruangan_id)->update(['open_api' => 1]);

        if (!$request->mahasiswa) {
            return response()->json(["message" => "Mahasiswa harus di isi"], 400);
        }

        return DB::transaction(function () use ($request) {


            $hakAkses = HakAkses::create([
                "tanggal" => $request->tanggal,
                "ruangan_id" => $request->ruangan_id,
                "jam_masuk" => $request->jam_masuk,
                "jam_keluar" => $request->jam_keluar,
            ]);

            $data = [];
            foreach ($request->mahasiswa as $row) {
                $data[] = [
                    'hak_akses_id' => $hakAkses->id,
                    'mahasiswa_id' => $row['id'],
                    'updated_at' => now('Asia/Makassar'),
                    'created_at' => now('Asia/Makassar'),
                ];
            }
            HakAksesMahasiswa::insert($data);
            return HakAkses::with(['ruangan', 'hakAksesMahasiswa.mahasiswa'])->withCount('hakAksesMahasiswa')->where('id', $hakAkses->id)->first();
        });
    }

    public function destroy(HakAkses $hakAkses)
    {
        Ruangan::find($hakAkses->ruangan_id)->update(['open_api' => 1]);
        $hakAkses->delete();
    }
}
