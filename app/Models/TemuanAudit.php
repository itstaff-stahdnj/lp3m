<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemuanAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'jadwal_audit_id',
        'standar_mutu_id',
        'indikator_mutu_id',
        'kode_temuan',
        'klasifikasi',
        'deskripsi_temuan',
        'kriteria_standar',
        'akar_penyebab',
        'akibat_dampak',
        'rekomendasi_auditor',
        'target_selesai_ptk',
        'status_temuan',
        'tindakan_koreksi',
        'pencegahan',
        'tanggal_tindakan_koreksi',
        'bukti_ptk_url',
        'catatan_verifikasi_auditor',
        'tanggal_closing',
    ];

    protected $casts = [
        'target_selesai_ptk' => 'date',
        'tanggal_tindakan_koreksi' => 'date',
        'tanggal_closing' => 'date',
    ];

    public function jadwalAudit(): BelongsTo
    {
        return $this->belongsTo(JadwalAudit::class);
    }

    public function standarMutu(): BelongsTo
    {
        return $this->belongsTo(StandarMutu::class);
    }

    public function indikatorMutu(): BelongsTo
    {
        return $this->belongsTo(IndikatorMutu::class);
    }
}
