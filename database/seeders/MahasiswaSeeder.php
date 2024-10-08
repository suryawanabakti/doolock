<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {



        Mahasiswa::create([
            'id_tag' => "8fc3df",
            'nama' => 'Aldous',
            'nim' => '4445270902',
            'ruangan_id' => 5,
            'ket' => 'mhs',
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "8fd909",
            'nama' => 'Nami',
            'nim' => '4425370902',
            'ket' => 'mhs',
            'status' => 1,
            'ruangan_id' => 5,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "8fd940",
            'nama' => 'Aphelios',
            'nim' => '4445370909',
            'ket' => 'mhs',
            'status' => 0,
            'ruangan_id' => 5,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "7bb63e",
            'nama' => 'Kayla',
            'nim' => '4345370902',
            'ket' => 'mhs',
            'ruangan_id' => 5,
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "72e4cc",
            'nama' => 'Syndra',
            'nim' => '1445370902',
            'ket' => 'mhs',
            'ruangan_id' => 5,
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        Mahasiswa::create([
            'id_tag' => "7a2d3a",
            'nama' => 'Ronaldo',
            'nim' => '1445360902',
            'ket' => 'mhs',
            'status' => 0,
            'ruangan_id' => 5,
            'tahun_masuk' => '2024'
        ]);
    }
}
