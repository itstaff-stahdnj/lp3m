<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanTahunan extends Model
{
    use HasFactory;

    protected $fillable = [
        'tahun_akademik_id',
        'nomor_laporan',
        'judul',
        'periode_tahun',
        'ringkasan_eksekutif',
        'skor_spmi',
        'total_standar_tercapai',
        'total_standar',
        'skor_ami_closing_rate',
        'skor_kepuasan_pengguna',
        'skor_capaian_iku',
        'rekomendasi_utama',
        'data_snapshot',
        'status',
        'disetujui_oleh',
        'tanggal_pengesahan',
    ];

    protected function casts(): array
    {
        return [
            'skor_spmi' => 'float',
            'total_standar_tercapai' => 'integer',
            'total_standar' => 'integer',
            'skor_ami_closing_rate' => 'float',
            'skor_kepuasan_pengguna' => 'float',
            'skor_capaian_iku' => 'float',
            'data_snapshot' => 'array',
            'tanggal_pengesahan' => 'date',
        ];
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }
}
