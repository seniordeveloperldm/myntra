<?php

use App\Models\Product;
use App\Models\User;
use Database\Seeders\StorefrontCatalogSeeder;

test('catalog category page renders with seeded products', function () {
    $this->seed(StorefrontCatalogSeeder::class);

    $response = $this->get(route('products.category', ['category' => 'men']));

    $response->assertOk();
});

test('authenticated users can add items to bag and apply promo code', function () {
    $this->seed(StorefrontCatalogSeeder::class);

    $user = User::factory()->create();
    $product = Product::query()->firstOrFail();

    $response = $this->actingAs($user)->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $promoResponse = $this->actingAs($user)->post(route('cart.promo'), [
        'code' => 'MYNTRA300',
    ]);

    $promoResponse->assertRedirect();
    $promoResponse->assertSessionHas('promo_code', 'MYNTRA300');
});

test('authenticated users can save address and place an order', function () {
    $this->seed(StorefrontCatalogSeeder::class);

    $user = User::factory()->create();
    $product = Product::query()->firstOrFail();

    $this->actingAs($user)->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertRedirect();

    $this->actingAs($user)->post(route('checkout.address.store'), [
        'fullName' => 'Sumit Kumar',
        'mobile' => '9876543210',
        'street' => 'House No-C12, Gandhi Road',
        'street2' => 'Near Market',
        'city' => 'Dhanbad',
        'state' => 'Jharkhand',
        'pinCode' => '826001',
        'country' => 'India',
    ])->assertRedirect(route('checkout.payment'));

    $response = $this->actingAs($user)->post(route('order.place'), [
        'payment_method' => 'cod',
        'otp' => '1234',
    ]);

    $response->assertRedirect(route('checkout.success'));
    $this->assertDatabaseCount('orders', 1);
    $this->assertDatabaseCount('order_items', 1);
    $this->assertDatabaseMissing('cart_items', [
        'product_id' => $product->id,
    ]);
});
