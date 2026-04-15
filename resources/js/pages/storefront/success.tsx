import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { completeOrder } from '@/storefront/storage';

export default function StorefrontSuccess() {
    useEffect(() => {
        completeOrder();
    }, []);

    return (
        <>
            <Head>
                <title>Order Confirmed | Myntra Clone</title>
                <link rel="stylesheet" href="/css/storefront-success.css" />
            </Head>

            <div id="thanks">
                <img src="https://bit.ly/3J2FZ5A" alt="Order confirmed" />
            </div>
            <div id="confirm">
                <h3>
                    Order Confirmed
                    <br />
                    You will soon receive a mail/SMS regarding confirmation of
                    your recent order
                </h3>
            </div>

            <Link href="/">
                <div id="move">GO TO HOME</div>
            </Link>
        </>
    );
}
