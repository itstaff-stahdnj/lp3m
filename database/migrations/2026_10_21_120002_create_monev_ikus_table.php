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
        Schema::create('monev_ikus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iku_id')->constrained('ikus')->cascadeOnDelete();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->nullOnDelete();
            $table->decimal('target', 8, 2)->default(0);
            $table->decimal('realisasi', 8, 2)->default(0);
            $table->decimal('persentase_capaian', 5, 2)->default(0);
            $table->enum('status', ['Tercapai', 'Sebagian Tercapai', 'Belum Tercapai'])->default('Belum Tercapai');
            $table->text('kendala')->nullable();
            $table->text('strategi_tindak_lanjut')->nullable();
            $table->string('bukti_dokumen_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monev_ikus');
    }
};
