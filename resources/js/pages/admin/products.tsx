import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AdminFlashBanner } from '@/components/admin/admin-flash-banner';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProductRecord = {
    id: number;
    name: string;
    slug: string;
    sku: string;
    short_description?: string | null;
    description?: string | null;
    primary_image: string;
    gallery_input: string;
    price: number;
    compare_at_price?: number | null;
    stock: number;
    discount_percentage: number;
    rating: number;
    review_count: number;
    is_active: boolean;
    is_featured: boolean;
    category_id: number;
    brand_id?: number | null;
    category?: string | null;
    brand?: string | null;
};

type LookupOption = {
    id: number;
    name: string;
    slug: string;
};

type Filters = {
    search: string;
    category_id?: number | null;
    brand_id?: number | null;
};

type Metrics = {
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    lowStockProducts: number;
};

type ProductFormState = {
    name: string;
    slug: string;
    sku: string;
    short_description: string;
    description: string;
    primary_image: string;
    gallery_input: string;
    price: string;
    compare_at_price: string;
    stock: string;
    discount_percentage: string;
    rating: string;
    review_count: string;
    category_id: string;
    brand_id: string;
    is_active: boolean;
    is_featured: boolean;
};

type QuickCategoryFormState = {
    name: string;
    slug: string;
    department: string;
    description: string;
};

const emptyForm: ProductFormState = {
    name: '',
    slug: '',
    sku: '',
    short_description: '',
    description: '',
    primary_image: '',
    gallery_input: '',
    price: '',
    compare_at_price: '',
    stock: '0',
    discount_percentage: '',
    rating: '4.2',
    review_count: '0',
    category_id: '',
    brand_id: '',
    is_active: true,
    is_featured: false,
};

const emptyQuickCategoryForm: QuickCategoryFormState = {
    name: '',
    slug: '',
    department: '',
    description: '',
};

const metricCards = [
    { key: 'totalProducts', label: 'Total Products' },
    { key: 'activeProducts', label: 'Active Products' },
    { key: 'featuredProducts', label: 'Featured' },
    { key: 'lowStockProducts', label: 'Low Stock' },
] as const;

const inputClassName =
    'rounded-2xl border-[#ebe8f0] bg-white shadow-none focus-visible:ring-[#ff3f6c]/20';

