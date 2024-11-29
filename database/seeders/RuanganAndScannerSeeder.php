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
            'pin' => '000113',
            'type' => 'umum',
        ]);

        $anatomiBasah = Ruangan::create([
            'nama_ruangan' => 'Anatomi Basah',
            'pin' => '000114',
            'type' => 'lab',
        ]);

        $anatomiKomputer = Ruangan::create([
            'nama_ruangan' => 'Anatomi Komputer',
            'type' => 'lab',
            'pin' => '000115',
        ]);

        $cslLantai1 = Ruangan::create([
            'nama_ruangan' => 'CSL Lantai 1',
            'type' => 'lab',
            'pin' => '000116',
        ]);


        $kelasA = Ruangan::create([
            'nama_ruangan' => 'Kelas A',
            'type' => 'kelas',
            'pin' => '100111',
        ]);

        $cslLantai2 = Ruangan::create([
            'nama_ruangan' => 'CSL Lantai 2',
            'type' => 'lab',
            'pin' => '000117',
        ]);

        $cslInventaris = Ruangan::create([
            'nama_ruangan' => 'CSL Inventaris',
            'type' => 'lab',
            'pin' => '000118',
        ]);

        $cbtLabKomputer = Ruangan::create([
            'nama_ruangan' => 'CBT Lab Komputer Lt.4',
            'type' => 'lab',
            'pin' => '000119',
        ]);


        $museum = Ruangan::create([
            'nama_ruangan' => 'Museum Lt. 2 (Gedung International)',
            'type' => 'lab',
            'pin' => '000120',
        ]);


        $studentCenter = Ruangan::create([
            'nama_ruangan' => 'Student Center',
            'type' => 'umum',
            'pin' => '000121',
        ]);

        ScanerStatus::create([
            'kode' => 'R13A',
            'ruangan_id' => $perpustakaan->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'R13B',
            'ruangan_id' => $perpustakaan->id,
            'type' => 'luar',
        ]);

        ScanerStatus::create([
            'kode' => 'R12A',
            'ruangan_id' => $anatomiBasah->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'R12B',
            'ruangan_id' => $anatomiBasah->id,
            'type' => 'luar',
        ]);

        ScanerStatus::create([
            'kode' => 'R14A',
            'ruangan_id' => $cslLantai1->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'R14B',
            'ruangan_id' => $cslLantai1->id,
            'type' => 'luar',
        ]);

        ScanerStatus::create([
            'kode' => 'R11A',
            'ruangan_id' => $cslLantai2->id,
            'type' => 'dalam',
        ]);

        ScanerStatus::create([
            'kode' => 'R11B',
            'ruangan_id' => $cslLantai2->id,
            'type' => 'luar',
        ]);
    }
}
