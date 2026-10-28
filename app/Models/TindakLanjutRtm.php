<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TindakLanjutRtm extends Model
{
    use HasFactory;

    protected $table = 'tindak_lanjut_rtms';

    protected $fillable = [
        'rtm_id',
        'program_studi_id',
        'unit_kerja_id',
        'butir_rekomendasi',
        'rencana_tindakan',
        'target_waktu',
        'penanggung_jawab',
        'status',
        'bukti_tindak_lanjut',
        'catatan_verifikasi',
    ];

    protected function casts(): array
    {
        return [
            'target_waktu' => 'date',
        ];
    }

    public function rtm(): BelongsTo
    {
        return $this->belongsTo(Rtm::class);
    }

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    public function unitKerja(): BelongsTo
    {
        return $this->belongsTo(UnitKerja::class);
    }
}
