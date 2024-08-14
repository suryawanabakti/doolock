<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuanganAkses extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_tag', 'id_tag');
    }
    // Metode untuk memeriksa keberadaan ruangan_id
    public static function hasRuanganId($ruanganId)
    {
        return self::where('ruangan_id', $ruanganId)->exists();
    }

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }
}
