<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'hero';

    protected $fillable = [
        'badge_text_en',
        'title_line1_en',
        'title_line2_en',
        'description_en',
        'button1_text_en',
        'button2_text_en',

        'badge_text_id',
        'title_line1_id',
        'title_line2_id',
        'description_id',
        'button1_text_id',
        'button2_text_id',

        'button1_link',
        'button2_link',
    ];
}
