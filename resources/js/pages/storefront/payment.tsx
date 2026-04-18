import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupees } from '@/storefront/money';
import type {
    PaymentMethodOption,
    StorefrontAddress,
    StorefrontSummary,
} from '@/storefront/types';

export default function StorefrontPayment({
    address,
    summary,
    paymentMethods,
}: {
    address: StorefrontAddress;
    summary: StorefrontSummary;
    paymentMethods: PaymentMethodOption[];
}) {
    const flash = (usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    }).flash;
    const [selectedMode, setSelectedMode] = useState(paymentMethods[0]?.key ?? 'cod');

    return (
        <>
            <Head>
                <title>Payment | Myntra</title>
                <link rel="stylesheet" href="/css/storefront-payment.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </Head>

            <div id="navbar">
                <Link href="/">
                    <img
                        id="logo"
                        src="/images/myntra-removebg-preview.png"
                        alt="Myntra"
                    />
                </Link>

                <div id="nav2">
                    <h5 id="first">
                        <Link href="/cart">BAG</Link>
                    </h5>
                    <div className="line"></div>
                    <h5 id="second">
                        <Link href="/checkout/address">ADDRESS</Link>
                    </h5>
                    <div className="line"></div>
                    <h5>PAYMENT</h5>
                </div>
                <div id="nav3">
                    <img
                        src="https://constant.myntassets.com/checkout/assets/img/sprite-secure.png"
                        alt="Secure checkout"
                    />
                    <p>
                        100 % <b>SECURE</b>
                    </p>
                </div>
            </div>

            {(flash?.success || flash?.error) && (
                <div className="mx-auto mb-4 max-w-6xl px-4">
                    <div className="rounded-2xl border border-[#ffd5e1] bg-[#fff6f8] px-4 py-3 text-sm font-medium text-[#d6336c]">
                        {flash?.success ?? flash?.error}
                    </div>
                </div>
            )}

            <div id="cart">
                <div id="main1">
                    <div>
                        <h4>Delivery Address</h4>
                        <p>
                            {address.fullName}, {address.street}, {address.city},{' '}
                            {address.state} - {address.pinCode}
                        </p>
                    </div>
                    <h4>Choose Payment Mode</h4>
                    <div id="payment">
                        <div id="mode">
                            {paymentMethods.map((mode, index) => (
                                <div
                                    key={mode.key}
                                    id={index === 1 ? 'card' : undefined}
                                    onClick={() => setSelectedMode(mode.key)}
                                    style={{
                                        border:
                                            selectedMode === mode.key
                                                ? '2px solid #ff3f6c'
                                                : undefined,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <i className="fa-solid fa-wallet"></i>
                                    <h5>{mode.label}</h5>
                                </div>
                            ))}
                        </div>
                        <div id="paymentDiv">
                            <h4>
                                {
                                    paymentMethods.find(
                                        (mode) => mode.key === selectedMode,
                                    )?.label
                                }
                            </h4>
                            <p>
                                {summary.itemCount} items ready for secure payment.
                            </p>
                            <div
                                id="pay"
                                onClick={() =>
                                    router.get('/checkout/otp', {
                                        payment_method: selectedMode,
                                    })
                                }
                            >
                                PAY
                            </div>
                        </div>
                    </div>
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
                </div>
            </div>
        </>
    );
}
