<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rtms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->string('nomor_dokumen', 100)->unique();
            $table->string('judul');
            $table->date('tanggal_rapat');
            $table->string('tempat')->default('Ruang Rapat Pimpinan STAH DNJ / Zoom Meeting');
            $table->string('pimpinan_rapat')->default('Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.');
            $table->text('peserta_hadir')->nullable();
            $table->text('agenda')->nullable();
            $table->text('ringkasan_pembahasan')->nullable();
            $table->text('kesimpulan')->nullable();
            $table->enum('status', ['Draft', 'Terlaksana', 'Dalam Tindak Lanjut', 'Selesai'])->default('Terlaksana');
            $table->timestamps();
        });

        Schema::create('tindak_lanjut_rtms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rtm_id')->constrained('rtms')->cascadeOnDelete();
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->text('butir_rekomendasi');
            $table->text('rencana_tindakan');
            $table->date('target_waktu');
            $table->string('penanggung_jawab');
            $table->enum('status', ['Belum Dimulai', 'Dalam Proses', 'Selesai', 'Diverifikasi'])->default('Dalam Proses');
            $table->text('bukti_tindak_lanjut')->nullable();
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tindak_lanjut_rtms');
        Schema::dropIfExists('rtms');
    }
};
