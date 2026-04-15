<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/wishlist');
    }

    public function add(Request $request)
    {
        $productId = $request->input('product_id');

        // Sample product data
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

        $wishlist = session()->get('wishlist', []);

        if (!isset($wishlist[$productId])) {
            $wishlist[$productId] = $product;
        }

        session()->put('wishlist', $wishlist);

        return response()->json(['success' => 'Product added to wishlist']);
    }

    public function remove(Request $request)
    {
        $productId = $request->input('product_id');
        $wishlist = session()->get('wishlist', []);

        if (isset($wishlist[$productId])) {
            unset($wishlist[$productId]);
        }

        session()->put('wishlist', $wishlist);

        return response()->json(['success' => 'Product removed from wishlist']);
    }
}
