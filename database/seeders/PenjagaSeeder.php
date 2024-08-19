<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenjagaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Penjaga Perpustakaan',
            'role' => 'penjaga',
            'email' => 'perpustakaan@fkuh',
            'ruangan_id' => 1,
            'password' => bcrypt('perpustakaan@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Penjaga Anatomi Basah',
            'role' => 'penjaga',
            'email' => 'anatomibasah@fkuh',
            'ruangan_id' => 2,
            'password' => bcrypt('anatomibasah@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Penjaga Anatomi Komputer',
            'role' => 'penjaga',
            'email' => 'anatomikomputer@fkuh',
            'ruangan_id' => 3,
            'password' => bcrypt('anatomikomputer@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'CSL Lantai 1',
            'role' => 'penjaga',
            'email' => 'csllantai1@fkuh',
            'ruangan_id' => 4,
            'password' => bcrypt('csllantai1@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'CSL Lantai 2',
            'role' => 'penjaga',
            'email' => 'csllantai2@fkuh',
            'ruangan_id' => 6,
            'password' => bcrypt('csllantai2@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'CSL Inventaris',
            'role' => 'penjaga',
            'email' => 'cslinventaris@fkuh',
            'ruangan_id' => 7,
            'password' => bcrypt('cslinventaris@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'CBT Lab Komputer Lt.4',
            'role' => 'penjaga',
            'email' => 'cbtkomputer@fkuh',
            'ruangan_id' => 8,
            'password' => bcrypt('cbtkomputer@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Museum Lt. 2',
            'role' => 'penjaga',
            'email' => 'museum@fkuh',
            'ruangan_id' => 9,
            'password' => bcrypt('museum@fkuh')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Student Center',
            'role' => 'penjaga',
            'email' => 'studentcenter@fkuh',
            'ruangan_id' => 10,
            'password' => bcrypt('studentcenter@fkuh')
        ]);
    }
}
