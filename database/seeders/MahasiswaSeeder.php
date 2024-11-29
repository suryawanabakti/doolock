<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Seeder;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $user1 =  User::create([
            'name' => 'Aldous',
            'email' => '4445270902',
            'role' => 'mahasiswa',
            'password' => bcrypt('4445270902')
        ]);

        Mahasiswa::create([
            'user_id' => $user1->id,
            'id_tag' => "8fc3df",
            'nama' => 'Aldous',
            'nim' => '4445270902',
            'ruangan_id' => 5,
            'ket' => 'mhs',
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);


        $user2 =  User::create([
            'name' => 'Nami',
            'email' => '4425370902',
            'role' => 'mahasiswa',
            'password' => bcrypt('4425370902')
        ]);

        Mahasiswa::create([
            'user_id' => $user2->id,
            'id_tag' => "8fd909",
            'nama' => 'Nami',
            'nim' => '4425370902',
            'ket' => 'mhs',
            'status' => 1,
            'ruangan_id' => 5,
            'tahun_masuk' => '2024'
        ]);

        $user3 =  User::create([
            'name' => 'Aphelios',
            'email' => '4445170909',
            'role' => 'mahasiswa',
            'password' => bcrypt('4445170909')
        ]);

        Mahasiswa::create([
            'user_id' => $user3->id,
            'id_tag' => "8fd940",
            'nama' => 'Aphelios',
            'nim' => '4445170909',
            'ket' => 'mhs',
            'status' => 0,
            'ruangan_id' => 5,
            'tahun_masuk' => '2024'
        ]);

        $user4 =  User::create([
            'name' => 'Kayla',
            'email' => '4345370902',
            'role' => 'mahasiswa',
            'password' => bcrypt('4345370902')
        ]);

        Mahasiswa::create([
            'user_id' => $user4->id,
            'id_tag' => "7bb63e",
            'nama' => 'Kayla',
            'nim' => '4345370902',
            'ket' => 'mhs',
            'ruangan_id' => 5,
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        $user5 =  User::create([
            'name' => 'Syndra',
            'email' => '1445370902',
            'role' => 'mahasiswa',
            'password' => bcrypt('1445370902')
        ]);

        Mahasiswa::create([
            'user_id' => $user5->id,
            'id_tag' => "72e4cc",
            'nama' => 'Syndra',
            'nim' => '1445370902',
            'ket' => 'mhs',
            'ruangan_id' => 5,
            'status' => 1,
            'tahun_masuk' => '2024'
        ]);

        $user6 =  User::create([
            'name' => 'Ronaldo',
            'email' => '1445360902',
            'role' => 'mahasiswa',
            'password' => bcrypt('1445360902')
        ]);

        Mahasiswa::create([
            'user_id' => $user6->id,
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
