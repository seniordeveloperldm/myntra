<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Support\AdminMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/catalog', [
            'categories' => Category::query()
                ->withCount('products')
                ->orderBy('name')
                ->get()
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'department' => $category->department,
                    'description' => $category->description,
                    'image_path' => $category->image_path,
                    'is_active' => $category->is_active,
                    'products_count' => $category->products_count,
                ])
                ->all(),
            'brands' => Brand::query()
                ->withCount('products')
                ->orderBy('name')
                ->get()
                ->map(fn (Brand $brand) => [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'logo_url' => $brand->logo_url,
                    'is_active' => $brand->is_active,
                    'products_count' => $brand->products_count,
                ])
                ->all(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $this->validateCategory($request);

        Category::create($this->categoryPayload($request, $validated));

        return back()->with('success', 'Category created successfully.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        $validated = $this->validateCategory($request, $category);

        $category->update($this->categoryPayload($request, $validated, $category));

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'Category has linked products. Reassign or delete those products first.');
        }

        AdminMedia::deleteManagedImages($category->image_path);
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }

    public function quickStoreCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'quick_category_name' => ['required', 'string', 'max:255'],
            'quick_category_slug' => ['nullable', 'string', 'max:255', Rule::unique(Category::class, 'slug')],
            'quick_category_department' => ['nullable', 'string', 'max:255'],
            'quick_category_description' => ['nullable', 'string'],
        ]);

        $category = Category::create([
            'name' => $validated['quick_category_name'],
            'slug' => $validated['quick_category_slug'] ?: $this->uniqueSlug(Category::class, Str::slug($validated['quick_category_name'])),
            'department' => $validated['quick_category_department'] ?: null,
            'description' => $validated['quick_category_description'] ?: null,
            'is_active' => true,
        ]);

        return back()
            ->with('success', 'Category created successfully. You can use it right away.')
            ->with('created_category_id', $category->id)
            ->with('created_category_name', $category->name);
    }

    public function storeBrand(Request $request): RedirectResponse
    {
        $validated = $this->validateBrand($request);

        Brand::create($this->brandPayload($validated));

        return back()->with('success', 'Brand created successfully.');
    }

    public function updateBrand(Request $request, Brand $brand): RedirectResponse
    {
        $validated = $this->validateBrand($request, $brand);

        $brand->update($this->brandPayload($validated, $brand));

        return back()->with('success', 'Brand updated successfully.');
    }

    public function destroyBrand(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            return back()->with('error', 'Brand has linked products. Update products first before deleting the brand.');
        }

        $brand->delete();

        return back()->with('success', 'Brand deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCategory(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(Category::class, 'slug')->ignore($category?->id),
            ],
            'department' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:2048'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateBrand(Request $request, ?Brand $brand = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(Brand::class, 'slug')->ignore($brand?->id),
            ],
            'logo_url' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function categoryPayload(Request $request, array $validated, ?Category $category = null): array
    {
        $imagePath = $request->file('image_file')
            ? AdminMedia::storeUploadedImage($request->file('image_file'), 'categories')
            : ($validated['image_path'] ?: $category?->image_path);

        if ($category && $category->image_path !== $imagePath) {
            AdminMedia::deleteManagedImages($category->image_path);
        }

        return [
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?: $this->uniqueSlug(Category::class, Str::slug($validated['name']), $category?->id),
            'department' => $validated['department'] ?: null,
            'description' => $validated['description'] ?: null,
            'image_path' => $imagePath,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function brandPayload(array $validated, ?Brand $brand = null): array
    {
        return [
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?: $this->uniqueSlug(Brand::class, Str::slug($validated['name']), $brand?->id),
            'logo_url' => $validated['logo_url'] ?: null,
            'is_active' => (bool) ($validated['is_active'] ?? false),
        ];
    }

    private function uniqueSlug(string $modelClass, string $base, ?int $ignoreId = null): string
    {
        $slug = $base !== '' ? $base : 'item';
        $candidate = $slug;
        $suffix = 2;

        while ($modelClass::query()
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = "{$slug}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
