import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StorefrontLayout from '@/layouts/storefront-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const standaloneStorefrontPages = new Set([
    'storefront/cart',
    'storefront/address',
    'storefront/payment',
    'storefront/otp',
    'storefront/success',
]);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    pages: './pages',
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case standaloneStorefrontPages.has(name):
                return null;
            case name.startsWith('storefront/'):
                return StorefrontLayout;
            case name === 'auth/login' || name === 'auth/register':
                return AuthSplitLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
