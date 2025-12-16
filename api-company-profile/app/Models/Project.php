<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title_en',
        'description_en',
        
        'title_id',
        'description_id',
        
        'image_url',
        'tech_stack',
        'link',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];
}
