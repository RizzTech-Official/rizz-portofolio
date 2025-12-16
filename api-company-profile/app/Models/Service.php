<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'icon_name',
        
        'title_en',
        'description_en',
        
        'title_id',
        'description_id',
    ];
}
