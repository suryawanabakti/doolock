<?php

namespace App\Http\Controllers;

use App\Models\Histori;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RiwayatByRuanganController extends Controller
{
    public function index(Request $request)
    {
        $sampai = null;
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->startOfDay();
            $sampai = Carbon::createFromDate($request->dates[1])->addDay(1);
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')->whereBetween('waktu', $request->dates ? [$mulai, $sampai] : [Carbon::now()->addDay(-3)->startOfDay(), Carbon::now()->endOfDay()])->get()->map(function ($data) {
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

        if ($request->ruangan_id) {
            if ($riwayat->count() == 0) {
                $dataKosong = true;
            } else {
                $dataKosong = false;
            }
        }

        return inertia("Admin/RiwayatByRuangan/Index", [
            "ruangan" => Ruangan::where('id', $request->ruangan_id)->first(),
            "ruangans" => Ruangan::query()->get()->map(fn ($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong ?? false,
            "mulai" => $mulai ?? Carbon::now()->addDay(-3)->startOfDay(),
            "sampai" => $sampai ? $sampai->addDay(-1) : Carbon::now()->endOfDay(),
        ]);
    }
}
