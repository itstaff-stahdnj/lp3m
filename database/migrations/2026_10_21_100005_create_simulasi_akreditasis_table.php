<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulasi_akreditasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_studi_id')->constrained('program_studis')->cascadeOnDelete();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->string('instrumen', 100)->default('9 Kriteria BAN-PT');
            $table->decimal('total_skor', 6, 2)->default(0.00);
            $table->enum('predikat_proyeksi', ['Unggul', 'Baik Sekali', 'Baik', 'Tidak Terakreditasi'])->default('Baik');
            $table->json('rincian_skor_json')->nullable();
            $table->text('catatan_evaluator')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulasi_akreditasis');
    }
};
