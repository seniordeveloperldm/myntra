<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\StorefrontData;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function category(string $category): Response
    {
        $categoryModel = Category::query()
            ->where('slug', $category)
            ->firstOrFail();

        $products = Product::query()
            ->with(['brand', 'category'])
            ->whereBelongsTo($categoryModel)
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('storefront/category', [
            'category' => $categoryModel->slug,
            'categoryLabel' => $categoryModel->name,
            'products' => StorefrontData::products($products),
            'wishlistIds' => auth()->check()
                ? auth()->user()->wishlistItems()->pluck('product_id')->map(fn ($id) => (int) $id)->all()
                : [],
        ]);
    }

    public function show(string $id): Response
    {
        $product = Product::query()
            ->with(['brand', 'category'])
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('slug', $id);
            })
            ->where('is_active', true)
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->with(['brand', 'category'])
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        return Inertia::render('storefront/product', [
            'product' => StorefrontData::product($product),
            'relatedProducts' => StorefrontData::products($relatedProducts),
            'isWishlisted' => auth()->check()
                ? auth()->user()->wishlistItems()->where('product_id', $product->id)->exists()
                : false,
        ]);
    }
}
