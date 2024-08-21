<?php

namespace App\Http\Controllers;

use App\Events\StoreHistoryEvent;
use App\Models\Absensi;
use App\Models\DosenRuangan;
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
        $mahasiswa = Mahasiswa::where('id_tag', $request->id)->first();
        $status = $mahasiswa ? $mahasiswa->status : 2;

        $ruangan = Ruangan::with('scanner')
            ->whereHas('scanner', fn($query) => $query->where('kode', $request->kode))
            ->first();


        $now = Carbon::now('Asia/Makassar')->format('H:i:s');
        if (!$ruangan || $now < $ruangan->jam_buka || $now > $ruangan->jam_tutup) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $scanner = ScanerStatus::where('kode', $request->kode)->first();

        if ($mahasiswa && $mahasiswa->ket === 'mhs' && $scanner->type == 'luar') {
            $ruanganAkses = HakAksesMahasiswa::where('mahasiswa_id', $mahasiswa->id)
                ->whereHas('hakAkses', function ($query) use ($ruangan) {
                    $query->where('day', Carbon::now('Asia/Makassar')->format('D'))
                        ->where('ruangan_id', $ruangan->id);
                })
                ->latest()
                ->first();

            if (!$ruanganAkses) {
                $this->createHistoriAndBroadcast($mahasiswa, $request->id, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }

            $now = Carbon::now('Asia/Makassar');
            $jamMasuk = Carbon::parse($ruanganAkses->hakAkses->jam_masuk);
            $jamKeluar = Carbon::parse($ruanganAkses->hakAkses->jam_keluar);


            if (!$now->between($jamMasuk, $jamKeluar) && $scanner && $scanner->type === 'luar') {
                $this->createHistoriAndBroadcast($mahasiswa, $request->id, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }
        }

        if ($mahasiswa && $mahasiswa->ket === 'dsn' && $scanner->type == 'luar') {
            $ruanganAkses =   DosenRuangan::where('mahasiswa_id', $mahasiswa->id)->where('ruangan_id', $ruangan->id)->latest()
                ->first();
            if (!$ruanganAkses) {
                $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }
        }

        $histori = Histori::create([
            'nim' => $mahasiswa->nim ?? null,
            'nama' => $mahasiswa->nama ?? null,
            'id_tag' => $request->id,
            'kode' => $request->kode,
            'waktu' => Carbon::now('Asia/Makassar'),
            'status' => $status,
        ]);

        if ($mahasiswa) {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')]);

            if ($mahasiswa->status == 0) {
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }

            if ($mahasiswa->status == 1) {
                $absenToday = Absensi::where('id_tag', $request->id)
                    ->where('ruangan_id', $ruangan->id)
                    ->whereDate('waktu_masuk', Carbon::now('Asia/Makassar'))
                    ->first();

                if (!$absenToday) {
                    Absensi::create([
                        'id_tag' => $request->id,
                        'ruangan_id' => $ruangan->id,
                        'waktu_masuk' => Carbon::now('Asia/Makassar'),
                    ]);
                } else {
                    $scannerStatus = ScanerStatus::where('kode', $request->kode)->first();
                    if ($scannerStatus && $scannerStatus->type === 'dalam') {
                        $absenToday->update(['waktu_keluar' => Carbon::now('Asia/Makassar')]);
                    }
                }

                echo json_encode([$mahasiswa->id_tag], JSON_UNESCAPED_UNICODE);
            }
        } else {
            ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now()->format('Y-m-d H:i:s')]);
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
        }

        if (env("APP_REALTIME") == "true") {
            broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        }
    }

    private function createHistoriAndBroadcast($mahasiswa, $id_tag, $kode, $status, $ruangan)
    {
        $histori = Histori::create([
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'id_tag' => $id_tag,
            'kode' => $kode,
            'waktu' => Carbon::now('Asia/Makassar'),
            'status' => $status,
        ]);

        if (env("APP_REALTIME") == "true") {
            broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        }
    }

    public function index2(Request $request)
    {
        // Cek apakah PIN ada dalam permintaan
        if (!$request->pin) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Ambil data mahasiswa berdasarkan PIN
        $mahasiswa = Mahasiswa::where('pin', $request->pin)->first();

        // Jika mahasiswa tidak ditemukan, kembalikan respon "noid"
        if (!$mahasiswa) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $status = $mahasiswa->status;

        // Ambil data ruangan berdasarkan kode scanner
        $ruangan = Ruangan::with('scanner')->whereHas('scanner', fn($query) => $query->where('kode', $request->kode))->first();

        // if ($ruangan->pin == $request->pin && $ruangan && $ruangan->pin_active) {
        //     echo json_encode([$request->pin], JSON_UNESCAPED_UNICODE);
        //     return;
        // }

        $now = Carbon::now('Asia/Makassar')->format('H:i:s');
        // Cek apakah ruangan tersedia dan dalam jam buka
        if (!$ruangan || $now < $ruangan->jam_buka || $now > $ruangan->jam_tutup) {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Jika mahasiswa adalah mahasiswa biasa (mhs)
        if ($mahasiswa->ket === 'mhs') {
            $ruanganAkses = HakAksesMahasiswa::where('mahasiswa_id', $mahasiswa->id)
                ->whereHas('hakAkses', function ($query) use ($ruangan) {
                    $query->where('day', Carbon::now('Asia/Makassar')->format('D'))
                        ->where('ruangan_id', $ruangan->id);
                })
                ->latest()
                ->first();

            // Jika akses ruangan tidak ditemukan
            if (!$ruanganAkses) {
                // $mahasiswa, $id_tag, $kode, $status, $ruangan
                $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }

            // Cek apakah waktu saat ini berada di antara jam masuk dan keluar
            $now = Carbon::now('Asia/Makassar');
            $jamMasuk = Carbon::parse($ruanganAkses->hakAkses->jam_masuk);
            $jamKeluar = Carbon::parse($ruanganAkses->hakAkses->jam_keluar);

            if (!$now->between($jamMasuk, $jamKeluar)) {
                $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }
        }
        // Jika mahasiswa adalah mahasiswa dosen
        if ($mahasiswa->ket === 'dsn') {
            $ruanganAkses =   DosenRuangan::where('mahasiswa_id', $mahasiswa->id)->where('ruangan_id', $ruangan->id)->latest()
                ->first();
            if (!$ruanganAkses) {
                $this->createHistoriAndBroadcast($mahasiswa, $mahasiswa->id_tag, $request->kode, 3, $ruangan);
                echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
                return;
            }
        }
        // Membuat histori untuk mahasiswa
        $histori = Histori::create([
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'id_tag' => $mahasiswa->id_tag,
            'kode' => $request->kode,
            'waktu' => Carbon::now('Asia/Makassar'),
            'status' => $status,
        ]);

        if (env("APP_REALTIME") === "true") {
            broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        }

        // Memperbarui waktu terakhir pada scanner
        ScanerStatus::where('kode', $request->kode)->update(['last' => Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s')]);

        if ($mahasiswa->status == 1) {
            $absenToday = Absensi::where('id_tag', $mahasiswa->id_tag)
                ->where('ruangan_id', $ruangan->id)
                ->whereDate('waktu_masuk', Carbon::now('Asia/Makassar'))
                ->first();

            if (!$absenToday) {
                Absensi::create([
                    'id_tag' => $mahasiswa->id_tag,
                    'ruangan_id' => $ruangan->id,
                    'waktu_masuk' => Carbon::now('Asia/Makassar'),
                ]);
            } else {
                $scannerStatus = ScanerStatus::where('kode', $request->kode)->first();
                if ($scannerStatus && $scannerStatus->type === 'dalam') {
                    $absenToday->update(['waktu_keluar' => Carbon::now('Asia/Makassar')]);
                }
            }
            echo json_encode([$mahasiswa->pin], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["noid"], JSON_UNESCAPED_UNICODE);
        }
        if (env("APP_REALTIME") == "true") {
            broadcast(new StoreHistoryEvent($histori->load('user', 'scanner.ruangan'), $ruangan));
        }
    }
}
