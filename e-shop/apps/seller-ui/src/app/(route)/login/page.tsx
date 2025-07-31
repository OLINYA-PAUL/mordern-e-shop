'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from 'apps/user-ui/src/configs/constants/constants';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'apps/user-ui/src/configs/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import styles from 'apps/seller-ui/src/styles/styles';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();
  interface formData {
    password: string;
    email: string;
  }

  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(LoginSchema) as any,
  });

  // h-[85vh]
  const onSubmit: SubmitHandler<formData> = (data) => {
    console.log({ LoginData: data });
    signInMutation.mutate(data);
  };

  const inputs = watch(); // returns current values
  const dataEmpty = inputs.email === '' || inputs.password === '';

  const signInMutation = useMutation({
    mutationFn: async (data: formData) => {
      const datas = { ...data, rememberMe };

      const res = await axiosInstance.post(`/login-seller`, datas);
      console.log({ resbody: datas }, 'and response', res.data);

      const msg = res?.data?.message || 'Sign in successful';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formData) => {
      router.push('/');
      setServerError('');
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg = err?.response?.data?.error || 'Failed to Sign in';
        setServerError(msg);
        toast.error(msg);
      }
    },
  });

  return (
    <div className="w-full mx-auto bg-[#fcfcf3]  p-6 min-h-screen ">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Login To Your Account
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        We are happy to have you back!
      </p>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="w-full sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[25%] shadow-sm bg-white p-4 sm:p-5 rounded-md">
          {' '}
          <h3 className="text-sm font-extrabold font-roboto text-center text-[#00000099] mb-1">
            Login to Eshop
          </h3>
          <p className="text-center font-poppins text-xs mb-2">
            Don't have an account?
            <Link href="/signup" className="text-blue-600 ml-2">
              Sign up
            </Link>
          </p>
          {/* <SVGComponent /> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="w-full mb-2">
              <input
                type="text"
                className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px]`}
                placeholder="Enter your Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email entered',
                  },
                })}
              />
              {errors.email && (
                <p className="text-[11px] font-poppins text-red-500 mt-1">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="w-full mb-1 flex items-center gap-2 !bg-[#f3f3ec] pr-2 rounded-md">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                className={`${styles.input} !border-none !bg-[#f3f3ec] text-xs px-3 py-[6px] flex-1`}
                placeholder="Enter your Password"
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <button
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="cursor-pointer"
                type="button"
              >
                {isPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-poppins text-red-500 mt-1">
                {String(errors.password.message)}
              </p>
            )}

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between my-2 ">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberme"
                  className="mr-2 !border-none !bg-[#f3f3ec] cursor-pointer  w-3 h-3"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <p className="font-poppins text-xs text-black">Remember me</p>
              </label>
              <Link
                href="/forget-password"
                className="font-poppins text-xs text-blue-600"
              >
                Forget password
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`${
                signInMutation.isPending ||
                (dataEmpty && 'cursor-not-allowed bg-slate-400')
              } w-full bg-black text-white py-2 px-3 mt-2 rounded-md font-medium text-xs  transition-colors`}
              disabled={signInMutation.isPending || dataEmpty}
            >
              {signInMutation.isPending ? 'Please wait...' : 'Login'}
            </button>
          </form>
          <div className="text-left mt-5">
            {serverError && (
              <p className="text-red-600 font-poppins text-xs" aria-readonly>
                {serverError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
