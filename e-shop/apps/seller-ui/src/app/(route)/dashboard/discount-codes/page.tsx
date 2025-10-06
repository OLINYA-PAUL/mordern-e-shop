'use client';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from 'apps/seller-ui/src/configs/axios';
import styles from 'apps/seller-ui/src/styles/styles';
import { ChevronRightIcon, Loader, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdCancel } from 'react-icons/md';
import { bool, boolean } from 'yup';

const DiscountCodes = () => {
  const [isModelShown, setIsModelShown] = useState<boolean>(false);
  const navigate = useRouter();

  const {
    data: discountCodes,
    error,
    isError,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['shop-discount-codes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/get-discount-codes');
      return res?.data?.discountCodes;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const handleDeleteDiscountCode = async (id: string) => {
    setDeleteLoading((prev) => ({
      ...prev,
      [id]: true,
    }));
    return deleteDiscountCodeMutation.mutate(id);
  };
  const [deleteLoading, setDeleteLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const queryClient = useQueryClient();

  // const { } = getUser

  const {
    reset,
    watch,
    handleSubmit,
    register,

    formState: { errors },
  } = useForm({
    defaultValues: {
      discountCode: '',
      public_name: '',
      discountType: 'Percentage',
      discountValue: '',
      sellerId: '',
    },
  });

  const handleCreateDiscountCode = async (data: any) => {
    if (discountCodes?.length === 10)
      return toast.error('You can only create 10 discount codes');

    await createDiscountCodeMutation.mutateAsync({
      ...data,
      sellerId: '689914b2284d64dd0958e350',
    });
    setIsModelShown(false);
  };

  const createDiscountCodeMutation = useMutation({
    mutationKey: ['shop-discount-codes'],
    mutationFn: async (data: any) =>
      await axiosInstance.post('/products/create-discount-codes', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop-discount-codes'] });
      reset();
      setIsModelShown(false);
      return toast.success(
        data?.data?.message || 'Discount code created successfully'
      );
    },
    onError: (error: any) => {
      console.error('Error creating discount code:', error);
      return toast.error(
        error?.response?.data?.message || 'Failed to create discount code'
      );
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationKey: ['shop-discount-codes'],
    mutationFn: async (id: any) =>
      await axiosInstance.delete(`/products/delete-discount-codes/${id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop-discount-codes'] });
      setIsModelShown(false);
      return toast.success(
        data?.data?.message || 'Discount code Deleted successfully'
      );
    },
    onError: (error: any) => {
      console.error('Error creating discount code:', error);
      return toast.error(
        error?.response?.data?.message || 'Failed to Delete discount code'
      );
    },
  });

  return (
    <div className="w-full p-8 min-h-screen relative">
      <div className="flex items-center">
        <span
          className="text-xs text-slate-300 cursor-pointer"
          onClick={() => navigate.push('/dashboard')}
        >
          Dashboard
        </span>
        <ChevronRightIcon className="opacity-70 cursor-pointer" size={15} />
        <span className="text-xs text-slate-300 cursor-pointer">
          Discount Codes
        </span>
      </div>
      <div className="flex justify-between items-center my-2">
        <div className="text-xl font-poppins text-white font-semibold">
          Discounts Codes
        </div>
        <button
          type="button"
          className="text-xs outline-none border-none py-1 px-2 rounded-md bg-blue-950 hover:bg-blue-900 transition duration-300  flex items-center justify-center gap-2 "
          onClick={() => setIsModelShown(true)}
        >
          <Plus size={15} color="white" className="shadow-sm" />
          Add Discount
        </button>
      </div>
      <div className="w-full p-5 relative bg-black/20  mt-7 border border-slate-800 border-opacity-[9.5] text-white">
        <div className="text-md font-poppins text-white font-semibold">
          Your Discounts Codes
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-slate-300 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-slate-200 text-lg font-semibold tracking-wide">
              Loading Discounts...
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Please wait while we fetch your discount codes.
            </p>
          </div>
        ) : (
          <div className="w-full mt-3 overflow-x-auto">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-xs text-slate-200 p-3 w-[25%]">
                    Title
                  </th>
                  <th className="text-left text-xs text-slate-200 p-3 w-[20%]">
                    Type
                  </th>
                  <th className="text-left text-xs text-slate-200 p-3 w-[15%]">
                    Value
                  </th>
                  <th className="text-left text-xs text-slate-200 p-3 w-[25%]">
                    Codes
                  </th>
                  <th className="text-left text-xs text-slate-200 p-3 w-[15%]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {discountCodes && discountCodes.length > 0 ? (
                  discountCodes.map((discount: any) => (
                    <tr
                      key={discount.id}
                      className="hover:bg-slate-900 transition duration-300 border-b border-slate-700"
                    >
                      <td className="p-3 text-xs text-slate-200 w-[25%] truncate">
                        {discount.public_name}
                      </td>
                      <td className="p-3 text-xs text-slate-200 w-[20%]">
                        {discount.discountType === 'percentage'
                          ? 'Percentage (%)'
                          : 'Flat Rate ($)'}
                      </td>
                      <td className="p-3 text-xs text-slate-200 w-[15%]">
                        {discount.discountType === 'percentage'
                          ? `${discount.discountValue}%`
                          : `$${discount.discountValue}`}
                      </td>
                      <td className="p-3 text-xs text-slate-200 w-[25%]">
                        {discount.discountCode}
                      </td>
                      <td className="p-3 w-[15%]">
                        <button
                          type="button"
                          onClick={() => handleDeleteDiscountCode(discount.id)}
                          disabled={
                            deleteDiscountCodeMutation.isPending ||
                            deleteLoading[discount.id]
                          }
                          className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition duration-300"
                        >
                          {deleteLoading[discount.id] ? (
                            <Loader color="white" size={15} />
                          ) : (
                            <Trash size={15} color="white" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m0 3.75h.008v.008H12V16.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>

                        <h2 className="text-lg font-semibold text-red-600 mb-1">
                          No Discount Codes Found
                        </h2>
                        <p className="text-gray-300 max-w-sm">
                          You haven't added any discount codes yet. Once you
                          create one, it will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModelShown && (
        <div className="w-full min-h-screen absolute top-0 left-0 bg-black/90 flex items-center justify-center p-5 z-50">
          <div className="w-full max-w-[700px] bg-black/90 border border-slate-800 text-white rounded-lg shadow-xl relative p-6">
            <MdCancel
              size={22}
              color="white"
              className="absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => setIsModelShown(false)}
            />

            <div className="text-center mb-5">
              <h2 className="text-xl font-semibold text-white mb-1 font-poppins">
                Create Discount Code
              </h2>
              <div className=" border-slate-800 border-opacity-90 w-full border-b my-3" />
            </div>

            <form
              onSubmit={handleSubmit(handleCreateDiscountCode)}
              className="flex flex-col gap-4 items-center justify-center"
            >
              {/* Discount Code */}
              <div className="w-full">
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-slate-700 transition-all"
                  placeholder="Enter Discount Code"
                  {...register('discountCode', {
                    required: 'Discount code is required',
                  })}
                />
                {errors.discountCode && (
                  <p className="text-[11px] text-red-500 mt-1 font-poppins">
                    {String(errors.discountCode.message)}
                  </p>
                )}
              </div>

              {/* Public Name */}
              <div className="w-full">
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-slate-700 transition-all"
                  placeholder="Enter Public Name"
                  {...register('public_name', {
                    required: 'Public name is required',
                  })}
                />
                {errors.public_name && (
                  <p className="text-[11px] text-red-500 mt-1 font-poppins">
                    {String(errors.public_name.message)}
                  </p>
                )}
              </div>

              {/* Discount Type */}
              <div className="w-full">
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-slate-700 transition-all"
                  placeholder="Enter Discount Type (e.g. percentage)"
                  {...register('discountType', {
                    required: 'Discount type is required',
                  })}
                />
                {errors.discountType && (
                  <p className="text-[11px] text-red-500 mt-1 font-poppins">
                    {String(errors.discountType.message)}
                  </p>
                )}
              </div>

              {/* Discount Value */}
              <div className="w-full">
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-slate-700 transition-all"
                  placeholder="Enter Discount Value"
                  {...register('discountValue', {
                    required: 'Discount value is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]+$/,
                      message: 'Please enter a valid number or decimal',
                    },
                  })}
                />
                {errors.discountValue && (
                  <p className="text-[11px] text-red-500 mt-1 font-poppins">
                    {String(errors.discountValue.message)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createDiscountCodeMutation.isPending}
                className={`w-full py-2 px-3 mt-2 rounded-md font-medium text-xs transition-colors duration-200 ${
                  createDiscountCodeMutation.isPending
                    ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {createDiscountCodeMutation.isPending
                  ? 'Creating...'
                  : 'Create Discount Code'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodes;
