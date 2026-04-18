<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends \App\Http\Controllers\Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $orders = Order::query()
            ->with(['items', 'user:id,name,email'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('order_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'total_amount' => $order->total_amount,
                'subtotal' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'placed_at' => optional($order->placed_at)->toDayDateTimeString(),
                'shipping_address' => $order->shipping_address,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'brand' => $item->brand_name,
                    'image' => $item->product_image,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                    'product_id' => $item->product_id,
                ])->values()->all(),
            ])
            ->all();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
            ],
            'statusOptions' => ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            'paymentStatusOptions' => ['pending', 'authorized', 'paid', 'failed', 'refunded'],
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])],
            'payment_status' => ['required', 'string', Rule::in(['pending', 'authorized', 'paid', 'failed', 'refunded'])],
        ]);

        if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            $order->loadMissing('items.product');

            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }
        }

        $order->update($validated);

        return back()->with('success', 'Order updated successfully.');
    }
}
