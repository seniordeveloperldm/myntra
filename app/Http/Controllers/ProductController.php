<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function category(string $category): Response
    {
        return Inertia::render('storefront/category', ['category' => $category]);
    }

    public function show(string $id): Response
    {
        return Inertia::render('storefront/product', ['id' => $id]);
    }
}
