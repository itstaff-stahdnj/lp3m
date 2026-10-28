<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IndikatorMutu extends Model
{
    use HasFactory;

    protected $fillable = [
        'standar_mutu_id',
        'kode',
        'pernyataan',
        'target',
        'satuan',
        'baseline',
        'tipe_indikator',
        'metode_pengukuran',
        'bobot',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'bobot' => 'integer',
    ];

    public function standarMutu(): BelongsTo
    {
        return $this->belongsTo(StandarMutu::class);
    }

    public function capaians(): HasMany
    {
        return $this->hasMany(CapaianIndikator::class);
    }
}
