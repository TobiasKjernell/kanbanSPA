import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useLogin } from "../../../hooks/useLogin";
import { loginSchema } from '../../../schemas/schemas';
import { Spinner } from '../../../components/shared/Spinner/spinner';

const LoginForm = () => {
    const { login, isLoggingIn, error } = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema), mode: 'onChange' });

    return (
        <form
            onSubmit={handleSubmit(values => login(values))}
            className="w-full max-w-md bg-zinc-900 border border-[#cea86f]/30 rounded-sm text-white font-[Jura]"
        >
            <div className="px-6 py-4 border-b border-[#cea86f]/30">
                <h2 className="text-sm tracking-widest uppercase psp-text-gold">Sign in</h2>
                <p className="text-zinc-400 text-xs mt-1">Enter your credentials to access the dashboard</p>
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
                <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-2 text-xs tracking-widest uppercase font-semibold bg-[#cea86f] text-zinc-900 rounded-sm hover:bg-[#ddbf88] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                    {isLoggingIn ? <><Spinner className="animate-spin" /> Signing in...</> : 'Sign in'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
