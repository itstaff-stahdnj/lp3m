<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rtm extends Model
{
    use HasFactory;

    protected $fillable = [
        'tahun_akademik_id',
        'nomor_dokumen',
        'judul',
        'tanggal_rapat',
        'tempat',
        'pimpinan_rapat',
        'peserta_hadir',
        'agenda',
        'ringkasan_pembahasan',
        'kesimpulan',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_rapat' => 'date',
        ];
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }

    public function tindakLanjuts(): HasMany
    {
        return $this->hasMany(TindakLanjutRtm::class);
    }
}
