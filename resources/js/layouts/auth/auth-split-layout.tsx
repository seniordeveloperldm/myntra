import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const highlights = [
    {
        icon: ShoppingBag,
        title: 'Curated fashion journeys',
        description:
            'Catalog, wishlist, bag, checkout, and account all in one polished flow.',
    },
    {
        icon: Truck,
        title: 'Fast order handling',
        description:
            'Persistent addresses, checkout steps, and order placement are wired for real backend data.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure account access',
        description:
            'Fortify-powered authentication with a custom Myntra-inspired experience.',
    },
] as const;

const quickStats = [
    { label: 'Styles Online', value: '12+' },
    { label: 'User Roles', value: '3' },
    { label: 'Checkout Steps', value: '4' },
] as const;

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(135deg,#fff3f8_0%,#fffafc_40%,#f4f8ff_100%)]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 right-[-6rem] h-72 w-72 rounded-full bg-[#ff8daa]/18 blur-3xl" />
                <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-[#90d8ff]/18 blur-3xl" />
            </div>
            <div className="mx-auto grid min-h-dvh max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative hidden overflow-hidden lg:flex">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ff6b8f_0%,#ff3f6c_26%,#ffb5c9_52%,transparent_72%)] opacity-90" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,#171923_0%,#141824_44%,#1e2231_100%)]" />
                    <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#ff88aa]/20 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#53d0ff]/15 blur-3xl" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white xl:p-14">
                        <div>
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.2em] uppercase backdrop-blur"
                            >
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ff3f6c]">
                                    M
                                </span>
                                {name}
                            </Link>

                            <div className="mt-14 max-w-xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur">
                                    <Sparkles className="size-4" />
                                    Myntra Commerce Suite
                                </div>
                                <h1 className="mt-6 text-5xl leading-[1.05] font-semibold">
                                    Fashion-first login built for a real
                                    commerce backend.
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-7 text-white/78">
                                    Sign in to manage wishlists, saved
                                    addresses, persistent bags, and seamless
                                    checkout journeys powered by Laravel and
                                    React.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="grid gap-4 md:grid-cols-3">
                                {quickStats.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur"
                                    >
                                        <p className="text-3xl font-semibold">
                                            {item.value}
                                        </p>
                                        <p className="mt-2 text-sm text-white/72">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-4">
                                {highlights.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex items-start gap-4 rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur"
                                        >
                                            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff3f6c]">
                                                <Icon className="size-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold">
                                                    {item.title}
                                                </h2>
                                                <p className="mt-1 text-sm leading-6 text-white/72">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
                    <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_72%)] lg:block" />

                    <div className="relative z-10 w-full max-w-lg rounded-[36px] border border-[#eddbe3] bg-white/96 p-8 shadow-[0_32px_90px_rgba(18,26,46,0.14)] backdrop-blur xl:p-10">
                        <Link
                            href={home()}
                            className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#ffe1ea] bg-[#fff7fa] px-4 py-2 text-sm font-semibold text-[#ff3f6c] lg:hidden"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ff3f6c] text-white">
                                M
                            </span>
                            {name}
                        </Link>

                        <div className="mb-6 grid gap-4 rounded-[28px] border border-[#f3e6ec] bg-[linear-gradient(135deg,#fff7fa_0%,#ffffff_100%)] p-5 lg:hidden">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffdbe6] bg-white px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase">
                                <Sparkles className="size-4" />
                                Myntra Access
                            </div>
                            <div>
                                <h2 className="text-2xl leading-tight font-semibold text-[#161a2e]">
                                    Fashion account access with clearer checkout
                                    journeys.
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#6b7185]">
                                    Sign in or register to manage your wishlist,
                                    bag, addresses, and recent orders across
                                    devices.
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffdce7] bg-[#fff7fa] px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase">
                                <Sparkles className="size-3.5" />
                                Account Access
                            </div>
                            <p className="text-xs font-semibold tracking-[0.24em] text-[#ff3f6c] uppercase">
                                Welcome Back
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold text-[#161a2e]">
                                {title}
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-[#6b7185]">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
