<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruangan extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function hakAksesOne()
    {
        return $this->hasOne(HakAkses::class);
    }

    public function child()
    {
        return $this->hasMany(Ruangan::class, 'parent_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Ruangan::class, 'parent_id', 'id');
    }

    public function first_scanner()
    {
        return $this->hasOne(ScanerStatus::class, 'ruangan_id', 'id');
    }

    public function scanner()
    {
        return $this->hasMany(ScanerStatus::class, 'ruangan_id', 'id');
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }
}
