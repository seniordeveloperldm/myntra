import { Head } from '@inertiajs/react';
import { findProductById } from '@/storefront/catalog';
import { addToBag, addToWishlist, isWishlisted } from '@/storefront/storage';

export default function StorefrontProduct({
    id,
}: {
    id: string;
}) {
    const product = findProductById(id);

    if (!product) {
        return (
            <>
                <Head title="Product not found" />
                <div className="mx-auto max-w-5xl px-4 py-16">
                    <h1 className="text-3xl font-bold">Product not found</h1>
                    <p className="mt-4 text-neutral-600">
                        This product is not available in the imported Myntra
                        clone catalog.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${product.brand} | ${product.name}`} />

            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="overflow-hidden rounded-2xl bg-neutral-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
                                {product.brand}
                            </p>
                            <h1 className="mt-2 text-3xl font-bold text-neutral-900">
                                {product.name}
                            </h1>
                            <p className="mt-3 text-sm text-neutral-500">
                                Imported from your static Myntra clone catalog.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-5">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-neutral-900">
                                    {product.priceLabel}
                                </span>
                                <span className="text-lg text-neutral-400 line-through">
                                    {product.originalPriceLabel}
                                </span>
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                                    {product.offer}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3 text-sm text-neutral-600">
                            <p>Category: {product.categoryLabel}</p>
                            <p>Style: Myntra clone React storefront</p>
                            <p>Delivery: Usually delivered in 3-5 business days</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                className="rounded-xl bg-[#ff3f6c] px-6 py-4 font-semibold text-white"
                                onClick={() => addToBag(product)}
                            >
                                ADD TO BAG
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-neutral-300 px-6 py-4 font-semibold text-neutral-900"
                                onClick={() => addToWishlist(product)}
                            >
                                {isWishlisted(product.id)
                                    ? 'ADDED TO WISHLIST'
                                    : 'ADD TO WISHLIST'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
