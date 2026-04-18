import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AdminFlashBanner } from '@/components/admin/admin-flash-banner';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CategoryRecord = {
    id: number;
    name: string;
    slug: string;
    department?: string | null;
    description?: string | null;
    image_path?: string | null;
    is_active: boolean;
    products_count: number;
};

type BrandRecord = {
    id: number;
    name: string;
    slug: string;
    logo_url?: string | null;
    is_active: boolean;
    products_count: number;
};

type CategoryFormState = {
    name: string;
    slug: string;
    department: string;
    description: string;
    image_path: string;
    is_active: boolean;
};

type BrandFormState = {
    name: string;
    slug: string;
    logo_url: string;
    is_active: boolean;
};

const inputClassName =
    'rounded-2xl border-[#ebe8f0] bg-white shadow-none focus-visible:ring-[#ff3f6c]/20';

const emptyCategoryForm: CategoryFormState = {
    name: '',
    slug: '',
    department: '',
    description: '',
    image_path: '',
    is_active: true,
};

const emptyBrandForm: BrandFormState = {
    name: '',
    slug: '',
    logo_url: '',
    is_active: true,
};

export default function AdminCatalog({
    categories,
    brands,
}: {
    categories: CategoryRecord[];
    brands: BrandRecord[];
}) {
    const errors =
        (usePage().props as { errors?: Record<string, string> }).errors ?? {};
    const [categoryForm, setCategoryForm] =
        useState<CategoryFormState>(emptyCategoryForm);
    const [brandForm, setBrandForm] = useState<BrandFormState>(emptyBrandForm);
    const [categoryImageFile, setCategoryImageFile] = useState<File | null>(
        null,
    );
    const [categoryImagePreview, setCategoryImagePreview] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
        null,
    );
    const [editingBrandId, setEditingBrandId] = useState<number | null>(null);

    const categoryMetrics = [
        {
            label: 'Categories',
            value: categories.length,
        },
        {
            label: 'Active Categories',
            value: categories.filter((category) => category.is_active).length,
        },
        {
            label: 'Brands',
            value: brands.length,
        },
        {
            label: 'Active Brands',
            value: brands.filter((brand) => brand.is_active).length,
        },
    ];

    const setCategoryField = (
        field: keyof CategoryFormState,
        value: string | boolean,
    ) => {
        setCategoryForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const setBrandField = (
        field: keyof BrandFormState,
        value: string | boolean,
    ) => {
        setBrandForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetCategoryForm = () => {
        setCategoryForm(emptyCategoryForm);
        setEditingCategoryId(null);
        setCategoryImageFile(null);
    };

    const resetBrandForm = () => {
        setBrandForm(emptyBrandForm);
        setEditingBrandId(null);
    };

    const startEditingCategory = (category: CategoryRecord) => {
        setEditingCategoryId(category.id);
        setCategoryForm({
            name: category.name,
            slug: category.slug,
            department: category.department ?? '',
            description: category.description ?? '',
            image_path: category.image_path ?? '',
            is_active: category.is_active,
        });
        setCategoryImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startEditingBrand = (brand: BrandRecord) => {
        setEditingBrandId(brand.id);
        setBrandForm({
            name: brand.name,
            slug: brand.slug,
            logo_url: brand.logo_url ?? '',
            is_active: brand.is_active,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!categoryImageFile) {
            setCategoryImagePreview(categoryForm.image_path);

            return;
        }

        const objectUrl = URL.createObjectURL(categoryImageFile);
        setCategoryImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [categoryImageFile, categoryForm.image_path]);

    const submitCategory = () => {
        const payload = {
            ...categoryForm,
            image_file: categoryImageFile ?? undefined,
            is_active: categoryForm.is_active ? 1 : 0,
        };

        if (editingCategoryId) {
            router.post(
                `/admin/categories/${editingCategoryId}`,
                {
                    ...payload,
                    _method: 'patch',
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => resetCategoryForm(),
                },
            );

            return;
        }

        router.post('/admin/categories', payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => resetCategoryForm(),
        });
    };

    const submitBrand = () => {
        const payload = {
            ...brandForm,
            is_active: brandForm.is_active ? 1 : 0,
        };

        if (editingBrandId) {
            router.patch(`/admin/brands/${editingBrandId}`, payload, {
                preserveScroll: true,
                onSuccess: () => resetBrandForm(),
            });

            return;
        }

        router.post('/admin/brands', payload, {
            preserveScroll: true,
            onSuccess: () => resetBrandForm(),
        });
    };

    return (
        <>
            <Head title="Catalog Control" />

            <div className="flex flex-col gap-6 p-4">
                <section className="rounded-[28px] border border-[#ece8ef] bg-[linear-gradient(135deg,#fff5f8_0%,#ffffff_50%,#f4fbff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                        Catalog Architecture
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#161b2d]">
                        Organize categories and brand partners
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#687086]">
                        Build the storefront taxonomy, manage departments, and
                        keep brand identities clean before products go live
                        across the Myntra experience.
                    </p>
                </section>

                <AdminFlashBanner />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categoryMetrics.map((metric) => (
                        <article
                            key={metric.label}
                            className="rounded-[24px] border border-[#ece9f0] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                        >
                            <p className="text-sm font-medium text-[#687086]">
                                {metric.label}
                            </p>
                            <p className="mt-4 text-3xl font-semibold text-[#161b2d]">
                                {new Intl.NumberFormat('en-IN').format(
                                    metric.value,
                                )}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    {editingCategoryId
                                        ? 'Edit Category'
                                        : 'Create Category'}
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    Category structure for storefront navigation
                                </h2>
                            </div>
                            {editingCategoryId ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-2xl"
                                    onClick={resetCategoryForm}
                                >
                                    Cancel
                                </Button>
                            ) : null}
                        </div>

                        <div className="mt-6 grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category-name">
                                    Category name
                                </Label>
                                <Input
                                    id="category-name"
                                    className={inputClassName}
                                    value={categoryForm.name}
                                    onChange={(event) =>
                                        setCategoryField(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Men"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="category-slug">Slug</Label>
                                    <Input
                                        id="category-slug"
                                        className={inputClassName}
                                        value={categoryForm.slug}
                                        onChange={(event) =>
                                            setCategoryField(
                                                'slug',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Auto-generated if blank"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category-department">
                                        Department
                                    </Label>
                                    <Input
                                        id="category-department"
                                        className={inputClassName}
                                        value={categoryForm.department}
                                        onChange={(event) =>
                                            setCategoryField(
                                                'department',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Fashion"
                                    />
                                    <InputError message={errors.department} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category-description">
                                    Description
                                </Label>
                                <textarea
                                    id="category-description"
                                    className={`min-h-28 rounded-2xl border px-3 py-3 text-sm ${inputClassName}`}
                                    value={categoryForm.description}
                                    onChange={(event) =>
                                        setCategoryField(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Used in merchandising and discovery pages."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="category-image-upload">
                                        Category image
                                    </Label>
                                    <span className="text-xs font-medium text-[#687086]">
                                        Upload file or paste image URL
                                    </span>
                                </div>
                                <div className="grid gap-4 rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4">
                                    {categoryImagePreview ? (
                                        <div className="overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                            <img
                                                src={categoryImagePreview}
                                                alt="Category preview"
                                                className="h-52 w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#d9ddea] bg-white text-sm text-[#7b8398]">
                                            Category artwork preview will appear
                                            here
                                        </div>
                                    )}

                                    <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                                        <div className="grid gap-2">
                                            <Label htmlFor="category-image-upload">
                                                Upload image file
                                            </Label>
                                            <input
                                                id="category-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="block w-full rounded-2xl border border-[#ebe8f0] bg-white px-3 py-3 text-sm text-[#20263a]"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target
                                                            .files?.[0] ?? null;
                                                    setCategoryImageFile(file);
                                                }}
                                            />
                                            {categoryImageFile ? (
                                                <p className="text-xs text-[#687086]">
                                                    Selected:{' '}
                                                    {categoryImageFile.name}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="category-image-url">
                                                Or paste image URL
                                            </Label>
                                            <Input
                                                id="category-image-url"
                                                className={inputClassName}
                                                value={categoryForm.image_path}
                                                onChange={(event) =>
                                                    setCategoryField(
                                                        'image_path',
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
                                        errors.image_file ?? errors.image_path
                                    }
                                />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-[#efeaf2] bg-[#fafbfe] px-4 py-3 text-sm font-medium text-[#20263a]">
                                <input
                                    type="checkbox"
                                    checked={categoryForm.is_active}
                                    onChange={(event) =>
                                        setCategoryField(
                                            'is_active',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Category visible in admin and storefront flows
                            </label>

                            <Button
                                type="button"
                                className="rounded-2xl bg-[#ff3f6c] text-white hover:bg-[#ff2b60]"
                                onClick={submitCategory}
                            >
                                {editingCategoryId
                                    ? 'Update Category'
                                    : 'Create Category'}
                            </Button>
                        </div>
                    </article>

                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    {editingBrandId
                                        ? 'Edit Brand'
                                        : 'Create Brand'}
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    Brand profiles for merchandising
                                </h2>
                            </div>
                            {editingBrandId ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-2xl"
                                    onClick={resetBrandForm}
                                >
                                    Cancel
                                </Button>
                            ) : null}
                        </div>

                        <div className="mt-6 grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="brand-name">Brand name</Label>
                                <Input
                                    id="brand-name"
                                    className={inputClassName}
                                    value={brandForm.name}
                                    onChange={(event) =>
                                        setBrandField(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Roadster"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="brand-slug">Slug</Label>
                                    <Input
                                        id="brand-slug"
                                        className={inputClassName}
                                        value={brandForm.slug}
                                        onChange={(event) =>
                                            setBrandField(
                                                'slug',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Auto-generated if blank"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand-logo">Logo URL</Label>
                                    <Input
                                        id="brand-logo"
                                        className={inputClassName}
                                        value={brandForm.logo_url}
                                        onChange={(event) =>
                                            setBrandField(
                                                'logo_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://..."
                                    />
                                    <InputError message={errors.logo_url} />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-[#efeaf2] bg-[#fafbfe] px-4 py-3 text-sm font-medium text-[#20263a]">
                                <input
                                    type="checkbox"
                                    checked={brandForm.is_active}
                                    onChange={(event) =>
                                        setBrandField(
                                            'is_active',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Brand available for new product assignments
                            </label>

                            <Button
                                type="button"
                                className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                onClick={submitBrand}
                            >
                                {editingBrandId
                                    ? 'Update Brand'
                                    : 'Create Brand'}
                            </Button>
                        </div>
                    </article>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div>
                            <p className="text-sm font-medium text-[#687086]">
                                Category Library
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                Existing storefront departments
                            </h2>
                        </div>

                        <div className="mt-6 grid gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                                {category.image_path ? (
                                                    <img
                                                        src={
                                                            category.image_path
                                                        }
                                                        alt={category.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xl font-semibold text-[#98a0b5]">
                                                        {category.name.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-[#151a2a]">
                                                        {category.name}
                                                    </h3>
                                                    <Badge variant="outline">
                                                        /{category.slug}
                                                    </Badge>
                                                    <Badge
                                                        className={
                                                            category.is_active
                                                                ? 'bg-[#eff9f2] text-[#1b8f52]'
                                                                : 'bg-[#fff7e9] text-[#b7791f]'
                                                        }
                                                    >
                                                        {category.is_active
                                                            ? 'Active'
                                                            : 'Hidden'}
                                                    </Badge>
                                                </div>
                                                <p className="mt-2 text-sm text-[#687086]">
                                                    {category.description ||
                                                        'No merchandising description added yet.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right text-sm text-[#687086]">
                                            <p>
                                                {category.department ||
                                                    'No department'}
                                            </p>
                                            <p>
                                                {category.products_count} linked
                                                products
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                            onClick={() =>
                                                startEditingCategory(category)
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
                                                        `Delete category ${category.name}?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/admin/categories/${category.id}`,
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

                            {categories.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#e4e8f0] bg-[#fafbfe] px-6 py-12 text-center text-sm text-[#687086]">
                                    No categories have been configured yet.
                                </div>
                            ) : null}
                        </div>
                    </article>

                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div>
                            <p className="text-sm font-medium text-[#687086]">
                                Brand Directory
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                Partner labels and in-house brands
                            </h2>
                        </div>

                        <div className="mt-6 grid gap-4">
                            {brands.map((brand) => (
                                <div
                                    key={brand.id}
                                    className="rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                                {brand.logo_url ? (
                                                    <img
                                                        src={brand.logo_url}
                                                        alt={brand.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xl font-semibold text-[#98a0b5]">
                                                        {brand.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-[#151a2a]">
                                                        {brand.name}
                                                    </h3>
                                                    <Badge variant="outline">
                                                        /{brand.slug}
                                                    </Badge>
                                                    <Badge
                                                        className={
                                                            brand.is_active
                                                                ? 'bg-[#eff9f2] text-[#1b8f52]'
                                                                : 'bg-[#fff7e9] text-[#b7791f]'
                                                        }
                                                    >
                                                        {brand.is_active
                                                            ? 'Active'
                                                            : 'Hidden'}
                                                    </Badge>
                                                </div>
                                                <p className="mt-2 text-sm text-[#687086]">
                                                    {brand.products_count}{' '}
                                                    products tagged to this
                                                    brand
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                            onClick={() =>
                                                startEditingBrand(brand)
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
                                                        `Delete brand ${brand.name}?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/admin/brands/${brand.id}`,
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

                            {brands.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#e4e8f0] bg-[#fafbfe] px-6 py-12 text-center text-sm text-[#687086]">
                                    No brands have been added yet.
                                </div>
                            ) : null}
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}

AdminCatalog.layout = {
    breadcrumbs: [
        {
            title: 'Catalog',
            href: '/admin/catalog',
        },
    ],
};
