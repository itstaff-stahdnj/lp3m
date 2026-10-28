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
        Schema::create('laporan_tahunans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->string('nomor_laporan', 100)->unique();
            $table->string('judul');
            $table->string('periode_tahun', 50);
            $table->text('ringkasan_eksekutif');
            $table->decimal('skor_spmi', 5, 2)->default(88.50);
            $table->integer('total_standar_tercapai')->default(21);
            $table->integer('total_standar')->default(24);
            $table->decimal('skor_ami_closing_rate', 5, 2)->default(85.00);
            $table->decimal('skor_kepuasan_pengguna', 5, 2)->default(87.25);
            $table->decimal('skor_capaian_iku', 5, 2)->default(82.50);
            $table->text('rekomendasi_utama')->nullable();
            $table->json('data_snapshot')->nullable();
            $table->enum('status', ['Draft', 'Review LP3M', 'Disetujui Pimpinan', 'Dipublikasikan'])->default('Disetujui Pimpinan');
            $table->string('disetujui_oleh')->default('Prof. Dr. I Made Kartika, S.Ag., M.Fil.H.');
            $table->date('tanggal_pengesahan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_tahunans');
    }
};
