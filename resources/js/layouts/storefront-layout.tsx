import { Head } from '@inertiajs/react';
import StorefrontFooter from '@/components/storefront-footer';
import StorefrontHeader from '@/components/storefront-header';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Head>
                <link
                    rel="shortcut icon"
                    type="image/png"
                    href="/images/favicon.png"
                />
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="stylesheet" href="/css/storefront-shell.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
            </Head>

            <div className="storefront-shell">
                <StorefrontHeader />
                <main className="storefront-main">{children}</main>
                <StorefrontFooter />
            </div>
        </>
    );
}
