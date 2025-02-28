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
        foreach ($mahasiswa as $mhs) {
            $user = User::where('email', $mhs->nim)->first();
            if (empty($user)) {
                $user =   User::create([
                    'name' => $mhs->nama,
                    'email' => $mhs->nim,
                    'role' => 'mahasiswa',
                    'password' => bcrypt($mhs->nim),
                    'status' => 1
                ]);
                $mhs->update([
                    'user_id' => $mhs->user_id,
                    'status' => 1
                ]);
            } else {
                Mahasiswa::where('nim', $user->email)->update([
                    'user_id' => $user->id,
                    'status' => 1
                ]);
            }
        }
        Log::info("Job selesai diproses.");
    }
}
