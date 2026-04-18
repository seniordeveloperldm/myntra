import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type MegaMenuLink = {
    label: string;
    href: string;
};

type MegaMenuSection = {
    title: string;
    href: string;
    links: readonly MegaMenuLink[];
};

type MegaMenuColumn = {
    sections: readonly MegaMenuSection[];
};

type NavItem = {
    label: string;
    href: string;
    slug: string;
    match?: string;
    badge?: string;
    menu?: readonly MegaMenuColumn[];
};

const menMenuHref = '/products/category/men';

const menMegaMenu: readonly MegaMenuColumn[] = [
    {
        sections: [
            {
                title: 'Topwear',
                href: menMenuHref,
                links: [
                    { label: 'T-Shirts', href: menMenuHref },
                    { label: 'Casual Shirts', href: menMenuHref },
                    { label: 'Formal Shirts', href: menMenuHref },
                    { label: 'Sweatshirts', href: menMenuHref },
                    { label: 'Sweaters', href: menMenuHref },
                    { label: 'Jackets', href: menMenuHref },
                    { label: 'Blazers & Coats', href: menMenuHref },
                    { label: 'Suits', href: menMenuHref },
                    { label: 'Rain Jackets', href: menMenuHref },
                ],
            },
            {
                title: 'Indian & Festive Wear',
                href: menMenuHref,
                links: [
                    { label: 'Kurtas & Kurta Sets', href: menMenuHref },
                    { label: 'Sherwanis', href: menMenuHref },
                    { label: 'Nehru Jackets', href: menMenuHref },
                    { label: 'Dhotis', href: menMenuHref },
                ],
            },
        ],
    },
    {
        sections: [
            {
                title: 'Bottomwear',
                href: menMenuHref,
                links: [
                    { label: 'Jeans', href: menMenuHref },
                    { label: 'Casual Trousers', href: menMenuHref },
                    { label: 'Formal Trousers', href: menMenuHref },
                    { label: 'Shorts', href: menMenuHref },
                    { label: 'Track Pants & Joggers', href: menMenuHref },
                ],
            },
            {
                title: 'Innerwear & Sleepwear',
                href: menMenuHref,
                links: [
                    { label: 'Briefs & Trunks', href: menMenuHref },
                    { label: 'Boxers', href: menMenuHref },
                    { label: 'Vests', href: menMenuHref },
                    { label: 'Sleepwear & Loungewear', href: menMenuHref },
                    { label: 'Thermals', href: menMenuHref },
                ],
            },
            {
                title: 'Plus Size',
                href: menMenuHref,
                links: [],
            },
        ],
    },
    {
        sections: [
            {
                title: 'Footwear',
                href: menMenuHref,
                links: [
                    { label: 'Casual Shoes', href: menMenuHref },
                    { label: 'Sports Shoes', href: menMenuHref },
                    { label: 'Formal Shoes', href: menMenuHref },
                    { label: 'Sneakers', href: menMenuHref },
                    { label: 'Sandals & Floaters', href: menMenuHref },
                    { label: 'Flip Flops', href: menMenuHref },
                    { label: 'Socks', href: menMenuHref },
                ],
            },
            {
                title: 'Personal Care & Grooming',
                href: menMenuHref,
                links: [],
            },
            {
                title: 'Sunglasses & Frames',
                href: menMenuHref,
                links: [],
            },
            {
                title: 'Watches',
                href: menMenuHref,
                links: [],
            },
        ],
    },
    {
        sections: [
            {
                title: 'Sports & Active Wear',
                href: menMenuHref,
                links: [
                    { label: 'Sports Shoes', href: menMenuHref },
                    { label: 'Sports Sandals', href: menMenuHref },
                    { label: 'Active T-Shirts', href: menMenuHref },
                    { label: 'Track Pants & Shorts', href: menMenuHref },
                    { label: 'Tracksuits', href: menMenuHref },
                    { label: 'Jackets & Sweatshirts', href: menMenuHref },
                    { label: 'Sports Accessories', href: menMenuHref },
                    { label: 'Swimwear', href: menMenuHref },
                ],
            },
            {
                title: 'Gadgets',
                href: menMenuHref,
                links: [
                    { label: 'Smart Wearables', href: menMenuHref },
                    { label: 'Fitness Gadgets', href: menMenuHref },
                    { label: 'Headphones', href: menMenuHref },
                    { label: 'Speakers', href: menMenuHref },
                ],
            },
        ],
    },
    {
        sections: [
            {
                title: 'Fashion Accessories',
                href: menMenuHref,
                links: [
                    { label: 'Wallets', href: menMenuHref },
                    { label: 'Belts', href: menMenuHref },
                    { label: 'Perfumes & Body Mists', href: menMenuHref },
                    { label: 'Trimmers', href: menMenuHref },
                    { label: 'Deodorants', href: menMenuHref },
                    {
                        label: 'Ties, Cufflinks & Pocket Squares',
                        href: menMenuHref,
                    },
                    { label: 'Accessory Gift Sets', href: menMenuHref },
                    { label: 'Caps & Hats', href: menMenuHref },
                    {
                        label: 'Mufflers, Scarves & Gloves',
                        href: menMenuHref,
                    },
                    { label: 'Phone Cases', href: menMenuHref },
                    { label: 'Rings & Wristwear', href: menMenuHref },
                    { label: 'Helmets', href: menMenuHref },
                ],
            },
            {
                title: 'Bags & Backpacks',
                href: menMenuHref,
                links: [],
            },
            {
                title: 'Luggages & Trolleys',
                href: menMenuHref,
                links: [],
            },
        ],
    },
];

