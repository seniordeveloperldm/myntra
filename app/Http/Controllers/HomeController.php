<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\StorefrontData;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/home', [
            'featuredProducts' => StorefrontData::products(
                Product::query()
                    ->with(['brand', 'category'])
                    ->where('is_active', true)
                    ->where('is_featured', true)
                    ->take(8)
                    ->get(),
            ),
        ]);
    }

    public function profile(): RedirectResponse
    {
        return auth()->check()
            ? redirect()->route('profile.edit')
            : redirect()->route('login');
    }
}
