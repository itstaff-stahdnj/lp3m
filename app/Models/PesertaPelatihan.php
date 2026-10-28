<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaPelatihan extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelatihan_id',
        'user_id',
        'status_kehadiran',
        'nomor_sertifikat',
        'tanggal_terbit_sertifikat',
        'catatan_evaluasi',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_terbit_sertifikat' => 'date',
        ];
    }

    public function pelatihan(): BelongsTo
    {
        return $this->belongsTo(Pelatihan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
