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
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
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
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>

                        {/* Demo Accounts Quick-Select */}
                        <div className="mt-2 p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-amber-700 dark:text-amber-400">Akun Demo (Klik untuk Autofill):</span>
                                <span className="text-[10px] text-muted-foreground">Password: <strong>password</strong></span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const emailEl = document.getElementById('email') as HTMLInputElement | null;
                                        const passEl = document.getElementById('password') as HTMLInputElement | null;
                                        if (emailEl && passEl) {
                                            emailEl.value = 'admin@stahdnj.ac.id';
                                            emailEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            emailEl.dispatchEvent(new Event('change', { bubbles: true }));
                                            passEl.value = 'password';
                                            passEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            passEl.dispatchEvent(new Event('change', { bubbles: true }));
                                        }
                                    }}
                                    className="p-1.5 rounded bg-background border border-input hover:border-amber-500 text-left transition-colors"
                                >
                                    <div className="font-semibold text-slate-900 dark:text-slate-100">Super Admin</div>
                                    <div className="text-[10px] text-muted-foreground truncate">admin@stahdnj.ac.id</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const emailEl = document.getElementById('email') as HTMLInputElement | null;
                                        const passEl = document.getElementById('password') as HTMLInputElement | null;
                                        if (emailEl && passEl) {
                                            emailEl.value = 'ketua.lp3m@stahdnj.ac.id';
                                            emailEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            emailEl.dispatchEvent(new Event('change', { bubbles: true }));
                                            passEl.value = 'password';
                                            passEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            passEl.dispatchEvent(new Event('change', { bubbles: true }));
                                        }
                                    }}
                                    className="p-1.5 rounded bg-background border border-input hover:border-amber-500 text-left transition-colors"
                                >
                                    <div className="font-semibold text-slate-900 dark:text-slate-100">Ketua LP3M</div>
                                    <div className="text-[10px] text-muted-foreground truncate">ketua.lp3m@stahdnj.ac.id</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const emailEl = document.getElementById('email') as HTMLInputElement | null;
                                        const passEl = document.getElementById('password') as HTMLInputElement | null;
                                        if (emailEl && passEl) {
                                            emailEl.value = 'auditor@stahdnj.ac.id';
                                            emailEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            emailEl.dispatchEvent(new Event('change', { bubbles: true }));
                                            passEl.value = 'password';
                                            passEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            passEl.dispatchEvent(new Event('change', { bubbles: true }));
                                        }
                                    }}
                                    className="p-1.5 rounded bg-background border border-input hover:border-amber-500 text-left transition-colors"
                                >
                                    <div className="font-semibold text-slate-900 dark:text-slate-100">Auditor Mutu</div>
                                    <div className="text-[10px] text-muted-foreground truncate">auditor@stahdnj.ac.id</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const emailEl = document.getElementById('email') as HTMLInputElement | null;
                                        const passEl = document.getElementById('password') as HTMLInputElement | null;
                                        if (emailEl && passEl) {
                                            emailEl.value = 'kaprodi.pah@stahdnj.ac.id';
                                            emailEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            emailEl.dispatchEvent(new Event('change', { bubbles: true }));
                                            passEl.value = 'password';
                                            passEl.dispatchEvent(new Event('input', { bubbles: true }));
                                            passEl.dispatchEvent(new Event('change', { bubbles: true }));
                                        }
                                    }}
                                    className="p-1.5 rounded bg-background border border-input hover:border-amber-500 text-left transition-colors"
                                >
                                    <div className="font-semibold text-slate-900 dark:text-slate-100">Kaprodi S1-PAH</div>
                                    <div className="text-[10px] text-muted-foreground truncate">kaprodi.pah@stahdnj.ac.id</div>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
