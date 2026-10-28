<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CapaianIndikator extends Model
{
    use HasFactory;

    protected $fillable = [
        'indikator_mutu_id',
        'tahun_akademik_id',
        'program_studi_id',
        'unit_kerja_id',
        'realisasi',
        'status_capaian',
        'analisis_capaian',
        'akar_masalah',
        'rencana_tindak_lanjut',
        'bukti_dokumen_url',
    ];

    public function indikatorMutu(): BelongsTo
    {
        return $this->belongsTo(IndikatorMutu::class);
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
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
