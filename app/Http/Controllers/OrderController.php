<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function place(Request $request)
    {
        // Validate the form data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:6',
            'country' => 'required|string|max:255',
            'payment_method' => 'required|in:credit_card,debit_card,upi,netbanking,cod',
            'agree_terms' => 'required'
        ]);

        // Get cart data
        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Save order to database (you'll need to create Order model and migration)
        // For now, just clear the cart and show success message
        
        $orderId = 'MYNTRY' . time();
        
        // Save order data to session (in production, save to database)
        session()->put('last_order', [
            'order_id' => $orderId,
            'customer' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'items_count' => count($cart),
            'payment_method' => $validated['payment_method']
        ]);

        // Clear the cart
        session()->forget('cart');

        return redirect()->route('home')->with('success', 'Order placed successfully! Order ID: ' . $orderId);
    }
}
