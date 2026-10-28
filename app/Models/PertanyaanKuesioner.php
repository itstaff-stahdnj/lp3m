<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PertanyaanKuesioner extends Model
{
    use HasFactory;

    protected $fillable = [
        'kuesioner_id',
        'nomor_urut',
        'aspek',
        'teks_pertanyaan',
        'tipe_jawaban',
        'pilihan_jawaban_json',
        'is_required',
    ];

    protected function casts(): array
    {
        return [
            'pilihan_jawaban_json' => 'array',
            'is_required' => 'boolean',
        ];
    }

    public function kuesioner(): BelongsTo
    {
        return $this->belongsTo(Kuesioner::class);
    }
}
