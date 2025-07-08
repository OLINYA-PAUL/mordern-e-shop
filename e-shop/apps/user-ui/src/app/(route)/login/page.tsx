'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from 'apps/user-ui/src/configs/constants/constants';
import { formTypes } from 'apps/user-ui/src/configs/constants/global.d.types';
import SVGComponent from 'apps/user-ui/src/shared/components';
import styles from 'apps/user-ui/src/styles/styles';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    'Please try again in next 30 minutes!'
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formTypes>({
    resolver: yupResolver(userSchema),
  });

  const onSubmit: SubmitHandler<formTypes> = (data) => console.log(data);
  // h-[85vh]
  return (
    <div className="w-full mx-auto bg-[#fcfcf3]  p-6 ">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Login To Your Account
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        We are happy to have you back!
      </p>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="md:w-[25%] shadow-sm bg-white p-4 rounded-md">
          <h3 className="text-sm font-extrabold font-roboto text-center text-[#00000099] mb-1">
            Login to Eshop
          </h3>
          <p className="text-center font-poppins text-xs mb-2">
            Don't have an account?
            <Link href="/signup" className="text-blue-600 ml-2">
              Sign up
            </Link>
          </p>
          <SVGComponent />
          <div className="w-full flex items-center justify-between text-xs my-3">
            <div className="border-t border-x-slate-400 flex-1" />
            <span className="px-2">or Sign in with Email</span>
            <div className="border-t border-x-slate-400 flex-1" />
          </div>
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
                {isPasswordVisible ? (
                  <Eye size={16} />
                ) : (
                  <EyeClosed size={16} />
                )}
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
                  onChange={() => setRememberMe((prev) => !prev)}
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
              className="w-full bg-black text-white py-2 px-3 rounded-md font-medium text-xs hover:bg-gray-800 transition-colors"
            >
              Login
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
