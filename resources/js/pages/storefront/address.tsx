import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    formatRupees,
    getBag,
    getCartSummary,
    getCheckoutAddress,
    saveCheckoutAddress,
    type CheckoutAddress,
} from '@/storefront/storage';

const fallbackAddress: CheckoutAddress = {
    fullName: 'Sumit Kumar',
    mobile: '2314567898',
    street: 'House No-C12, Old Extension Road, Gandhi Road, Karmik Nagar',
    city: 'Dhanbad',
    state: 'Jharkhand',
    pinCode: '123456',
};

export default function StorefrontAddress() {
    const [editing, setEditing] = useState(!getCheckoutAddress());
    const [address, setAddress] = useState<CheckoutAddress>(
        () => getCheckoutAddress() ?? fallbackAddress,
    );
    const bag = getBag();
    const summary = getCartSummary();

    const handleContinue = () => {
        saveCheckoutAddress(address);
        window.location.href = '/checkout/payment';
    };

    return (
        <>
            <Head>
                <title>Address | Myntra Clone</title>
                <link rel="stylesheet" href="/css/storefront-address.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </Head>

            <div id="navbar">
                <Link href="/cart">
                    <img
                        id="logo"
                        src="/images/myntra-removebg-preview.png"
                        alt="Myntra"
                    />
                </Link>

                <div id="div2">
                    <h5 id="first">
                        <Link href="/cart">BAG</Link>
                    </h5>
                    <div className="line"></div>
                    <h5>ADDRESS</h5>
                    <div className="line"></div>
                    <h5 id="third">
                        <Link href="/checkout/payment">PAYMENT</Link>
                    </h5>
                </div>
                <div id="div3">
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
                <div id="div">
                    <div>
                        <h3>Select Delivery Address</h3>
                        <div onClick={() => setEditing(true)}>
                            <h5>ADD NEW ADDRESS</h5>
                        </div>
                    </div>

                    <h5>DEFAULT ADDRESS</h5>

                    <div>
                        <div id="name">
                            <div>
                                <h4>{address.fullName}</h4>
                            </div>
                            <div id="home">Home</div>
                        </div>
                        <p>
                            {address.street}
                            <br />
                            {address.city}, {address.state}, PIN-
                            {address.pinCode}
                        </p>
                        <p>
                            Mobile No: <b>{address.mobile}</b>
                        </p>
                        <p>Pay on Delivery</p>
                        <div id="option">
                            <div onClick={() => setEditing(true)}>EDIT</div>
                            <div onClick={() => setEditing(true)}>CHANGE</div>
                        </div>
                    </div>

                    {editing ? (
                        <div
                            style={{
                                display: 'grid',
                                gap: '0.75rem',
                                marginTop: '1rem',
                                padding: '1rem',
                                border: '1px solid #e9e9ed',
                            }}
                        >
                            <input
                                placeholder="Full Name"
                                value={address.fullName}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        fullName: event.target.value,
                                    }))
                                }
                            />
                            <input
                                placeholder="Mobile Number"
                                value={address.mobile}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        mobile: event.target.value,
                                    }))
                                }
                            />
                            <input
                                placeholder="Street Address"
                                value={address.street}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        street: event.target.value,
                                    }))
                                }
                            />
                            <input
                                placeholder="City"
                                value={address.city}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        city: event.target.value,
                                    }))
                                }
                            />
                            <input
                                placeholder="State"
                                value={address.state}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        state: event.target.value,
                                    }))
                                }
                            />
                            <input
                                placeholder="PIN Code"
                                value={address.pinCode}
                                onChange={(event) =>
                                    setAddress((current) => ({
                                        ...current,
                                        pinCode: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    ) : null}
                </div>

                <div id="checkDiv">
                    <div id="itemDiv">
                        <h5>DELIVERY ESTIMATES</h5>
                        Delivery Between 7 Apr to 10 Apr
                        <br />
                        <br />
                        {bag.length} items | {formatRupees(summary.payable)}
                    </div>
                    <div id="place" onClick={handleContinue}>
                        CONTINUE
                    </div>
                </div>
            </div>
        </>
    );
}
