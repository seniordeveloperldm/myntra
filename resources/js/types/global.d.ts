import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: {
                success?: string | null;
                error?: string | null;
                createdCategoryId?: number | null;
                createdCategoryName?: string | null;
            };
            storefront: {
                cartCount: number;
                wishlistCount: number;
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
