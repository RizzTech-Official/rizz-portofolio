<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = BlogPost::where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($posts);
    }

    /**
     * Get all posts for admin (including unpublished)
     */
    public function adminIndex()
    {
        $posts = BlogPost::orderBy('created_at', 'desc')->get();
        
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'read_time' => 'nullable|integer|min:1',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($validated['is_published'] && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);
        
        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $post = BlogPost::where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();
        
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BlogPost $blogPost)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $blogPost->id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:255',
            'read_time' => 'nullable|integer|min:1',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'order' => 'nullable|integer',
        ]);

        if (isset($validated['is_published']) && $validated['is_published'] && empty($blogPost->published_at)) {
            $validated['published_at'] = now();
        }

        $blogPost->update($validated);
        
        return response()->json($blogPost);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();
        
        return response()->json(null, 204);
    }
}
