<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function user()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_tag', 'id_tag');
    }
}
