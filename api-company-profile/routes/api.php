<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\BlogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no auth required)
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/hero', [HeroController::class, 'show']);
Route::get('/about', [AboutController::class, 'show']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);

// New public routes
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/team', [TeamMemberController::class, 'index']);
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/faq', [FaqController::class, 'index']);
Route::get('/pricing', [PricingController::class, 'index']);
Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{id}', [BlogController::class, 'show']);

// Public contact form submission
Route::post('/contacts', [ContactController::class, 'store']);

// Protected routes (require auth)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/verify', [AuthController::class, 'verify']);

    // File Upload
    Route::post('/upload', [UploadController::class, 'upload']);
    Route::delete('/upload', [UploadController::class, 'delete']);

    // Hero
    Route::put('/hero', [HeroController::class, 'update']);

    // About
    Route::put('/about', [AboutController::class, 'update']);

    // Projects
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    // Certificates
    Route::get('/certificates/{id}', [CertificateController::class, 'show']);
    Route::post('/certificates', [CertificateController::class, 'store']);
    Route::put('/certificates/{id}', [CertificateController::class, 'update']);
    Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);

    // Services
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    // Contacts
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/contacts/{id}/read', [ContactController::class, 'markRead']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

    // Testimonials (CRUD)
    Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    // Team Members (CRUD)
    Route::get('/team/{teamMember}', [TeamMemberController::class, 'show']);
    Route::post('/team', [TeamMemberController::class, 'store']);
    Route::put('/team/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('/team/{teamMember}', [TeamMemberController::class, 'destroy']);

    // Clients (CRUD)
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    // FAQ (CRUD)
    Route::get('/faq/{faq}', [FaqController::class, 'show']);
    Route::post('/faq', [FaqController::class, 'store']);
    Route::put('/faq/{faq}', [FaqController::class, 'update']);
    Route::delete('/faq/{faq}', [FaqController::class, 'destroy']);

    // Pricing (CRUD)
    Route::get('/pricing/{pricingPackage}', [PricingController::class, 'show']);
    Route::post('/pricing', [PricingController::class, 'store']);
    Route::put('/pricing/{pricingPackage}', [PricingController::class, 'update']);
    Route::delete('/pricing/{pricingPackage}', [PricingController::class, 'destroy']);

    // Blog (CRUD)
    Route::get('/blog/admin', [BlogController::class, 'adminIndex']);
    Route::post('/blog', [BlogController::class, 'store']);
    Route::put('/blog/{blogPost}', [BlogController::class, 'update']);
    Route::delete('/blog/{blogPost}', [BlogController::class, 'destroy']);
});
