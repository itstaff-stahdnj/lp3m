<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResponSurvei extends Model
{
    use HasFactory;

    protected $fillable = [
        'kuesioner_id',
        'user_id',
        'dosen_id',
        'mata_kuliah',
        'program_studi_id',
        'skor_rata_rata',
        'jawaban_json',
        'saran_masukan',
    ];

    protected function casts(): array
    {
        return [
            'skor_rata_rata' => 'float',
            'jawaban_json' => 'array',
        ];
    }

    public function kuesioner(): BelongsTo
    {
        return $this->belongsTo(Kuesioner::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
}
