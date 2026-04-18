<?php

namespace App\Support;

use App\Models\Address;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class StorefrontData
{
    /**
     * @return array<int, array{key: string, label: string}>
     */
    public static function paymentMethods(): array
    {
        return [
            ['key' => 'cod', 'label' => 'Cash On Delivery (Cash/Card/UPI)'],
            ['key' => 'card', 'label' => 'Credit/Debit Card'],
            ['key' => 'upi', 'label' => 'PhonePe/Google Pay/BHIM UPI'],
            ['key' => 'wallet', 'label' => 'Paytm/Payzapp/Wallets'],
            ['key' => 'netbanking', 'label' => 'Net Banking'],
            ['key' => 'emi', 'label' => 'EMI/Pay Later'],
        ];
    }

    public static function paymentMethodLabel(string $key): string
    {
        return collect(self::paymentMethods())
            ->firstWhere('key', $key)['label'] ?? 'Payment';
    }

    /**
     * @return array<string, int>
     */
    public static function sharedState(?User $user): array
    {
        if (! $user) {
            return [
                'cartCount' => 0,
                'wishlistCount' => 0,
            ];
        }

        $cart = $user->cart()->first();
        $cartCount = $cart ? (int) $cart->items()->sum('quantity') : 0;

        return [
            'cartCount' => $cartCount,
            'wishlistCount' => $user->wishlistItems()->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function product(Product $product): array
    {
        $originalPrice = $product->compare_at_price ?? $product->price;
        $discountPercentage = $product->discount_percentage > 0
            ? $product->discount_percentage
            : self::calculateDiscountPercentage($product->price, $originalPrice);

        return [
            'id' => $product->id,
            'slug' => $product->slug,
            'category' => $product->category?->slug,
            'brand' => $product->brand?->name ?? 'Myntra',
            'name' => $product->name,
            'image' => $product->primary_image,
            'gallery' => $product->gallery ?: [$product->primary_image],
            'price' => $product->price,
            'priceLabel' => self::formatRupees($product->price),
            'originalPrice' => $originalPrice,
            'originalPriceLabel' => self::formatRupees($originalPrice),
            'offer' => $discountPercentage > 0 ? sprintf('(%s%% OFF)', $discountPercentage) : '',
            'categoryLabel' => $product->category?->name ?? 'Fashion',
            'shortDescription' => $product->short_description,
            'description' => $product->description,
            'rating' => number_format($product->rating, 1),
            'reviewCount' => $product->review_count,
            'reviewLabel' => self::formatCompactCount($product->review_count),
            'stock' => $product->stock,
            'deliveryPromise' => 'Usually delivered in 2-4 business days',
        ];
    }

    /**
     * @param  iterable<Product>  $products
     * @return array<int, array<string, mixed>>
     */
    public static function products(iterable $products): array
    {
        return collect($products)
            ->map(fn (Product $product) => self::product($product))
            ->values()
            ->all();
    }

    /**
     * @param  iterable<CartItem>  $items
     * @return array<int, array<string, mixed>>
     */
    public static function cartItems(iterable $items): array
    {
        return collect($items)
            ->map(function (CartItem $item) {
                $lineTotal = $item->unit_price * $item->quantity;

                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'subtotal' => $lineTotal,
                    'subtotalLabel' => self::formatRupees($lineTotal),
                    'product' => self::product($item->product),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  iterable<CartItem>  $items
     * @return array<string, int|string|null>
     */
    public static function cartSummary(iterable $items, ?string $promoCode = null): array
    {
        $collection = $items instanceof Collection ? $items : collect($items);

        $itemCount = (int) $collection->sum('quantity');
        $mrp = (int) $collection->sum(
            fn (CartItem $item) => ($item->compare_at_price ?? $item->unit_price) * $item->quantity
        );
        $amount = (int) $collection->sum(
            fn (CartItem $item) => $item->unit_price * $item->quantity
        );
        $productDiscount = max($mrp - $amount, 0);
        $promoDiscount = self::promoDiscount($promoCode, $amount);
        $payable = max($amount - $promoDiscount, 0);

        return [
            'itemCount' => $itemCount,
            'mrp' => $mrp,
            'amount' => $amount,
            'productDiscount' => $productDiscount,
            'promoDiscount' => $promoDiscount,
            'payable' => $payable,
            'appliedPromo' => $promoDiscount > 0 ? 'MYNTRA300' : null,
        ];
    }

    public static function promoDiscount(?string $promoCode, int $amount): int
    {
        if (strtoupper((string) $promoCode) !== 'MYNTRA300') {
            return 0;
        }

        return $amount > 300 ? 300 : 0;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function address(?Address $address): ?array
    {
        if (! $address) {
            return null;
        }

        return [
            'id' => $address->id,
            'label' => $address->label,
            'fullName' => $address->full_name,
            'mobile' => $address->phone,
            'street' => $address->line_1,
            'street2' => $address->line_2,
            'city' => $address->city,
            'state' => $address->state,
            'pinCode' => $address->postal_code,
            'country' => $address->country,
            'isDefault' => $address->is_default,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function order(Order $order): array
    {
        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'status' => $order->status,
            'paymentMethod' => self::paymentMethodLabel($order->payment_method),
            'paymentStatus' => $order->payment_status,
            'placedAt' => optional($order->placed_at)->toDayDateTimeString(),
            'customerName' => $order->customer_name,
            'totalAmount' => $order->total_amount,
            'totalAmountLabel' => self::formatRupees($order->total_amount),
            'shippingAddress' => $order->shipping_address,
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->product_name,
                'brand' => $item->brand_name,
                'image' => $item->product_image,
                'quantity' => $item->quantity,
                'lineTotalLabel' => self::formatRupees($item->line_total),
            ])->values()->all(),
        ];
    }

    public static function formatRupees(int $value): string
    {
        return 'Rs. '.number_format($value);
    }

    private static function calculateDiscountPercentage(int $price, int $originalPrice): int
    {
        if ($originalPrice <= 0 || $originalPrice <= $price) {
            return 0;
        }

        return (int) round((($originalPrice - $price) / $originalPrice) * 100);
    }

    private static function formatCompactCount(int $value): string
    {
        if ($value >= 1000) {
            $precision = $value >= 10000 ? 0 : 1;

            return rtrim(rtrim(number_format($value / 1000, $precision), '0'), '.').'k';
        }

        return (string) $value;
    }
}
