<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HakAksesMahasiswa extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function hakAkses()
    {
        return $this->belongsTo(HakAkses::class);
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}
