<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaAkreditasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor',
        'kode',
        'nama',
        'deskripsi',
        'bobot_default',
    ];

    protected $casts = [
        'nomor' => 'integer',
        'bobot_default' => 'decimal:2',
    ];
}
