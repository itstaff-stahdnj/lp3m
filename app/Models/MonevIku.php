<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonevIku extends Model
{
    use HasFactory;

    protected $fillable = [
        'iku_id',
        'tahun_akademik_id',
        'program_studi_id',
        'target',
        'realisasi',
        'persentase_capaian',
        'status',
        'kendala',
        'strategi_tindak_lanjut',
        'bukti_dokumen_url',
    ];

    protected function casts(): array
    {
        return [
            'target' => 'float',
            'realisasi' => 'float',
            'persentase_capaian' => 'float',
        ];
    }

    public function iku(): BelongsTo
    {
        return $this->belongsTo(Iku::class);
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
}
