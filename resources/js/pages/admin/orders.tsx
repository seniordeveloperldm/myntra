import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AdminFlashBanner } from '@/components/admin/admin-flash-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ShippingAddress = {
    fullName: string;
    mobile: string;
    street: string;
    street2?: string | null;
    city: string;
    state: string;
    pinCode: string;
    country: string;
};

type OrderItemRecord = {
    id: number;
    name: string;
    brand?: string | null;
    image?: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
    product_id?: number | null;
};

type OrderRecord = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string | null;
    status: string;
    payment_method: string;
    payment_status: string;
    total_amount: number;
    subtotal: number;
    discount_amount: number;
    placed_at?: string | null;
    shipping_address: ShippingAddress;
    items: OrderItemRecord[];
};

type Filters = {
    search: string;
};

type OrderEditState = Record<
    number,
    {
        status: string;
        payment_status: string;
    }
>;

const inputClassName =
    'rounded-2xl border-[#ebe8f0] bg-white shadow-none focus-visible:ring-[#ff3f6c]/20';

const statusTone: Record<string, string> = {
    confirmed: 'bg-[#eef6ff] text-[#2752cc]',
    processing: 'bg-[#fff7e9] text-[#b7791f]',
    shipped: 'bg-[#ecf7ff] text-[#0f6ea8]',
    delivered: 'bg-[#eff9f2] text-[#1b8f52]',
    cancelled: 'bg-[#fff1f1] text-[#d64545]',
};

const paymentTone: Record<string, string> = {
    pending: 'bg-[#fff7e9] text-[#b7791f]',
    authorized: 'bg-[#eef6ff] text-[#2752cc]',
    paid: 'bg-[#eff9f2] text-[#1b8f52]',
    failed: 'bg-[#fff1f1] text-[#d64545]',
    refunded: 'bg-[#f4f5f8] text-[#4b5565]',
};

