// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';

const SignupForm = () => {
    // const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(signUpSchema) });
    // const { mutate, isPending } = useMutation({ mutationFn: SignUp })

    // return (
    //     <form onSubmit={handleSubmit(values => mutate(values))} className="p-4 flex flex-col w-full md:w-[400px] mx-auto bg-neutral-900 rounded-2xl border" >
    //         <div className='flex flex-col gap-5'>
    //             <fieldset className="flex flex-col sm:gap-1 ">
    //                 <label htmlFor="email" className=" ">Enter your ema il</label>
    //                 <input className=" bg-neutral-800 p-2 rounded-2xl border px-4" autoComplete="off" id="email" {...register('email')} placeholder="Enter your email" />
    //                 {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
    //             </fieldset>
    //             <fieldset className="flex flex-col sm:gap-1 ">
    //                 <label htmlFor="password">Password</label>
    //                 <input className="bg-neutral-800 p-2 rounded-2xl border px-4" autoComplete="off" type="password" id="password" {...register('password')} placeholder="Enter your password" />
    //                 {errors.password && <div>{errors.password?.message}</div>}
    //             </fieldset> 
    //               <fieldset className="flex flex-col sm:gap-1 ">
    //                 <label htmlFor="username">Username</label>
    //                 <input className="bg-neutral-800 p-2 rounded-2xl border px-4"  type="text" id="username" {...register('username')} placeholder="Username" />
    //                 {errors.username && <div>{errors.username?.message}</div>}
    //             </fieldset>
    //         </div>      
    //         <div className='flex flex-col items-center justify-center gap-2'>
    //             <button  className=" m-auto mt-5 cursor-pointer bg-neutral-800 rounded-xl p-3 px-5 border hover:bg-neutral-900">{isPending ? <Spinner /> : 'Signup'}</button>
    //         </div>
    //     </form>
    // )
}

export default SignupForm;  