import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupees, getBag, getCartSummary } from '@/storefront/storage';

const paymentModes = [
    'Cash On Delivery (Cash/Card/UPI)',
    'Credit/Debit Card',
    'PhonePe/Google Pay/BHIM UPI',
    'Paytm/Payzapp/Wallets',
    'Net Banking',
    'EMI/Pay Later',
];

export default function StorefrontPayment() {
    const [selectedMode, setSelectedMode] = useState(paymentModes[0]);
    const bag = getBag();
    const summary = getCartSummary();

    return (
        <>
            <Head>
                <title>Payment | Myntra Clone</title>
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

            <div id="cart">
                <div id="main1">
                    <div>
                        <h4>Bank Offer</h4>
                        <p>
                            10% Instant Discount with Standard Chartered Credit
                            &amp; Debit cards on a min spend of Rs 3,000.
                        </p>
                        <p>
                            Show More{' '}
                            <i className="fa-solid fa-angle-down"></i>
                        </p>
                    </div>
                    <h4>Choose Payment Mode</h4>
                    <div id="payment">
                        <div id="mode">
                            {paymentModes.map((mode, index) => (
                                <div
                                    key={mode}
                                    id={index === 1 ? 'card' : undefined}
                                    onClick={() => setSelectedMode(mode)}
                                    style={{
                                        border:
                                            selectedMode === mode
                                                ? '2px solid #ff3f6c'
                                                : undefined,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <i className="fa-solid fa-wallet"></i>
                                    <h5>{mode}</h5>
                                </div>
                            ))}
                        </div>
                        <div id="paymentDiv">
                            <h4>{selectedMode}</h4>
                            <p>{bag.length} items ready for secure payment.</p>
                            <Link href="/checkout/otp">
                                <div id="pay">PAY</div>
                            </Link>
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
