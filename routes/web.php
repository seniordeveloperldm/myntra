<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::redirect('/dashboard', '/')->middleware('auth')->name('dashboard');

Route::get('/products/category/{category}', [ProductController::class, 'category'])->name('products.category');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::get('/checkout/address', [CheckoutController::class, 'address'])->name('checkout.address');
Route::get('/checkout/payment', [CheckoutController::class, 'payment'])->name('checkout.payment');
Route::get('/checkout/otp', [CheckoutController::class, 'otp'])->name('checkout.otp');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

Route::middleware(['auth'])->group(function () {
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

    Route::post('/wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
    Route::post('/wishlist/remove', [WishlistController::class, 'remove'])->name('wishlist.remove');

    Route::post('/order/place', [OrderController::class, 'place'])->name('order.place');

    Route::get('/profile', [HomeController::class, 'profile'])->name('account.profile');
});

require __DIR__.'/settings.php';
