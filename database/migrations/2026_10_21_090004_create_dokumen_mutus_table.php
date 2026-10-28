<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokumen_mutus', function (Blueprint $table) {
            $table->id();
            $table->string('kode_dokumen', 100)->unique();
            $table->string('nama', 255);
            $table->enum('kategori', ['Kebijakan', 'Manual', 'Standar', 'SOP', 'Formulir', 'Laporan', 'Lainnya'])->default('Standar');
            $table->foreignId('standar_mutu_id')->nullable()->constrained('standar_mutus')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->string('nomor_sk', 255)->nullable();
            $table->date('tanggal_berlaku')->nullable();
            $table->string('versi', 20)->default('1.0');
            $table->string('file_path', 255)->nullable();
            $table->text('keterangan')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen_mutus');
    }
};
