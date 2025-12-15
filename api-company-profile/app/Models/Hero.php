<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'hero';

    protected $fillable = [
        'badge_text',
        'title_line1',
        'title_line2',
        'description',
        'button1_text',
        'button1_link',
        'button2_text',
        'button2_link',
    ];
}
