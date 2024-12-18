<?php

namespace App\Http\Controllers;

use App\Exports\HistoriExport;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RiwayatController extends Controller
{
    private function parseDateRange($dates)
    {
        if ($dates) {
            return [
                'mulai' => Carbon::createFromDate($dates[0])->format('Y-m-d'),
                'sampai' => Carbon::createFromDate($dates[1])->format('Y-m-d')
            ];
        }

        return [
            'mulai' => Carbon::now('GMT+8')->subDays(3)->format('Y-m-d'),
            'sampai' => Carbon::now('GMT+8')->format('Y-m-d')
        ];
    }

    public function mapHistori($data)
    {
        $statusLabels = [
            0 => "Blok",
            1 => "Terbuka",
            2 => "Tidak Terdaftar",
            3 => "No Akses"
        ];

        $result = $data->scanner?->type === 'luar' ? 'Masuk' : 'Keluar';
        return [
            "id" => $data->id,
            "kode" => $data->kode,
            "waktu" => $data->waktu,
            "id_tag" => $data->id_tag,
            "scanner" => $data->scanner,
            "nim" => $data->nim,
            "nama" => $data->nama,
            "user" => $data->user,
            "status" => $statusLabels[$data->status] ?? 0,
            "ruangan" => $data->scanner?->ruangan?->nama_ruangan ?? 'Ruangan Tidak Ada',
            "type" => $data->scanner ? $result : '-'
        ];
    }

    public function export(Request $request)
    {
        $dates = $this->parseDateRange([$request->mulai, $request->sampai]);
        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return Excel::download(new HistoriExport($riwayat), 'histori.xlsx');
    }

    public function index(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Admin/Riwayat/Index", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
        ]);
    }

    public function indexPenjaga(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner', function ($query) use ($request) {
                $query->where('ruangan_id', $request->id);
            })
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Penjaga/Riwayat/Index", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
        ]);
    }

    public function ruangan(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Admin/Riwayat/DetailRuangan", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
            "ruangan" => Ruangan::findOrFail($request->ruangan_id)
        ]);
    }

    public function ruanganPenjaga(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->whereHas('scanner.ruangan', function ($query) use ($request) {
                $query->where('id', $request->ruangan_id);
            })
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Penjaga/Riwayat/DetailRuangan", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
            "ruangan" => Ruangan::findOrFail($request->ruangan_id)
        ]);
    }

    public function mahasiswa(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $mahasiswa = Mahasiswa::where('id_tag', $request->id_tag)->firstOrFail();
        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->where('id_tag', $request->id_tag)
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Admin/Riwayat/DetailMahasiswa", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
            "mahasiswa" => $mahasiswa
        ]);
    }

    public function mahasiswaPenjaga(Request $request)
    {
        $dates = $this->parseDateRange($request->dates);

        $mahasiswa = Mahasiswa::where('id_tag', $request->id_tag)->firstOrFail();
        $riwayat = Histori::with('scanner.ruangan', 'user')
            ->where('id_tag', $request->id_tag)
            ->orderBy('waktu', 'DESC')
            ->whereBetween(DB::raw('DATE(waktu)'), [$dates['mulai'], $dates['sampai']])
            ->get()
            ->map([$this, 'mapHistori']);

        return inertia("Penjaga/Riwayat/DetailMahasiswa", [
            "riwayat" => $riwayat,
            "mulai" => $dates['mulai'],
            "sampai" => $dates['sampai'],
            "mahasiswa" => $mahasiswa
        ]);
    }
}
