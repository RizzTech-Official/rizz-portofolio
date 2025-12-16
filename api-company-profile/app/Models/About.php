<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $table = 'about';

    protected $fillable = [
        'title_en',
        'description_en',
        'mission_en',
        'vision_en',
        
        'title_id',
        'description_id',
        'mission_id',
        'vision_id',
        
        'image_url',
    ];
}
