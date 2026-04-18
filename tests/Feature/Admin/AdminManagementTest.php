<?php

use App\Models\Address;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins can access all admin management pages', function () {
    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
    ]);

    $this->actingAs($admin)->get(route('admin.products.index'))->assertOk();
    $this->actingAs($admin)->get(route('admin.catalog.index'))->assertOk();
    $this->actingAs($admin)->get(route('admin.users.index'))->assertOk();
    $this->actingAs($admin)->get(route('admin.orders.index'))->assertOk();
});

test('admins can create products from the admin panel', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
    ]);

    $category = Category::create([
        'name' => 'Men',
        'slug' => 'men',
        'department' => 'Fashion',
        'is_active' => true,
    ]);

    $brand = Brand::create([
        'name' => 'Roadster',
        'slug' => 'roadster',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'name' => 'Cargo Joggers',
        'slug' => 'cargo-joggers',
        'sku' => 'MYNTRA-CARGO-001',
        'short_description' => 'Relaxed cargo fit',
        'description' => 'Streetwear cargo joggers for men.',
        'primary_image_file' => UploadedFile::fake()->image('joggers.jpg'),
        'gallery_files' => [
            UploadedFile::fake()->image('joggers-2.jpg'),
            UploadedFile::fake()->image('joggers-3.jpg'),
        ],
        'price' => 1899,
        'compare_at_price' => 2499,
        'stock' => 18,
        'discount_percentage' => 24,
        'rating' => 4.4,
        'review_count' => 128,
        'is_active' => 1,
        'is_featured' => 1,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('products', [
        'name' => 'Cargo Joggers',
        'slug' => 'cargo-joggers',
        'sku' => 'MYNTRA-CARGO-001',
        'is_featured' => true,
    ]);

    $product = Product::query()->where('slug', 'cargo-joggers')->firstOrFail();

    expect($product->primary_image)->toStartWith('/storage/products/');
    expect($product->gallery)->toHaveCount(3);
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $product->primary_image));
});

test('admins can create catalog records and users from the admin panel', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
    ]);

    $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Women',
        'slug' => 'women',
        'department' => 'Fashion',
        'description' => 'Women fashion catalog',
        'image_file' => UploadedFile::fake()->image('women-category.jpg'),
        'is_active' => 1,
    ])->assertRedirect();

    $quickResponse = $this->actingAs($admin)->post(route('admin.categories.quick-store'), [
        'quick_category_name' => 'Beauty',
        'quick_category_slug' => 'beauty',
        'quick_category_department' => 'Lifestyle',
        'quick_category_description' => 'Beauty essentials',
    ]);

    $quickResponse
        ->assertRedirect()
        ->assertSessionHas('created_category_id');

    $this->actingAs($admin)->post(route('admin.brands.store'), [
        'name' => 'Tokyo Talkies',
        'slug' => 'tokyo-talkies',
        'logo_url' => 'https://example.com/tokyo-talkies.jpg',
        'is_active' => 1,
    ])->assertRedirect();

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Operations Manager',
        'email' => 'ops@example.com',
        'phone' => '9876543210',
        'role' => User::ROLE_MANAGER,
        'password' => 'password123',
    ])->assertRedirect();

    $this->assertDatabaseHas('categories', [
        'slug' => 'women',
    ]);

    $this->assertDatabaseHas('categories', [
        'slug' => 'beauty',
    ]);

    $this->assertDatabaseHas('brands', [
        'slug' => 'tokyo-talkies',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'ops@example.com',
        'role' => User::ROLE_MANAGER,
    ]);

    $category = Category::query()->where('slug', 'women')->firstOrFail();
    expect($category->image_path)->toStartWith('/storage/categories/');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $category->image_path));
});

test('admins can cancel orders and restock inventory', function () {
    $admin = User::factory()->create([
        'role' => User::ROLE_ADMIN,
    ]);

    $customer = User::factory()->create();

    $category = Category::create([
        'name' => 'Men',
        'slug' => 'men',
        'department' => 'Fashion',
        'is_active' => true,
    ]);

    $brand = Brand::create([
        'name' => 'Roadster',
        'slug' => 'roadster',
        'is_active' => true,
    ]);

    $product = Product::create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'name' => 'Overshirt',
        'slug' => 'overshirt',
        'sku' => 'MYNTRA-OVER-001',
        'primary_image' => 'https://example.com/overshirt.jpg',
        'gallery' => ['https://example.com/overshirt.jpg'],
        'price' => 2199,
        'compare_at_price' => 2999,
        'stock' => 1,
        'discount_percentage' => 27,
        'rating' => 4.3,
        'review_count' => 40,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $address = Address::create([
        'user_id' => $customer->id,
        'label' => 'Home',
        'full_name' => 'Test Customer',
        'phone' => '9876543210',
        'line_1' => 'C-12 Gandhi Road',
        'city' => 'Dhanbad',
        'state' => 'Jharkhand',
        'postal_code' => '826001',
        'country' => 'India',
        'is_default' => true,
    ]);

    $order = Order::create([
        'user_id' => $customer->id,
        'address_id' => $address->id,
        'order_number' => 'MYNTRA-TEST-001',
        'status' => 'confirmed',
        'payment_method' => 'cod',
        'payment_status' => 'pending',
        'customer_name' => 'Test Customer',
        'customer_email' => $customer->email,
        'customer_phone' => '9876543210',
        'shipping_address' => [
            'fullName' => 'Test Customer',
            'mobile' => '9876543210',
            'street' => 'C-12 Gandhi Road',
            'street2' => null,
            'city' => 'Dhanbad',
            'state' => 'Jharkhand',
            'pinCode' => '826001',
            'country' => 'India',
        ],
        'subtotal' => 4398,
        'discount_amount' => 400,
        'shipping_amount' => 0,
        'total_amount' => 3998,
        'placed_at' => now(),
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'brand_name' => $brand->name,
        'product_image' => $product->primary_image,
        'sku' => $product->sku,
        'quantity' => 2,
        'unit_price' => 2199,
        'compare_at_price' => 2999,
        'line_total' => 4398,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.update', $order), [
        'status' => 'cancelled',
        'payment_status' => 'refunded',
    ]);

    $response->assertRedirect();

    expect($product->fresh()->stock)->toBe(3);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
        'payment_status' => 'refunded',
    ]);
});
