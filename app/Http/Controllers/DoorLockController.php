<?php

namespace App\Http\Controllers;

use App\Events\StoreHistoryEvent;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class DoorLockController extends Controller
{

    public function index(Request $request)
    {
        // list($jam, $menit, $detik) = explode('-', $request->jam);
        // $tanggalDanWaktu =  date('Y-m-d H:i:s', strtotime("$request->tanggal $jam:$menit:$detik"));

        $status = 0;
        $mahasiswa = Mahasiswa::where('id_tag', $request->id)->first();

        if (!empty($mahasiswa)) {
            if ($mahasiswa->status == 0) {
                $status = 0;
            }
            if ($mahasiswa->status == 1) {
                $status = 1;
            }
        } else {
            $status = 2;
        }

        $histori = Histori::create([
            'id_tag' => $request->id,
            'kode' => $request->kode,
            'waktu' => Carbon::now('GMT+8'),
            'status' => $status,
        ]);

        $ruangan = Ruangan::whereHas('scanner', fn ($query) => $query->where('kode', $request->kode))->first();

        if (!empty($mahasiswa)) {
            if ($mahasiswa->status == 0) {
                ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
                $data = Histori::with('user', 'scanner.ruangan')->where('id', $histori->id)->first();
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            }
            if ($mahasiswa->status == 1) {
                ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
                $data = Histori::with('user', 'scanner.ruangan')->where('id', $histori->id)->first();
                echo  json_encode([$mahasiswa->id_tag], JSON_UNESCAPED_UNICODE);
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
            $data = Histori::with('user', 'scanner.ruangan')->where('id', $histori->id)->first();
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
        }
        broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
    }

    public function getRiwayat(Request $request)
    {
        if ($request->dates) {
            $mulai = Carbon::createFromDate($request->dates[0])->addDay(1)->startOfDay()->toIso8601String();
            $sampai = Carbon::createFromDate($request->dates[1])->addDay(1)->endOfDay()->toIso8601String();
        }
        return $riwayat = Histori::with('scanner.ruangan', 'user')->orderBy('waktu', 'DESC')->whereBetween('waktu', $request->dates ? [$mulai, $sampai] : [Carbon::now()->addMonth(-1)->startOfDay()->toIso8601String(), Carbon::now()->endOfDay()->toIso8601String()])->get()->map(function ($data) {
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
    }
}
