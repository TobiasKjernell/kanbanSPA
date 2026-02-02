import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useLogin } from "../../../hooks/useLogin";
import { loginSchema } from '../../../schemas/schemas';
import { Spinner } from '../../../components/shared/Spinner/spinner';

const LoginForm = () => {
    const { login, isLoggingIn, error } = useLogin()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema), mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(values => login((values)))} className="p-4 flex flex-col w-full md:w-[400px] mx-auto bg-neutral-900 rounded-2xl border text-white" >
            <div className='mb-5'>
                <h2 className='text-lg font-semibold'>Login to your account</h2>
                <p className='text-muted-foreground'>Enter your email and password below</p >
            </div>
            <div className='flex flex-col gap-5'>
                <fieldset className="flex flex-col sm:gap-1 ">
                    <label htmlFor="email" className=" ">Enter your email</label>
                    <input className=" bg-neutral-800 p-2 rounded-2xl border px-4" autoComplete="off" id="email" {...register('email')} placeholder="Enter your email" />
                    {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
                </fieldset>
                <fieldset className="flex flex-col sm:gap-1 ">
                    <label htmlFor="password">Password</label>
                    <input className="bg-neutral-800 p-2 rounded-2xl border px-4" autoComplete="off" type="password" id="password" {...register('password')} placeholder="Enter your password" />
                    {errors.password && <div>{errors.password?.message}</div>}
                </fieldset>
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <button className=" m-auto mt-5 cursor-pointer bg-neutral-800 rounded-xl p-3 px-5 border hover:bg-neutral-900">{isLoggingIn ? <Spinner /> : 'Login'}</button>
                {error && <div className='text-red-500'>{error.message}</div>}
            </div>
        </form>
    )
}

export default LoginForm;