export default function AdminProducts({
    products,
    categories,
    brands,
    filters,
    metrics,
}: {
    products: ProductRecord[];
    categories: LookupOption[];
    brands: LookupOption[];
    filters: Filters;
    metrics: Metrics;
}) {
    const page = usePage().props as {
        errors?: Record<string, string>;
        flash?: {
            createdCategoryId?: number | null;
            createdCategoryName?: string | null;
        };
    };
    const errors = page.errors ?? {};
    const flash = page.flash;
    const [form, setForm] = useState<ProductFormState>(emptyForm);
    const [editingProductId, setEditingProductId] = useState<number | null>(
        null,
    );
    const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [primaryImagePreview, setPrimaryImagePreview] = useState('');
    const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
    const [quickCategoryForm, setQuickCategoryForm] =
        useState<QuickCategoryFormState>(emptyQuickCategoryForm);
    const [productFilters, setProductFilters] = useState({
        search: filters.search ?? '',
        category_id: filters.category_id ? String(filters.category_id) : '',
        brand_id: filters.brand_id ? String(filters.brand_id) : '',
    });

    useEffect(() => {
        setProductFilters({
            search: filters.search ?? '',
            category_id: filters.category_id ? String(filters.category_id) : '',
            brand_id: filters.brand_id ? String(filters.brand_id) : '',
        });
    }, [filters]);

    useEffect(() => {
        if (!primaryImageFile) {
            setPrimaryImagePreview(form.primary_image);

            return;
        }

        const objectUrl = URL.createObjectURL(primaryImageFile);
        setPrimaryImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [primaryImageFile, form.primary_image]);

    useEffect(() => {
        if (!flash?.createdCategoryId) {
            return;
        }

        setForm((current) => ({
            ...current,
            category_id: String(flash.createdCategoryId),
        }));
        setShowQuickCategoryForm(false);
        setQuickCategoryForm(emptyQuickCategoryForm);
    }, [flash?.createdCategoryId]);

    const setField = (
        field: keyof ProductFormState,
        value: string | boolean,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingProductId(null);
        setPrimaryImageFile(null);
        setGalleryFiles([]);
    };

    const startEditing = (product: ProductRecord) => {
        setEditingProductId(product.id);
        setForm({
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            short_description: product.short_description ?? '',
            description: product.description ?? '',
            primary_image: product.primary_image,
            gallery_input: product.gallery_input,
            price: String(product.price),
            compare_at_price: product.compare_at_price
                ? String(product.compare_at_price)
                : '',
            stock: String(product.stock),
            discount_percentage: String(product.discount_percentage),
            rating: String(product.rating),
            review_count: String(product.review_count),
            category_id: String(product.category_id),
            brand_id: product.brand_id ? String(product.brand_id) : '',
            is_active: product.is_active,
            is_featured: product.is_featured,
        });
        setPrimaryImageFile(null);
        setGalleryFiles([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const serializeForm = () => ({
        ...form,
        category_id: Number(form.category_id),
        brand_id: form.brand_id ? Number(form.brand_id) : null,
        price: Number(form.price || 0),
        compare_at_price: form.compare_at_price
            ? Number(form.compare_at_price)
            : null,
        stock: Number(form.stock || 0),
        discount_percentage: form.discount_percentage
            ? Number(form.discount_percentage)
            : null,
        rating: form.rating ? Number(form.rating) : null,
        review_count: form.review_count ? Number(form.review_count) : null,
        is_active: form.is_active ? 1 : 0,
        is_featured: form.is_featured ? 1 : 0,
    });

    const submit = () => {
        const payload = {
            ...serializeForm(),
            primary_image_file: primaryImageFile ?? undefined,
            gallery_files: galleryFiles.length > 0 ? galleryFiles : undefined,
        };

        if (editingProductId) {
            router.post(
                `/admin/products/${editingProductId}`,
                {
                    ...payload,
                    _method: 'patch',
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => resetForm(),
                },
            );

            return;
        }

        router.post('/admin/products', payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => resetForm(),
        });
    };

    const setQuickCategoryField = (
        field: keyof QuickCategoryFormState,
        value: string,
    ) => {
        setQuickCategoryForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submitQuickCategory = () => {
        router.post(
            '/admin/categories/quick',
            {
                quick_category_name: quickCategoryForm.name,
                quick_category_slug: quickCategoryForm.slug || null,
                quick_category_department: quickCategoryForm.department || null,
                quick_category_description:
                    quickCategoryForm.description || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => setQuickCategoryForm(emptyQuickCategoryForm),
            },
        );
    };

    const applyFilters = () => {
        router.get(
            '/admin/products',
            {
                search: productFilters.search || undefined,
                category_id: productFilters.category_id || undefined,
                brand_id: productFilters.brand_id || undefined,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Product Management" />

            <div className="flex flex-col gap-6 p-4">
                <section className="rounded-[28px] border border-[#ece8ef] bg-[linear-gradient(135deg,#fff5f8_0%,#ffffff_48%,#f7fbff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                        Product Studio
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#161b2d]">
                        Manage Myntra catalog inventory
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#687086]">
                        Create products, update pricing, control featured
                        visibility, and keep stock levels ready for storefront
                        sales.
                    </p>
                </section>

                <AdminFlashBanner />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((card) => (
                        <article
                            key={card.key}
                            className="rounded-[24px] border border-[#ece9f0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                        >
                            <p className="text-sm font-medium text-[#687086]">
                                {card.label}
                            </p>
                            <p className="mt-4 text-3xl font-semibold text-[#161b2d]">
                                {new Intl.NumberFormat('en-IN').format(
                                    metrics[card.key],
                                )}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    {editingProductId
                                        ? 'Edit Product'
                                        : 'Create Product'}
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    {editingProductId
                                        ? 'Update catalog listing'
                                        : 'Add a new catalog listing'}
                                </h2>
                            </div>
                            {editingProductId ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-2xl"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            ) : null}
                        </div>

                        <div className="mt-6 grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="product-name">
                                    Product name
                                </Label>
                                <Input
                                    id="product-name"
                                    className={inputClassName}
                                    value={form.name}
                                    onChange={(event) =>
                                        setField('name', event.target.value)
                                    }
                                    placeholder="Oversized graphic t-shirt"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor="product-category">
                                            Category
                                        </Label>
                                        <button
                                            type="button"
                                            className="text-sm font-medium text-[#ff3f6c]"
                                            onClick={() =>
                                                setShowQuickCategoryForm(
                                                    (current) => !current,
                                                )
                                            }
                                        >
                                            {showQuickCategoryForm
                                                ? 'Hide create category'
                                                : 'Create category'}
                                        </button>
                                    </div>
                                    <select
                                        id="product-category"
                                        className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                        value={form.category_id}
                                        onChange={(event) =>
                                            setField(
                                                'category_id',
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                    {flash?.createdCategoryName ? (
                                        <p className="text-xs font-medium text-[#1b8f52]">
                                            New category selected:{' '}
                                            {flash.createdCategoryName}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-brand">Brand</Label>
                                    <select
                                        id="product-brand"
                                        className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                        value={form.brand_id}
                                        onChange={(event) =>
                                            setField(
                                                'brand_id',
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="">No brand</option>
                                        {brands.map((brand) => (
                                            <option
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.brand_id} />
                                </div>
                            </div>

                            {showQuickCategoryForm ? (
                                <div className="grid gap-4 rounded-[24px] border border-[#ffdce6] bg-[#fff8fa] p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-[#161b2d]">
                                                Create category without leaving
                                                product setup
                                            </p>
                                            <p className="text-sm text-[#687086]">
                                                Add a basic category now. It
                                                will appear in the dropdown
                                                after save.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="rounded-2xl"
                                            onClick={() =>
                                                setShowQuickCategoryForm(false)
                                            }
                                        >
                                            Close
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="quick-category-name">
                                                Category name
                                            </Label>
                                            <Input
                                                id="quick-category-name"
                                                className={inputClassName}
                                                value={quickCategoryForm.name}
                                                onChange={(event) =>
                                                    setQuickCategoryField(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Kids"
                                            />
                                            <InputError
                                                message={
                                                    errors.quick_category_name
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quick-category-slug">
                                                Slug
                                            </Label>
                                            <Input
                                                id="quick-category-slug"
                                                className={inputClassName}
                                                value={quickCategoryForm.slug}
                                                onChange={(event) =>
                                                    setQuickCategoryField(
                                                        'slug',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Auto-generated if blank"
                                            />
                                            <InputError
                                                message={
                                                    errors.quick_category_slug
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="quick-category-department">
                                                Department
                                            </Label>
                                            <Input
                                                id="quick-category-department"
                                                className={inputClassName}
                                                value={
                                                    quickCategoryForm.department
                                                }
                                                onChange={(event) =>
                                                    setQuickCategoryField(
                                                        'department',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Fashion"
                                            />
                                            <InputError
                                                message={
                                                    errors.quick_category_department
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quick-category-description">
                                                Description
                                            </Label>
                                            <Input
                                                id="quick-category-description"
                                                className={inputClassName}
                                                value={
                                                    quickCategoryForm.description
                                                }
                                                onChange={(event) =>
                                                    setQuickCategoryField(
                                                        'description',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Quick merchandising note"
                                            />
                                            <InputError
                                                message={
                                                    errors.quick_category_description
                                                }
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        className="w-fit rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                        onClick={submitQuickCategory}
                                    >
                                        Save Category
                                    </Button>
                                </div>
                            ) : null}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="product-slug">Slug</Label>
                                    <Input
                                        id="product-slug"
                                        className={inputClassName}
                                        value={form.slug}
                                        onChange={(event) =>
                                            setField('slug', event.target.value)
                                        }
                                        placeholder="Auto-generated if blank"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-sku">SKU</Label>
                                    <Input
                                        id="product-sku"
                                        className={inputClassName}
                                        value={form.sku}
                                        onChange={(event) =>
                                            setField('sku', event.target.value)
                                        }
                                        placeholder="Auto-generated if blank"
                                    />
                                    <InputError message={errors.sku} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="product-image">
                                        Primary image
                                    </Label>
                                    <span className="text-xs font-medium text-[#687086]">
                                        Upload file or paste URL
                                    </span>
                                </div>
                                <div className="grid gap-4 rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4">
                                    {primaryImagePreview ? (
                                        <div className="overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                            <img
                                                src={primaryImagePreview}
                                                alt="Primary preview"
                                                className="h-52 w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#d9ddea] bg-white text-sm text-[#7b8398]">
                                            Product image preview will appear
                                            here
                                        </div>
                                    )}

                                    <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                                        <div className="grid gap-2">
                                            <Label htmlFor="product-image-upload">
                                                Upload image file
                                            </Label>
                                            <input
                                                id="product-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="block w-full rounded-2xl border border-[#ebe8f0] bg-white px-3 py-3 text-sm text-[#20263a]"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target
                                                            .files?.[0] ?? null;
                                                    setPrimaryImageFile(file);
                                                }}
                                            />
                                            {primaryImageFile ? (
                                                <p className="text-xs text-[#687086]">
                                                    Selected:{' '}
                                                    {primaryImageFile.name}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="product-image-url">
                                                Or paste image URL
                                            </Label>
                                            <Input
                                                id="product-image-url"
                                                className={inputClassName}
                                                value={form.primary_image}
                                                onChange={(event) =>
                                                    setField(
                                                        'primary_image',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <InputError
                                    message={
                                        errors.primary_image_file ??
                                        errors.primary_image
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="product-gallery">
                                        Gallery images
                                    </Label>
                                    <span className="text-xs font-medium text-[#687086]">
                                        Add multiple uploads or URLs
                                    </span>
                                </div>
                                <div className="grid gap-4 rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="product-gallery-upload">
                                            Upload gallery files
                                        </Label>
                                        <input
                                            id="product-gallery-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="block w-full rounded-2xl border border-[#ebe8f0] bg-white px-3 py-3 text-sm text-[#20263a]"
                                            onChange={(event) =>
                                                setGalleryFiles(
                                                    Array.from(
                                                        event.target.files ??
                                                            [],
                                                    ),
                                                )
                                            }
                                        />
                                        {galleryFiles.length > 0 ? (
                                            <p className="text-xs text-[#687086]">
                                                {galleryFiles.length} file(s)
                                                selected:{' '}
                                                {galleryFiles
                                                    .map((file) => file.name)
                                                    .join(', ')}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="product-gallery">
                                            Or paste gallery URLs
                                        </Label>
                                        <textarea
                                            id="product-gallery"
                                            className={`min-h-24 rounded-2xl border px-3 py-3 text-sm ${inputClassName}`}
                                            value={form.gallery_input}
                                            onChange={(event) =>
                                                setField(
                                                    'gallery_input',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="One URL per line or comma separated"
                                        />
                                    </div>
                                </div>
                                <InputError message={errors.gallery_files} />
                                <InputError message={errors.gallery_input} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-short-description">
                                    Short description
                                </Label>
                                <Input
                                    id="product-short-description"
                                    className={inputClassName}
                                    value={form.short_description}
                                    onChange={(event) =>
                                        setField(
                                            'short_description',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Compact summary for listing cards"
                                />
                                <InputError
                                    message={errors.short_description}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-description">
                                    Description
                                </Label>
                                <textarea
                                    id="product-description"
                                    className={`min-h-28 rounded-2xl border px-3 py-3 text-sm ${inputClassName}`}
                                    value={form.description}
                                    onChange={(event) =>
                                        setField(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Detailed merchandising copy"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="product-price">Price</Label>
                                    <Input
                                        id="product-price"
                                        className={inputClassName}
                                        value={form.price}
                                        onChange={(event) =>
                                            setField(
                                                'price',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                    />
                                    <InputError message={errors.price} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-compare-price">
                                        Compare at price
                                    </Label>
                                    <Input
                                        id="product-compare-price"
                                        className={inputClassName}
                                        value={form.compare_at_price}
                                        onChange={(event) =>
                                            setField(
                                                'compare_at_price',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                    />
                                    <InputError
                                        message={errors.compare_at_price}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-stock">Stock</Label>
                                    <Input
                                        id="product-stock"
                                        className={inputClassName}
                                        value={form.stock}
                                        onChange={(event) =>
                                            setField(
                                                'stock',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="product-discount">
                                        Discount %
                                    </Label>
                                    <Input
                                        id="product-discount"
                                        className={inputClassName}
                                        value={form.discount_percentage}
                                        onChange={(event) =>
                                            setField(
                                                'discount_percentage',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                        max="100"
                                    />
                                    <InputError
                                        message={errors.discount_percentage}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-rating">
                                        Rating
                                    </Label>
                                    <Input
                                        id="product-rating"
                                        className={inputClassName}
                                        value={form.rating}
                                        onChange={(event) =>
                                            setField(
                                                'rating',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                    />
                                    <InputError message={errors.rating} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product-reviews">
                                        Review count
                                    </Label>
                                    <Input
                                        id="product-reviews"
                                        className={inputClassName}
                                        value={form.review_count}
                                        onChange={(event) =>
                                            setField(
                                                'review_count',
                                                event.target.value,
                                            )
                                        }
                                        type="number"
                                        min="0"
                                    />
                                    <InputError message={errors.review_count} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 rounded-2xl border border-[#efeaf2] bg-[#fafbfe] px-4 py-3">
                                <label className="flex items-center gap-3 text-sm font-medium text-[#20263a]">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(event) =>
                                            setField(
                                                'is_active',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    Active on storefront
                                </label>
                                <label className="flex items-center gap-3 text-sm font-medium text-[#20263a]">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(event) =>
                                            setField(
                                                'is_featured',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    Featured product
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="button"
                                    className="rounded-2xl bg-[#ff3f6c] text-white hover:bg-[#ff2b60]"
                                    onClick={submit}
                                >
                                    {editingProductId
                                        ? 'Update Product'
                                        : 'Create Product'}
                                </Button>
                                {editingProductId ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-2xl"
                                        onClick={resetForm}
                                    >
                                        Reset
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </article>

                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    Catalog inventory
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    Search and manage live products
                                </h2>
                            </div>
                            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                                <Input
                                    className={inputClassName}
                                    placeholder="Search name, slug, or SKU"
                                    value={productFilters.search}
                                    onChange={(event) =>
                                        setProductFilters((current) => ({
                                            ...current,
                                            search: event.target.value,
                                        }))
                                    }
                                />
                                <select
                                    className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                    value={productFilters.category_id}
                                    onChange={(event) =>
                                        setProductFilters((current) => ({
                                            ...current,
                                            category_id: event.target.value,
                                        }))
                                    }
                                >
                                    <option value="">All categories</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                    value={productFilters.brand_id}
                                    onChange={(event) =>
                                        setProductFilters((current) => ({
                                            ...current,
                                            brand_id: event.target.value,
                                        }))
                                    }
                                >
                                    <option value="">All brands</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-2xl"
                                    onClick={applyFilters}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="grid gap-4 rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4 md:grid-cols-[120px_1fr_auto]"
                                >
                                    <div className="overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                        <img
                                            src={product.primary_image}
                                            alt={product.name}
                                            className="aspect-square h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-[#151a2a]">
                                                {product.name}
                                            </h3>
                                            <Badge variant="outline">
                                                {product.sku}
                                            </Badge>
                                            {product.is_featured ? (
                                                <Badge className="bg-[#fff1f5] text-[#ff3f6c]">
                                                    Featured
                                                </Badge>
                                            ) : null}
                                            {product.is_active ? (
                                                <Badge className="bg-[#eff9f2] text-[#1b8f52]">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Draft
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-[#687086]">
                                            {product.short_description ||
                                                product.description ||
                                                'No description added yet.'}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#50576b]">
                                            <span>
                                                Category:{' '}
                                                {product.category ??
                                                    'Unassigned'}
                                            </span>
                                            <span>
                                                Brand:{' '}
                                                {product.brand ?? 'No brand'}
                                            </span>
                                            <span>
                                                Price: Rs.{' '}
                                                {new Intl.NumberFormat(
                                                    'en-IN',
                                                ).format(product.price)}
                                            </span>
                                            <span>Stock: {product.stock}</span>
                                            <span>
                                                Rating: {product.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                            onClick={() =>
                                                startEditing(product)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="rounded-2xl text-red-600"
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        `Delete ${product.name}?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/admin/products/${product.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {products.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#e4e8f0] bg-[#fafbfe] px-6 py-12 text-center text-sm text-[#687086]">
                                    No products match the current filter set.
                                </div>
                            ) : null}
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}

AdminProducts.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '/admin/products',
        },
    ],
};
