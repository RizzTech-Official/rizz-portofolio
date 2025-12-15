<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json(Contact::orderBy('submitted_at', 'desc')->get());
    }

    public function show($id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($contact);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        $contact = Contact::create($request->all());
        return response()->json($contact, 201);
    }

    public function markRead($id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $contact->update(['is_read' => true]);
        return response()->json($contact);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $contact->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
