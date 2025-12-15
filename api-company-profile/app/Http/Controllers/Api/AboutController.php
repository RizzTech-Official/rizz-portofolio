<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        $about = About::first();
        return response()->json($about ?? []);
    }

    public function update(Request $request)
    {
        $about = About::first();
        
        if (!$about) {
            $about = About::create($request->all());
        } else {
            $about->update($request->all());
        }

        return response()->json($about);
    }
}
