<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ruangan::create([
            'nama_ruangan' => 'Perpustakaan',
            'type' => 'umum'
        ]);

        $kelasA = Ruangan::create([
            'nama_ruangan' => 'Kelas A',
            'type' => 'kelas'
        ]);

        Mahasiswa::create([
            'id_tag' => "934C2C10",
            'nama' => 'Alim Kusuma',
            'nim' => '12345453',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 1
        ]);

        Mahasiswa::create([
            'id_tag' => "130D6629",
            'nama' => 'Winda Halima',
            'nim' => '12345112',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 1
        ]);

        Mahasiswa::create([
            'id_tag' => "D08CB0A4",
            'nama' => 'Rinaldy',
            'nim' => '129999',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 1
        ]);

        Mahasiswa::create([
            'id_tag' => "D31AE50F",
            'nama' => 'ALdi Wiruadi',
            'nim' => '12344',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 1
        ]);


        Mahasiswa::create([
            'id_tag' => "C3740513",
            'nama' => 'John Doe',
            'nim' => '123512',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 1
        ]);

        Mahasiswa::create([
            'id_tag' => "735FD7F7",
            'nama' => 'Jane Smith',
            'nim' => '2345678901',
            'ruangan_id' => $kelasA->id,
            'ket' => 'mhs',
            'status' => 0
        ]);
    }
}
