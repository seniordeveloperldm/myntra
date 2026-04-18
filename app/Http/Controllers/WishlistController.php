<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\StorefrontData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $wishlistItems = $request->user()
            ->wishlistItems()
            ->with('product.brand', 'product.category')
            ->latest()
            ->get()
            ->filter(fn ($item) => $item->product !== null)
            ->values();

        return Inertia::render('storefront/wishlist', [
            'wishlist' => $wishlistItems->map(fn ($item) => [
                'id' => $item->id,
                'product' => StorefrontData::product($item->product),
            ])->all(),
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $product = Product::query()
            ->whereKey($validated['product_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $request->user()->wishlistItems()->firstOrCreate([
            'product_id' => $product->id,
        ]);

        return back()->with('success', 'Added to wishlist.');
    }

    public function remove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'wishlist_item_id' => ['required', 'integer'],
        ]);

        $request->user()->wishlistItems()->findOrFail($validated['wishlist_item_id'])->delete();

        return back()->with('success', 'Removed from wishlist.');
    }

    public function moveToCart(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'wishlist_item_id' => ['required', 'integer'],
        ]);

        $wishlistItem = $request->user()
            ->wishlistItems()
            ->with('product')
            ->findOrFail($validated['wishlist_item_id']);
        $product = $wishlistItem->product;

        if (! $product) {
            $wishlistItem->delete();

            return back()->with('error', 'Product is no longer available.');
        }

        $cart = $request->user()->cart()->firstOrCreate([], []);
        $cartItem = $cart->items()->firstOrNew([
            'product_id' => $product->id,
        ]);
        $cartItem->quantity = min(($cartItem->exists ? $cartItem->quantity : 0) + 1, max($product->stock, 1));
        $cartItem->unit_price = $product->price;
        $cartItem->compare_at_price = $product->compare_at_price;
        $cartItem->save();

        $wishlistItem->delete();

        return back()->with('success', 'Item moved to bag.');
    }
}
