<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class PeriodeAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'tahun_akademik_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(JadwalAudit::class);
    }

    public function temuans(): HasManyThrough
    {
        return $this->hasManyThrough(TemuanAudit::class, JadwalAudit::class);
    }
}
