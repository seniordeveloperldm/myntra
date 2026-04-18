import { Head, Link } from '@inertiajs/react';
import type { StorefrontOrder } from '@/storefront/types';

export default function StorefrontSuccess({
    order,
}: {
    order: StorefrontOrder;
}) {
    return (
        <>
            <Head>
                <title>Order Confirmed | Myntra</title>
                <link rel="stylesheet" href="/css/storefront-success.css" />
            </Head>

            <div id="thanks">
                <img src="https://bit.ly/3J2FZ5A" alt="Order confirmed" />
            </div>
            <div id="confirm">
                <h3>
                    Order Confirmed
                    <br />
                    Order #{order.orderNumber} has been placed successfully.
                </h3>
                <p style={{ marginTop: '1rem' }}>
                    Total paid: <strong>{order.totalAmountLabel}</strong>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                    Payment: {order.paymentMethod} | Status: {order.paymentStatus}
                </p>
            </div>

            <Link href="/">
                <div id="move">GO TO HOME</div>
            </Link>
        </>
    );
}
