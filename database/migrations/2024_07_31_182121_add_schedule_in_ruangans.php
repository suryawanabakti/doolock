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
            $table->time('jam_buka')->default("0:01");
            $table->time('jam_tutup')->default("23:59");
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
