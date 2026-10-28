<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TracerStudy extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_studi_id',
        'tahun_lulus',
        'nama_alumni',
        'nim',
        'email',
        'nomor_hp',
        'status_alumni',
        'nama_instansi',
        'posisi_jabatan',
        'masa_tunggu_bulan',
        'pendapatan_bulanan',
        'kesesuaian_bidang',
        'rekomendasi_alumni',
    ];

    protected function casts(): array
    {
        return [
            'masa_tunggu_bulan' => 'integer',
        ];
    }

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }
}
