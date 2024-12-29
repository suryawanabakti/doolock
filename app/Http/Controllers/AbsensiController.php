<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $dates = $this->getDates($request->dates);
        $riwayat = $this->getRiwayatAbsensi($request->ruangan_id, $dates);

        $dataKosong = $request->ruangan_id ? $riwayat->isEmpty() : false;

        return inertia("Admin/Absensi/Index", [
            "ruangan" => Ruangan::find($request->ruangan_id),
            "ruangans" => $this->getRuanganList(),
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
        ]);
    }

    public function indexPenjaga(Request $request)
    {
        $dates = $this->getDates($request->dates);

        $idRuangan = $request->ruangan_id ?? $request->id;
        $riwayat = $this->getRiwayatAbsensi($idRuangan, $dates);

        $dataKosong = $idRuangan ? $riwayat->isEmpty() : false;

        $ruangan = Ruangan::where('id', $idRuangan)->first();

        return inertia("Penjaga/Absensi/Index", [
            "ruangan" => $ruangan,
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
        ]);
    }

    private function getDates($dates)
    {
        $mulai = Carbon::now('Asia/Makassar')->addDays(-3)->format('Y-m-d');
        $sampai = Carbon::now('Asia/Makassar')->format('Y-m-d');

        if ($dates) {
            $mulai = Carbon::createFromDate($dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($dates[1])->format('Y-m-d');
        }

        return ['mulai' => $mulai, 'sampai' => $sampai];
    }

    private function getRiwayatAbsensi($ruanganId, $dates)
    {
        return Absensi::with('ruangan', 'user')
            ->whereHas('ruangan', fn($query) => $query->where('id', $ruanganId))
            ->orderBy('waktu_keluar', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu_masuk)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map(fn($data) => [
                "tanggal" => $data->created_at->format('d M Y'),
                "id_tag" => $data->id_tag,
                "user" => $data->user,
                "jam_masuk" => (new Carbon($data->waktu_masuk))->format('H:i:s'),
                "jam_keluar" => $data->waktu_keluar ? (new Carbon($data->waktu_keluar))->format('H:i:s') : null,
            ]);
    }

    private function getRuanganList()
    {
        return Ruangan::all()->map(fn($data) => [
            "name" => $data->nama_ruangan,
            "code" => $data->id
        ]);
    }
}
