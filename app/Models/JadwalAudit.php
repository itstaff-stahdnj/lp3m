<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'periode_audit_id',
        'auditee_tipe',
        'program_studi_id',
        'unit_kerja_id',
        'lead_auditor_id',
        'auditor_anggota_id',
        'tanggal_audit',
        'lokasi',
        'status',
        'catatan_auditor',
    ];

    protected $casts = [
        'tanggal_audit' => 'date',
    ];

    public function periodeAudit(): BelongsTo
    {
        return $this->belongsTo(PeriodeAudit::class);
    }

    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    public function unitKerja(): BelongsTo
    {
        return $this->belongsTo(UnitKerja::class);
    }

    public function leadAuditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lead_auditor_id');
    }

    public function auditorAnggota(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auditor_anggota_id');
    }

    public function temuans(): HasMany
    {
        return $this->hasMany(TemuanAudit::class);
    }

    public function getAuditeeNameAttribute(): string
    {
        if ($this->auditee_tipe === 'ProgramStudi' && $this->programStudi) {
            return "Prodi {$this->programStudi->jenjang} {$this->programStudi->nama}";
        }
        if ($this->auditee_tipe === 'UnitKerja' && $this->unitKerja) {
            return "Unit {$this->unitKerja->nama}";
        }

        return 'Auditee';
    }
}
