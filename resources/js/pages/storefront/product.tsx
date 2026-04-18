import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { StorefrontProduct } from '@/storefront/types';

export default function StorefrontProductPage({
    product,
    relatedProducts,
    isWishlisted,
}: {
    product: StorefrontProduct;
    relatedProducts: StorefrontProduct[];
    isWishlisted: boolean;
}) {
    const auth = (usePage().props as { auth?: { user?: { id: number } | null } })
        .auth;
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        setWishlisted(isWishlisted);
    }, [isWishlisted]);

    const showNotice = (message: string) => {
        setNotice(message);
        window.setTimeout(() => setNotice(null), 1800);
    };

    const requireLogin = () => {
        router.visit('/login');
    };

    const handleAddToBag = () => {
        if (!auth?.user) {
            requireLogin();

            return;
        }

        router.post(
            '/cart/add',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => showNotice('Added to bag'),
            },
        );
    };

    const handleWishlist = () => {
        if (!auth?.user) {
            requireLogin();

            return;
        }

        if (wishlisted) {
            showNotice('Already in wishlist');

            return;
        }

        router.post(
            '/wishlist/add',
            { product_id: product.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setWishlisted(true);
                    showNotice('Added to wishlist');
                },
            },
        );
    };

    return (
        <>
            <Head title={`${product.brand} | ${product.name}`} />

            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-10 rounded-[32px] border border-[#f1f0f4] bg-white p-6 shadow-[0_24px_80px_rgba(22,26,45,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-[28px] bg-[#f6f7fb]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {relatedProducts.length ? (
                            <div className="grid grid-cols-4 gap-3">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}`}
                                        className="overflow-hidden rounded-2xl border border-[#eceaf1] bg-[#fafbff]"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="aspect-square w-full object-cover"
                                        />
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#ff3f6c]">
                                {product.brand}
                            </p>
                            <h1 className="mt-3 text-3xl font-bold text-neutral-900">
                                {product.name}
                            </h1>
                            <p className="mt-3 text-base text-neutral-600">
                                {product.shortDescription ?? product.description}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#eceaf1] bg-[#faf7fb] px-4 py-2 text-sm font-medium text-neutral-700">
                                <span>{product.rating} ★</span>
                                <span className="text-neutral-300">|</span>
                                <span>{product.reviewLabel} ratings</span>
                            </div>
                        </div>

                        <div className="rounded-[28px] bg-[#fff7f9] p-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-bold text-neutral-900">
                                    {product.priceLabel}
                                </span>
                                <span className="text-lg text-neutral-400 line-through">
                                    {product.originalPriceLabel}
                                </span>
                                {product.offer ? (
                                    <span className="rounded-full bg-[#ffe3ea] px-3 py-1 text-sm font-semibold text-[#ff3f6c]">
                                        {product.offer}
                                    </span>
                                ) : null}
                            </div>
                            <p className="mt-3 text-sm font-medium text-[#2d8f62]">
                                {product.deliveryPromise}
                            </p>
                        </div>

                        <div className="grid gap-3 rounded-[28px] border border-[#eceaf1] p-5 text-sm text-neutral-600">
                            <p>Category: {product.categoryLabel}</p>
                            <p>Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                            <p>Order with confidence using your saved Myntra-style account flow.</p>
                        </div>

                        {notice ? (
                            <div className="rounded-2xl border border-[#ffd2dd] bg-[#fff5f8] px-4 py-3 text-sm font-medium text-[#d6336c]">
                                {notice}
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                className="rounded-2xl bg-[#ff3f6c] px-6 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(255,63,108,0.25)]"
                                onClick={handleAddToBag}
                            >
                                ADD TO BAG
                            </button>
                            <button
                                type="button"
                                className="rounded-2xl border border-neutral-300 px-6 py-4 font-semibold text-neutral-900"
                                onClick={handleWishlist}
                            >
                                {wishlisted ? 'WISHLISTED' : 'ADD TO WISHLIST'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
