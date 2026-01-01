<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = PricingPackage::where('is_active', true)
            ->orderBy('order')
            ->orderBy('price_monthly')
            ->get();
        
        return response()->json($packages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_monthly' => 'required|numeric|min:0',
            'price_yearly' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'not_included' => 'nullable|array',
            'is_popular' => 'nullable|boolean',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $package = PricingPackage::create($validated);
        
        return response()->json($package, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PricingPackage $pricingPackage)
    {
        return response()->json($pricingPackage);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PricingPackage $pricingPackage)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price_monthly' => 'sometimes|required|numeric|min:0',
            'price_yearly' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'not_included' => 'nullable|array',
            'is_popular' => 'nullable|boolean',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $pricingPackage->update($validated);
        
        return response()->json($pricingPackage);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PricingPackage $pricingPackage)
    {
        $pricingPackage->delete();
        
        return response()->json(null, 204);
    }
}
