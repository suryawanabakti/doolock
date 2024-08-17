<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Ruangan;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class MahasiswaImport implements ToModel, WithValidation, WithHeadingRow
{

    public function model(array $row)
    {
        return new Mahasiswa([
            'id_tag' => $row['id_tag'],
            'nama' => $row['nama'],
            'nim' => $row['nim'],
            'pin' => $row['pin'],
            'ket' => 'mhs',
            'ruangan_id' => Ruangan::where('nama_ruangan', $row['kelas'])->first()->id,
            'tahun_masuk' => $row['tahun_masuk'],
            'status' => 1
        ]);
    }

    public function rules(): array
    {
        return [
            'id_tag' => ['required', Rule::unique(Mahasiswa::class, 'id_tag')],
            'nama' => ['required'],
            'nim' => ['required', Rule::unique(Mahasiswa::class, 'nim')],
            'pin' => ['nullable', Rule::unique(Mahasiswa::class, 'pin')],
            'kelas' => ['nullable', Rule::exists(Ruangan::class, 'nama_ruangan')],
            'tahun_masuk' => ['required']
        ];
    }
}
