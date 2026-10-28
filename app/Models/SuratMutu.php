<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuratMutu extends Model
{
    use HasFactory;

    protected $fillable = [
        'tahun_akademik_id',
        'nomor_surat',
        'jenis_surat',
        'perihal',
        'tujuan_penerima',
        'program_studi_id',
        'unit_kerja_id',
        'user_id',
        'tanggal_surat',
        'penandatangan_nama',
        'penandatangan_jabatan',
        'isi_ringkas',
        'qr_token',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_surat' => 'date',
        ];
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
