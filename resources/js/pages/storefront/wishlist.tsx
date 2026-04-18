import { Head, Link, router, usePage } from '@inertiajs/react';
import type { StorefrontWishlistItem } from '@/storefront/types';

export default function StorefrontWishlist({
    wishlist,
}: {
    wishlist: StorefrontWishlistItem[];
}) {
    const flash = (usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    }).flash;

    return (
        <>
            <Head>
                <title>Wishlist | Myntra</title>
                <link rel="stylesheet" href="/css/storefront-wishlist.css" />
            </Head>

            <h3 className="wishhead">
                My Wishlist{' '}
                <span className="wishcount">{`${wishlist.length} Items`}</span>
            </h3>

            {flash?.success ? (
                <div className="mx-auto mb-6 max-w-6xl rounded-2xl border border-[#ffd5e1] bg-[#fff6f8] px-4 py-3 text-sm font-medium text-[#d6336c]">
                    {flash.success}
                </div>
            ) : null}

            {flash?.error ? (
                <div className="mx-auto mb-6 max-w-6xl rounded-2xl border border-[#ffe0de] bg-[#fff7f6] px-4 py-3 text-sm font-medium text-[#d94841]">
                    {flash.error}
                </div>
            ) : null}

            {wishlist.length === 0 ? (
                <div className="mx-auto max-w-3xl rounded-[32px] border border-[#eceaf1] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(22,26,45,0.06)]">
                    <h2 className="text-3xl font-bold text-neutral-900">
                        Your wishlist is waiting
                    </h2>
                    <p className="mt-3 text-neutral-600">
                        Save styles you love, then move them into your bag when
                        you are ready to checkout.
                    </p>
                    <Link
                        href="/products/category/men"
                        className="mt-6 inline-flex rounded-2xl bg-[#ff3f6c] px-6 py-3 font-semibold text-white"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="container">
                    {wishlist.map((item) => (
                        <div key={item.id} className="imgbox">
                            <Link href={`/products/${item.product.slug}`}>
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                />
                            </Link>
                            <p>{item.product.brand}</p>
                            <p className="pricepara">
                                <span>{item.product.priceLabel}</span>
                                <span
                                    style={{
                                        color: 'gray',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    {item.product.originalPriceLabel}
                                </span>
                                <span style={{ color: 'red' }}>
                                    {item.product.offer}
                                </span>
                            </p>
                            <div className="buttonholder">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            '/wishlist/remove',
                                            { wishlist_item_id: item.id },
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    Remove
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            '/wishlist/move-to-cart',
                                            { wishlist_item_id: item.id },
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    MOVE TO BAG
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
