import { categoriesArr } from '@/storefront/data/landing-sections';
import { homeLivingProducts } from '@/storefront/data/home-living-products';
import { menProducts } from '@/storefront/data/men-products';
import { womenProducts } from '@/storefront/data/women-products';

type RawProduct = {
    image_url: string;
    brand: string;
    para: string;
    rs?: number;
    price: string;
    strikedoffprice: string;
    offer: string;
    category?: string;
};

export type StorefrontCategory = 'men' | 'women' | 'home-living';

export type StorefrontProduct = {
    id: string;
    category: StorefrontCategory;
    brand: string;
    name: string;
    image: string;
    price: number;
    priceLabel: string;
    originalPrice: number;
    originalPriceLabel: string;
    offer: string;
    categoryLabel: string;
};

export type StorefrontSection = {
    id: string;
    title: string;
    images: string[];
    href: string;
    layout: 'feature' | 'premium' | 'category';
};

export type StorefrontHeroSlide = {
    image: string;
    href: string;
    alt: string;
};

export const storefrontPromoBanner = {
    image: 'https://assets.myntassets.com/assets/images/2026/APRIL/12/XC10hxBQ_0180d5dccc7e4308bd4b44cefdaca489.png',
    href: '/',
    alt: 'Myntra best seller promo banner',
} as const;

const parseCurrency = (value: string) => {
    const digits = value.replace(/[^\d]/g, '');

    return Number.parseInt(digits || '0', 10);
};

const normalizeProducts = (
    products: readonly RawProduct[],
    category: StorefrontCategory,
) => {
    return products.map((product, index) => ({
        id: `${category}-${index + 1}`,
        category,
        brand: product.brand,
        name: product.para,
        image: product.image_url.trim(),
        price: product.rs ?? parseCurrency(product.price),
        priceLabel: `Rs. ${product.rs ?? parseCurrency(product.price)}`,
        originalPrice: parseCurrency(product.strikedoffprice),
        originalPriceLabel: `Rs. ${parseCurrency(product.strikedoffprice)}`,
        offer: product.offer.replace(/\s+/g, ' ').trim(),
        categoryLabel: product.category ?? 'Fashion',
    }));
};

export const heroSlides: StorefrontHeroSlide[] = [
    {
        image: 'https://assets.myntassets.com/assets/images/2022/7/25/179e278f-77ee-44c2-bf39-9f00b0cd08e01658752429301-Handbags_Desk.jpg',
        href: '/products/category/women',
        alt: 'Handbags desktop banner',
    },
    {
        image: 'https://assets.myntassets.com/assets/images/2022/7/25/9be788ff-39a4-4214-99d0-fc97505aae5a1658752545685-USPA_Desk_Banner.jpg',
        href: '/products/category/men',
        alt: 'US Polo Assn desktop banner',
    },
    {
        image: 'https://assets.myntassets.com/assets/images/2025/AUGUST/25/0pfZkpSF_60a17fdbda0a4622b8bd1f79585836c0.png',
        href: '/',
        alt: 'GenZ collection desktop banner',
    },
    {
        image: 'https://assets.myntassets.com/assets/images/2022/5/31/4031994d-9092-4aa7-aea1-f52f2ae5194f1654006594976-Activewear_DK.jpg',
        href: '/products/category/men',
        alt: 'Activewear desktop banner',
    },
];

export const storefrontCategories = [
    { key: 'men', label: 'Men' },
    { key: 'women', label: 'Women' },
    { key: 'home-living', label: 'Home & Living' },
] as const;

