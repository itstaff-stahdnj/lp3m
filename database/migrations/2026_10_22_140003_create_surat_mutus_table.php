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
        Schema::create('surat_mutus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_akademik_id')->constrained('tahun_akademiks')->cascadeOnDelete();
            $table->string('nomor_surat', 100)->unique();
            $table->enum('jenis_surat', [
                'Surat Keterangan Akreditasi',
                'Surat Bebas Temuan AMI',
                'Surat Rekomendasi Mutu',
                'E-Sertifikat Pelatihan',
                'Surat Pengantar Audit',
            ])->default('Surat Keterangan Akreditasi');
            $table->string('perihal');
            $table->string('tujuan_penerima');
            $table->foreignId('program_studi_id')->nullable()->constrained('program_studis')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->constrained('unit_kerjas')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('tanggal_surat');
            $table->string('penandatangan_nama')->default('Dr. I Nyoman Yoga, M.Pd.H.');
            $table->string('penandatangan_jabatan')->default('Ketua LP3M STAH Dharma Nusantara Jakarta');
            $table->text('isi_ringkas');
            $table->string('qr_token', 64)->unique();
            $table->enum('status', ['Draft', 'Diterbitkan', 'Diarsipkan', 'Dibatalkan'])->default('Diterbitkan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_mutus');
    }
};
