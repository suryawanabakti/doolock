<?php

namespace App\Exports;

use App\Models\Histori;
use Maatwebsite\Excel\Concerns\FromCollection;

class HistoriExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function __construct(public $riwayat)
    {
    }
    public function collection()
    {
        return $this->riwayat;
    }
}
