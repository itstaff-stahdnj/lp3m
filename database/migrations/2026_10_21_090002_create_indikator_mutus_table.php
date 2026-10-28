<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indikator_mutus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('standar_mutu_id')->constrained('standar_mutus')->cascadeOnDelete();
            $table->string('kode', 50)->unique();
            $table->text('pernyataan');
            $table->string('target', 100);
            $table->string('satuan', 50)->default('%');
            $table->string('baseline', 100)->nullable();
            $table->enum('tipe_indikator', ['Standar', 'IKU', 'IKT'])->default('Standar');
            $table->text('metode_pengukuran')->nullable();
            $table->integer('bobot')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_mutus');
    }
};
