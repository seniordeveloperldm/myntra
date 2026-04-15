import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StorefrontOtp() {
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

        window.location.href = '/checkout/success';
    };

    return (
        <>
            <Head>
                <title>OTP Verification | Myntra Clone</title>
                <link rel="stylesheet" href="/css/storefront-otp.css" />
            </Head>

            <div id="otpDiv">
                <img
                    src="https://constant.myntassets.com/pwa/assets/img/3a438cb4-c9bf-4316-b60c-c63e40a1a96d1548071106233-mobile-verification.jpg"
                    alt="OTP verification"
                />
                <div id="otpline">
                    <h2>Verify with OTP</h2>
                    <p>Sent to your registered mobile number</p>
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
                        <Link href="/checkout/payment">BACK TO PAYMENT</Link>
                    </h4>
                </div>
            </div>
        </>
    );
}
