<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\AdminMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $categoryId = $request->integer('category_id');
        $brandId = $request->integer('brand_id');

        $products = Product::query()
            ->with(['category:id,name,slug', 'brand:id,name,slug'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($categoryId > 0, fn ($query) => $query->where('category_id', $categoryId))
            ->when($brandId > 0, fn ($query) => $query->where('brand_id', $brandId))
            ->latest()
            ->get()
            ->map(fn (Product $product) => $this->serializeProduct($product))
            ->all();

        return Inertia::render('admin/products', [
            'products' => $products,
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->all(),
            'brands' => Brand::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->all(),
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId > 0 ? $categoryId : null,
                'brand_id' => $brandId > 0 ? $brandId : null,
            ],
            'metrics' => [
                'totalProducts' => Product::count(),
                'activeProducts' => Product::where('is_active', true)->count(),
                'featuredProducts' => Product::where('is_featured', true)->count(),
                'lowStockProducts' => Product::where('stock', '<=', 5)->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePayload($request);

        Product::create($this->payload($request, $validated));

        return back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validatePayload($request, $product);

        $product->update($this->payload($request, $validated, $product));

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        AdminMedia::deleteManagedImages([
            $product->primary_image,
            ...($product->gallery ?? []),
        ]);

        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(Product::class, 'slug')->ignore($product?->id),
            ],
            'sku' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(Product::class, 'sku')->ignore($product?->id),
            ],
            'short_description' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'primary_image' => ['nullable', 'string', 'max:2048'],
            'primary_image_file' => ['nullable', 'image', 'max:5120'],
            'gallery_input' => ['nullable', 'string'],
            'gallery_files' => ['nullable', 'array'],
            'gallery_files.*' => ['nullable', 'image', 'max:5120'],
            'price' => ['required', 'integer', 'min:0'],
            'compare_at_price' => ['nullable', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'review_count' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function payload(Request $request, array $validated, ?Product $product = null): array
    {
        $slugBase = Str::slug((string) ($validated['slug'] ?: $validated['name']));
        $slug = $this->uniqueSlug($slugBase, $product?->id);
        $price = (int) $validated['price'];
        $compareAtPrice = isset($validated['compare_at_price']) && $validated['compare_at_price'] !== null
            ? (int) $validated['compare_at_price']
            : null;
        $discountPercentage = isset($validated['discount_percentage']) && $validated['discount_percentage'] !== null
            ? (int) $validated['discount_percentage']
            : ($compareAtPrice && $compareAtPrice > $price
                ? (int) round((($compareAtPrice - $price) / $compareAtPrice) * 100)
                : 0);

        $galleryFromInput = collect(preg_split('/\r\n|\r|\n|,/', (string) ($validated['gallery_input'] ?? '')))
            ->map(fn ($item) => trim((string) $item))
            ->filter()
            ->values()
            ->all();

        $galleryFromUploads = collect($request->file('gallery_files', []))
            ->filter()
            ->map(fn ($file) => AdminMedia::storeUploadedImage($file, 'products/gallery'))
            ->values()
            ->all();

        $uploadedPrimaryImage = $request->file('primary_image_file');

        $primaryImage = $uploadedPrimaryImage
            ? AdminMedia::storeUploadedImage($uploadedPrimaryImage, 'products')
            : ($validated['primary_image'] ?: $product?->primary_image);

        if (! $primaryImage && $galleryFromUploads !== []) {
            $primaryImage = $galleryFromUploads[0];
        }

        if (! $primaryImage) {
            throw ValidationException::withMessages([
                'primary_image' => 'Upload a primary image or paste a valid image URL.',
            ]);
        }

        $gallery = collect([...$galleryFromInput, ...$galleryFromUploads])
            ->prepend($primaryImage)
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($product) {
            $previousImages = collect([$product->primary_image, ...($product->gallery ?? [])])
                ->filter()
                ->unique()
                ->values()
                ->all();

            $nextImages = collect([$primaryImage, ...$gallery])
                ->filter()
                ->unique()
                ->values()
                ->all();

            AdminMedia::deleteManagedImages(array_values(array_diff($previousImages, $nextImages)));
        }

        return [
            'category_id' => (int) $validated['category_id'],
            'brand_id' => isset($validated['brand_id']) && $validated['brand_id'] !== null ? (int) $validated['brand_id'] : null,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => $validated['sku'] ?: $this->uniqueSku($product?->id),
            'short_description' => $validated['short_description'] ?: null,
            'description' => $validated['description'] ?: null,
            'primary_image' => $primaryImage,
            'gallery' => $gallery,
            'price' => $price,
            'compare_at_price' => $compareAtPrice,
            'stock' => (int) $validated['stock'],
            'discount_percentage' => $discountPercentage,
            'rating' => isset($validated['rating']) && $validated['rating'] !== null ? (float) $validated['rating'] : 4.2,
            'review_count' => isset($validated['review_count']) && $validated['review_count'] !== null ? (int) $validated['review_count'] : 0,
            'is_active' => (bool) ($validated['is_active'] ?? false),
            'is_featured' => (bool) ($validated['is_featured'] ?? false),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base !== '' ? $base : 'product';
        $candidate = $slug;
        $suffix = 2;

        while (Product::query()
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = "{$slug}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }

    private function uniqueSku(?int $ignoreId = null): string
    {
        do {
            $candidate = 'MYNTRA-'.Str::upper(Str::random(8));
        } while (Product::query()
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('sku', $candidate)
            ->exists());

        return $candidate;
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'short_description' => $product->short_description,
            'description' => $product->description,
            'primary_image' => $product->primary_image,
            'gallery_input' => implode(",\n", $product->gallery ?? []),
            'price' => $product->price,
            'compare_at_price' => $product->compare_at_price,
            'stock' => $product->stock,
            'discount_percentage' => $product->discount_percentage,
            'rating' => $product->rating,
            'review_count' => $product->review_count,
            'is_active' => $product->is_active,
            'is_featured' => $product->is_featured,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id,
            'category' => $product->category?->name,
            'brand' => $product->brand?->name,
        ];
    }
}
