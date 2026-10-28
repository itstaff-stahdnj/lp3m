<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SimulasiAkreditasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_studi_id',
        'tahun_akademik_id',
        'instrumen',
        'total_skor',
        'predikat_proyeksi',
        'rincian_skor_json',
        'catatan_evaluator',
    ];

    protected $casts = [
        'total_skor' => 'decimal:2',
        'rincian_skor_json' => 'array',
    ];

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }
}
