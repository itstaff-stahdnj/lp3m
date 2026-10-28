<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capaian_indikators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indikator_mutu_id')->constrained('indikator_mutus')->cascadeOnDelete();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->string('realisasi', 100);
            $table->enum('status_capaian', ['Terlampaui', 'Tercapai', 'Belum Tercapai'])->default('Belum Tercapai');
            $table->text('analisis_capaian')->nullable();
            $table->text('akar_masalah')->nullable();
            $table->text('rencana_tindak_lanjut')->nullable();
            $table->string('bukti_dokumen_url', 255)->nullable();
            $table->timestamps();

            $table->unique(['indikator_mutu_id', 'tahun_akademik_id', 'program_studi_id'], 'capaian_unique_per_prodi_tahun');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capaian_indikators');
    }
};
