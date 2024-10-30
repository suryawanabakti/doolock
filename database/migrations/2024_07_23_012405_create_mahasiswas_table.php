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
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('id_tag')->unique()->nullable();
            $table->string('nama');
            $table->string('nim')->unique();
            $table->string('pin')->nullable()->unique();
            $table->unsignedBigInteger('ruangan_id')->nullable();
            $table->foreign('ruangan_id')->references('id')->on('ruangans');
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
