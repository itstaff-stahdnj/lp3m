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
        Schema::create('pelatihans', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 50)->unique();
            $table->string('judul');
            $table->enum('kategori', [
                'Pedagogik & Kurikulum',
                'Penelitian & Publikasi',
                'Pengabdian Masyarakat',
                'Penjaminan Mutu SPMI',
                'Pengembangan Tendik',
            ])->default('Pedagogik & Kurikulum');
            $table->string('narasumber')->nullable();
            $table->string('penyelenggara')->default('LP3M STAH DNJ');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('lokasi')->nullable();
            $table->integer('kuota')->default(30);
            $table->integer('jam_pelajaran')->default(32); // JP
            $table->enum('status', ['Akan Datang', 'Sedang Berjalan', 'Selesai'])->default('Akan Datang');
            $table->text('deskripsi')->nullable();
            $table->text('silabus_materi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelatihans');
    }
};
