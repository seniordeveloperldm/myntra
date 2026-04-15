import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { StorefrontProduct } from '@/storefront/catalog';
import {
    applyPromoCode,
    formatRupees,
    getBag,
    getCartSummary,
    removeBagItem,
    storefrontStorageEvent,
} from '@/storefront/storage';

export default function StorefrontCart() {
    const [bag, setBag] = useState<StorefrontProduct[]>(() => getBag());
    const [promo, setPromo] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const refresh = () => {
            setBag(getBag());
        };

        window.addEventListener(storefrontStorageEvent, refresh);
        window.addEventListener('storage', refresh);

        return () => {
            window.removeEventListener(storefrontStorageEvent, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    const summary = getCartSummary();

    const handlePromo = () => {
        const response = applyPromoCode(promo);
        setMessage(response.message);
        setPromo('');
        setBag(getBag());
    };

    return (
        <>
            <Head>
                <title>Bag | Myntra Clone</title>
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
                    Sale Starts in <span>3</span> Days
                </p>
            </div>

            <div className="con_ord">
                <div className="container">
                    {bag.length === 0 ? (
                        <div className="main">
                            <div style={{ width: '100%' }}>
                                <p>Your bag is empty right now.</p>
                                <p>Add products from the wishlist or category pages.</p>
                            </div>
                        </div>
                    ) : (
                        bag.map((product, index) => (
                            <div key={`${product.id}-${index}`} className="main">
                                <div>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: '20px',
                                            marginBottom: '-8px',
                                        }}
                                    >
                                        {product.brand}
                                    </p>
                                    <p style={{ color: 'gray' }}>
                                        {product.name}
                                    </p>
                                    <p>
                                        <span>{product.priceLabel}</span>
                                        <span
                                            style={{
                                                color: 'gray',
                                                textDecoration: 'line-through',
                                            }}
                                        >
                                            {product.originalPriceLabel}
                                        </span>
                                    </p>
                                    <span style={{ color: 'red' }}>
                                        {product.offer}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeBagItem(index)}
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
                        <div className="apply" onClick={handlePromo}>
                            Apply
                        </div>
                    </div>
                    {message ? (
                        <p style={{ color: '#ff3f6c' }}>{message}</p>
                    ) : null}
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