const utilityLinks = [
    { label: 'Myntra Insider', href: '/' },
    { label: 'Gift Card', href: '/' },
    { label: 'Track Orders', href: '/' },
    { label: 'Contact Us', href: '/' },
] as const;

const navItems: readonly NavItem[] = [
    {
        label: 'MEN',
        href: '/products/category/men',
        slug: 'men',
        match: '/products/category/men',
        menu: menMegaMenu,
    },
] as const;

const profileLinks = [
    { label: 'Orders', href: '/' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Gift Cards', href: '/' },
    { label: 'Contact Us', href: '/' },
] as const;

export default function StorefrontHeader() {
    const page = usePage();
    const auth = (page.props as {
        auth?: { user?: { name?: string } | null };
    }).auth;
    const storefront = (page.props as {
        storefront?: { cartCount?: number; wishlistCount?: number };
    }).storefront;
    const currentUrl = page.url ?? '';
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const firstName = auth?.user?.name?.split(' ')[0] ?? 'there';
    const counts = {
        bag: storefront?.cartCount ?? 0,
        wishlist: storefront?.wishlistCount ?? 0,
    };

    return (
        <>
            <button type="button" className="storefront-floating-offer">
                <span className="storefront-floating-offer__arrow">
                    <i className="fa-solid fa-caret-left"></i>
                </span>
                <span className="storefront-floating-offer__text">
                    UPTO Rs. 300 OFF
                </span>
            </button>

            <header className="storefront-header">
                <div className="storefront-header__utility">
                    <div className="storefront-header__utility-links">
                        {utilityLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="storefront-header__utility-link"
                            >
                                {link.label}
                                {link.label === 'Myntra Insider' ? (
                                    <span className="storefront-header__utility-badge">
                                        New
                                    </span>
                                ) : null}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="storefront-header__main">
                    <div className="storefront-header__brand-nav">
                        <Link href="/" className="storefront-logo">
                            <img
                                src="/images/myntra-removebg-preview.png"
                                alt="Myntra"
                            />
                        </Link>

                        <nav className="storefront-nav" aria-label="Primary">
                            {navItems.map((item) => {
                                const active = item.match
                                    ? currentUrl.startsWith(item.match)
                                    : false;

                                return (
                                    <div
                                        key={item.label}
                                        className={`storefront-nav__item storefront-nav__item--${item.slug}`}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`storefront-nav__link storefront-nav__link--${item.slug}${active ? ' is-active' : ''}`}
                                        >
                                            <span>{item.label}</span>
                                            {item.badge ? (
                                                <span className="storefront-nav__badge">
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </Link>

                                        {item.menu ? (
                                            <>
                                                <div className="storefront-megamenu__backdrop"></div>
                                                <div className="storefront-megamenu">
                                                    <div className="storefront-megamenu__panel">
                                                        <div className="storefront-megamenu__columns">
                                                            {item.menu.map(
                                                                (
                                                                    column,
                                                                    columnIndex,
                                                                ) => (
                                                                    <div
                                                                        key={`${item.slug}-column-${columnIndex + 1}`}
                                                                        className="storefront-megamenu__column"
                                                                    >
                                                                        {column.sections.map(
                                                                            (
                                                                                section,
                                                                                sectionIndex,
                                                                            ) => (
                                                                                <div
                                                                                    key={`${section.title}-${sectionIndex + 1}`}
                                                                                    className="storefront-megamenu__section"
                                                                                >
                                                                                    <Link
                                                                                        href={section.href}
                                                                                        className="storefront-megamenu__heading"
                                                                                    >
                                                                                        {section.title}
                                                                                    </Link>

                                                                                    {section.links.map(
                                                                                        (
                                                                                            link,
                                                                                        ) => (
                                                                                            <Link
                                                                                                key={link.label}
                                                                                                href={link.href}
                                                                                                className="storefront-megamenu__link"
                                                                                            >
                                                                                                {link.label}
                                                                                            </Link>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <label className="storefront-search" aria-label="Search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="search"
                            placeholder="Search for products, brands and more"
                            autoComplete="off"
                        />
                    </label>

                    <div className="storefront-actions">
                        <div className="storefront-profile">
                            <button
                                type="button"
                                className="storefront-action storefront-action--button"
                            >
                                <span className="storefront-action__icon">
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                <span className="storefront-action__label">
                                    Profile
                                </span>
                            </button>

                            <div className="storefront-profile__panel">
                                <div className="storefront-profile__intro">
                                    <h3>
                                        {auth?.user
                                            ? `Hello ${firstName}`
                                            : 'Welcome'}
                                    </h3>
                                    <p>
                                        {auth?.user
                                            ? 'Manage your profile, saved details and recent activity.'
                                            : 'To access account and manage orders.'}
                                    </p>
                                </div>

                                {!auth?.user ? (
                                    <div className="storefront-profile__auth-links">
                                        <Link
                                            href="/login"
                                            className="storefront-profile__cta"
                                        >
                                            Login / Signup
                                        </Link>
                                    </div>
                                ) : null}

                                <div className="storefront-profile__menu">
                                    {auth?.user ? (
                                        <Link
                                            href="/settings/profile"
                                            className="storefront-profile__menu-link"
                                        >
                                            My Account
                                        </Link>
                                    ) : null}

                                    {profileLinks.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="storefront-profile__menu-link"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {auth?.user ? (
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="storefront-profile__menu-link storefront-profile__menu-link--button"
                                        >
                                            Logout
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/register"
                                            className="storefront-profile__menu-link"
                                        >
                                            Create Account
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link href="/wishlist" className="storefront-action">
                            <span className="storefront-action__icon">
                                <i className="fa-regular fa-heart"></i>
                            </span>
                            <span className="storefront-action__label">
                                Wishlist
                            </span>
                            {counts.wishlist ? (
                                <span className="storefront-action__badge">
                                    {counts.wishlist}
                                </span>
                            ) : null}
                        </Link>

                        <Link href="/cart" className="storefront-action">
                            <span className="storefront-action__icon">
                                <i className="fa-solid fa-bag-shopping"></i>
                            </span>
                            <span className="storefront-action__label">Bag</span>
                            {counts.bag ? (
                                <span className="storefront-action__badge">
                                    {counts.bag}
                                </span>
                            ) : null}
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="storefront-mobile-toggle"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-expanded={mobileOpen}
                        aria-label="Toggle navigation"
                    >
                        <i
                            className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}
                        ></i>
                    </button>
                </div>

                <div
                    className={`storefront-mobile-panel${mobileOpen ? ' is-open' : ''}`}
                >
                    <label
                        className="storefront-search storefront-search--mobile"
                        aria-label="Search"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="search"
                            placeholder="Search for products, brands and more"
                            autoComplete="off"
                        />
                    </label>

                    <div className="storefront-mobile-panel__links">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="storefront-mobile-panel__link"
                                onClick={closeMobileMenu}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="storefront-mobile-panel__actions">
                        <img
                            src="/images/myntra-removebg-preview.png"
                            alt="Myntra"
                            className="storefront-mobile-panel__logo"
                        />
                        <div className="storefront-mobile-panel__utility">
                            <Link
                                href={auth?.user ? '/settings/profile' : '/login'}
                                className="storefront-mobile-panel__action"
                                onClick={closeMobileMenu}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/wishlist"
                                className="storefront-mobile-panel__action"
                                onClick={closeMobileMenu}
                            >
                                Wishlist
                            </Link>
                            <Link
                                href="/cart"
                                className="storefront-mobile-panel__action"
                                onClick={closeMobileMenu}
                            >
                                Bag
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
