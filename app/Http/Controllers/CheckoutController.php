<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('checkout.address');
    }

    public function address(): Response
    {
        return Inertia::render('storefront/address');
    }

    public function payment(): Response
    {
        return Inertia::render('storefront/payment');
    }

    public function otp(): Response
    {
        return Inertia::render('storefront/otp');
    }

    public function success(): Response
    {
        return Inertia::render('storefront/success');
    }
}
