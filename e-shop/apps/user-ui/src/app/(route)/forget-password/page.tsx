'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RequestOtp } from 'apps/user-ui/src/configs/constants/constants';
import { formData } from 'apps/user-ui/src/configs/constants/global.d.types';
import styles from 'apps/user-ui/src/styles/styles';

import { useMutation } from '@tanstack/react-query';
import { axiosBaseUrl } from 'apps/user-ui/src/configs/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import Link from 'next/link';

const ForgetPassword = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(RequestOtp) as any,
  });

  // h-[85vh]
  const onSubmit: SubmitHandler<formData> = (data) => {
    console.log({ singupData: data });
    requestOtp.mutate(data);
  };

  const inputs = watch(['email']); // returns current values
  const dataEmpty = inputs.some((v) => !v);

  // const dataEmpty = Object.values(FormData).some(
  //   (items) => items === '' || !items
  // );

  const requestOtp = useMutation({
    mutationFn: async (data: formData) => {
      const res = await axiosBaseUrl.post(`/request-passwordreset`, data);
      console.log({ resbody: res.data });

      const msg = res?.data?.message || 'Otp sent to your email';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formData) => {
      router.push('/verify-otp');
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg = err?.response?.data?.error || 'Fail to send Otp';
        toast.error(msg);
      }
    },
  });

  return (
    <div className="w-full mx-auto bg-[#fcfcf3] p-6 h-[70vh]">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Reset Your Account
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        Please input your email to reset your account{' '}
      </p>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="w-full sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[25%] shadow-sm bg-white p-4 sm:p-5 rounded-md">
          <Link
            href={'/login'}
            className="text-xs font-roboto text-center py-1 mb-3 text-[#00000099] flex items-center justify-center "
          >
            Go back to
            <span className="text-blue-600 font-poppins font-semibold text-xs text-center ml-2">
              Login
            </span>
          </Link>
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
            {/* Submit */}
            <button
              type="submit"
              className={`${
                requestOtp.isPending ||
                (dataEmpty && 'cursor-not-allowed bg-slate-400')
              } w-full bg-black text-white py-2 px-3 mt-2 rounded-md font-medium text-xs  transition-colors`}
              disabled={requestOtp.isPending || dataEmpty}
            >
              {requestOtp.isPending ? 'Please wait...' : 'Request Otp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
