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
            'email' => 'admin@fkuh',
            'password' => bcrypt('Qw12@erty')
        ]);

        $this->call([
            MahasiswaSeeder::class,
            DosenSeeder::class
        ]);
    }
}
