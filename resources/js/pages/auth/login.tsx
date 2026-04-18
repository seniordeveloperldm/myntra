import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const authInputClassName =
    'h-12 rounded-2xl border-[#d9dfeb] bg-white text-[#161a2e] placeholder:text-[#8a92a8] shadow-[0_1px_0_rgba(255,255,255,0.9)] focus-visible:border-[#ff3f6c] focus-visible:ring-[#ff3f6c]/15 autofill:[-webkit-text-fill-color:#161a2e] autofill:shadow-[inset_0_0_0px_1000px_#ffffff]';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="rounded-[24px] border border-[#d8eadb] bg-[#f6fff7] px-4 py-3 text-sm font-medium text-[#20744b]">
                                {status}
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div className="rounded-[28px] border border-[#ede1e7] bg-[linear-gradient(180deg,#ffffff_0%,#fff8fb_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-6">
                                <div className="mb-5 rounded-[24px] border border-[#ffe0ea] bg-[#fff7fa] px-4 py-4">
                                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase">
                                        Member Sign In
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#5f667d]">
                                        Use your email and password to continue
                                        to your bag, wishlist, saved addresses,
                                        and orders.
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className={authInputClassName}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="mt-5 grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm text-[#ff3f6c]"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className={authInputClassName}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#ece4eb] bg-[#fbfcff] px-4 py-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm text-[#1e2537]"
                                        >
                                            Keep me signed in
                                        </Label>
                                    </div>
                                    <span className="text-xs font-medium text-[#7c8295]">
                                        Secure access
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-5 h-12 w-full rounded-2xl bg-[#ff3f6c] text-base font-semibold text-white shadow-[0_18px_40px_rgba(255,63,108,0.22)] hover:bg-[#ff2d5f]"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Continue To Myntra
                                </Button>
                            </div>

                            <div className="rounded-[28px] border border-[#e8edf6] bg-[linear-gradient(135deg,#fbfcff_0%,#f7faff_100%)] p-5 text-sm leading-6 text-[#525a72]">
                                Sign in to instantly sync your wishlist,
                                persistent bag, saved addresses, and order
                                history across devices with clearer,
                                higher-contrast account access.
                            </div>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-[#5d657d]">
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-semibold text-[#ff3f6c] decoration-[#ffb6ca]"
                                >
                                    Sign up
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description:
        'Use your account to access your bag, wishlist, addresses, and recent orders.',
};
