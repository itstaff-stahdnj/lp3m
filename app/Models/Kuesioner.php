<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kuesioner extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'judul',
        'tipe',
        'deskripsi',
        'tahun_akademik_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'target_role',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    public function tahunAkademik(): BelongsTo
    {
        return $this->belongsTo(TahunAkademik::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pertanyaans(): HasMany
    {
        return $this->hasMany(PertanyaanKuesioner::class)->orderBy('nomor_urut');
    }

    public function respons(): HasMany
    {
        return $this->hasMany(ResponSurvei::class);
    }
}
