<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kriteria_akreditasis', function (Blueprint $table) {
            $table->id();
            $table->integer('nomor')->unique();
            $table->string('kode', 20)->unique();
            $table->string('nama', 255);
            $table->text('deskripsi')->nullable();
            $table->decimal('bobot_default', 5, 2)->default(10.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriteria_akreditasis');
    }
};
