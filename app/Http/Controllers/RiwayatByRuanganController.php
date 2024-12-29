<?php

namespace App\Http\Controllers;

use App\Exports\HistoriExport;
use App\Models\Histori;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RiwayatByRuanganController extends Controller
{
    public function export(Request $request)
    {
        $sampai = null;
        if ($request->mulai && $request->sampai) {
            $cleanedDateStringMulai = preg_replace('/ GMT \d{4} \(.*\)/', '', $request->mulai);
            $mulai = Carbon::createFromFormat('D M d Y H:i:s', $cleanedDateStringMulai, 'Asia/Makassar');
            $cleanedDateStringSampai = preg_replace('/ GMT \d{4} \(.*\)/', '', $request->sampai);
            $sampai = Carbon::createFromFormat('D M d Y H:i:s', $cleanedDateStringSampai, 'Asia/Makassar');
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')->whereHas('scanner.ruangan', function ($query) use ($request) {
            $query->where('id', $request->ruangan_id ?? null);
        })->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), $request->mulai ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
            if ($data->status == 0) {
                $status = "Blok";
            }
            if ($data->status == 1) {
                $status = "Terbuka";
            }
            if ($data->status == 2) {
                $status = "Tidak Terdaftar";
            }
            $result = $data->scanner?->type === 'luar' ? 'Masuk' : 'Keluar';
            return [
                "id_tag" => $data->id_tag,
                "nim" => $data->user?->nim ?? '-',
                "namaUser" => $data->user?->nama ?? '-',
                "waktu" => $data->waktu,
                "ruangan" => $data->scanner?->ruangan?->nama_ruangan ?? 'Ruangan Tidak Ada',
                "type" => $data->scanner ? $result : '-',
                "status" => $status ?? 0,
            ];
        });

        return Excel::download(new HistoriExport($riwayat), 'histori-per-ruangan.xlsx');
    }

    public function index(Request $request)
    {
        $mulai = Carbon::now('GMT+8')->startOfMonth()->format('Y-m-d');
        $sampai = Carbon::now('GMT+8')->format('Y-m-d');

        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), [$mulai, $sampai])->get()->map(function ($data) {
                if ($data->status == 0) {
                    $status = "Blok";
                }
                if ($data->status == 1) {
                    $status = "Terbuka";
                }
                if ($data->status == 2) {
                    $status = "Tidak Terdaftar";
                }
                if ($data->status == 3) {
                    $status = "No Akses";
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
            "ruangans" => Ruangan::query()->get()->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
            "riwayat" => $riwayat,
            "dataKosong" => $dataKosong ?? false,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai ?? Carbon::now('GMT+8')->format('Y-m-d'),
        ]);
    }
}
