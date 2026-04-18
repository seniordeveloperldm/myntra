import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupees } from '@/storefront/money';
import type { StorefrontCartItem, StorefrontSummary } from '@/storefront/types';

export default function StorefrontCart({
    cartItems,
    summary,
    appliedPromo,
}: {
    cartItems: StorefrontCartItem[];
    summary: StorefrontSummary;
    appliedPromo?: string | null;
}) {
    const flash = (usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    }).flash;
    const [promo, setPromo] = useState(appliedPromo ?? '');

    const updateQuantity = (item: StorefrontCartItem, quantity: number) => {
        router.post(
            '/cart/update',
            {
                cart_item_id: item.id,
                quantity,
            },
            { preserveScroll: true },
        );
    };

    const applyPromo = () => {
        router.post(
            '/cart/promo',
            { code: promo },
            {
                preserveScroll: true,
                onSuccess: () => setPromo(''),
            },
        );
    };

    return (
        <>
            <Head>
                <title>Bag | Myntra</title>
                <link
                    rel="shortcut icon"
                    type="image/png"
                    href="/images/favicon.png"
                />
                <link rel="stylesheet" href="/css/storefront-cart.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </Head>

            <div id="upperbar">
                <div>
                    <Link href="/">
                        <img
                            src="/images/myntra-removebg-preview.png"
                            alt="Myntra"
                            id="landingPage"
                        />
                    </Link>
                </div>
                <div>
                    <p>
                        <span id="first">BAG </span>---------{' '}
                        <span id="second">ADDRESS</span> ---------{' '}
                        <span>PAYMENT</span>
                    </p>
                </div>
                <div>
                    <img
                        src="https://constant.myntassets.com/checkout/assets/img/sprite-secure.png"
                        alt="Secure checkout"
                    />
                    <span>100% SECURE</span>
                </div>
            </div>

            <div id="timerbox">
                <p>
                    Bag Value <span>{formatRupees(summary.payable)}</span>
                </p>
            </div>

            {(flash?.success || flash?.error) && (
                <div className="mx-auto mb-4 max-w-6xl px-4">
                    <div className="rounded-2xl border border-[#ffd5e1] bg-[#fff6f8] px-4 py-3 text-sm font-medium text-[#d6336c]">
                        {flash?.success ?? flash?.error}
                    </div>
                </div>
            )}

            <div className="con_ord">
                <div className="container">
                    {cartItems.length === 0 ? (
                        <div className="main">
                            <div style={{ width: '100%' }}>
                                <p>Your bag is empty right now.</p>
                                <p>Browse more products and build your Myntra cart.</p>
                                <Link href="/products/category/men">
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="main">
                                <div>
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                    />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: '20px',
                                            marginBottom: '-8px',
                                        }}
                                    >
                                        {item.product.brand}
                                    </p>
                                    <p style={{ color: 'gray' }}>
                                        {item.product.name}
                                    </p>
                                    <p>
                                        <span>{item.product.priceLabel}</span>
                                        <span
                                            style={{
                                                color: 'gray',
                                                textDecoration: 'line-through',
                                            }}
                                        >
                                            {item.product.originalPriceLabel}
                                        </span>
                                    </p>
                                    <span style={{ color: 'red' }}>
                                        {item.product.offer}
                                    </span>

                                    <div className="mt-4 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    Math.max(item.quantity - 1, 0),
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <span>Qty {item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity + 1,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p style={{ marginTop: '12px' }}>
                                        Item Total: <strong>{item.subtotalLabel}</strong>
                                    </p>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(
                                                '/cart/remove',
                                                { cart_item_id: item.id },
                                                { preserveScroll: true },
                                            )
                                        }
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="orderbox">
                    <div className="pricedets">
                        PRICE DETAILS ({summary.itemCount} Items)
                    </div>
                    <div className="total">
                        <span>Total MRP</span>
                        <span className="totalprice">
                            {formatRupees(summary.mrp)}
                        </span>
                    </div>
                    <div className="discount">
                        <span>Discount on MRP</span>
                        <span className="filldiscount">
                            - {formatRupees(summary.productDiscount)}
                        </span>
                    </div>
                    {summary.promoDiscount > 0 ? (
                        <div className="discount">
                            <span>Promo Discount</span>
                            <span>- {formatRupees(summary.promoDiscount)}</span>
                        </div>
                    ) : null}
                    <div className="amount">
                        <span>Total Amount</span>
                        <span className="amount_pay">
                            {formatRupees(summary.payable)}
                        </span>
                    </div>
                    <p>Enter Promo Code</p>
                    <div className="promocode">
                        <input
                            type="text"
                            id="promo"
                            placeholder="MYNTRA300"
                            value={promo}
                            onChange={(event) => setPromo(event.target.value)}
                        />
                        <div className="apply" onClick={applyPromo}>
                            Apply
                        </div>
                    </div>
                    <Link href="/checkout/address">
                        <div className="makeorder">PLACE ORDER</div>
                    </Link>
                </div>
            </div>

            <div className="wishlistlink">
                <i className="fa-solid fa-cart-flatbed"></i>
                <p>
                    <Link href="/wishlist">Add More From Wishlist</Link>
                </p>
            </div>
        </>
    );
}
