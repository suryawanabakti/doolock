<?php

namespace App\Jobs;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessLongTask implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $mahasiswa = Mahasiswa::all();
        $existingEmails = User::whereIn('email', $mahasiswa->pluck('nim'))->pluck('email')->toArray();

        $data = [];
        foreach ($mahasiswa as $mhs) {
            if (!in_array($mhs->nim, $existingEmails)) {
                $data[] = [
                    'name' => $mhs->nama,
                    'email' => $mhs->nim,
                    'role' => 'mahasiswa',
                    'password' => bcrypt($mhs->nim),
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($data)) {
            User::insert($data); // Insert batch untuk efisiensi
        }

        Log::info("Job selesai diproses.");
    }
}
