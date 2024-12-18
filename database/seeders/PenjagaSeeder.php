<?php

namespace Database\Seeders;

use App\Models\PenjagaRuangan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenjagaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $perpus = \App\Models\User::factory()->create([
            'name' => 'Penjaga Perpustakaan',
            'role' => 'penjaga',
            'email' => 'perpustakaan@fkuh',
            'password' => bcrypt('perpustakaan@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $perpus->id,
            'ruangan_id' => 1
        ]);

        $anatomiBasah = \App\Models\User::factory()->create([
            'name' => 'Penjaga Anatomi Basah',
            'role' => 'penjaga',
            'email' => 'anatomibasah@fkuh',
            'password' => bcrypt('anatomibasah@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $anatomiBasah->id,
            'ruangan_id' => 2
        ]);

        $anatomiKomputer = \App\Models\User::factory()->create([
            'name' => 'Penjaga Anatomi Komputer',
            'role' => 'penjaga',
            'email' => 'anatomikomputer@fkuh',
            'password' => bcrypt('anatomikomputer@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $anatomiKomputer->id,
            'ruangan_id' => 3
        ]);

        $csllt1 = \App\Models\User::factory()->create([
            'name' => 'CSL Lantai 1',
            'role' => 'penjaga',
            'email' => 'csllantai1@fkuh',
            'password' => bcrypt('csllantai1@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $csllt1->id,
            'ruangan_id' => 4
        ]);

        PenjagaRuangan::create([
            'user_id' => $csllt1->id,
            'ruangan_id' => 11
        ]);

        $csllt2 = \App\Models\User::factory()->create([
            'name' => 'CSL Lantai 2',
            'role' => 'penjaga',
            'email' => 'csllantai2@fkuh',
            'password' => bcrypt('csllantai2@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $csllt2->id,
            'ruangan_id' => 6
        ]);

        $cslinventaris = \App\Models\User::factory()->create([
            'name' => 'CSL Inventaris',
            'role' => 'penjaga',
            'email' => 'cslinventaris@fkuh',
            'password' => bcrypt('cslinventaris@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $cslinventaris->id,
            'ruangan_id' => 7
        ]);

        $cbtkomputer = \App\Models\User::factory()->create([
            'name' => 'CBT Lab Komputer Lt.4',
            'role' => 'penjaga',
            'email' => 'cbtkomputer@fkuh',
            'password' => bcrypt('cbtkomputer@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $cbtkomputer->id,
            'ruangan_id' => 8
        ]);

        $adminCSL = \App\Models\User::factory()->create([
            'name' => 'Admin CSL',
            'role' => 'penjaga',
            'email' => 'admincsl@fkuh',
            'password' => bcrypt('admincsl@fkuh')
        ]);

        PenjagaRuangan::create([
            'user_id' => $adminCSL->id,
            'ruangan_id' => 4
        ]);

        PenjagaRuangan::create([
            'user_id' => $adminCSL->id,
            'ruangan_id' => 6
        ]);
    }
}
