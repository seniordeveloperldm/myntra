import type { StorefrontProduct } from '@/storefront/catalog';

const BAG_KEY = 'BagListObj';
const WISHLIST_KEY = 'wishListObj';
const ADDRESS_KEY = 'MyntraAddress';
const PROMO_KEY = 'MyntraPromo';

export const storefrontStorageEvent = 'storefront:updated';

export type CheckoutAddress = {
    fullName: string;
    mobile: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
};

type PromoState = {
    code: string;
    discount: number;
};

const isBrowser = typeof window !== 'undefined';

const readJson = <T,>(key: string, fallback: T) => {
    if (!isBrowser) {
        return fallback;
    }

    try {
        const value = window.localStorage.getItem(key);

        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
};

const writeJson = (key: string, value: unknown) => {
    if (!isBrowser) {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(storefrontStorageEvent));
};

export const getWishlist = () => {
    return readJson<StorefrontProduct[]>(WISHLIST_KEY, []);
};

export const getBag = () => {
    return readJson<StorefrontProduct[]>(BAG_KEY, []);
};

export const isWishlisted = (productId: string) => {
    return getWishlist().some((product) => product.id === productId);
};

export const addToWishlist = (product: StorefrontProduct) => {
    const wishlist = getWishlist();

    if (wishlist.some((item) => item.id === product.id)) {
        return false;
    }

    writeJson(WISHLIST_KEY, [product, ...wishlist]);

    return true;
};

export const removeFromWishlist = (productId: string) => {
    writeJson(
        WISHLIST_KEY,
        getWishlist().filter((product) => product.id !== productId),
    );
};

export const addToBag = (product: StorefrontProduct) => {
    writeJson(BAG_KEY, [product, ...getBag()]);
};

export const removeBagItem = (index: number) => {
    const bag = getBag();
    bag.splice(index, 1);
    writeJson(BAG_KEY, bag);
};

export const moveWishlistToBag = (productId: string) => {
    const wishlist = getWishlist();
    const product = wishlist.find((item) => item.id === productId);

    if (!product) {
        return;
    }

    writeJson(
        WISHLIST_KEY,
        wishlist.filter((item) => item.id !== productId),
    );
    addToBag(product);
};

export const clearBag = () => {
    writeJson(BAG_KEY, []);
};

const getPromoState = () => {
    return readJson<PromoState | null>(PROMO_KEY, null);
};

const setPromoState = (value: PromoState | null) => {
    writeJson(PROMO_KEY, value);
};

export const getCartSummary = () => {
    const bag = getBag();
    const mrp = bag.reduce((sum, product) => sum + product.originalPrice, 0);
    const amount = bag.reduce((sum, product) => sum + product.price, 0);
    const productDiscount = mrp - amount;
    const promo = getPromoState();
    const promoDiscount =
        promo && promo.code === 'MYNTRA300' && amount > 300
            ? promo.discount
            : 0;

    if (promo && promoDiscount === 0) {
        setPromoState(null);
    }

    return {
        itemCount: bag.length,
        mrp,
        amount,
        productDiscount,
        promoDiscount,
        payable: Math.max(amount - promoDiscount, 0),
        appliedPromo: promoDiscount > 0 ? promo?.code ?? null : null,
    };
};

export const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const summary = getCartSummary();

    if (normalized !== 'MYNTRA300') {
        return { success: false, message: 'Try promo code MYNTRA300.' };
    }

    if (summary.amount <= 300) {
        return {
            success: false,
            message: 'Promo code works on orders above Rs. 300.',
        };
    }

    setPromoState({ code: normalized, discount: 300 });

    return {
        success: true,
        message: 'Promo code applied successfully.',
    };
};

export const clearPromoCode = () => {
    setPromoState(null);
};

export const getCheckoutAddress = () => {
    return readJson<CheckoutAddress | null>(ADDRESS_KEY, null);
};

export const saveCheckoutAddress = (address: CheckoutAddress) => {
    writeJson(ADDRESS_KEY, address);
};

export const completeOrder = () => {
    clearBag();
    clearPromoCode();
};

export const formatRupees = (value: number) => {
    return `Rs. ${value}`;
};
