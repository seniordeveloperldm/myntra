<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends \App\Http\Controllers\Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $users = User::query()
            ->withCount(['orders', 'wishlistItems'])
            ->with('cart')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'email_verified_at' => optional($user->email_verified_at)?->toDateTimeString(),
                'orders_count' => $user->orders_count,
                'wishlist_items_count' => $user->wishlist_items_count,
                'cart_exists' => $user->cart !== null,
                'created_at' => optional($user->created_at)?->toDayDateTimeString(),
            ])
            ->all();

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
            'roles' => [
                User::ROLE_ADMIN,
                User::ROLE_MANAGER,
                User::ROLE_CUSTOMER,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class)],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', Rule::in([User::ROLE_ADMIN, User::ROLE_MANAGER, User::ROLE_CUSTOMER])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?: null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', Rule::in([User::ROLE_ADMIN, User::ROLE_MANAGER, User::ROLE_CUSTOMER])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if ($user->isAdmin()
            && $validated['role'] === User::ROLE_CUSTOMER
            && User::query()->whereIn('role', [User::ROLE_ADMIN, User::ROLE_MANAGER])->count() <= 1) {
            return back()->with('error', 'At least one admin or manager account must remain active.');
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?: null,
            'role' => $validated['role'],
            ...($validated['password'] ? ['password' => Hash::make($validated['password'])] : []),
        ]);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own admin account from this screen.');
        }

        if ($user->isAdmin()
            && User::query()->whereIn('role', [User::ROLE_ADMIN, User::ROLE_MANAGER])->count() <= 1) {
            return back()->with('error', 'At least one admin or manager account must remain.');
        }

        if ($user->orders()->exists()) {
            return back()->with('error', 'This user has orders and cannot be deleted.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
