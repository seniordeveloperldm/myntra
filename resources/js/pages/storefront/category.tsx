import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    getCategoryLabel,
    getProductsForCategory
    
} from '@/storefront/catalog';
import type {StorefrontProduct} from '@/storefront/catalog';
import { addToWishlist, isWishlisted } from '@/storefront/storage';

type SortValue =
    | 'recommended'
    | 'price-asc'
    | 'price-desc'
    | 'discount-desc'
    | 'brand-asc';

type PriceBand = 'all' | 'under-1000' | '1000-2000' | 'above-2000';

type CategoryPageMeta = {
    title: string;
    breadcrumb: readonly string[];
    quickFilters: readonly string[];
};

type ColorSwatch = {
    name: string;
    hex: string;
    border?: string;
};

type EnrichedProduct = {
    product: StorefrontProduct;
    index: number;
    family: string;
    color: ColorSwatch;
    rating: string;
    reviews: string;
    showAdTag: boolean;
    sizeHint: string;
    status: string | null;
};

const colorPalette: readonly ColorSwatch[] = [
    { name: 'Black', hex: '#2b2f3f' },
    { name: 'White', hex: '#f7f7f7', border: '#d9dce3' },
    { name: 'Navy Blue', hex: '#233f79' },
    { name: 'Blue', hex: '#2f6fe4' },
    { name: 'Grey', hex: '#8f96a3' },
    { name: 'Olive', hex: '#60734d' },
] as const;

const pageMetaMap: Record<string, CategoryPageMeta> = {
    men: {
        title: 'Men Topwear',
        breadcrumb: ['Clothing', 'Men Topwear'],
        quickFilters: ['Bundles', 'Country of Origin', 'Size'],
    },
    women: {
        title: 'Women Fashion',
        breadcrumb: ['Clothing', 'Women Fashion'],
        quickFilters: ['Occasion', 'Workwear', 'Size'],
    },
    'home-living': {
        title: 'Home & Living',
        breadcrumb: ['Decor', 'Home & Living'],
        quickFilters: ['Brand', 'Discount Range', 'Price'],
    },
};

const sortLabels: Record<SortValue, string> = {
    recommended: 'Recommended',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'discount-desc': 'Better Discount',
    'brand-asc': 'Brand Name',
};

const priceBands = [
    {
        id: 'under-1000',
        label: 'Under Rs. 1000',
        matches: (price: number) => price < 1000,
    },
    {
        id: '1000-2000',
        label: 'Rs. 1000 to Rs. 2000',
        matches: (price: number) => price >= 1000 && price <= 2000,
    },
    {
        id: 'above-2000',
        label: 'Above Rs. 2000',
        matches: (price: number) => price > 2000,
    },
] as const;

const categoryDisplayMap: Record<string, string> = {
    Tshirts: 'T-Shirts',
    Slippers: 'Slides & Slippers',
};

const formatCount = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
};

const formatCompactCount = (value: number) => {
    if (value >= 1000) {
        const precision = value >= 10000 ? 0 : 1;

        return `${(value / 1000).toFixed(precision).replace(/\.0$/, '')}k`;
    }

    return `${value}`;
};

const getDiscount = (offer: string) => {
    return Number.parseInt(offer.replace(/[^\d]/g, ''), 10) || 0;
};

const inferFamily = (product: StorefrontProduct) => {
    if (product.categoryLabel && product.categoryLabel !== 'Fashion') {
        return categoryDisplayMap[product.categoryLabel] ?? product.categoryLabel;
    }

    const source = `${product.brand} ${product.name}`.toLowerCase();

    if (source.includes('kurta')) {
        return 'Kurtas';
    }

    if (source.includes('dress')) {
        return 'Dresses';
    }

    if (source.includes('saree')) {
        return 'Sarees';
    }

    if (
        source.includes('sneaker') ||
        source.includes('shoe') ||
        source.includes('flip-flop') ||
        source.includes('slipper')
    ) {
        return 'Footwear';
    }

    if (
        source.includes('t-shirt') ||
        source.includes('tshirt') ||
        source.includes('tee') ||
        source.includes('polo')
    ) {
        return 'T-Shirts';
    }

    if (source.includes('shirt')) {
        return 'Shirts';
    }

    if (
        source.includes('bed') ||
        source.includes('cushion') ||
        source.includes('blanket') ||
        source.includes('curtain')
    ) {
        return 'Home Furnishing';
    }

    if (
        source.includes('cup') ||
        source.includes('mug') ||
        source.includes('tray') ||
        source.includes('kitchen')
    ) {
        return 'Kitchen & Table';
    }

    return 'Fashion';
};

