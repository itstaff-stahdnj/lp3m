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
        Schema::create('pertanyaan_kuesioners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kuesioner_id')->constrained('kuesioners')->cascadeOnDelete();
            $table->integer('nomor_urut')->default(1);
            $table->string('aspek')->default('Umum'); // Pedagogik, Profesional, Tangibles, Reliability, dll.
            $table->text('teks_pertanyaan');
            $table->enum('tipe_jawaban', ['skala_4', 'skala_5', 'teks', 'pilihan'])->default('skala_4');
            $table->json('pilihan_jawaban_json')->nullable();
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pertanyaan_kuesioners');
    }
};
