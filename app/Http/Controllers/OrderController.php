<?php

namespace App\Http\Controllers;

use App\Support\StorefrontData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function place(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:cod,card,upi,wallet,netbanking,emi'],
            'otp' => ['nullable', 'string', 'size:4'],
        ]);

        $user = $request->user();
        $address = $user->defaultAddress()->first();
        $cart = $user->cart()->firstOrCreate([], [])->load(['items.product.brand', 'items.product.category']);

        if (! $address) {
            return to_route('checkout.address')->with('error', 'Please add a delivery address before placing the order.');
        }

        if ($cart->items->isEmpty()) {
            return to_route('cart')->with('error', 'Your bag is empty.');
        }

        $summary = StorefrontData::cartSummary($cart->items, $request->session()->get('promo_code'));

        $order = DB::transaction(function () use ($address, $cart, $summary, $user, $validated) {
            $order = $user->orders()->create([
                'address_id' => $address->id,
                'order_number' => 'MYNTRA-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'status' => 'confirmed',
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cod' ? 'pending' : 'authorized',
                'customer_name' => $address->full_name,
                'customer_email' => $user->email,
                'customer_phone' => $address->phone,
                'shipping_address' => [
                    'fullName' => $address->full_name,
                    'mobile' => $address->phone,
                    'street' => $address->line_1,
                    'street2' => $address->line_2,
                    'city' => $address->city,
                    'state' => $address->state,
                    'pinCode' => $address->postal_code,
                    'country' => $address->country,
                ],
                'subtotal' => $summary['amount'],
                'discount_amount' => $summary['productDiscount'] + $summary['promoDiscount'],
                'shipping_amount' => 0,
                'total_amount' => $summary['payable'],
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                $product = $item->product;

                $order->items()->create([
                    'product_id' => $product?->id,
                    'product_name' => $product?->name ?? 'Unavailable Product',
                    'brand_name' => $product?->brand?->name,
                    'product_image' => $product?->primary_image,
                    'sku' => $product?->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'compare_at_price' => $item->compare_at_price,
                    'line_total' => $item->unit_price * $item->quantity,
                ]);

                if ($product) {
                    $product->decrement('stock', min($product->stock, $item->quantity));
                }
            }

            $cart->items()->delete();

            return $order;
        });

        $request->session()->forget('promo_code');
        $request->session()->put('last_order_id', $order->id);

        return to_route('checkout.success')->with('success', 'Order placed successfully.');
    }
}
