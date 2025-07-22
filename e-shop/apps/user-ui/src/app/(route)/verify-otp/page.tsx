'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { VerifyOtp } from 'apps/user-ui/src/configs/constants/constants';
import styles from 'apps/user-ui/src/styles/styles';
import { Eye, EyeOff } from 'lucide-react';

import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'apps/user-ui/src/configs/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export interface formData {
  email: string;
  otp?: number | string;
}

const VerifyOpt = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(VerifyOtp) as any,
  });

  // h-[85vh]
  const onSubmit: SubmitHandler<formData> = (data) => {
    console.log({ singupData: data });
    signInMutation.mutate(data);
  };

  const inputs = watch(['email', 'otp']); // returns current values
  const dataEmpty = inputs.some((v) => !v);

  // const dataEmpty = Object.values(FormData).some(
  //   (items) => items === '' || !items
  // );

  const signInMutation = useMutation({
    mutationFn: async (data: formData) => {
      const res = await axiosInstance.post(`/verify-otp`, data);
      console.log({ resbody: res.data });

      const msg = res?.data?.message || 'otp verify successfully!';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formData) => {
      router.push('/reset-password');
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg = err?.response?.data?.error || 'otp failed to very';
        toast.error(msg);
      }
    },
  });

  return (
    <div className="w-full mx-auto bg-[#fcfcf3]  p-6 ">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Reset Your Account
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        Please input your email to reset your account{' '}
      </p>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="w-full sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[25%] shadow-sm bg-white p-4 sm:p-5 rounded-md">
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
                // type={isPasswordVisible ? 'text' : 'password'}
                className={`${styles.input} !border-none !bg-[#f3f3ec] text-xs px-3 py-[6px] flex-1`}
                placeholder="Enter your otp"
                {...register('otp', {
                  required: 'otp is required',
                })}
              />
              <button
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="cursor-pointer"
                type="button"
              >
                {/* {isPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />} */}
              </button>
            </div>
            {errors.otp && (
              <p className="text-[11px] font-poppins text-red-500 mt-1">
                {String(errors.otp.message)}
              </p>
            )}
            {/* Submit */}
            <button
              type="submit"
              className={`${
                signInMutation.isPending ||
                (dataEmpty && 'cursor-not-allowed bg-slate-400')
              } w-full bg-black text-white py-2 px-3 mt-2 rounded-md font-medium text-xs  transition-colors`}
              disabled={signInMutation.isPending || dataEmpty}
            >
              {signInMutation.isPending ? 'Please wait...' : 'Verify otp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOpt;
