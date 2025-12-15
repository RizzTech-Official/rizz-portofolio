<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function show()
    {
        $hero = Hero::first();
        return response()->json($hero ?? []);
    }

    public function update(Request $request)
    {
        $hero = Hero::first();
        
        if (!$hero) {
            $hero = Hero::create($request->all());
        } else {
            $hero->update($request->all());
        }

        return response()->json($hero);
    }
}
