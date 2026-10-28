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
        Schema::create('profil_institusis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kampus')->default('STAH Dharma Nusantara Jakarta');
            $table->string('singkatan')->default('STAH DNJ');
            $table->string('motto')->default('Vidya - Vijñānām - Vidvān');
            $table->text('visi')->nullable();
            $table->text('misi')->nullable();
            $table->text('tujuan')->nullable();
            $table->text('alamat')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('nama_ketua_stah')->nullable();
            $table->string('nama_ketua_lp3m')->nullable();
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_institusis');
    }
};
