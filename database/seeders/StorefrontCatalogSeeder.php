<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StorefrontCatalogSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = collect([
            [
                'name' => 'Men',
                'slug' => 'men',
                'department' => 'Fashion',
                'description' => 'Trend-forward menswear inspired by Myntra storefront flows.',
            ],
            [
                'name' => 'Women',
                'slug' => 'women',
                'department' => 'Fashion',
                'description' => 'Curated women styles across western, festive, and daily wear.',
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'department' => 'Lifestyle',
                'description' => 'Decor, bedding, and home upgrades for premium storefront browsing.',
            ],
        ])->mapWithKeys(function (array $category) {
            $model = Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );

            return [$category['slug'] => $model];
        });

        $brands = collect([
            'Roadster',
            'U.S. Polo Assn.',
            'HIGHLANDER',
            'Puma',
            'Anouk',
            'Libas',
            'Tokyo Talkies',
            'Mast & Harbour',
            'DDecor',
            'Spaces',
            'House of Pataudi',
            'H&M',
        ])->mapWithKeys(function (string $name) {
            $model = Brand::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );

            return [$name => $model];
        });

        $products = [
            [
                'category' => 'men',
                'brand' => 'Roadster',
                'name' => 'Slim Fit Checked Casual Shirt',
                'price' => 899,
                'compare_at_price' => 1999,
                'stock' => 18,
                'rating' => 4.3,
                'review_count' => 18423,
                'is_featured' => true,
                'short_description' => 'Breathable cotton shirt for everyday styling.',
                'description' => 'Soft-touch cotton construction with a modern slim fit and versatile checks for work-to-weekend dressing.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/19913732/2022/9/12/7f4e0a88-a3f4-4821-b6b1-c4fd28f8a4631662963431242RoadsterMenBlueSlimFitCheckedCasualShirt1.jpg',
            ],
            [
                'category' => 'men',
                'brand' => 'U.S. Polo Assn.',
                'name' => 'Pure Cotton Polo T-Shirt',
                'price' => 1099,
                'compare_at_price' => 2199,
                'stock' => 22,
                'rating' => 4.4,
                'review_count' => 9321,
                'is_featured' => true,
                'short_description' => 'Signature polo with everyday premium comfort.',
                'description' => 'A soft premium cotton polo finished with a contrast collar and iconic pony branding.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/24670152/2023/8/28/f83863c5-f463-4b41-9a17-fdd4fd7e88411693204237626USPoloAssnMenTshirts1.jpg',
            ],
            [
                'category' => 'men',
                'brand' => 'Puma',
                'name' => 'Velocity Nitro Running Shoes',
                'price' => 3499,
                'compare_at_price' => 6999,
                'stock' => 12,
                'rating' => 4.6,
                'review_count' => 4211,
                'short_description' => 'High-cushion running pair built for everyday training.',
                'description' => 'Responsive cushioning, engineered upper support, and durable grip for road sessions and gym transitions.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/23918346/2023/7/7/8dc1dc34-5b3a-4dcb-bbaf-ff9c0d913d5a1688735363840PumaMenBlackRunningShoes1.jpg',
            ],
            [
                'category' => 'men',
                'brand' => 'HIGHLANDER',
                'name' => 'Tapered Fit Distressed Jeans',
                'price' => 1299,
                'compare_at_price' => 2599,
                'stock' => 16,
                'rating' => 4.1,
                'review_count' => 6804,
                'short_description' => 'Stretch denim with a sharp tapered silhouette.',
                'description' => 'Mid-rise jeans crafted for daily comfort with faded wash detailing and all-day movement.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/17037474/2022/2/3/8eb6c15d-a737-4f8d-8f90-52e0f70f91371643880498438HIGHLANDERMenBlueTaperedFitMid-RiseCleanLookStretchableJeans1.jpg',
            ],
            [
                'category' => 'women',
                'brand' => 'Anouk',
                'name' => 'Floral Printed A-Line Kurta',
                'price' => 1199,
                'compare_at_price' => 2499,
                'stock' => 20,
                'rating' => 4.5,
                'review_count' => 11204,
                'is_featured' => true,
                'short_description' => 'Festive-ready kurta with effortless everyday wearability.',
                'description' => 'Printed straight silhouette with elegant floral motifs and soft fabric for long festive days.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/27988434/2024/3/11/df2f09c3-3676-4370-bbf4-b27023f6350f1710140170259AnoukWomenFloralPrintedRegularPureCottonKurta1.jpg',
            ],
            [
                'category' => 'women',
                'brand' => 'Libas',
                'name' => 'Embroidered Kurta with Trousers',
                'price' => 1899,
                'compare_at_price' => 3799,
                'stock' => 14,
                'rating' => 4.4,
                'review_count' => 8732,
                'is_featured' => true,
                'short_description' => 'Elegant ethnic set for celebrations and occasion wear.',
                'description' => 'A polished kurta set with tonal embroidery, straight trousers, and refined festive appeal.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/25436664/2023/10/17/5a28d32d-c9e7-4609-b5d9-8f647ddf8a4c1697520484968LibasWomenEmbroideredRegularKurtaWithTrousers1.jpg',
            ],
            [
                'category' => 'women',
                'brand' => 'Tokyo Talkies',
                'name' => 'Bodycon Midi Dress',
                'price' => 999,
                'compare_at_price' => 1999,
                'stock' => 25,
                'rating' => 4.2,
                'review_count' => 5230,
                'short_description' => 'Smart evening silhouette with a flattering fit.',
                'description' => 'A stretch-knit midi dress designed for elevated evening dressing, brunches, and event styling.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/27255266/2024/2/2/e9ab0af0-4842-462f-b966-72b6b5480bec1706873729728TokyoTalkiesWomenBodyconDress1.jpg',
            ],
            [
                'category' => 'women',
                'brand' => 'H&M',
                'name' => 'Wide Leg High-Rise Trousers',
                'price' => 1499,
                'compare_at_price' => 2999,
                'stock' => 17,
                'rating' => 4.3,
                'review_count' => 3119,
                'short_description' => 'Minimal wardrobe essential with premium drape.',
                'description' => 'Tailored wide-leg trousers with a clean high-rise finish for workwear and smart casual outfits.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/27178758/2024/2/1/66e59448-0f14-4fe1-8f5a-6022bd6767f31706790369548HMWomenTrousers1.jpg',
            ],
            [
                'category' => 'home-living',
                'brand' => 'DDecor',
                'name' => 'Printed 144 TC Double Bedsheet Set',
                'price' => 1399,
                'compare_at_price' => 2799,
                'stock' => 28,
                'rating' => 4.4,
                'review_count' => 2910,
                'is_featured' => true,
                'short_description' => 'Premium bedding refresh for modern bedrooms.',
                'description' => 'A soft double bedsheet set with coordinated pillow covers and vibrant printed styling.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/29207322/2024/5/3/e0aa350f-7584-4c97-a1f5-5f7d2d2a32a21714716637917DDecorBedsheet1.jpg',
            ],
            [
                'category' => 'home-living',
                'brand' => 'Spaces',
                'name' => '100% Cotton Bath Towel Set',
                'price' => 899,
                'compare_at_price' => 1799,
                'stock' => 34,
                'rating' => 4.1,
                'review_count' => 1874,
                'short_description' => 'Soft absorbent towel set for daily luxury.',
                'description' => 'Plush, quick-drying cotton towels built for daily use with a clean premium finish.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/21691228/2023/1/30/a7e825e6-9cf9-438a-8e2b-5fd7ed661dc91675062001013SPACESCottonBathTowels1.jpg',
            ],
            [
                'category' => 'home-living',
                'brand' => 'House of Pataudi',
                'name' => 'Decorative Cushion Cover Set',
                'price' => 699,
                'compare_at_price' => 1499,
                'stock' => 30,
                'rating' => 4.0,
                'review_count' => 1462,
                'short_description' => 'Accent cushion covers to elevate your living room.',
                'description' => 'Textured decorative cushion covers with luxe detailing and an easy-match neutral palette.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/27919198/2024/3/8/3af6a261-a6fc-47af-9d2c-1e2b6d5d3f4d1709895804805HouseofPataudiCushionCover1.jpg',
            ],
            [
                'category' => 'home-living',
                'brand' => 'Spaces',
                'name' => 'Blackout Window Curtain Pair',
                'price' => 1599,
                'compare_at_price' => 3199,
                'stock' => 11,
                'rating' => 4.2,
                'review_count' => 956,
                'short_description' => 'Room-darkening curtains with a tailored fall.',
                'description' => 'Noise-softening blackout curtains with subtle texture and generous coverage for modern homes.',
                'primary_image' => 'https://assets.myntassets.com/f_webp,w_412,c_limit,fl_progressive,dpr_2/assets/images/24085862/2023/7/18/b895d7c9-0f90-4aa7-88f2-6d6850df3c261689675151978SPACESCurtains1.jpg',
            ],
        ];

        foreach ($products as $index => $product) {
            $category = $categories[$product['category']];
            $brand = $brands[$product['brand']];
            $slug = Str::slug($product['name']).'-'.($index + 1);

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $category->id,
                    'brand_id' => $brand->id,
                    'name' => $product['name'],
                    'slug' => $slug,
                    'sku' => strtoupper('MYNTRA-'.Str::slug($category->slug.'-'.$brand->slug.'-'.($index + 1), '-')),
                    'short_description' => $product['short_description'],
                    'description' => $product['description'],
                    'primary_image' => $product['primary_image'],
                    'gallery' => [$product['primary_image']],
                    'price' => $product['price'],
                    'compare_at_price' => $product['compare_at_price'],
                    'stock' => $product['stock'],
                    'discount_percentage' => (int) round((($product['compare_at_price'] - $product['price']) / $product['compare_at_price']) * 100),
                    'rating' => $product['rating'],
                    'review_count' => $product['review_count'],
                    'is_active' => true,
                    'is_featured' => $product['is_featured'] ?? false,
                ],
            );
        }
    }
}
