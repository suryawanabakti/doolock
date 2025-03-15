<?php

namespace App\Jobs;

use App\Mail\NotificationJamPulangToMahasiswa;
use App\Mail\NotificationRegisterToAdmin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationRegisterToMahasiswa;
use App\Services\Fonnte;

class SendEmailToAdminJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mahasiswa;
    public $customer;

    /**
     * Create a new job instance.
     *
     * @param $mahasiswa
     * @param $customer
     */
    public function __construct(public $user, public $hakAksesMahasiswa) {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //         <H1>Halo Admin Ruangan {{ $data->hakAkses->ruangan->nama_ruangan }}</H1>
        // <p>Ada mahasiswa yang mendaftar di ruangan anda</p>

        // <p>Nama : {{ $data->mahasiswa->nama }}</p>
        // <p>NIM : {{ $data->mahasiswa->nim }}</p>
        // <p>Ruangan : {{ $data->hakAkses->ruangan->nama_ruangan ?? null }} </p>
        // <p>Jam Masuk : {{ $data->hakAkses->jam_masuk }}</p>
        // <p>Jam Keluar : {{ $data->hakAkses->jam_keluar }} </p>

        Fonnte::sendWa($this->user->nowa, "Halo Admin " . $this->hakAksesMahasiswa->hakAkses->ruangan->nama_ruangan . " Mahasiswa baru saja mendaftar" . "\n\nNama: " . $this->hakAksesMahasiswa->mahasiswa->nama . "\nNim: " . $this->hakAksesMahasiswa->mahasiswa->nim);

        Mail::to($this->user->email_notifikasi)->send(
            new NotificationRegisterToAdmin(
                $this->hakAksesMahasiswa
            )
        );
    }
}
