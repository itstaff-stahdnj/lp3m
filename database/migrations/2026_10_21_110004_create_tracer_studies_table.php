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
        Schema::create('tracer_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_studi_id')->constrained('program_studis')->cascadeOnDelete();
            $table->year('tahun_lulus');
            $table->string('nama_alumni');
            $table->string('nim', 30);
            $table->string('email')->nullable();
            $table->string('nomor_hp', 30)->nullable();
            $table->enum('status_alumni', [
                'Bekerja Penuh',
                'Bekerja Paruh Waktu',
                'Wiraswasta',
                'Melanjutkan Studi',
                'Mencari Kerja',
            ])->default('Bekerja Penuh');
            $table->string('nama_instansi')->nullable();
            $table->string('posisi_jabatan')->nullable();
            $table->integer('masa_tunggu_bulan')->default(0); // misal: 3 bulan
            $table->enum('pendapatan_bulanan', [
                '< 3 Juta',
                '3 - 5 Juta',
                '5 - 10 Juta',
                '> 10 Juta',
            ])->default('3 - 5 Juta');
            $table->enum('kesesuaian_bidang', [
                'Sangat Sesuai',
                'Sesuai',
                'Kurang Sesuai',
                'Tidak Sesuai',
            ])->default('Sesuai');
            $table->text('rekomendasi_alumni')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracer_studies');
    }
};
