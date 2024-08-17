<?php

namespace App\Http\Controllers;

use App\Events\StoreHistoryEvent;
use App\Models\Absensi;
use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Histori;
use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\RuanganAkses;
use App\Models\ScanerStatus;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class DoorLockController extends Controller
{

    public function index(Request $request)
    {
        $status = 0;
        $mahasiswa = Mahasiswa::where('id_tag', $request->id)->first();

        if ($mahasiswa) {
            $status = $mahasiswa->status;
        } else {
            $status = 2;
        }

        $ruangan = Ruangan::with('scanner')->whereHas('scanner', fn($query) => $query->where('kode', $request->kode))->first();

        $now = Carbon::now('GMT+8')->format('H:i:s');
        if (!$ruangan || $now < $ruangan->jam_buka || $now > $ruangan->jam_tutup) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        if ($mahasiswa && $mahasiswa->ket == 'mhs') {

            $ruanganAkses = HakAksesMahasiswa::orderBy('created_at', 'DESC')->where('mahasiswa_id', $mahasiswa->id)->whereHas('hakAkses', function ($query) use ($ruangan) {
                return $query->where('day', Carbon::now('Asia/Makassar')->format('D'))->where('ruangan_id', $ruangan->id);
            })->first();

            if (!$ruanganAkses) {
                $histori = Histori::create([
                    'nim' => $mahasiswa->nim,
                    'nama' => $mahasiswa->nama,
                    'id_tag' => $request->id,
                    'kode' => $request->kode,
                    'waktu' => Carbon::now('GMT+8'),
                    'status' => 3,
                ]);
                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                if (env("APP_REALTIME") == "true") {
                    broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
                }
                return;
            }

            if ($ruanganAkses) {
                // Ambil waktu saat ini
                $now = Carbon::now('Asia/Makassar');
                // Ambil jam masuk dan jam keluar dari hak akses
                $jamMasuk = Carbon::parse($ruanganAkses->hakAkses->jam_masuk);
                $jamKeluar = Carbon::parse($ruanganAkses->hakAkses->jam_keluar);

                if (!$now->between($jamMasuk, $jamKeluar)) {
                    echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                    $histori = Histori::create([
                        'id_tag' => $request->id,
                        'kode' => $request->kode,
                        'nim' => $mahasiswa->nim,
                        'nama' => $mahasiswa->nama,
                        'waktu' => Carbon::now('GMT+8'),
                        'status' => 3,
                    ]);
                    $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                    if (env("APP_REALTIME") == "true") {
                        broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
                    }
                    return;
                }
            }
        }


        $histori = Histori::create([
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'id_tag' => $request->id,
            'kode' => $request->kode,
            'waktu' => Carbon::now('GMT+8'),
            'status' => $status,
        ]);



        if ($mahasiswa) {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')]);

            if ($mahasiswa->status == 0) {
                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            }

            if ($mahasiswa->status == 1) {
                $absenToday = Absensi::where('id_tag', $request->id)
                    ->where('ruangan_id', $ruangan->id)
                    ->whereDate('waktu_masuk', Carbon::now('GMT+8'))
                    ->first();

                if (!$absenToday) {
                    Absensi::create([
                        'id_tag' => $request->id,
                        'ruangan_id' => $ruangan->id,
                        'waktu_masuk' => Carbon::now('GMT+8'),
                    ]);
                } else {
                    $scannerStatus = ScanerStatus::where('kode', $request->kode)->first();
                    if ($scannerStatus && $scannerStatus->type == 'dalam') {
                        $absenToday->update(['waktu_keluar' => Carbon::now('GMT+8')]);
                    }
                }

                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);

                echo json_encode([$mahasiswa->id_tag], JSON_UNESCAPED_UNICODE);
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
            $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
        }

        if (env("APP_REALTIME") == "true") {
            broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
        }
    }

    public function index2(Request $request)
    {
        $status = 0;
        if (!$request->pin) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }
        $mahasiswa = Mahasiswa::where('pin', $request->pin)->first();

        if ($mahasiswa) {
            $status = $mahasiswa->status;
        } else {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $ruangan = Ruangan::with('scanner')->whereHas('scanner', fn($query) => $query->where('kode', $request->kode))->first();

        $now = Carbon::now('GMT+8')->format('H:i:s');
        if (!$ruangan || $now < $ruangan->jam_buka || $now > $ruangan->jam_tutup) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        if ($mahasiswa && $mahasiswa->ket == 'mhs') {
            $ruanganAkses = HakAksesMahasiswa::orderBy('created_at', 'DESC')->where('mahasiswa_id', $mahasiswa->id)->whereHas('hakAkses', function ($query) use ($ruangan) {
                return $query->where('day', Carbon::now('Asia/Makassar')->format('D'))->where('ruangan_id', $ruangan->id);
            })->first();

            if (!$ruanganAkses) {
                $histori = Histori::create([
                    'id_tag' => $mahasiswa->id_tag,
                    'kode' => $request->kode,
                    'nim' => $mahasiswa->nim,
                    'nama' => $mahasiswa->nama,
                    'waktu' => Carbon::now('GMT+8'),
                    'status' => 3,
                ]);
                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                if (env("APP_REALTIME") == "true") {
                    broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
                }
                return;
            }

            if ($ruanganAkses) {
                // Ambil waktu saat ini
                $now = Carbon::now('Asia/Makassar');
                // Ambil jam masuk dan jam keluar dari hak akses
                $jamMasuk = Carbon::parse($ruanganAkses->hakAkses->jam_masuk);
                $jamKeluar = Carbon::parse($ruanganAkses->hakAkses->jam_keluar);
                if (!$now->between($jamMasuk, $jamKeluar)) {
                    echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                    $histori = Histori::create([
                        'nim' => $mahasiswa->nim,
                        'nama' => $mahasiswa->nama,
                        'id_tag' => $mahasiswa->id_tag,
                        'kode' => $request->kode,
                        'waktu' => Carbon::now('GMT+8'),
                        'status' => 3,
                    ]);
                    $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                    if (env("APP_REALTIME") == "true") {
                        broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
                    }
                    return;
                }
            }
        }

        $histori = Histori::create([
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'id_tag' => $mahasiswa->id_tag,
            'kode' => $request->kode,
            'waktu' => Carbon::now('GMT+8'),
            'status' => $status,
        ]);

        if ($mahasiswa) {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')]);

            if ($mahasiswa->status == 0) {
                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            }

            if ($mahasiswa->status == 1) {
                $absenToday = Absensi::where('id_tag', $mahasiswa->id_tag)
                    ->where('ruangan_id', $ruangan->id)
                    ->whereDate('waktu_masuk', Carbon::now('GMT+8'))
                    ->first();

                if (!$absenToday) {
                    Absensi::create([
                        'id_tag' => $mahasiswa->id_tag,
                        'ruangan_id' => $ruangan->id,
                        'waktu_masuk' => Carbon::now('GMT+8'),
                    ]);
                } else {
                    $scannerStatus = ScanerStatus::where('kode', $request->kode)->first();
                    if ($scannerStatus && $scannerStatus->type == 'dalam') {
                        $absenToday->update(['waktu_keluar' => Carbon::now('GMT+8')]);
                    }
                }

                $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);

                echo json_encode([$mahasiswa->id_tag], JSON_UNESCAPED_UNICODE);
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
            $data = Histori::with('user', 'scanner.ruangan')->find($histori->id);
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
        }

        if (env("APP_REALTIME") == "true") {
            broadcast(new StoreHistoryEvent($data ?? null, $ruangan));
        }
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
