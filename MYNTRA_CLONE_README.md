# Myntra Clone - Laravel Blade Template Version

A fully functional e-commerce Myntra clone built with **Laravel** and **Blade Templates**. This project converts the static HTML site to a dynamic Laravel application with routing, controllers, and session-based cart/wishlist management.

## 📋 Features Implemented

### ✅ Complete
- **Landing Page** - With slider, deals, bestsellers, and featured categories
- **Category Pages** - Men, Women, Kids, Home & Living, Beauty with products
- **Product Detail Page** - Full product information, images, ratings, reviews
- **Shopping Cart** - Add/remove items, update quantities, session-based
- **Wishlist** - Add/remove items from wishlist, session-based
- **Checkout** - Complete checkout form with delivery & payment options
- **User Authentication** - Login/Register (via Fortify)
- **User Profile** - View and edit profile information
- **Responsive Design** - Mobile-friendly UI

### 🔧 Technical Stack
- **Backend**: Laravel 11
- **Frontend**: Blade Templates
- **Styling**: Custom CSS
- **JavaScript**: Vanilla JS for interactivity
- **Storage**: Session-based (Cart & Wishlist)
- **Authentication**: Laravel Fortify

## 📁 Project Structure

```
resources/
├── views/
│   ├── layouts/
│   │   └── app.blade.php      # Main layout template
│   ├── home.blade.php          # Landing page
│   ├── products/
│   │   ├── category.blade.php  # Category listing page
│   │   └── show.blade.php      # Product detail page
│   ├── cart/
│   │   └── index.blade.php     # Shopping cart page
│   ├── wishlist/
│   │   └── index.blade.php     # Wishlist page
│   ├── checkout/
│   │   └── index.blade.php     # Checkout page
│   └── profile/
│       └── edit.blade.php      # User profile page

app/Http/Controllers/
├── HomeController.php          # Home & Profile routes
├── ProductController.php        # Product listing & detail
├── CartController.php           # Cart operations
├── WishlistController.php       # Wishlist operations
├── CheckoutController.php       # Checkout page
└── OrderController.php          # Order placement

public/
├── css/
│   ├── style.css               # Main styles
│   ├── navbar.css              # Navigation styles
│   └── header.css              # Header styles
└── js/
    └── main.js                 # Main JavaScript

routes/
└── web.php                     # Web routes
```

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.1+
- Laravel 11
- Composer
- XAMPP/Local Server

### Step 1: Navigate to Project
```bash
cd C:\xampp\htdocs\myntra
```

### Step 2: Install Dependencies
```bash
composer install
npm install
```

### Step 3: Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### Step 4: Database Configuration (Optional)
```bash
php artisan migrate
php artisan db:seed
```

### Step 5: Run Application
```bash
php artisan serve
```

Or access via XAMPP:
- **URL**: `http://localhost/myntra` or `http://localhost:8000`

## 📍 Routes Overview

### Public Routes
```
GET  /                           # Home page
GET  /products/category/{category}   # Category page (men, women, kids, etc)
GET  /products/{id}              # Product detail page
```

### Protected Routes (Requires Authentication)
```
GET  /cart                       # Shopping cart
POST /cart/add                   # Add to cart
POST /cart/update                # Update cart item
POST /cart/remove                # Remove from cart

GET  /wishlist                   # Wishlist page
POST /wishlist/add               # Add to wishlist
POST /wishlist/remove            # Remove from wishlist

GET  /checkout                   # Checkout page
POST /order/place                # Place order

GET  /profile                    # User profile
```

## 🛒 Product Data

Currently, products are stored as **sample arrays in controllers**. To add real product data:

### Option 1: Add to Database (Recommended)
```bash
php artisan make:model Product -m
```

Then update `ProductController.php` to fetch from database:
```php
$products = Product::where('category', $category)->get();
```

### Option 2: Modify Sample Data
Edit `ProductController.php` to add/modify products in the `$products` array.

## 🛍️ How to Use

### 1. **Browse Products**
   - Click on categories (Men, Women, Kids, etc.)
   - View all products with filtering options

### 2. **View Product Details**
   - Click on any product card
   - View images, price, ratings, reviews
   - Select size and add to cart

### 3. **Shopping Cart**
   - Add items from product page
   - Adjust quantities in cart
   - Remove items
   - View order summary

### 4. **Wishlist**
   - Click the heart icon to add items
   - Manage wishlist from dedicated page
   - Move items to cart from wishlist

### 5. **Checkout**
   - Fill delivery address
   - Select payment method
   - Place order
   - Order confirmation

### 6. **User Profile**
   - View and edit personal information
   - Manage addresses
   - Track orders
   - View wishlist and reviews

## 💾 Cart & Wishlist Storage

Currently uses **Laravel Sessions** (stored in files or database). 

To upgrade to persistent storage:

### Option 1: Database Storage
```bash
php artisan make:model Cart -m
php artisan make:model Wishlist -m
```

Then update controllers to use database instead of sessions.

### Option 2: Redis Cache
Update `.env`:
```
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

## 🎨 Customization

### Change Colors
Edit `public/css/style.css`:
```css
/* Primary color */
background: #f37d4f;  /* Change to your color */
color: #f37d4f;
```

### Add More Products
Edit `app/Http/Controllers/ProductController.php`:
```php
private $products = [
    ['id' => 15, 'name' => 'New Product', ...],
    // Add more products
];
```

### Modify Navigation
Edit `resources/views/layouts/app.blade.php`:
```blade
<li><a href="{{ route('products.category', 'new-category') }}">New Category</a></li>
```

## 💳 Payment Integration

The checkout page supports multiple payment methods. To integrate actual payment:

### For Razorpay (India)
```bash
composer require razorpay/razorpay
```

Then update `OrderController.php`:
```php
$razorpay = new \Razorpay\Api\Api($key, $secret);
$order = $razorpay->order->create([...]);
```

### For Stripe
```bash
composer require stripe/stripe-php
```

## 🔐 Security Features

- **CSRF Protection** - All forms protected with `@csrf`
- **Authentication** - User must be logged in for cart/wishlist/checkout
- **User Authorization** - Cart/wishlist tied to authenticated user (via session)
- **Input Validation** - Form validation in controllers

## 📱 Responsive Design

The entire application is mobile-responsive:
- `320px` - Mobile phones
- `768px` - Tablets
- `1024px+` - Desktop

## 🐛 Troubleshooting

### Problem: Routes not working
**Solution**: Clear route cache
```bash
php artisan route:clear
php artisan config:clear
```

### Problem: Static files not loading
**Solution**: Generate symlink for public directory
```bash
php artisan storage:link
```

### Problem: Session not persisting
**Solution**: Check `.env` SESSION_DRIVER is set correctly
```
SESSION_DRIVER=file
```

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Blade Template Documentation](https://laravel.com/docs/blade)
- [Fortify Documentation](https://laravel.com/docs/fortify)

## 🚀 Next Steps

To enhance this project further:

1. **Database Integration**
   - Create Product, Order, User, Cart models
   - Set up proper relationships
   - Migrate sample data to database

2. **Payment Gateway**
   - Integrate Razorpay or Stripe
   - Handle payment webhooks
   - Order confirmation emails

3. **Search & Filter**
   - Implement full-text search
   - Advanced filtering options
   - Sorting capabilities

4. **Admin Panel**
   - Product management
   - Order management
   - User management
   - Analytics dashboard

5. **Performance**
   - Add caching (Redis)
   - Optimize database queries
   - Image optimization
   - CDN integration

## 📝 License

This project is for educational purposes only. Myntra is a trademark of Flipkart.

---

**Happy Coding! 🎉**
