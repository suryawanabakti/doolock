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
        Schema::table('ruangans', function (Blueprint $table) {
            $table->integer('max_register')->default(10);
            $table->foreignId('mahasiswa_id')->nullable()->constrained('mahasiswa')->cascadeOnDelete(); // Penanggung Jawab Dosen
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruangans', function (Blueprint $table) {
            //
        });
    }
};
