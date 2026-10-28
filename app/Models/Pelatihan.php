<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pelatihan extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'judul',
        'kategori',
        'narasumber',
        'penyelenggara',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'kuota',
        'jam_pelajaran',
        'status',
        'deskripsi',
        'silabus_materi',
    ];

    protected function casts(): array
    {
        return [
            'kuota' => 'integer',
            'jam_pelajaran' => 'integer',
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    public function pesertas(): HasMany
    {
        return $this->hasMany(PesertaPelatihan::class);
    }
}
