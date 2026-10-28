<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('temuan_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_audit_id')->constrained('jadwal_audits')->cascadeOnDelete();
            $table->foreignId('standar_mutu_id')->constrained('standar_mutus')->cascadeOnDelete();
            $table->foreignId('indikator_mutu_id')->nullable()->constrained('indikator_mutus')->nullOnDelete();
            $table->string('kode_temuan', 50)->unique();
            $table->enum('klasifikasi', ['KTS Mayor', 'KTS Minor', 'Observasi'])->default('KTS Minor');
            $table->text('deskripsi_temuan');
            $table->text('kriteria_standar')->nullable();
            $table->text('akar_penyebab')->nullable();
            $table->text('akibat_dampak')->nullable();
            $table->text('rekomendasi_auditor');
            $table->date('target_selesai_ptk')->nullable();
            $table->enum('status_temuan', ['Open', 'Proses PTK', 'Menunggu Verifikasi', 'Closed'])->default('Open');
            $table->text('tindakan_koreksi')->nullable();
            $table->text('pencegahan')->nullable();
            $table->date('tanggal_tindakan_koreksi')->nullable();
            $table->string('bukti_ptk_url', 255)->nullable();
            $table->text('catatan_verifikasi_auditor')->nullable();
            $table->date('tanggal_closing')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('temuan_audits');
    }
};
