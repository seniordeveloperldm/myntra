import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupees } from '@/storefront/money';
import type { StorefrontAddress, StorefrontSummary } from '@/storefront/types';

const emptyAddress: StorefrontAddress = {
    fullName: '',
    mobile: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
};

export default function StorefrontAddress({
    address,
    summary,
}: {
    address: StorefrontAddress | null;
    summary: StorefrontSummary;
}) {
    const flash = (usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    }).flash;
    const [editing, setEditing] = useState(!address);
    const [form, setForm] = useState<StorefrontAddress>(address ?? emptyAddress);

    const updateField = (field: keyof StorefrontAddress, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleContinue = () => {
        router.post('/checkout/address', form);
    };

    return (
        <>
            <Head>
                <title>Address | Myntra</title>
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

            {(flash?.success || flash?.error) && (
                <div className="mx-auto mb-4 max-w-6xl px-4">
                    <div className="rounded-2xl border border-[#ffd5e1] bg-[#fff6f8] px-4 py-3 text-sm font-medium text-[#d6336c]">
                        {flash?.success ?? flash?.error}
                    </div>
                </div>
            )}

            <div id="cart">
                <div id="div">
                    <div>
                        <h3>Select Delivery Address</h3>
                        <div onClick={() => setEditing(true)}>
                            <h5>{address ? 'ADD NEW ADDRESS' : 'SAVE ADDRESS'}</h5>
                        </div>
                    </div>

                    {address ? <h5>DEFAULT ADDRESS</h5> : null}

                    {address ? (
                        <div>
                            <div id="name">
                                <div>
                                    <h4>{address.fullName}</h4>
                                </div>
                                <div id="home">{address.label ?? 'Home'}</div>
                            </div>
                            <p>
                                {address.street}
                                {address.street2 ? (
                                    <>
                                        <br />
                                        {address.street2}
                                    </>
                                ) : null}
                                <br />
                                {address.city}, {address.state}, PIN-
                                {address.pinCode}
                            </p>
                            <p>
                                Mobile No: <b>{address.mobile}</b>
                            </p>
                            <p>Pay on Delivery available</p>
                            <div id="option">
                                <div onClick={() => setEditing(true)}>EDIT</div>
                                <div onClick={() => setEditing(true)}>CHANGE</div>
                            </div>
                        </div>
                    ) : null}

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
                                value={form.fullName}
                                onChange={(event) =>
                                    updateField('fullName', event.target.value)
                                }
                            />
                            <input
                                placeholder="Mobile Number"
                                value={form.mobile}
                                onChange={(event) =>
                                    updateField('mobile', event.target.value)
                                }
                            />
                            <input
                                placeholder="Street Address"
                                value={form.street}
                                onChange={(event) =>
                                    updateField('street', event.target.value)
                                }
                            />
                            <input
                                placeholder="Apartment, suite, landmark"
                                value={form.street2 ?? ''}
                                onChange={(event) =>
                                    updateField('street2', event.target.value)
                                }
                            />
                            <input
                                placeholder="City"
                                value={form.city}
                                onChange={(event) =>
                                    updateField('city', event.target.value)
                                }
                            />
                            <input
                                placeholder="State"
                                value={form.state}
                                onChange={(event) =>
                                    updateField('state', event.target.value)
                                }
                            />
                            <input
                                placeholder="PIN Code"
                                value={form.pinCode}
                                onChange={(event) =>
                                    updateField('pinCode', event.target.value)
                                }
                            />
                        </div>
                    ) : null}
                </div>

                <div id="checkDiv">
                    <div id="itemDiv">
                        <h5>DELIVERY ESTIMATES</h5>
                        Delivery Between 2 to 4 business days
                        <br />
                        <br />
                        {summary.itemCount} items | {formatRupees(summary.payable)}
                    </div>
                    <div id="place" onClick={handleContinue}>
                        CONTINUE
                    </div>
                </div>
            </div>
        </>
    );
}
