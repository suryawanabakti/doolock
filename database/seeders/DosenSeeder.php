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
            'id_tag' => "900ba5",
            'nama' => 'Xayah',
            'nim' => '4445678902',
            'ket' => 'dsn',
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "8ef24f",
            'nama' => 'Rakan',
            'nim' => '4445278902',
            'ket' => 'dsn',
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);
    }
}
