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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('password')->constrained('roles')->nullOnDelete();
            $table->foreignId('program_studi_id')->nullable()->after('role_id')->constrained('program_studis')->nullOnDelete();
            $table->foreignId('unit_kerja_id')->nullable()->after('program_studi_id')->constrained('unit_kerjas')->nullOnDelete();
            $table->string('nip_nim')->nullable()->after('unit_kerja_id');
            $table->string('phone')->nullable()->after('nip_nim');
            $table->string('avatar')->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('avatar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
            $table->dropConstrainedForeignId('program_studi_id');
            $table->dropConstrainedForeignId('unit_kerja_id');
            $table->dropColumn(['nip_nim', 'phone', 'avatar', 'is_active']);
        });
    }
};
