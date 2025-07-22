'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResetNewPassword } from 'apps/user-ui/src/configs/constants/constants';
import styles from 'apps/user-ui/src/styles/styles';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'apps/user-ui/src/configs/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export interface formData {
  email: string;
  newpassword?: string;
}

const ResetPassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(ResetNewPassword) as any,
  });

  // h-[85vh]
  const onSubmit: SubmitHandler<formData> = (data) => {
    console.log({ singupData: data });
    signInMutation.mutate(data);
  };

  const inputs = watch(['email', 'newpassword']); // returns current values
  const dataEmpty = inputs.some((v) => !v);

  // const dataEmpty = Object.values(FormData).some(
  //   (items) => items === '' || !items
  // );

  const signInMutation = useMutation({
    mutationFn: async (data: formData) => {
      const res = await axiosInstance.post(`/reset-password`, data);
      console.log({ resbody: res.data });

      const msg = res?.data?.message || 'Password reset successful';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formData) => {
      router.push('/login');
      setServerError('');
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg =
          err?.response?.data?.error || 'Failed to reset new password';
        setServerError(msg);
        toast.error(msg);
      }
    },
  });

  return (
    <div className="w-full mx-auto bg-[#fcfcf3]  p-6 ">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Create New password to login your account{' '}
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        Get back to your account with new password!
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
                type={isPasswordVisible ? 'text' : 'password'}
                className={`${styles.input} !border-none !bg-[#f3f3ec] text-xs px-3 py-[6px] flex-1`}
                placeholder="Enter your Password"
                {...register('newpassword', {
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
            {errors.newpassword && (
              <p className="text-[11px] font-poppins text-red-500 mt-1">
                {String(errors.newpassword.message)}
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
              {signInMutation.isPending
                ? 'Please wait...'
                : 'Submit new password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
