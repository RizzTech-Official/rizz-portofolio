<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_url',
        'tech_stack',
        'link',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];
}
