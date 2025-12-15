<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero', function (Blueprint $table) {
            $table->id();
            $table->string('badge_text', 255)->default('🚀 Shaping the Digital Future');
            $table->string('title_line1', 255)->default('Innovating');
            $table->string('title_line2', 255)->default('The Future');
            $table->text('description')->nullable();
            $table->string('button1_text', 100)->default('Get Started');
            $table->string('button1_link', 255)->default('#contact');
            $table->string('button2_text', 100)->default('Learn More');
            $table->string('button2_link', 255)->default('#about');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero');
    }
};
