<?php

namespace App\Jobs;

use App\Mail\NotificationJamPulangToMahasiswa;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationRegisterToMahasiswa;
use App\Services\Fonnte;

class SendEmailJamPulangToMahasiswa implements ShouldQueue
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
    public function __construct($mahasiswa, $customer)
    {
        $this->mahasiswa = $mahasiswa;
        $this->customer = $customer;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->mahasiswa->user->email_notifikasi) {
            $namaRuangan = $this->customer['hak_akses']['ruangan']['nama_ruangan'] ?? null;
            Fonnte::sendWa($this->mahasiswa->user->nowa, "Jam pulang $namaRuangan  sisa 10 menit lagi\nHarap keluar sebelum pintu terkunci");
            Mail::to($this->mahasiswa->user->email_notifikasi)
                ->send(new NotificationJamPulangToMahasiswa($this->customer));
        }
    }
}
