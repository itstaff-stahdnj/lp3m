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
        Schema::create('ikus', function (Blueprint $table) {
            $table->id();
            $table->integer('nomor')->default(1);
            $table->string('kode', 20)->unique(); // IKU 1 - IKU 8
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->text('definisi_operasional')->nullable();
            $table->string('satuan', 50)->default('%');
            $table->decimal('target_default', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ikus');
    }
};