export default function AdminOrders({
    orders,
    filters,
    statusOptions,
    paymentStatusOptions,
}: {
    orders: OrderRecord[];
    filters: Filters;
    statusOptions: string[];
    paymentStatusOptions: string[];
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [orderEdits, setOrderEdits] = useState<OrderEditState>({});

    useEffect(() => {
        setSearch(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        const nextState = orders.reduce<OrderEditState>((carry, order) => {
            carry[order.id] = {
                status: order.status,
                payment_status: order.payment_status,
            };

            return carry;
        }, {});

        setOrderEdits(nextState);
    }, [orders]);

    const metrics = [
        { label: 'Orders', value: orders.length },
        {
            label: 'Open Fulfilment',
            value: orders.filter((order) =>
                ['confirmed', 'processing', 'shipped'].includes(order.status),
            ).length,
        },
        {
            label: 'Pending Payments',
            value: orders.filter((order) =>
                ['pending', 'authorized'].includes(order.payment_status),
            ).length,
        },
        {
            label: 'Revenue',
            value: `Rs. ${new Intl.NumberFormat('en-IN').format(
                orders.reduce((sum, order) => sum + order.total_amount, 0),
            )}`,
        },
    ];

    const setOrderField = (
        orderId: number,
        field: 'status' | 'payment_status',
        value: string,
    ) => {
        setOrderEdits((current) => ({
            ...current,
            [orderId]: {
                ...(current[orderId] ?? {
                    status: 'confirmed',
                    payment_status: 'pending',
                }),
                [field]: value,
            },
        }));
    };

    const applyFilters = () => {
        router.get(
            '/admin/orders',
            { search: search || undefined },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const updateOrder = (orderId: number) => {
        const payload = orderEdits[orderId];

        if (!payload) {
            return;
        }

        router.patch(`/admin/orders/${orderId}`, payload, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Order Operations" />

            <div className="flex flex-col gap-6 p-4">
                <section className="rounded-[28px] border border-[#ece8ef] bg-[linear-gradient(135deg,#fff5f8_0%,#ffffff_50%,#f4fbff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                        Fulfilment Desk
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#161b2d]">
                        Track orders, payment states, and delivery progress
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#687086]">
                        Review every placed order, move fulfilment forward, and
                        handle payment transitions from the same admin
                        workspace.
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
                                {typeof metric.value === 'number'
                                    ? new Intl.NumberFormat('en-IN').format(
                                          metric.value,
                                      )
                                    : metric.value}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#687086]">
                                Order Ledger
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                Search the current order book
                            </h2>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                            <Input
                                className={inputClassName}
                                placeholder="Search by order number, customer, or email"
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
                        {orders.map((order) => {
                            const orderState = orderEdits[order.id] ?? {
                                status: order.status,
                                payment_status: order.payment_status,
                            };

                            return (
                                <div
                                    key={order.id}
                                    className="rounded-[24px] border border-[#ece9f0] bg-[#fcfcfe] p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold text-[#151a2a]">
                                                    {order.order_number}
                                                </h3>
                                                <Badge
                                                    className={
                                                        statusTone[
                                                            order.status
                                                        ] ??
                                                        'bg-[#f4f5f8] text-[#4b5565]'
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        paymentTone[
                                                            order.payment_status
                                                        ] ??
                                                        'bg-[#f4f5f8] text-[#4b5565]'
                                                    }
                                                >
                                                    {order.payment_status}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 text-sm text-[#687086]">
                                                {order.customer_name} •{' '}
                                                {order.customer_email}
                                            </p>
                                            <p className="mt-1 text-sm text-[#687086]">
                                                {order.customer_phone ||
                                                    'No phone'}{' '}
                                                •{' '}
                                                {order.placed_at ||
                                                    'Not available'}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-[#687086]">
                                                {order.items.length} line items
                                            </p>
                                            <p className="mt-1 text-2xl font-semibold text-[#151a2a]">
                                                Rs.{' '}
                                                {new Intl.NumberFormat(
                                                    'en-IN',
                                                ).format(order.total_amount)}
                                            </p>
                                            <p className="mt-1 text-sm text-[#687086]">
                                                via {order.payment_method}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                                        <div className="grid gap-3">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="grid gap-3 rounded-2xl border border-[#ece9f0] bg-white p-3 md:grid-cols-[72px_1fr_auto]"
                                                >
                                                    <div className="overflow-hidden rounded-2xl bg-[#f4f6fb]">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="aspect-square h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex aspect-square h-full w-full items-center justify-center text-xs text-[#98a0b5]">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-[#151a2a]">
                                                            {item.brand ||
                                                                'Myntra'}{' '}
                                                            • {item.name}
                                                        </p>
                                                        <p className="mt-1 text-sm text-[#687086]">
                                                            Qty {item.quantity}{' '}
                                                            • Unit Rs.{' '}
                                                            {new Intl.NumberFormat(
                                                                'en-IN',
                                                            ).format(
                                                                item.unit_price,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm font-medium text-[#151a2a]">
                                                        Rs.{' '}
                                                        {new Intl.NumberFormat(
                                                            'en-IN',
                                                        ).format(
                                                            item.line_total,
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid gap-4 rounded-[24px] border border-[#ece9f0] bg-white p-4">
                                            <div>
                                                <p className="text-sm font-medium text-[#687086]">
                                                    Shipping address
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-[#151a2a]">
                                                    {
                                                        order.shipping_address
                                                            .fullName
                                                    }
                                                    <br />
                                                    {
                                                        order.shipping_address
                                                            .street
                                                    }
                                                    {order.shipping_address
                                                        .street2
                                                        ? `, ${order.shipping_address.street2}`
                                                        : ''}
                                                    <br />
                                                    {
                                                        order.shipping_address
                                                            .city
                                                    }
                                                    ,{' '}
                                                    {
                                                        order.shipping_address
                                                            .state
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        order.shipping_address
                                                            .pinCode
                                                    }
                                                    <br />
                                                    {
                                                        order.shipping_address
                                                            .country
                                                    }
                                                    <br />
                                                    {
                                                        order.shipping_address
                                                            .mobile
                                                    }
                                                </p>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <label className="grid gap-2 text-sm font-medium text-[#20263a]">
                                                    Status
                                                    <select
                                                        className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                                        value={
                                                            orderState.status
                                                        }
                                                        onChange={(event) =>
                                                            setOrderField(
                                                                order.id,
                                                                'status',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        {statusOptions.map(
                                                            (status) => (
                                                                <option
                                                                    key={status}
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {status}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </label>

                                                <label className="grid gap-2 text-sm font-medium text-[#20263a]">
                                                    Payment status
                                                    <select
                                                        className={`h-11 rounded-2xl border px-3 text-sm ${inputClassName}`}
                                                        value={
                                                            orderState.payment_status
                                                        }
                                                        onChange={(event) =>
                                                            setOrderField(
                                                                order.id,
                                                                'payment_status',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        {paymentStatusOptions.map(
                                                            (status) => (
                                                                <option
                                                                    key={status}
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {status}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </label>
                                            </div>

                                            <div className="rounded-2xl border border-[#efeaf2] bg-[#fafbfe] px-4 py-3 text-sm text-[#687086]">
                                                Subtotal Rs.{' '}
                                                {new Intl.NumberFormat(
                                                    'en-IN',
                                                ).format(order.subtotal)}{' '}
                                                • Discount Rs.{' '}
                                                {new Intl.NumberFormat(
                                                    'en-IN',
                                                ).format(order.discount_amount)}
                                            </div>

                                            <Button
                                                type="button"
                                                className="rounded-2xl bg-[#161b2d] text-white hover:bg-[#0f1322]"
                                                onClick={() =>
                                                    updateOrder(order.id)
                                                }
                                            >
                                                Save Order Update
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {orders.length === 0 ? (
                            <div className="rounded-[24px] border border-dashed border-[#e4e8f0] bg-[#fafbfe] px-6 py-12 text-center text-sm text-[#687086]">
                                No orders matched the current search filter.
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </>
    );
}

AdminOrders.layout = {
    breadcrumbs: [
        {
            title: 'Orders',
            href: '/admin/orders',
        },
    ],
};
