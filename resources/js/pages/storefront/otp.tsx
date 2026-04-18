import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function StorefrontOtp({
    paymentMethod,
    paymentLabel,
}: {
    paymentMethod: string;
    paymentLabel: string;
}) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState<string | null>(null);

    const updateOtp = (index: number, value: string) => {
        const next = [...otp];
        next[index] = value.slice(-1).replace(/\D/g, '');
        setOtp(next);
    };

    const handleConfirm = () => {
        if (otp.join('').length !== 4) {
            setError('Please enter the 4-digit OTP.');

            return;
        }

        router.post('/order/place', {
            payment_method: paymentMethod,
            otp: otp.join(''),
        });
    };

    return (
        <>
            <Head>
                <title>OTP Verification | Myntra</title>
                <link rel="stylesheet" href="/css/storefront-otp.css" />
            </Head>

            <div id="otpDiv">
                <img
                    src="https://constant.myntassets.com/pwa/assets/img/3a438cb4-c9bf-4316-b60c-c63e40a1a96d1548071106233-mobile-verification.jpg"
                    alt="OTP verification"
                />
                <div id="otpline">
                    <h2>Verify with OTP</h2>
                    <p>Confirming payment via {paymentLabel}</p>
                </div>
                <div id="inputDiv">
                    {otp.map((digit, index) => (
                        <input
                            key={`otp-${index + 1}`}
                            type="tel"
                            maxLength={1}
                            value={digit}
                            onChange={(event) =>
                                updateOtp(index, event.target.value)
                            }
                        />
                    ))}
                </div>
                <button type="button" id="checkotp" onClick={handleConfirm}>
                    CONFIRM
                </button>
                {error ? (
                    <p style={{ color: '#ff3e6c', paddingInline: '60px' }}>
                        {error}
                    </p>
                ) : null}
                <div id="checkDiv">
                    <h4>
                        <Link href={`/checkout/payment?payment_method=${paymentMethod}`}>
                            BACK TO PAYMENT
                        </Link>
                    </h4>
                </div>
            </div>
        </>
    );
}
