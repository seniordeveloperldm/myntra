import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AdminFlashBanner } from '@/components/admin/admin-flash-banner';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserRecord = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    email_verified_at?: string | null;
    orders_count: number;
    wishlist_items_count: number;
    cart_exists: boolean;
    created_at: string;
};

type Filters = {
    search: string;
};

type UserFormState = {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
};

const inputClassName =
    'rounded-2xl border-[#ebe8f0] bg-white shadow-none focus-visible:ring-[#ff3f6c]/20';

const emptyForm: UserFormState = {
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    password: '',
};

const roleTone: Record<string, string> = {
    admin: 'bg-[#fff1f5] text-[#ff3f6c]',
    manager: 'bg-[#eef6ff] text-[#2752cc]',
    customer: 'bg-[#eff9f2] text-[#1b8f52]',
};

export default function AdminUsers({
    users,
    filters,
    roles,
}: {
    users: UserRecord[];
    filters: Filters;
    roles: string[];
}) {
    const errors =
        (usePage().props as { errors?: Record<string, string> }).errors ?? {};
    const [form, setForm] = useState<UserFormState>(emptyForm);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    const metrics = [
        { label: 'Total Users', value: users.length },
        {
            label: 'Admins & Managers',
            value: users.filter((user) =>
                ['admin', 'manager'].includes(user.role),
            ).length,
        },
        {
            label: 'Customers',
            value: users.filter((user) => user.role === 'customer').length,
        },
        {
            label: 'Verified Emails',
            value: users.filter((user) => Boolean(user.email_verified_at))
                .length,
        },
    ];

    const setField = (field: keyof UserFormState, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingUserId(null);
    };

    const startEditing = (user: UserRecord) => {
        setEditingUserId(user.id);
        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            role: user.role,
            password: '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = () => {
        const payload = {
            ...form,
            phone: form.phone || null,
            password: form.password || null,
        };

        if (editingUserId) {
            router.patch(`/admin/users/${editingUserId}`, payload, {
                preserveScroll: true,
                onSuccess: () => resetForm(),
            });

            return;
        }

        router.post('/admin/users', payload, {
            preserveScroll: true,
            onSuccess: () => resetForm(),
        });
    };

    const applyFilters = () => {
        router.get(
            '/admin/users',
            { search: search || undefined },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="User Management" />

            <div className="flex flex-col gap-6 p-4">
                <section className="rounded-[28px] border border-[#ece8ef] bg-[linear-gradient(135deg,#fff5f8_0%,#ffffff_52%,#f4fbff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                        User Ops
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#161b2d]">
                        Manage customers, admins, and internal operators
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#687086]">
                        Create privileged accounts, review engagement signals,
                        and keep the entire commerce team structure under one
                        admin workflow.
                    </p>
                </section>

                <AdminFlashBanner />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
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

                <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    {editingUserId
                                        ? 'Edit User'
                                        : 'Create User'}
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    {editingUserId
                                        ? 'Update permissions and contact details'
                                        : 'Add a new admin, manager, or customer'}
                                </h2>
                            </div>
                            {editingUserId ? (
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
                                <Label htmlFor="user-name">Full name</Label>
                                <Input
                                    id="user-name"
                                    className={inputClassName}
                                    value={form.name}
                                    onChange={(event) =>
                                        setField('name', event.target.value)
                                    }
                                    placeholder="Myntra Admin"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="user-email">
                                    Email address
                                </Label>
                                <Input
                                    id="user-email"
                                    className={inputClassName}
                                    value={form.email}
                                    onChange={(event) =>
                                        setField('email', event.target.value)
                                    }
                                    placeholder="admin@example.com"
                                    type="email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="user-phone">Phone</Label>
                                    <Input
                                        id="user-phone"
                                        className={inputClassName}
                                        value={form.phone}
                                        onChange={(event) =>
                                            setField(
                                                'phone',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="9876543210"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="user-role">Role</Label>
                                    <select
                                        id="user-role"
                                        className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                        value={form.role}
                                        onChange={(event) =>
                                            setField('role', event.target.value)
                                        }
                                    >
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role.charAt(0).toUpperCase() +
                                                    role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="user-password">
                                    {editingUserId
                                        ? 'New password (optional)'
                                        : 'Temporary password'}
                                </Label>
                                <Input
                                    id="user-password"
                                    className={inputClassName}
                                    value={form.password}
                                    onChange={(event) =>
                                        setField('password', event.target.value)
                                    }
                                    placeholder={
                                        editingUserId
                                            ? 'Leave blank to keep current password'
                                            : 'Minimum 8 characters'
                                    }
                                    type="password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="rounded-2xl border border-[#efeaf2] bg-[#fafbfe] px-4 py-3 text-sm leading-6 text-[#687086]">
                                Role meaning: `admin` has full control,
                                `manager` can use the admin panel too, and
                                `customer` is a storefront user.
                            </div>

                            <Button
                                type="button"
                                className="rounded-2xl bg-[#ff3f6c] text-white hover:bg-[#ff2b60]"
                                onClick={submit}
                            >
                                {editingUserId ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </article>

                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    User Directory
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    Search and manage registered accounts
                                </h2>
                            </div>

                            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                                <Input
                                    className={inputClassName}
                                    placeholder="Search by name, email, or phone"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />
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
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold text-[#151a2a]">
                                                    {user.name}
                                                </h3>
                                                <Badge
                                                    className={
                                                        roleTone[user.role] ??
                                                        'bg-[#f4f5f8] text-[#4b5565]'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {user.email_verified_at
                                                        ? 'Verified'
                                                        : 'Unverified'}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 text-sm text-[#687086]">
                                                {user.email}
                                            </p>
                                            <p className="mt-1 text-sm text-[#687086]">
                                                {user.phone || 'No phone added'}
                                            </p>
                                        </div>

                                        <div className="grid gap-1 text-right text-sm text-[#687086]">
                                            <p>Joined: {user.created_at}</p>
                                            <p>Orders: {user.orders_count}</p>
                                            <p>
                                                Wishlist:{' '}
                                                {user.wishlist_items_count}
                                            </p>
                                            <p>
                                                Bag created:{' '}
                                                {user.cart_exists
                                                    ? 'Yes'
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                            onClick={() => startEditing(user)}
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
                                                        `Delete user ${user.name}?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/admin/users/${user.id}`,
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

                            {users.length === 0 ? (
                                <div className="rounded-[24px] border border-dashed border-[#e4e8f0] bg-[#fafbfe] px-6 py-12 text-center text-sm text-[#687086]">
                                    No users matched the current search filter.
                                </div>
                            ) : null}
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: '/admin/users',
        },
    ],
};
