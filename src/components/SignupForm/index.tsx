import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useSignup } from '../../hooks/useSignup';
import { signUpSchema } from '../../schemas/schemas';
import { Spinner } from '../shared/Spinner/spinner';

const SignupForm = () => {
    const { signup, isSigningUp, error, isSuccess, reset } = useSignup();
    const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm({
        resolver: zodResolver(signUpSchema),
        mode: 'onChange',
    });

    const onSubmit = (values: object) => {
        signup(values as Parameters<typeof signup>[0], {
            onSuccess: () => resetForm(),
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-zinc-900 border border-[#cea86f]/30 rounded-sm text-white font-[Jura]"
        >
            <div className="px-6 py-4 border-b border-[#cea86f]/30">
                <h2 className="text-sm tracking-widest uppercase psp-text-gold">New crew member</h2>
                <p className="text-zinc-400 text-xs mt-1">Creates an auth account and adds to the crew roster</p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
                <fieldset className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">
                        Email
                    </label>
                    <input
                        id="email"
                        autoComplete="off"
                        className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#cea86f]/60 transition-colors"
                        placeholder="crew@example.com"
                        {...register('email')}
                    />
                    {errors.email && <p className="text-red-400 text-xs">{errors.email.message as string}</p>}
                </fieldset>

                <fieldset className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">
                        Username
                    </label>
                    <input
                        id="username"
                        autoComplete="off"
                        className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#cea86f]/60 transition-colors"
                        placeholder="Display name"
                        {...register('username')}
                    />
                    {errors.username && <p className="text-red-400 text-xs">{errors.username.message as string}</p>}
                </fieldset>

                <fieldset className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="off"
                        className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#cea86f]/60 transition-colors"
                        placeholder="Min. 6 characters"
                        {...register('password')}
                    />
                    {errors.password && <p className="text-red-400 text-xs">{errors.password.message as string}</p>}
                </fieldset>
            </div>

            <div className="px-6 py-4 border-t border-[#cea86f]/30 flex flex-col gap-3">
                {error && <p className="text-red-400 text-xs">{error.message}</p>}
                {isSuccess && (
                    <div className="flex items-center justify-between text-green-400 text-xs">
                        <span>Account created — user can now login!</span>
                        <button type="button" onClick={reset} className="underline underline-offset-2 cursor-pointer">
                            Dismiss
                        </button>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full py-2 text-xs tracking-widest uppercase font-semibold bg-[#cea86f] text-zinc-900 rounded-sm hover:bg-[#ddbf88] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                    {isSigningUp ? <><Spinner className="animate-spin" /> Creating...</> : 'Create account'}
                </button>
            </div>
        </form>
    );
};

export default SignupForm;
