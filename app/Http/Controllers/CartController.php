<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Support\StorefrontData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $this->cartFor($request);
        $promoCode = $request->session()->get('promo_code');

        return Inertia::render('storefront/cart', [
            'cartItems' => StorefrontData::cartItems($cart->items),
            'summary' => StorefrontData::cartSummary($cart->items, $promoCode),
            'appliedPromo' => $promoCode,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $product = Product::query()
            ->whereKey($validated['product_id'])
            ->where('is_active', true)
            ->firstOrFail();
        $cart = $this->cartFor($request);
        $quantity = $validated['quantity'] ?? 1;

        $item = $cart->items()->firstOrNew([
            'product_id' => $product->id,
        ]);
        $item->quantity = min(($item->exists ? $item->quantity : 0) + $quantity, max($product->stock, 1));
        $item->unit_price = $product->price;
        $item->compare_at_price = $product->compare_at_price;
        $item->save();

        return back()->with('success', 'Product added to bag.');
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cart_item_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:0', 'max:10'],
        ]);

        $item = $this->cartFor($request)->items()->findOrFail($validated['cart_item_id']);

        if ($validated['quantity'] === 0) {
            $item->delete();

            return back()->with('success', 'Product removed from bag.');
        }

        $item->update([
            'quantity' => min($validated['quantity'], max($item->product->stock, 1)),
            'unit_price' => $item->product->price,
            'compare_at_price' => $item->product->compare_at_price,
        ]);

        return back()->with('success', 'Bag updated.');
    }

    public function remove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cart_item_id' => ['required', 'integer'],
        ]);

        $this->cartFor($request)->items()->findOrFail($validated['cart_item_id'])->delete();

        return back()->with('success', 'Product removed from bag.');
    }

    public function applyPromo(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string'],
        ]);

        $code = strtoupper(trim($validated['code']));
        $summary = StorefrontData::cartSummary($this->cartFor($request)->items, $code);

        if ($code !== 'MYNTRA300') {
            return back()->with('error', 'Try promo code MYNTRA300.');
        }

        if ($summary['promoDiscount'] === 0) {
            return back()->with('error', 'Promo code works on orders above Rs. 300.');
        }

        $request->session()->put('promo_code', $code);

        return back()->with('success', 'Promo code applied successfully.');
    }

    private function cartFor(Request $request): Cart
    {
        return $request->user()
            ->cart()
            ->firstOrCreate([], [])
            ->load(['items.product.brand', 'items.product.category']);
    }
}
