<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Mahasiswa::create([
            'id_tag' => "E3AB2B25",
            'nama' => 'Michael Johnson',
            'nim' => '3456789012',
            'ket' => 'dsn',
            'status' => 0
        ]);

        Mahasiswa::create([
            'id_tag' => "F32CA712",
            'nama' => 'Emily Brown Johnson',
            'nim' => '4567890123',
            'ket' => 'dsn',
            'status' => 1
        ]);
    }
}
