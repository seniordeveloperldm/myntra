<?php

use App\Http\Controllers\Admin\CatalogController as AdminCatalogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/dashboard', function () {
    return auth()->user()?->isAdmin()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('home');
})->middleware('auth')->name('dashboard');

Route::get('/products/category/{category}', [ProductController::class, 'category'])->name('products.category');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::patch('/admin/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    Route::get('/admin/catalog', [AdminCatalogController::class, 'index'])->name('admin.catalog.index');
    Route::post('/admin/categories', [AdminCatalogController::class, 'storeCategory'])->name('admin.categories.store');
    Route::post('/admin/categories/quick', [AdminCatalogController::class, 'quickStoreCategory'])->name('admin.categories.quick-store');
    Route::patch('/admin/categories/{category}', [AdminCatalogController::class, 'updateCategory'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [AdminCatalogController::class, 'destroyCategory'])->name('admin.categories.destroy');
    Route::post('/admin/brands', [AdminCatalogController::class, 'storeBrand'])->name('admin.brands.store');
    Route::patch('/admin/brands/{brand}', [AdminCatalogController::class, 'updateBrand'])->name('admin.brands.update');
    Route::delete('/admin/brands/{brand}', [AdminCatalogController::class, 'destroyBrand'])->name('admin.brands.destroy');

    Route::get('/admin/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::patch('/admin/users/{user}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/admin/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::patch('/admin/orders/{order}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::get('/checkout/address', [CheckoutController::class, 'address'])->name('checkout.address');
    Route::post('/checkout/address', [CheckoutController::class, 'storeAddress'])->name('checkout.address.store');
    Route::get('/checkout/payment', [CheckoutController::class, 'payment'])->name('checkout.payment');
    Route::get('/checkout/otp', [CheckoutController::class, 'otp'])->name('checkout.otp');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/promo', [CartController::class, 'applyPromo'])->name('cart.promo');

    Route::post('/wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
    Route::post('/wishlist/remove', [WishlistController::class, 'remove'])->name('wishlist.remove');
    Route::post('/wishlist/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');

    Route::post('/order/place', [OrderController::class, 'place'])->name('order.place');

    Route::get('/profile', [HomeController::class, 'profile'])->name('account.profile');
});

require __DIR__.'/settings.php';
