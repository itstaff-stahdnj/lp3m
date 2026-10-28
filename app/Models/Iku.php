<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Iku extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor',
        'kode',
        'nama',
        'deskripsi',
        'definisi_operasional',
        'satuan',
        'target_default',
    ];

    protected function casts(): array
    {
        return [
            'nomor' => 'integer',
            'target_default' => 'float',
        ];
    }

    public function monevs(): HasMany
    {
        return $this->hasMany(MonevIku::class);
    }
}
