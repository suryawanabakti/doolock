<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class MahasiswaImport implements ToModel, WithValidation, WithHeadingRow
{
    public function __construct(public $kelas, public $tahun_masuk) {}
    public function model(array $row)
    {
        if ($row['id_tag'] && $row['nama'] && $row['nim']) {
            $mhs = Mahasiswa::create([
                'id_tag' => $row['id_tag'],
                'nama' => $row['nama'],
                'nim' => $row['nim'],
                'pin' => $row['pin'] ?? null,
                'ket' => 'mhs',
                'ruangan_id' => Ruangan::where('nama_ruangan', $this->kelas)->first()->id,
                'tahun_masuk' => $this->tahun_masuk,
                'status' => 1
            ]);

            User::create([
                'name' => $mhs->nama,
                'email' => $mhs->nim,
                'role' => 'mahasiswa',
                'password' => bcrypt($mhs->nim),
                'status' => 1
            ]);

            return $mhs;
        }
    }

    public function rules(): array
    {
        return [
            'id_tag' => ['nullable', Rule::unique(Mahasiswa::class, 'id_tag')],
            'nama' => ['required'],
            'nim' => ['required', Rule::unique(Mahasiswa::class, 'nim')],
            'pin' => ['nullable', Rule::unique(Mahasiswa::class, 'pin')],
        ];
    }
}
