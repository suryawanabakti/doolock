<?php

namespace App\Http\Controllers;

use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->addDay(1)->startOfDay()->toIso8601String();
            $sampai = Carbon::createFromDate($request->dates[1])->addDay(1)->endOfDay()->toIso8601String();
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')->orderBy('waktu', 'DESC')->whereBetween('waktu', $request->dates ? [$mulai, $sampai] : [Carbon::now()->addDay(-3)->startOfDay()->toIso8601String(), Carbon::now()->endOfDay()->toIso8601String()])->get()->map(function ($data) {
            if ($data->status == 0) {
                $status = "Blok";
            }
            if ($data->status == 1) {
                $status = "Terbuka";
            }
            if ($data->status == 2) {
                $status = "Tidak Terdaftar";
            }
            return [
                "id" => $data->id,
                "kode" => $data->kode,
                "waktu" => $data->waktu,
                "id_tag" => $data->id_tag,
                "scanner" => $data->scanner,
                "user" => $data->user,
                "status" => $status ?? 0,
            ];
        });

        return inertia("Admin/Riwayat/Index", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now()->addDay(-3)->startOfDay()->toIso8601String(),
            "sampai" => $sampai ?? Carbon::now()->endOfDay()->toIso8601String(),
        ]);
    }

    public function ruangan(Request $request)
    {
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->addDay(1)->startOfDay()->toIso8601String();
            $sampai = Carbon::createFromDate($request->dates[1])->addDay(1)->endOfDay()->toIso8601String();
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')->whereBetween('waktu', $request->dates ? [$mulai, $sampai] : [Carbon::now()->addMonth(-1)->startOfDay()->toIso8601String(), Carbon::now()->endOfDay()->toIso8601String()])->get()->map(function ($data) {
                if ($data->status == 0) {
                    $status = "Blok";
                }
                if ($data->status == 1) {
                    $status = "Terbuka";
                }
                if ($data->status == 2) {
                    $status = "Tidak Terdaftar";
                }
                return [
                    "id" => $data->id,
                    "kode" => $data->kode,
                    "waktu" => $data->waktu,
                    "id_tag" => $data->id_tag,
                    "scanner" => $data->scanner,
                    "user" => $data->user,
                    "status" => $status ?? 0,
                ];
            });



        return inertia("Admin/Riwayat/DetailRuangan", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now()->addMonth(-1)->startOfDay()->toIso8601String(),
            "sampai" => $sampai ?? Carbon::now()->endOfDay()->toIso8601String(),
            "ruangan" => Ruangan::where('id', $request->ruangan_id)->first()
        ]);
    }

    public function mahasiswa(Request $request)
    {
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->addDay(1)->startOfDay()->toIso8601String();
            $sampai = Carbon::createFromDate($request->dates[1])->addDay(1)->endOfDay()->toIso8601String();
        }

        $mahasiswa = Mahasiswa::where('id_tag', $request->id_tag)->first();
        if (empty($mahasiswa)) {
            abort(404);
        }
        $riwayat = Histori::with('scanner.ruangan', 'user')->where('id_tag', $request->id_tag)
            ->orderBy('waktu', 'DESC')->whereBetween('waktu', $request->dates ? [$mulai, $sampai] : [Carbon::now()->addMonth(-1)->startOfDay()->toIso8601String(), Carbon::now()->endOfDay()->toIso8601String()])->get()->map(function ($data) {
                if ($data->status == 0) {
                    $status = "Blok";
                }
                if ($data->status == 1) {
                    $status = "Terbuka";
                }
                if ($data->status == 2) {
                    $status = "Tidak Terdaftar";
                }
                return [
                    "id" => $data->id,
                    "kode" => $data->kode,
                    "waktu" => $data->waktu,
                    "id_tag" => $data->id_tag,
                    "scanner" => $data->scanner,
                    "user" => $data->user,
                    "status" => $status ?? 0,
                ];
            });

        return inertia("Admin/Riwayat/DetailMahasiswa", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now()->addMonth(-1)->startOfDay()->toIso8601String(),
            "sampai" => $sampai ?? Carbon::now()->endOfDay()->toIso8601String(),
            "mahasiswa" => $mahasiswa
        ]);
    }
}