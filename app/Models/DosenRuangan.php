<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosenRuangan extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }
    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }
}
