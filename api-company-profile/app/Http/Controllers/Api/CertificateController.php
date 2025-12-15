<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index()
    {
        return response()->json(Certificate::orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $cert = Certificate::find($id);
        if (!$cert) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($cert);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $cert = Certificate::create($request->all());
        return response()->json($cert, 201);
    }

    public function update(Request $request, $id)
    {
        $cert = Certificate::find($id);
        if (!$cert) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $cert->update($request->all());
        return response()->json($cert);
    }

    public function destroy($id)
    {
        $cert = Certificate::find($id);
        if (!$cert) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $cert->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
