<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('hero', function (Blueprint $table) {
            $table->renameColumn('badge_text', 'badge_text_en');
            $table->renameColumn('title_line1', 'title_line1_en');
            $table->renameColumn('title_line2', 'title_line2_en');
            $table->renameColumn('description', 'description_en');
            $table->renameColumn('button1_text', 'button1_text_en');
            $table->renameColumn('button2_text', 'button2_text_en');
        });

        Schema::table('hero', function (Blueprint $table) {
            $table->string('badge_text_id')->nullable()->after('badge_text_en');
            $table->string('title_line1_id')->nullable()->after('title_line1_en');
            $table->string('title_line2_id')->nullable()->after('title_line2_en');
            $table->text('description_id')->nullable()->after('description_en');
            $table->string('button1_text_id')->nullable()->after('button1_text_en');
            $table->string('button2_text_id')->nullable()->after('button2_text_en');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->renameColumn('title', 'title_en');
            $table->renameColumn('description', 'description_en');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('title_id')->nullable()->after('title_en');
            $table->text('description_id')->nullable()->after('description_en');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->renameColumn('title', 'title_en');
            $table->renameColumn('description', 'description_en');
        });
        
        Schema::table('projects', function (Blueprint $table) {
            $table->string('title_id')->nullable()->after('title_en');
            $table->text('description_id')->nullable()->after('description_en');
        });

        Schema::table('about', function (Blueprint $table) {
            $table->renameColumn('title', 'title_en');
            $table->renameColumn('description', 'description_en');
            $table->renameColumn('mission', 'mission_en');
            $table->renameColumn('vision', 'vision_en');
        });
        
        Schema::table('about', function (Blueprint $table) {
            $table->string('title_id')->nullable()->after('title_en');
            $table->text('description_id')->nullable()->after('description_en');
            $table->text('mission_id')->nullable()->after('mission_en');
            $table->text('vision_id')->nullable()->after('vision_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('hero', function (Blueprint $table) {
            $table->dropColumn(['badge_text_id', 'title_line1_id', 'title_line2_id', 'description_id', 'button1_text_id', 'button2_text_id']);
            $table->renameColumn('badge_text_en', 'badge_text');
            $table->renameColumn('title_line1_en', 'title_line1');
            $table->renameColumn('title_line2_en', 'title_line2');
            $table->renameColumn('description_en', 'description');
            $table->renameColumn('button1_text_en', 'button1_text');
            $table->renameColumn('button2_text_en', 'button2_text');
        });
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['title_id', 'description_id']);
            $table->renameColumn('title_en', 'title');
            $table->renameColumn('description_en', 'description');
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['title_id', 'description_id']);
            $table->renameColumn('title_en', 'title');
            $table->renameColumn('description_en', 'description');
        });
        Schema::table('about', function (Blueprint $table) {
            $table->dropColumn(['title_id', 'description_id', 'mission_id', 'vision_id']);
            $table->renameColumn('title_en', 'title');
            $table->renameColumn('description_en', 'description');
            $table->renameColumn('mission_en', 'mission');
            $table->renameColumn('vision_en', 'vision');
        });
    }
};
