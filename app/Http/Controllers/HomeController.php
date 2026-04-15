<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/home');
    }

    public function profile(): RedirectResponse
    {
        return auth()->check()
            ? redirect()->route('profile.edit')
            : redirect()->route('login');
    }
}
