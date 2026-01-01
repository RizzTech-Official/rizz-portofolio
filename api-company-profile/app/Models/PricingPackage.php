<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_monthly',
        'price_yearly',
        'features',
        'not_included',
        'is_popular',
        'icon',
        'is_active',
        'order',
    ];

    protected $casts = [
        'features' => 'array',
        'not_included' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
        'order' => 'integer',
    ];
}
