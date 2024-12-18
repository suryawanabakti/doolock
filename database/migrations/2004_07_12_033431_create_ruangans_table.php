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
        Schema::create('ruangans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ruangan')->nullable();
            $table->enum('type', ['umum', 'kelas', 'lab']);
            $table->boolean('open_api')->default(1);
            $table->string('pin')->unique()->nullable();
            $table->boolean('pin_active')->default(1);
            $table->foreignId('parent_id')->nullable()->constrained('ruangans')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruangans');
    }
};
