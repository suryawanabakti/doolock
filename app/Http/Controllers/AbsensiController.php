<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Histori;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $sampai = null;
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $riwayat = Absensi::with('ruangan', 'user')
            ->whereHas('ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu_keluar', 'DESC')->whereBetween(DB::raw('DATE(waktu_masuk)'), $request->dates ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
                return [
                    "tanggal" => $data->created_at->format('d M Y'),
                    "id_tag" => $data->id_tag,
                    "user" => $data->user,
                    "jam_masuk" => (new Carbon($data->waktu_masuk))->format('H:i:s'),
                    "jam_keluar" => $data->waktu_keluar ? (new Carbon($data->waktu_keluar))->format('H:i:s') : null,
                ];
            });

        if ($request->ruangan_id) {
            if ($riwayat->count() == 0) {
                $dataKosong = true;
            } else {
                $dataKosong = false;
            }
        }

        return inertia("Admin/Absensi/Index", [
            "ruangan" => Ruangan::where('id', $request->ruangan_id)->first(),
            "ruangans" => Ruangan::query()->get()->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong ?? false,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai ?? Carbon::now('GMT+8')->format('Y-m-d'),
        ]);
    }

    public function indexPenjaga(Request $request)
    {
        $sampai = null;
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $riwayat = Absensi::with('ruangan', 'user')
            ->whereHas('ruangan', function ($query) use ($request) {
                $query->where('id', auth()->user()->ruangan_id);
            })
            ->orderBy('waktu_keluar', 'DESC')->whereBetween(DB::raw('DATE(waktu_masuk)'), $request->dates ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
                return [
                    "tanggal" => $data->created_at->format('d M Y'),
                    "id_tag" => $data->id_tag,
                    "user" => $data->user,
                    "jam_masuk" => (new Carbon($data->waktu_masuk))->format('H:i:s'),
                    "jam_keluar" => $data->waktu_keluar ? (new Carbon($data->waktu_keluar))->format('H:i:s') : null,
                ];
            });

        if (auth()->user()->ruangan_id) {
            if ($riwayat->count() == 0) {
                $dataKosong = true;
            } else {
                $dataKosong = false;
            }
        }

        return inertia("Penjaga/Absensi/Index", [
            "ruangan" => Ruangan::where('id', auth()->user()->ruangan_id)->first(),
            "ruangans" => Ruangan::query()->get()->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong ?? false,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai ?? Carbon::now('GMT+8')->format('Y-m-d'),
        ]);
    }
}
