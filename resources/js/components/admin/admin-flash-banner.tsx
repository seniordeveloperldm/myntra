import { usePage } from '@inertiajs/react';

export function AdminFlashBanner() {
    const flash = (usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    }).flash;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    const isError = Boolean(flash.error);
    const message = flash.error ?? flash.success;

    return (
        <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                isError
                    ? 'border-[#ffd7d1] bg-[#fff7f6] text-[#cc4837]'
                    : 'border-[#ffd5e1] bg-[#fff6f8] text-[#d6336c]'
            }`}
        >
            {message}
        </div>
    );
}
