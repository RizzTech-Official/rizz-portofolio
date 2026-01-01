<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $team = TeamMember::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'asc')
            ->get();
        
        return response()->json($team);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|string|url',
            'github_url' => 'nullable|string|url',
            'email' => 'nullable|email',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $member = TeamMember::create($validated);
        
        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeamMember $teamMember)
    {
        return response()->json($teamMember);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|string',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|string',
            'github_url' => 'nullable|string',
            'email' => 'nullable|email',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $teamMember->update($validated);
        
        return response()->json($teamMember);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();
        
        return response()->json(null, 204);
    }
}
