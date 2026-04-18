<?php

namespace App\Http\Controllers;

use App\Support\StorefrontData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('checkout.address');
    }

    public function address(Request $request): Response|RedirectResponse
    {
        $cart = $request->user()
            ->cart()
            ->firstOrCreate([], [])
            ->load(['items.product.brand', 'items.product.category']);

        if ($cart->items->isEmpty()) {
            return to_route('cart')->with('error', 'Your bag is empty.');
        }

        $address = $request->user()->defaultAddress()->first()
            ?? $request->user()->addresses()->latest()->first();

        return Inertia::render('storefront/address', [
            'address' => StorefrontData::address($address),
            'summary' => StorefrontData::cartSummary($cart->items, $request->session()->get('promo_code')),
        ]);
    }

    public function storeAddress(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fullName' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'max:20'],
            'street' => ['required', 'string', 'max:255'],
            'street2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'pinCode' => ['required', 'string', 'max:12'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->addresses()->update(['is_default' => false]);

        $request->user()->addresses()->create([
            'label' => 'Home',
            'full_name' => $validated['fullName'],
            'phone' => $validated['mobile'],
            'line_1' => $validated['street'],
            'line_2' => $validated['street2'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['pinCode'],
            'country' => $validated['country'] ?? 'India',
            'is_default' => true,
        ]);

        return to_route('checkout.payment')->with('success', 'Address saved successfully.');
    }

    public function payment(Request $request): Response|RedirectResponse
    {
        $cart = $request->user()
            ->cart()
            ->firstOrCreate([], [])
            ->load(['items.product.brand', 'items.product.category']);
        $address = $request->user()->defaultAddress()->first();

        if ($cart->items->isEmpty()) {
            return to_route('cart')->with('error', 'Your bag is empty.');
        }

        if (! $address) {
            return to_route('checkout.address')->with('error', 'Please add a delivery address first.');
        }

        return Inertia::render('storefront/payment', [
            'address' => StorefrontData::address($address),
            'summary' => StorefrontData::cartSummary($cart->items, $request->session()->get('promo_code')),
            'paymentMethods' => StorefrontData::paymentMethods(),
        ]);
    }

    public function otp(Request $request): Response|RedirectResponse
    {
        $cart = $request->user()
            ->cart()
            ->firstOrCreate([], [])
            ->load(['items.product.brand', 'items.product.category']);
        $paymentMethod = (string) $request->query('payment_method', 'cod');
        $paymentMethodKeys = collect(StorefrontData::paymentMethods())->pluck('key')->all();

        if ($cart->items->isEmpty()) {
            return to_route('cart')->with('error', 'Your bag is empty.');
        }

        if (! in_array($paymentMethod, $paymentMethodKeys, true)) {
            return to_route('checkout.payment')->with('error', 'Select a valid payment option.');
        }

        return Inertia::render('storefront/otp', [
            'paymentMethod' => $paymentMethod,
            'paymentLabel' => StorefrontData::paymentMethodLabel($paymentMethod),
        ]);
    }

    public function success(Request $request): Response|RedirectResponse
    {
        $orderId = $request->session()->get('last_order_id');
        $order = $request->user()
            ->orders()
            ->with('items')
            ->when($orderId, fn ($query) => $query->whereKey($orderId))
            ->latest()
            ->first();

        if (! $order) {
            return to_route('home');
        }

        return Inertia::render('storefront/success', [
            'order' => StorefrontData::order($order),
        ]);
    }
}
