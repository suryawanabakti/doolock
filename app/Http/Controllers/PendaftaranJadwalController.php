<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailJamPulangToMahasiswa;
use App\Jobs\SendEmailToMahasiswa;
use App\Mail\NotificationRegisterToMahasiswa;
use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\Mahasiswa;
use App\Models\RegisterRuangan;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PendaftaranJadwalController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('mahasiswa', 'hakAkses.ruangan')->orderBy('created_at', 'DESC')
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 0)->where('ruangan_id', $request->id)->where('is_by_admin', 0))->get();
        $ruangan = Ruangan::find($request->id);
        return inertia("Penjaga/Register/Index", ["jadwals" => $jadwals, "ruangan" => $ruangan]);
    }

    public function approve(HakAksesMahasiswa $hakAksesMahasiswa)
    {
        return $hakAksesMahasiswa->hakAkses->update(['is_approve' => true]);
    }

    public function unapprove(HakAkses $hakAkses)
    {
        return $hakAkses->update(['is_approve' => false]);
    }

    private function updateHakAksesStatus(array $selectedCustomers, int $status)
    {
        $dataKey = array_column($selectedCustomers, 'hak_akses_id');
        return HakAkses::whereIn('id', $dataKey)->update(['is_approve' => $status]);
    }

    public function multiApprove(Request $request)
    {
        $customerIds = collect($request->selectedCustomers)->pluck('mahasiswa_id');
        $selectedCustomers = $request->selectedCustomers[0];
        $maxRegister = $selectedCustomers["hak_akses"]["ruangan"]["max_register"];

        foreach ($request->selectedCustomers as $cs) {
            $tanggal = $cs["hak_akses"]["tanggal"];
            $sisaKuota = $maxRegister - HakAkses::where('ruangan_id', $cs["hak_akses"]["ruangan_id"])->where('tanggal', $cs["hak_akses"]["tanggal"])
                ->where("is_approve", 1)
                ->count();

            $validasi = $sisaKuota - count($request->selectedCustomers);

            if ($validasi < 0) {
                return response()->json([
                    "message" => "Ruangan Penuh pada tanggal " . $tanggal,
                ], 422);
            }
        }







        // Ambil semua data mahasiswa beserta user terkait dalam satu query
        $mahasiswaList = Mahasiswa::with('user')
            ->whereIn('id', $customerIds)
            ->get();

        // KIRIM NOTIFIKASI EMAIL KE MAHASISWA
        foreach ($mahasiswaList as $mahasiswa) {
            if ($mahasiswa->user->email_notifikasi) {
                // Cari data customer berdasarkan mahasiswa_id
                $customer = collect($request->selectedCustomers)
                    ->firstWhere('mahasiswa_id', $mahasiswa->id);
                $tanggal = $customer['hak_akses']['tanggal'];
                $jamPulang = $customer['hak_akses']['jam_keluar'];

                $waktuJamPulang = "$tanggal $jamPulang";

                $jamPulangCarbon = Carbon::createFromFormat('Y-m-d H:i:s', $waktuJamPulang, 'Asia/Makassar');

                $delay = now('Asia/Makassar')->diffInSeconds($jamPulangCarbon);

                SendEmailToMahasiswa::dispatch($mahasiswa, $customer, "approve");

                if ($delay > 0) {
                    SendEmailJamPulangToMahasiswa::dispatch($mahasiswa, $customer)
                        ->delay(now('Asia/Makassar')->addSeconds($delay)->addMinutes(-10));
                }
            }
        }

        $this->updateHakAksesStatus($request->selectedCustomers, 1);
    }

    public function multiDisapprove(Request $request)
    {
        $customerIds = collect($request->selectedCustomers)->pluck('mahasiswa_id');

        // Ambil semua data mahasiswa beserta user terkait dalam satu query
        $mahasiswaList = Mahasiswa::with('user')
            ->whereIn('id', $customerIds)
            ->get();

        // KIRIM NOTIFIKASI EMAIL KE MAHASISWA
        foreach ($mahasiswaList as $mahasiswa) {
            if ($mahasiswa->user->email_notifikasi) {
                // Cari data customer berdasarkan mahasiswa_id
                $customer = collect($request->selectedCustomers)
                    ->firstWhere('mahasiswa_id', $mahasiswa->id);


                SendEmailToMahasiswa::dispatch($mahasiswa, $customer, "disapprove");
            }
        }

        $this->updateHakAksesStatus($request->selectedCustomers, 2);
    }



    public function index2(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('mahasiswa', 'hakAkses.ruangan')->orderBy('created_at', 'DESC')
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 1)->where('ruangan_id', $request->id)->where('is_by_admin', 0))->get();
        $ruangan = Ruangan::find($request->id);
        return inertia("Penjaga/Register/Index2", ["jadwals" => $jadwals, "ruangan" => $ruangan]);
    }

    public function index3(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('mahasiswa', 'hakAkses.ruangan')->orderBy('created_at', 'DESC')
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 2)->where('ruangan_id', $request->id)->where('is_by_admin', 0))->get();
        $ruangan = Ruangan::find($request->id);
        return inertia("Penjaga/Register/Index3", ["jadwals" => $jadwals, "ruangan" => $ruangan]);
    }
}
