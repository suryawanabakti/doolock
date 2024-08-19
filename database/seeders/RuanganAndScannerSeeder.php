<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use App\Models\ScanerStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuanganAndScannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $perpustakaan = Ruangan::create([
            'nama_ruangan' => 'Perpustakaan',
            'type' => 'umum',
        ]);

        $anatomiBasah = Ruangan::create([
            'nama_ruangan' => 'Anatomi Basah',
            'type' => 'lab',
        ]);

        $anatomiKomputer = Ruangan::create([
            'nama_ruangan' => 'Anatomi Komputer',
            'type' => 'lab',
        ]);

        $cslLantai1 = Ruangan::create([
            'nama_ruangan' => 'CSL Lantai 1',
            'type' => 'lab',
        ]);


        $kelasA = Ruangan::create([
            'nama_ruangan' => 'Kelas A',
            'type' => 'kelas'
        ]);

        $cslLantai2 = Ruangan::create([
            'nama_ruangan' => 'CSL Lantai 2',
            'type' => 'lab',
        ]);

        $cslInventaris = Ruangan::create([
            'nama_ruangan' => 'CSL Inventaris',
            'type' => 'lab',
        ]);

        $cbtLabKomputer = Ruangan::create([
            'nama_ruangan' => 'CBT Lab Komputer Lt.4',
            'type' => 'lab',
        ]);


        $museum = Ruangan::create([
            'nama_ruangan' => 'Museum Lt. 2 (Gedung International)',
            'type' => 'lab',
        ]);


        $studentCenter = Ruangan::create([
            'nama_ruangan' => 'Student Center',
            'type' => 'umum',
        ]);

        ScanerStatus::create([
            'kode' => 'RFID-A1',
            'ruangan_id' => $perpustakaan->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'RFID-A2',
            'ruangan_id' => $perpustakaan->id,
            'type' => 'luar',
        ]);

        ScanerStatus::create([
            'kode' => 'R11A',
            'ruangan_id' => $anatomiBasah->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'R11B',
            'ruangan_id' => $anatomiBasah->id,
            'type' => 'luar',
        ]);
    }
}
