<?php

namespace App\Jobs;

use App\Mail\NotificationDisapproveToMahasiswa;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationRegisterToMahasiswa;

class SendEmailToMahasiswa implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mahasiswa;
    public $customer;
    public $status;
    /**
     * Create a new job instance.
     *
     * @param $mahasiswa
     * @param $customer
     */
    public function __construct($mahasiswa, $customer, $status)
    {
        $this->mahasiswa = $mahasiswa;
        $this->customer = $customer;
        $this->status = $status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->mahasiswa->user->email_notifikasi) {
            if ($this->status == "approve") {
                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationRegisterToMahasiswa($this->customer));
            } else {
                Mail::to($this->mahasiswa->user->email_notifikasi)
                    ->send(new NotificationDisapproveToMahasiswa($this->customer));
            }
        }
    }
}