const getColorForProduct = (product: StorefrontProduct, index: number) => {
    return colorPalette[
        (product.price + product.originalPrice + index * 11) %
            colorPalette.length
    ];
};

const getRatingForProduct = (product: StorefrontProduct, index: number) => {
    const value = 3.8 + ((product.price + index) % 12) / 10;

    return Math.min(value, 4.9).toFixed(1);
};

const getReviewsForProduct = (product: StorefrontProduct, index: number) => {
    const value = ((product.originalPrice * 3 + index * 41) % 18000) + 18;

    return formatCompactCount(value);
};

const getSizeHint = (product: StorefrontProduct) => {
    const source = `${product.name} ${product.categoryLabel}`.toLowerCase();

    if (
        source.includes('shoe') ||
        source.includes('sneaker') ||
        source.includes('flip') ||
        source.includes('slipper')
    ) {
        return 'Sizes: 40, 41, 42';
    }

    return 'Sizes: S, M, L';
};

const getStatusText = (index: number) => {
    if (index % 5 === 0) {
        return 'Only Few Left!';
    }

    if (index % 7 === 0) {
        return 'Best price in 30 days';
    }

    return null;
};

export default function StorefrontCategory({
    category,
}: {
    category: string;
}) {
    const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [priceBand, setPriceBand] = useState<PriceBand>('all');
    const [sortBy, setSortBy] = useState<SortValue>('recommended');
    const [notice, setNotice] = useState<string | null>(null);
    const products = getProductsForCategory(category);
    const pageMeta = pageMetaMap[category] ?? {
        title: getCategoryLabel(category),
        breadcrumb: ['Storefront', getCategoryLabel(category)],
        quickFilters: ['Trending', 'Discount Range', 'Price'],
    };

    const enrichedProducts: EnrichedProduct[] = products.map((product, index) => ({
        product,
        index,
        family: inferFamily(product),
        color: getColorForProduct(product, index),
        rating: getRatingForProduct(product, index),
        reviews: getReviewsForProduct(product, index),
        showAdTag: index % 4 === 1,
        sizeHint: getSizeHint(product),
        status: getStatusText(index),
    }));

    const familyCounts = enrichedProducts.reduce<Record<string, number>>(
        (counts, item) => {
            counts[item.family] = (counts[item.family] ?? 0) + 1;

            return counts;
        },
        {},
    );
    const brandCounts = enrichedProducts.reduce<Record<string, number>>(
        (counts, item) => {
            counts[item.product.brand] = (counts[item.product.brand] ?? 0) + 1;

            return counts;
        },
        {},
    );
    const colorCounts = enrichedProducts.reduce<Record<string, number>>(
        (counts, item) => {
            counts[item.color.name] = (counts[item.color.name] ?? 0) + 1;

            return counts;
        },
        {},
    );

    const familyOptions = Object.entries(familyCounts)
        .map(([value, count]) => ({
            value,
            label: value,
            count,
        }))
        .sort((first, second) => second.count - first.count);

    const brandOptions = Object.entries(brandCounts)
        .map(([value, count]) => ({
            value,
            label: value,
            count,
        }))
        .sort(
            (first, second) =>
                second.count - first.count || first.label.localeCompare(second.label),
        );

    const colorOptions = colorPalette
        .map((color) => ({
            ...color,
            count: colorCounts[color.name] ?? 0,
        }))
        .filter((color) => color.count > 0);

    const filteredProducts = [...enrichedProducts]
        .filter((item) =>
            selectedFamilies.length === 0
                ? true
                : selectedFamilies.includes(item.family),
        )
        .filter((item) =>
            selectedBrands.length === 0
                ? true
                : selectedBrands.includes(item.product.brand),
        )
        .filter((item) =>
            selectedColors.length === 0
                ? true
                : selectedColors.includes(item.color.name),
        )
        .filter((item) => {
            if (priceBand === 'all') {
                return true;
            }

            const band = priceBands.find((option) => option.id === priceBand);

            return band ? band.matches(item.product.price) : true;
        })
        .sort((first, second) => {
            if (sortBy === 'price-asc') {
                return first.product.price - second.product.price;
            }

            if (sortBy === 'price-desc') {
                return second.product.price - first.product.price;
            }

            if (sortBy === 'discount-desc') {
                return (
                    getDiscount(second.product.offer) - getDiscount(first.product.offer)
                );
            }

            if (sortBy === 'brand-asc') {
                return first.product.brand.localeCompare(second.product.brand);
            }

            return first.index - second.index;
        });

    const hasActiveFilters =
        selectedFamilies.length > 0 ||
        selectedBrands.length > 0 ||
        selectedColors.length > 0 ||
        priceBand !== 'all';

    const showNotice = (message: string) => {
        setNotice(message);
        window.setTimeout(() => setNotice(null), 1800);
    };

    const handleWishlist = (product: StorefrontProduct) => {
        const added = addToWishlist(product);
        showNotice(added ? 'Added to wishlist' : 'Already in wishlist');
    };

    const toggleFamily = (value: string) => {
        setSelectedFamilies((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const toggleBrand = (value: string) => {
        setSelectedBrands((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const toggleColor = (value: string) => {
        setSelectedColors((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const clearFilters = () => {
        setSelectedFamilies([]);
        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceBand('all');
    };

    return (
        <>
            <Head>
                <title>{`${pageMeta.title} | Myntra`}</title>
                <link rel="stylesheet" href="/css/storefront-category.css" />
            </Head>

            <section className="storefront-category-page">
                <div className="storefront-category-page__inner">
                    <div className="storefront-category-page__hero">
                        <nav
                            className="storefront-category-page__breadcrumb"
                            aria-label="Breadcrumb"
                        >
                            <Link href="/">Home</Link>
                            {pageMeta.breadcrumb.map((crumb, index) => (
                                <span key={`${crumb}-${index}`}>
                                    <span className="storefront-category-page__crumb-separator">
                                        /
                                    </span>
                                    <span
                                        className={
                                            index === pageMeta.breadcrumb.length - 1
                                                ? 'is-active'
                                                : ''
                                        }
                                    >
                                        {crumb}
                                    </span>
                                </span>
                            ))}
                        </nav>

                        <div className="storefront-category-page__title-row">
                            <h1>{pageMeta.title}</h1>
                            <span>{formatCount(filteredProducts.length)} items</span>
                        </div>
                    </div>

                    <div className="storefront-category-toolbar">
                        <div className="storefront-category-toolbar__left">
                            <div className="storefront-category-toolbar__filters">
                                <span>FILTERS</span>
                                {hasActiveFilters ? (
                                    <button
                                        type="button"
                                        className="storefront-category-toolbar__clear"
                                        onClick={clearFilters}
                                    >
                                        Clear all
                                    </button>
                                ) : null}
                            </div>

                            <div className="storefront-category-toolbar__chips">
                                {pageMeta.quickFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        className="storefront-category-toolbar__chip"
                                    >
                                        <span>{filter}</span>
                                        <span aria-hidden="true">▾</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label
                            className="storefront-category-toolbar__sort"
                            htmlFor="storefront-sort"
                        >
                            <span>
                                Sort by : <strong>{sortLabels[sortBy]}</strong>
                            </span>

                            <select
                                id="storefront-sort"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value as SortValue)
                                }
                            >
                                {Object.entries(sortLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="storefront-category-layout">
                        <aside className="storefront-category-sidebar">
                            <section className="storefront-filter-section">
                                <header className="storefront-filter-section__header">
                                    <h2>Categories</h2>
                                </header>

                                <div className="storefront-filter-section__body">
                                    {familyOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className="storefront-filter-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedFamilies.includes(
                                                    option.value,
                                                )}
                                                onChange={() => toggleFamily(option.value)}
                                            />
                                            <span>{option.label}</span>
                                            <small>({formatCount(option.count)})</small>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="storefront-filter-section">
                                <header className="storefront-filter-section__header">
                                    <h2>Brand</h2>
                                    <button type="button" aria-label="Search brand">
                                        <i className="fa-solid fa-magnifying-glass" />
                                    </button>
                                </header>

                                <div className="storefront-filter-section__body">
                                    {brandOptions.slice(0, 8).map((option) => (
                                        <label
                                            key={option.value}
                                            className="storefront-filter-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(
                                                    option.value,
                                                )}
                                                onChange={() => toggleBrand(option.value)}
                                            />
                                            <span>{option.label}</span>
                                            <small>({formatCount(option.count)})</small>
                                        </label>
                                    ))}

                                    {brandOptions.length > 8 ? (
                                        <span className="storefront-filter-section__more">
                                            + {formatCount(brandOptions.length - 8)} more
                                        </span>
                                    ) : null}
                                </div>
                            </section>

                            <section className="storefront-filter-section">
                                <header className="storefront-filter-section__header">
                                    <h2>Price</h2>
                                </header>

                                <div className="storefront-filter-section__body">
                                    {priceBands.map((band) => (
                                        <label
                                            key={band.id}
                                            className="storefront-filter-option"
                                        >
                                            <input
                                                type="radio"
                                                name="price-band"
                                                checked={priceBand === band.id}
                                                onChange={() =>
                                                    setPriceBand(band.id as PriceBand)
                                                }
                                            />
                                            <span>{band.label}</span>
                                        </label>
                                    ))}

                                    <label className="storefront-filter-option">
                                        <input
                                            type="radio"
                                            name="price-band"
                                            checked={priceBand === 'all'}
                                            onChange={() => setPriceBand('all')}
                                        />
                                        <span>All Prices</span>
                                    </label>
                                </div>
                            </section>

                            <section className="storefront-filter-section">
                                <header className="storefront-filter-section__header">
                                    <h2>Color</h2>
                                </header>

                                <div className="storefront-filter-section__body">
                                    {colorOptions.map((color) => (
                                        <label
                                            key={color.name}
                                            className="storefront-filter-option storefront-filter-option--color"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedColors.includes(color.name)}
                                                onChange={() => toggleColor(color.name)}
                                            />
                                            <span
                                                className="storefront-filter-option__swatch"
                                                style={{
                                                    backgroundColor: color.hex,
                                                    borderColor:
                                                        color.border ?? color.hex,
                                                }}
                                            />
                                            <span>{color.name}</span>
                                            <small>({formatCount(color.count)})</small>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </aside>

                        <div className="storefront-category-results">
                            {notice ? (
                                <div className="storefront-category-toast">{notice}</div>
                            ) : null}

                            {filteredProducts.length === 0 ? (
                                <div className="storefront-category-empty">
                                    <h2>No products found</h2>
                                    <p>
                                        Try clearing a few filters to see more styles.
                                    </p>
                                    <button type="button" onClick={clearFilters}>
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="storefront-product-grid">
                                    {filteredProducts.map((item) => {
                                        const wishlisted = isWishlisted(
                                            item.product.id,
                                        );

                                        return (
                                            <article
                                                key={item.product.id}
                                                className="storefront-product-card"
                                            >
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="storefront-product-card__media"
                                                >
                                                    {item.showAdTag ? (
                                                        <span className="storefront-product-card__tag">
                                                            AD
                                                        </span>
                                                    ) : null}

                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        loading="lazy"
                                                    />

                                                    <span className="storefront-product-card__rating">
                                                        {item.rating} ★ | {item.reviews}
                                                    </span>
                                                </Link>

                                                <div className="storefront-product-card__content">
                                                    <Link
                                                        href={`/products/${item.product.id}`}
                                                        className="storefront-product-card__title"
                                                    >
                                                        <h3>{item.product.brand}</h3>
                                                        <p>{item.product.name}</p>
                                                    </Link>

                                                    <div className="storefront-product-card__hover">
                                                        <button
                                                            type="button"
                                                            className={`storefront-product-card__wishlist${
                                                                wishlisted
                                                                    ? ' is-active'
                                                                    : ''
                                                            }`}
                                                            onClick={() =>
                                                                handleWishlist(
                                                                    item.product,
                                                                )
                                                            }
                                                        >
                                                            {wishlisted
                                                                ? 'WISHLISTED'
                                                                : 'WISHLIST'}
                                                        </button>
                                                        <span>{item.sizeHint}</span>
                                                    </div>

                                                    <span className="storefront-product-card__family">
                                                        {item.family}
                                                    </span>

                                                    <div className="storefront-product-card__price">
                                                        <strong>
                                                            {item.product.priceLabel}
                                                        </strong>
                                                        <span>
                                                            {item.product.originalPriceLabel}
                                                        </span>
                                                        <em>{item.product.offer}</em>
                                                    </div>

                                                    {item.status ? (
                                                        <span className="storefront-product-card__status">
                                                            {item.status}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
