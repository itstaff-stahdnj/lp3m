<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_audit_id')->constrained('periode_audits')->cascadeOnDelete();
            $table->enum('auditee_tipe', ['ProgramStudi', 'UnitKerja'])->default('ProgramStudi');
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->foreignId('lead_auditor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('auditor_anggota_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('tanggal_audit');
            $table->string('lokasi', 255)->nullable();
            $table->enum('status', ['Terjadwal', 'Sedang Berjalan', 'Selesai Audit', 'Tindakan Koreksi', 'Closed'])->default('Terjadwal');
            $table->text('catatan_auditor')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_audits');
    }
};
