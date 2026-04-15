import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { StorefrontProduct } from '@/storefront/catalog';
import {
    getWishlist,
    moveWishlistToBag,
    removeFromWishlist as removeWishlistItem,
    storefrontStorageEvent,
} from '@/storefront/storage';

export default function StorefrontWishlist() {
    const [wishlist, setWishlist] = useState<StorefrontProduct[]>(() =>
        getWishlist(),
    );

    useEffect(() => {
        const refresh = () => {
            setWishlist(getWishlist());
        };

        window.addEventListener(storefrontStorageEvent, refresh);
        window.addEventListener('storage', refresh);

        return () => {
            window.removeEventListener(storefrontStorageEvent, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Wishlist | Myntra Clone</title>
                <link rel="stylesheet" href="/css/storefront-wishlist.css" />
            </Head>

            <h3 className="wishhead">
                My Wishlist{' '}
                <span className="wishcount">{`${wishlist.length} Items`}</span>
            </h3>

            <div className="container">
                {wishlist.map((product) => (
                    <div key={product.id} className="imgbox">
                        <div>
                            <img src={product.image} alt={product.name} />
                        </div>
                        <p>{product.brand}</p>
                        <p className="pricepara">
                            <span>{product.priceLabel}</span>
                            <span
                                style={{
                                    color: 'gray',
                                    textDecoration: 'line-through',
                                }}
                            >
                                {product.originalPriceLabel}
                            </span>
                            <span style={{ color: 'red' }}>{product.offer}</span>
                        </p>
                        <div className="buttonholder">
                            <button
                                type="button"
                                onClick={() => removeWishlistItem(product.id)}
                            >
                                Remove
                            </button>
                            <button
                                type="button"
                                onClick={() => moveWishlistToBag(product.id)}
                            >
                                MOVE TO BAG
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
