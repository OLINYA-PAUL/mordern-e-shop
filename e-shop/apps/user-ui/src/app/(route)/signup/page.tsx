'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from 'apps/user-ui/src/configs/constants/constants';
import { formTypes } from 'apps/user-ui/src/configs/constants/global.d.types';
import SVGComponent from 'apps/user-ui/src/shared/components';
import styles from 'apps/user-ui/src/styles/styles';
import { Eye, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { axiosBaseUrl, axiosErr } from 'apps/user-ui/src/configs/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [userData, setUserData] = useState<formTypes | null>(null);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formTypes>({
    resolver: yupResolver(userSchema),
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && inputRef.current[index + 1]) {
      inputRef.current[index + 1]?.focus(); // Move forward
    }
  };

  const verifyUserOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;

      const res = await axiosBaseUrl.post('/verify-user', {
        ...userData,
        otp: otp.join('').trim(),
      });

      const msg = res?.data?.message || 'Account Created successfully';
      toast.success(msg);

      return res.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
    onError: (err: any) => {
      console.log({ 'otp err': err });
      if (err instanceof AxiosError) {
        const msg = err?.response?.data?.error || 'Failed to verify otp';
        setServerError(msg);
        toast.error(msg);
      }
    },
  });

  const handleVerifyOtp = async () => {
    verifyUserOtpMutation.mutate();
  };

  const startResendTimer = () => {
    const timerInterval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit: SubmitHandler<formTypes> = (data) => {
    signUpMutation.mutate(data);
  };

  const resendOTP = () => {
    console.log('Resend OTP clicked');
    // Add API call to resend OTP here if needed
    setCanResend(false);
    setTimer(60);
    startResendTimer();
  };

  const signUpMutation = useMutation({
    mutationFn: async (data: formTypes) => {
      const res = await axiosBaseUrl.post(`/user-registration`, data);
      console.log({ resbody: res.data });

      const msg = res?.data?.message || 'OTP sent to your email';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formTypes) => {
      setUserData(formTypes);
      setTimer(60);
      setShowOtp(true);
      setCanResend(false);
      setServerError('');
      startResendTimer();
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg =
          err?.response?.data?.message ||
          err.message ||
          'Failed to create account';
        setServerError(msg);
        toast.error(msg);
      }
    },
  });

  useEffect(() => {
    if (!showOtp) setOtp(['', '', '', '']);
  }, [showOtp]);

  return (
    <div className="w-full mx-auto bg-[#fcfcf3] flex items-center flex-1 flex-col h-auto justify-center p-6 ">
      <div className="text-xl font-roboto font-semibold text-black text-center">
        Create a new Account
      </div>
      <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
        We are happy to have you back!
      </p>
      <div className="w-full flex items-center justify-center flex-col">
        <div className="md:w-[25%] shadow-sm bg-white p-4 rounded-md">
          <h3 className="text-sm font-extrabold font-roboto text-center text-[#00000099] mb-1">
            Sign up to Eshop
          </h3>
          <p className="text-center font-poppins text-xs mb-2">
            Already have an account?
            <Link href="/login" className="text-blue-600 ml-2">
              Login
            </Link>
          </p>

          <SVGComponent />

          <div className="w-full flex items-center justify-between text-xs my-3">
            <div className="border-t border-x-slate-400 flex-1" />
            <span className="px-2">or Sign Up with Email</span>
            <div className="border-t border-x-slate-400 flex-1" />
          </div>

          {showOtp ? (
            <div className="w-full">
              <h2 className="font-bold text-[17px] font-poppins text-center mb-3">
                Enter OTP
              </h2>

              <div className="flex items-center justify-center gap-3">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    ref={(el) => {
                      if (el) inputRef.current[index] = el;
                    }}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        const newOtp = [...otp];
                        if (otp[index]) {
                          newOtp[index] = '';
                          setOtp(newOtp);
                        } else if (inputRef.current[index - 1]) {
                          inputRef.current[index - 1]?.focus();
                        }
                      }
                    }}
                    className="w-10 h-10 text-center border border-gray-400 rounded-md focus:outline-none font-medium text-lg
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [-moz-appearance:textfield]"
                  />
                ))}
              </div>
              <button
                className={`${
                  otp.some(
                    (digit) => digit === '' || verifyUserOtpMutation.isPending
                  ) && 'bg-slate-300'
                } bg-blue-500 text-sm text-white font-poppins font-semibold mt-5 w-full outline-none border-none py-2 px-4 rounded-full`}
                disabled={
                  otp.some((digit) => digit === '') ||
                  verifyUserOtpMutation.isPending
                }
                type="button"
                onClick={handleVerifyOtp}
              >
                {verifyUserOtpMutation.isPending
                  ? 'Please wait...'
                  : 'Verify OTP'}
              </button>
              <div className="text-center text-sm mt-5">
                {canResend ? (
                  <button
                    className="text-xs font-poppins text-blue-500 outline-none border-none bg-transparent cursor-pointer"
                    onClick={resendOTP}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-xs font-poppins text-blue-500">
                    Resend OTP in{' '}
                    <span className="text-red-600">
                      {timer === 60 ? '1m' : `${timer}s`}
                    </span>
                    {/* <span className="text-red-600">
                      {`${Math.floor(timer / 60)}m ${timer % 60}s`}
                    </span> */}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="w-full mb-2">
                <input
                  type="text"
                  className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px]`}
                  placeholder="Enter your Email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="w-full mb-2">
                <input
                  type="text"
                  className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px]`}
                  placeholder="Enter your Name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.name.message)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="w-full mb-1 flex items-center gap-2 !bg-[#f3f3ec] pr-2 rounded-md">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className={`${styles.input} !border-none !bg-[#f3f3ec] text-xs px-3 py-[6px] flex-1`}
                  placeholder="Enter your Password"
                  {...register('password')}
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

              {/* Submit */}
              <button
                type="submit"
                className={`${
                  signUpMutation.isPending && 'cursor-not-allowed'
                } w-full bg-black text-white py-2 px-3 mt-2 rounded-md font-medium text-xs hover:bg-gray-800 transition-colors`}
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending ? 'Please wait...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* <div className="text-left mt-5">
            {serverError && (
              <p className="text-red-600 font-poppins text-xs" aria-readonly>
                {serverError}
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
