<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/cart');
    }

    public function add(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        // Sample product data (same as ProductController)
        $products = [
            ['id' => 1, 'name' => 'Men Cotton T-Shirt', 'brand' => 'U.S. Polo Assn.', 'price' => 599, 'original_price' => 1299, 'discount' => 54, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/1/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9j.jpg'],
            ['id' => 2, 'name' => 'Men Casual Shirt', 'brand' => 'Roadster', 'price' => 799, 'original_price' => 1999, 'discount' => 60, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/2/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9k.jpg'],
            ['id' => 3, 'name' => 'Men Denim Jeans', 'brand' => 'KLOTTHE', 'price' => 1199, 'original_price' => 2999, 'discount' => 60, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/3/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9l.jpg'],
            ['id' => 4, 'name' => 'Men Formal Trousers', 'brand' => 'Mast & Harbour', 'price' => 999, 'original_price' => 1999, 'discount' => 50, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/4/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9m.jpg'],
            ['id' => 5, 'name' => 'Men Sports T-Shirt', 'brand' => 'PUMA', 'price' => 1299, 'original_price' => 2499, 'discount' => 48, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/5/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9n.jpg'],
            ['id' => 6, 'name' => 'Women Casual Dress', 'brand' => 'Anouk', 'price' => 899, 'original_price' => 2499, 'discount' => 64, 'image' => 'https://assets.myntassets.com/f_webp,w_290,c_limit,fl_progressive,dpr_2/assets/images/productimage/2023/7/6/4b5e7d1c-8b9f-4e2a-9c1b-3d5f6g7h8i9o.jpg'],
        ];

        $product = collect($products)->firstWhere('id', $productId);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Get existing cart
        $cart = session()->get('cart', []);

        // Check if product already in cart
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $product['quantity'] = $quantity;
            $cart[$productId] = $product;
        }

        // Save cart to session
        session()->put('cart', $cart);

        return response()->json(['success' => 'Product added to cart']);
    }

    public function update(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            if ($quantity > 0) {
                $cart[$productId]['quantity'] = $quantity;
            } else {
                unset($cart[$productId]);
            }
        }

        session()->put('cart', $cart);

        return response()->json(['success' => 'Cart updated']);
    }

    public function remove(Request $request)
    {
        $productId = $request->input('product_id');
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
        }

        session()->put('cart', $cart);

        return response()->json(['success' => 'Product removed from cart']);
    }
}
