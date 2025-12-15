<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'title',
        'issuer',
        'date_issued',
        'image_url',
    ];

    protected $casts = [
        'date_issued' => 'date',
    ];
}
