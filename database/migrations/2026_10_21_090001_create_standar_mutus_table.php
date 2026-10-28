<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standar_mutus', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 50)->unique();
            $table->string('nama', 255);
            $table->enum('kategori', ['Pendidikan', 'Penelitian', 'Pengabdian', 'Tambahan'])->default('Pendidikan');
            $table->text('deskripsi')->nullable();
            $table->string('kriteria_akreditasi', 100)->nullable();
            $table->foreignId('penanggung_jawab_unit_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->string('dokumen_kebijakan_url', 255)->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standar_mutus');
    }
};
