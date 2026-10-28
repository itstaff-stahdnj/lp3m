<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumenMutu extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_dokumen',
        'nama',
        'kategori',
        'standar_mutu_id',
        'unit_kerja_id',
        'nomor_sk',
        'tanggal_berlaku',
        'versi',
        'file_path',
        'keterangan',
        'is_public',
        'is_active',
    ];

    protected $casts = [
        'tanggal_berlaku' => 'date',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function standarMutu(): BelongsTo
    {
        return $this->belongsTo(StandarMutu::class);
    }

    public function unitKerja(): BelongsTo
    {
        return $this->belongsTo(UnitKerja::class);
    }
}
