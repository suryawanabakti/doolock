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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->string('id_tag')->unique();
            $table->string('nama');
            $table->string('nim')->unique();
            $table->unsignedBigInteger('ruangan_id')->nullable();
            $table->foreign('ruangan_id')->references('id')->on('ruangans');
            $table->string('kelas')->nullable();
            $table->string('nomor_hp')->nullable();
            $table->string('ket'); // role
            $table->tinyInteger('status');
            $table->integer('tahun_masuk')->default('2024');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
