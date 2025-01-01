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
    public function __construct(public $email, public $hakAksesMahasiswa) {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to($this->email)->send(
            new NotificationRegisterToAdmin(
                $this->hakAksesMahasiswa
            )
        );
    }
}
