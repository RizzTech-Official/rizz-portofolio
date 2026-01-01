<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($testimonials);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_photo' => 'nullable|string',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $testimonial = Testimonial::create($validated);
        
        return response()->json($testimonial, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'client_name' => 'sometimes|required|string|max:255',
            'client_photo' => 'nullable|string',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'quote' => 'sometimes|required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $testimonial->update($validated);
        
        return response()->json($testimonial);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        
        return response()->json(null, 204);
    }
}
