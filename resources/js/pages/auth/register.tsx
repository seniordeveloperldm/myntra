import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

const authInputClassName =
    'h-12 rounded-2xl border-[#d9dfeb] bg-white text-[#161a2e] placeholder:text-[#8a92a8] shadow-[0_1px_0_rgba(255,255,255,0.9)] focus-visible:border-[#ff3f6c] focus-visible:ring-[#ff3f6c]/15 autofill:[-webkit-text-fill-color:#161a2e] autofill:shadow-[inset_0_0_0px_1000px_#ffffff]';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="rounded-[28px] border border-[#ede1e7] bg-[linear-gradient(180deg,#ffffff_0%,#fff8fb_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-6">
                                <div className="mb-5 rounded-[24px] border border-[#ffe0ea] bg-[#fff7fa] px-4 py-4">
                                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase">
                                        Account Setup
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#5f667d]">
                                        Create your account with clearer fields
                                        so your bag, wishlist, addresses, and
                                        orders stay synced.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2 sm:col-span-1">
                                        <Label
                                            htmlFor="name"
                                            className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            className={authInputClassName}
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-1">
                                        <Label
                                            htmlFor="phone"
                                            className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                        >
                                            Mobile number
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            tabIndex={2}
                                            autoComplete="tel"
                                            name="phone"
                                            placeholder="9876543210"
                                            className={authInputClassName}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={3}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className={authInputClassName}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                        >
                                            Password
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            className={authInputClassName}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-[11px] font-semibold tracking-[0.18em] text-[#ff3f6c] uppercase"
                                        >
                                            Confirm password
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                            className={authInputClassName}
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl border border-[#e8edf6] bg-[#fbfcff] px-4 py-3 text-sm leading-6 text-[#5a637b]">
                                    Choose a strong password so your order
                                    history, saved addresses, and wishlist stay
                                    protected.
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-5 h-12 w-full rounded-2xl bg-[#ff3f6c] text-base font-semibold text-white shadow-[0_18px_40px_rgba(255,63,108,0.22)] hover:bg-[#ff2d5f]"
                                    tabIndex={6}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Create account
                                </Button>
                            </div>

                            <div className="rounded-[28px] border border-[#e8edf6] bg-[linear-gradient(135deg,#fbfcff_0%,#f7faff_100%)] p-5 text-sm leading-6 text-[#525a72]">
                                Once you register, your wishlist, persistent
                                bag, checkout progress, and saved addresses stay
                                connected to your account.
                            </div>
                        </div>

                        <div className="text-center text-sm text-[#5d657d]">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                                className="font-semibold text-[#ff3f6c] decoration-[#ffb6ca]"
                            >
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description:
        'Create your Myntra-style account to save wishlists, addresses, and orders.',
};
