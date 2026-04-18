import { Head } from '@inertiajs/react';
import { Package, ShieldCheck, ShoppingBag, Users, WalletCards } from 'lucide-react';

type Stats = {
    customers: number;
    admins: number;
    products: number;
    orders: number;
    wishlistItems: number;
    revenue: number;
};

type RecentOrder = {
    order_number: string;
    customer_name: string;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
};

const cards = [
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'admins', label: 'Admins', icon: ShieldCheck },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'wishlistItems', label: 'Wishlist Items', icon: WalletCards },
] as const;

const formatRupees = (value: number) =>
    `Rs. ${new Intl.NumberFormat('en-IN').format(value)}`;

export default function AdminDashboard({
    stats,
    recentOrders,
}: {
    stats: Stats;
    recentOrders: RecentOrder[];
}) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                <section className="rounded-[28px] border border-[#ede8ee] bg-[linear-gradient(135deg,#fff5f8_0%,#ffffff_48%,#f6fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                        Admin Panel
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-[#141927]">
                        Myntra Control Center
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c7388]">
                        Track users, orders, catalog activity, and revenue from a
                        single admin landing panel.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        const value = stats[card.key];

                        return (
                            <article
                                key={card.key}
                                className="rounded-[24px] border border-[#ece9f0] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#687086]">
                                        {card.label}
                                    </p>
                                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f5] text-[#ff3f6c]">
                                        <Icon className="size-5" />
                                    </span>
                                </div>
                                <p className="mt-5 text-3xl font-semibold text-[#161b2d]">
                                    {new Intl.NumberFormat('en-IN').format(value)}
                                </p>
                            </article>
                        );
                    })}
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#687086]">
                                    Recent Orders
                                </p>
                                <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                                    Latest commerce activity
                                </h2>
                            </div>
                            <span className="rounded-full bg-[#f7f8fc] px-4 py-2 text-sm font-medium text-[#687086]">
                                {recentOrders.length} recent
                            </span>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-[#eff1f6]">
                            <table className="min-w-full divide-y divide-[#eff1f6] text-left text-sm">
                                <thead className="bg-[#fafbfe] text-[#687086]">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Order</th>
                                        <th className="px-4 py-3 font-medium">Customer</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Payment</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#eff1f6] bg-white">
                                    {recentOrders.map((order) => (
                                        <tr key={order.order_number}>
                                            <td className="px-4 py-3 font-medium text-[#151a2a]">
                                                {order.order_number}
                                            </td>
                                            <td className="px-4 py-3 text-[#687086]">
                                                {order.customer_name}
                                            </td>
                                            <td className="px-4 py-3 capitalize text-[#151a2a]">
                                                {order.status}
                                            </td>
                                            <td className="px-4 py-3 capitalize text-[#687086]">
                                                {order.payment_status}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#151a2a]">
                                                {formatRupees(order.total_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>

                    <article className="rounded-[28px] border border-[#ece9f0] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <p className="text-sm font-medium text-[#687086]">
                            Revenue Snapshot
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-[#151a2a]">
                            Total sales recorded
                        </h2>

                        <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,#161b2b_0%,#23293d_100%)] p-6 text-white">
                            <p className="text-sm text-white/70">Gross Revenue</p>
                            <p className="mt-3 text-4xl font-semibold">
                                {formatRupees(stats.revenue)}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/70">
                                This is based on locally placed orders in the current
                                environment. Next step can be full admin CRUD for products,
                                orders, users, and promotions.
                            </p>
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
