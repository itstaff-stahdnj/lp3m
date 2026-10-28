<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StandarMutu extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'deskripsi',
        'kriteria_akreditasi',
        'penanggung_jawab_unit_id',
        'dokumen_kebijakan_url',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];

    public function penanggungJawabUnit(): BelongsTo
    {
        return $this->belongsTo(UnitKerja::class, 'penanggung_jawab_unit_id');
    }

    public function indikators(): HasMany
    {
        return $this->hasMany(IndikatorMutu::class);
    }

    public function dokumens(): HasMany
    {
        return $this->hasMany(DokumenMutu::class);
    }
}
