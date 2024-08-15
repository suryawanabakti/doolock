<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HakAkses extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function hakAksesMahasiswa()
    {
        return $this->hasMany(HakAksesMahasiswa::class);
    }

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class);
    }
}
