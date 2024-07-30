<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "id_tag" => str()->upper(fake()->unique()->regexify('[A-Za-z0-9]{10}')),
            "nama" => fake()->name(),
            "nim" => fake()->unique()->userName(),
            "kelas" => 'A',
            'ket' => 'mhs',
            'status' => 1
        ];
    }
}