export const storefrontSections: StorefrontSection[] = [
    {
        id: 'rising-stars',
        title: 'RISING STARS',
        href: '/',
        layout: 'feature',
        images: [
            'https://assets.myntassets.com/assets/images/2025/4/3/925ace95-64e1-4692-92c0-826bde3f838b1743664826626-image_png2008444094.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/08fed317-13c3-4fca-925f-4e3f904adf6e1743664846782-image_png_345798654.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/edb347da-f35b-4d68-91d7-e3b0abba39f01743664908755-cf0de057-98b8-4d14-968d-8b35878100db.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/9ca117d1-1c90-4217-8615-f5d9a66245251743664924386-image_png676529993.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/62628ecd-af1d-4b81-8a82-302520ade5061743664952778-image_png_1238714099.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/62d92229-2d9d-4cc6-933f-1facd190248c1743664969307-image_png_1434304747.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/b3b8e1d5-0b7f-4ac2-988a-e1a2a4b71ef51743664985845-image_png747386139.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/6d3a4cec-35ee-4002-b8c9-115b7979eb4e1743665003385-image_png225290513.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/a478f3f4-b261-4d42-8b41-ba8e38eed7491743665021245-3d887b9c-1741-4f13-928f-4e052f5b4858.png',
            'https://assets.myntassets.com/assets/images/2025/4/3/e227f4c1-b6c6-4abc-bfcf-4693266d102a1743665039878-image_png_1046077641.png',
        ],
    },
    {
        id: 'luxe-grand-reduction',
        title: 'LUXE GRAND REDUCTION DEALS',
        href: '/',
        layout: 'premium',
        images: [
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/vEWFYOye_14f4f7547ecb4c079855f8301128df46.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/yeoUJy1S_4e79c54bdd174052a9abcfac1d2a8bbd.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/wFPkZ6H1_c9bb52d0824d4edcb2dbec7fe2f800d0.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/RYMYFMOO_ab6eb526601841019b9acd933df1bed6.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/8nY49yv6_2ac65b37e50645728658d8d7a75a5fd1.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/aRBN2tk4_964c12c29366441ab74f35f4efdf9591.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/tRX72V2a_47fba08feddc4ad8b9ad5c8dc04c45b3.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/OJvOUlQW_415a6f82c0ff4c38a3b650c734d3b52e.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/yrJ9o15l_06f85e217b104701aec6ce93c28e46fa.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/rTLGu6Uh_a7a63c3327d343a79a56f3a58eee52e3.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/of67fd3n_dcd2889a4a414ff9ab60ab881934b6ad.png',
            'https://assets.myntassets.com/assets/images/2025/JANUARY/10/b1M22Uns_fddc69ba45484eeda68f58756b71037e.png',
        ],
    },
    {
        id: 'medal-worthy',
        title: 'MEDAL WORTHY BRANDS TO BAG',
        href: '/',
        layout: 'feature',
        images: [
            'https://assets.myntassets.com/assets/images/retaillabs/2023/8/4/71a69cc9-210a-4a95-b37f-78319c8f33761691141606256-image_png2064277310.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/ccebd3fc-3628-4eb5-9604-5487049c2cff1691142886405-image_png356438875.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/5a8540d5-9bd0-4a5b-81ee-063f8f23cf1c1691142814463-image_png1048777875.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/30ce6d77-d4f5-4bed-b89a-c9cf00d197b81691142723203-image_png2141362199.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/26abfeae-7980-4263-aac2-2e6206035da81691142704308-image_png_391142713.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/6366f7f4-3942-4cbc-af0d-3b63c0f9add71691142685532-image_png45885503.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/ca44e488-c06b-48ce-814f-3a1e3e66e08b1691142548139-image_png_840304476.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/7abcde7c-18e5-44c5-9cd9-c1490daa842a1691142533559-image_png2078004791.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/6ddcd2e5-20c6-4672-9b02-7d2117550f641691142512854-image_png242033865.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/b504644b-f446-48c9-b928-36f1958bd19a1691142484406-image_png_292913761.png',
            'https://assets.myntassets.com/assets/images/retaillabs/2023/8/4/921e38ac-f903-4701-a419-df42b9448ef51691142513445-image_png1803300271.png',
            'https://assets.myntassets.com/assets/images/2023/8/4/944486f4-8cf8-456e-a0d5-c2655bf1deaa1691131597834-image_png_1935947130.png',
        ],
    },
    {
        id: 'shop-by-category',
        title: 'SHOP BY CATEGORY',
        href: '/',
        layout: 'category',
        images: (categoriesArr as readonly { img: string }[]).map(
            (item) => item.img,
        ),
    },
];

const catalog = {
    men: normalizeProducts(
        menProducts as unknown as readonly RawProduct[],
        'men',
    ),
    women: normalizeProducts(
        womenProducts as unknown as readonly RawProduct[],
        'women',
    ),
    'home-living': normalizeProducts(
        homeLivingProducts as unknown as readonly RawProduct[],
        'home-living',
    ),
} satisfies Record<StorefrontCategory, StorefrontProduct[]>;

export const getCategoryLabel = (category: string) => {
    switch (category) {
        case 'men':
            return 'Men';
        case 'women':
            return 'Women';
        case 'home-living':
            return 'Home & Living';
        default:
            return 'Storefront';
    }
};

export const getProductsForCategory = (category: string) => {
    if (category in catalog) {
        return catalog[category as StorefrontCategory];
    }

    return [] as StorefrontProduct[];
};

export const getAllProducts = () => {
    return Object.values(catalog).flat();
};

export const findProductById = (id: string) => {
    return getAllProducts().find((product) => product.id === id) ?? null;
};
