<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        \App\Models\User::factory()->create([
            'name' => 'ADMIN FKUH',
            'role' => 'admin',
            'email' => 'admin@fkuh',
            'password' => bcrypt('Qw12@erty')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Surya Wana Bakti',
            'role' => 'admin',
            'email' => 'suryawanabakti@dev',
            'password' => bcrypt('nrt796pr71')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Penjaga Perpustakaan',
            'role' => 'penjaga',
            'email' => 'perpus@fkuh',
            'password' => bcrypt('nrt796pr71')
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Penjaga Anatomi',
            'role' => 'penjaga',
            'email' => 'anatomi@fkuh',
            'password' => bcrypt('nrt796pr71')
        ]);


        $this->call([
            MahasiswaSeeder::class,
            DosenSeeder::class
        ]);
    }
}
