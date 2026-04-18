<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'customers' => User::query()->where('role', User::ROLE_CUSTOMER)->count(),
                'admins' => User::query()->whereIn('role', [User::ROLE_ADMIN, User::ROLE_MANAGER])->count(),
                'products' => Product::query()->count(),
                'orders' => Order::query()->count(),
                'wishlistItems' => WishlistItem::query()->count(),
                'revenue' => (int) Order::query()->sum('total_amount'),
            ],
            'recentOrders' => Order::query()
                ->latest()
                ->take(5)
                ->get([
                    'order_number',
                    'customer_name',
                    'status',
                    'payment_status',
                    'total_amount',
                    'created_at',
                ]),
        ]);
    }
}
