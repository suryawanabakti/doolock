<?php

namespace App\Http\Controllers;

use App\Exports\HistoriExport;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RiwayatController extends Controller
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

        $riwayat = Histori::with('scanner.ruangan', 'user')->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), $request->mulai ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
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

        return Excel::download(new HistoriExport($riwayat), 'histori.xlsx');
    }
    public function index(Request $request)
    {
        $sampai = null;

        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), $request->dates ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
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

        return inertia("Admin/Riwayat/Index", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai ?? Carbon::now('GMT+8')->format('Y-m-d'),
        ]);
    }

    public function ruangan(Request $request)
    {
        $sampai = null;
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), $request->dates ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
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

        return inertia("Admin/Riwayat/DetailRuangan", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai  ?? Carbon::now('GMT+8')->format('Y-m-d'),
            "ruangan" => Ruangan::where('id', $request->ruangan_id)->first()
        ]);
    }

    public function mahasiswa(Request $request)
    {
        $sampai = null;
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->format('Y-m-d');
            $sampai = Carbon::createFromDate($request->dates[1])->format('Y-m-d');
        }

        $mahasiswa = Mahasiswa::where('id_tag', $request->id_tag)->first();
        if (empty($mahasiswa)) {
            abort(404);
        }
        $riwayat = Histori::with('scanner.ruangan', 'user')->where('id_tag', $request->id_tag)
            ->orderBy('waktu', 'DESC')->whereBetween(DB::raw('DATE(waktu)'), $request->dates ? [$mulai, $sampai] : [Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'), Carbon::now('GMT+8')->format('Y-m-d')])->get()->map(function ($data) {
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

        return inertia("Admin/Riwayat/DetailMahasiswa", [
            "riwayat" => $riwayat,
            "mulai" => $mulai ?? Carbon::now('GMT+8')->addDay(-3)->format('Y-m-d'),
            "sampai" => $sampai ?? Carbon::now('GMT+8')->format('Y-m-d'),
            "mahasiswa" => $mahasiswa
        ]);
    }
}
