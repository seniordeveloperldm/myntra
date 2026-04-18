export type StorefrontProduct = {
    id: number;
    slug: string;
    category: string | null;
    brand: string;
    name: string;
    image: string;
    gallery: string[];
    price: number;
    priceLabel: string;
    originalPrice: number;
    originalPriceLabel: string;
    offer: string;
    categoryLabel: string;
    shortDescription?: string | null;
    description?: string | null;
    rating: string;
    reviewCount: number;
    reviewLabel: string;
    stock: number;
    deliveryPromise: string;
};

export type StorefrontWishlistItem = {
    id: number;
    product: StorefrontProduct;
};

export type StorefrontCartItem = {
    id: number;
    quantity: number;
    subtotal: number;
    subtotalLabel: string;
    product: StorefrontProduct;
};

export type StorefrontSummary = {
    itemCount: number;
    mrp: number;
    amount: number;
    productDiscount: number;
    promoDiscount: number;
    payable: number;
    appliedPromo: string | null;
};

export type StorefrontAddress = {
    id?: number;
    label?: string;
    fullName: string;
    mobile: string;
    street: string;
    street2?: string | null;
    city: string;
    state: string;
    pinCode: string;
    country?: string;
    isDefault?: boolean;
};

export type PaymentMethodOption = {
    key: string;
    label: string;
};

export type StorefrontOrderItem = {
    id: number;
    name: string;
    brand?: string | null;
    image?: string | null;
    quantity: number;
    lineTotalLabel: string;
};

export type StorefrontOrder = {
    id: number;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    placedAt: string;
    customerName: string;
    totalAmount: number;
    totalAmountLabel: string;
    shippingAddress: {
        fullName: string;
        mobile: string;
        street: string;
        street2?: string | null;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    items: StorefrontOrderItem[];
};
