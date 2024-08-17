<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Histori extends Model
{
    use HasFactory;
    public $table = 'histori';
    protected $fillable = ['id_tag', 'kode', 'waktu', 'status', 'nama', 'nim'];
    // public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_tag', 'id_tag');
    }

    public function scanner()
    {
        return $this->belongsTo(ScanerStatus::class, 'kode', 'kode');
    }
}
