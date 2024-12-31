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
            Mail::to($this->mahasiswa->user->email_notifikasi)
                ->send(new NotificationJamPulangToMahasiswa($this->customer));
        }
    }
}
