<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailToAdminJob;
use App\Mail\NotificationRegisterToAdmin;
use App\Models\HakAkses;
use App\Models\HakAksesMahasiswa;
use App\Models\PenjagaRuangan;
use App\Models\RegisterRuangan;
use App\Models\Ruangan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class MahasiswaRegisterRuanganController extends Controller
{
    public function index(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('hakAkses.ruangan')->orderBy('created_at', 'DESC')->where('mahasiswa_id', $request->user()->mahasiswa->id)
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 0)->where('is_by_admin', 0))->get();
        $ruangans = Ruangan::whereIn('type', ['lab'])
            ->get()
            ->map(fn($data) => ["name" => $data->nama_ruangan, "code" => $data->id]);


        return Inertia::render("Mahasiswa/Register/Index", [
            "jadwals" => $jadwals,
            "ruangans" => $ruangans,
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'ruangan_id' => ['required'],
            'tanggal' => ['required', 'date', 'after_or_equal:today'],
            "jam_keluar" => ['required', 'after_or_equal:jam_keluar'],
            "jam_masuk" => ['required', 'before_or_equal:jam_keluar'],
            'skill' => ['required'],
            'tujuan' => ['required'],
            'additional_participant' => ['nullable'],
        ]);

        $hakAkses = HakAkses::where('ruangan_id', $request->ruangan_id)->where('is_approve', false)->whereHas('hakAksesMahasiswa', fn($q) => $q->where('mahasiswa_id', auth()->user()->mahasiswa->id))->where('tanggal', $request->tanggal)->first();

        if ($hakAkses) {
            return back()->withErrors([
                "message" => "Kamu sudah mendaftar di ruangan ini untuk tanggal $request->tanggal . Harap Tunggu konfirmasi admin atau batalkan ",
            ]);
        }

        $ruangan = Ruangan::find($request->ruangan_id);
        $count = HakAkses::where('ruangan_id', $ruangan->id)->where('tanggal', $request->tanggal)->where('is_approve', 1)
            ->count();

        if ($count > $ruangan->max_register) {
            return back()->withErrors([
                "message" => "Ruangan penuh 🥲. Maximal Register Di Ruangan ini " . $ruangan->max_register,
            ]);
        }



        return DB::transaction(function () use ($request) {

            $hakAkses = HakAkses::create([
                'ruangan_id' => $request->ruangan_id,
                'tanggal' => $request->tanggal,
                'jam_masuk' => $request->jam_masuk,
                'jam_keluar' => $request->jam_keluar,
                'is_approve' => 0,
                'is_by_admin' => 0,
                'tujuan' => $request->tujuan,
                'skill' => $request->skill,
                'additional_participant' => $request->additional_participant,
            ]);


            $hakAksesMahasiswa =  HakAksesMahasiswa::create([
                'hak_akses_id' => $hakAkses->id,
                'mahasiswa_id' => $request->user()->mahasiswa->id,
            ]);



            // KIRIM EMAIL 
            $penjagaRuangan = PenjagaRuangan::with(['user:id,email_notifikasi', 'ruangan'])
                ->where('ruangan_id', $request->ruangan_id)
                ->get();
            $penjagaRuangan->filter(fn($data) => $data->user && $data->user->email_notifikasi)
                ->each(function ($data) use ($hakAksesMahasiswa) {
                    SendEmailToAdminJob::dispatch($data->user, $hakAksesMahasiswa->load('hakAkses.ruangan', 'mahasiswa'));
                });
            // KIRIM NOTIFIKASI EMAIL KE PENJAGA RUANGAN
            return back();
        });
    }

    public function destroy(HakAkses $hakAkses)
    {
        $hakAkses->delete();
    }


    public function index2(Request $request)
    {
        $jadwals = HakAksesMahasiswa::with('hakAkses.ruangan')->orderBy('created_at', 'DESC')->where('mahasiswa_id', $request->user()->mahasiswa->id)
            ->whereHas('hakAkses', fn($q) => $q->where('is_approve', 1)->where('is_by_admin', 0))->get();

        return Inertia::render("Mahasiswa/Register/Index2", [
            "jadwals" => $jadwals,
        ]);
    }
}
