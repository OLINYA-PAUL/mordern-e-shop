'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from 'apps/seller-ui/src/configs/axios';
import { ChevronRightIcon, Edit2, Loader, Plus, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const DeleteDiscountCode = ({
  id,
  setIsDeleteDiscountCodeModel,
  publicName,
}: {
  id: string;
  publicName: string;
  setIsDeleteDiscountCodeModel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log('onclick', setIsDeleteDiscountCodeModel);
  const queryClient = useQueryClient();
  const handleDeleteDiscountCode = async (id: string) => {
    setDeleteLoading((prev) => ({
      ...prev,
      [id]: true,
    }));
    deleteDiscountCodeMutation.mutate(id);
  };
  const [deleteLoading, setDeleteLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const deleteDiscountCodeMutation = useMutation({
    mutationKey: ['shop-discount-codes'],
    mutationFn: async (id: any) =>
      await axiosInstance.delete(`/products/delete-discount-codes/${id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop-discount-codes'] });
      setIsDeleteDiscountCodeModel(false);
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white text-center">
            Are you sure you want to delete this item?
          </h3>
          <button
            onClick={() => setIsDeleteDiscountCodeModel(false)}
            className="absolute right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 text-center">
          <p className="text-slate-300 text-xs mb-4">
            You are about to delete the discount{' '}
            <span className="font-bold text-white text-[15px] font-poppins">
              {publicName}
            </span>
            {'  '}?. <br />
            This action cannot be undone. Please confirm your decision.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteDiscountCodeModel(false)}
              className="w-1/2 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={deleteLoading[id]}
              className="w-1/2 py-2 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={() => handleDeleteDiscountCode(id)}
            >
              {deleteLoading[id] ? (
                <Loader color="white" size={15} />
              ) : (
                <>
                  <Trash size={12} className="mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscountCodes = () => {
  const [isModelShown, setIsModelShown] = useState<boolean>(false);
  const [isEditModelShown, setIsEditModelShown] = useState(false);
  const [isDeleteDiscountCodeModel, setIsDeleteDiscountCodeModel] =
    useState<boolean>(false);
  const navigate = useRouter();
  const {
    reset,
    watch,
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      discountCodes: '',
      public_name: '',
      discountType: 'Percentage',
      discountValue: '',
    },
  });
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

  console.log('discountCodes :<===>', discountCodes);
  const [editLoading, setEditLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const queryClient = useQueryClient();

  const [id, setEditId] = useState<string>('');

  const getEditDiscountCodeId = (id: string) => {
    const selected = discountCodes.find((item: any) => item.id === id);
    if (!selected) return toast.error('Invalid discount ID');

    setEditId(id);

    reset({
      discountCodes: selected.discountCodes || '',
      public_name: selected.public_name || '',
      discountType: selected.discountType || 'Percentage',
      discountValue: selected.discountValue || '',
    });

    setIsEditModelShown(true);
  };

  const handleEditDiscountCode = async (data: any) => {
    console.log('updating data ==>', data);
    const isValid = discountCodes.some(
      (discountId: any) => discountId.id === id.toString().trim()
    );

    if (!isValid) {
      toast.error('Invalid discount ID');
      return;
    }

    setEditLoading((prev) => ({
      ...prev,
      [id]: true,
    }));

    editDiscountCodeMutation.mutate({
      id,
      data,
    });
  };

  // const { } = getUser

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

  const editDiscountCodeMutation = useMutation({
    mutationKey: ['shop-discount-codes'],
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      await axiosInstance.put(`/products/edit-discount-codes/${id}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop-discount-codes'] });
      setIsEditModelShown(false);
      return toast.success(
        data?.data?.message || 'Discount code Edited successfully'
      );
    },
    onError: (error: any) => {
      console.error('Error creating discount code:', error);
      return toast.error(
        error?.response?.data?.message || 'Failed to Edited discount code'
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
          onClick={() => {
            reset({
              discountCodes: '',
              public_name: '',
              discountType: 'Percentage',
              discountValue: '',
            });
            setIsModelShown(true);
          }}
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
                  <th className="text-left text-xs text-slate-200 p-3 w-[20%]">
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
                        {discount.discountType === 'Percentage'
                          ? 'Percentage (%)'
                          : 'Flat Rate ($)'}
                      </td>
                      <td className="p-3 text-xs text-slate-200 w-[15%]">
                        {discount.discountType === 'percentage'
                          ? `${discount.discountValue}%`
                          : `$${discount.discountValue}`}
                      </td>
                      <td className="p-3 text-xs text-slate-200 w-[20%]">
                        {discount.discountCodes}
                      </td>
                      <td className="p-3 w-[15%]">
                        <button
                          type="button"
                          onClick={() => setIsDeleteDiscountCodeModel(true)}
                          className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition duration-300"
                        >
                          <Trash size={10} color="white" />
                        </button>

                        {isDeleteDiscountCodeModel && discount.id && (
                          <DeleteDiscountCode
                            id={discount.id}
                            setIsDeleteDiscountCodeModel={
                              setIsDeleteDiscountCodeModel
                            }
                            publicName={discount.public_name}
                          />
                        )}
                      </td>

                      <td className="p-3 w-[15%]">
                        <button
                          type="button"
                          onClick={() => getEditDiscountCodeId(discount.id)}
                          className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          <Edit2 size={10} color="white" />
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

      {/* COMPACT CREATE MODAL */}
      {isModelShown && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white">
                Create Discount
              </h3>
              <button
                onClick={() => setIsModelShown(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(handleCreateDiscountCode)}
              className="p-4 space-y-3"
            >
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Public Name"
                  {...register('public_name', {
                    required: 'Public name is required',
                  })}
                />
                {errors.public_name && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.public_name.message)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="discountType" className="text-xs">
                  Select Discount Type
                </label>
                <Controller
                  name="discountType"
                  control={control}
                  key={'discountType'}
                  render={({ field }) => {
                    return (
                      <>
                        <select
                          className="w-full mt-2 bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                          {...field}
                        >
                          <option value={'Percentage'}>Percentage (%)</option>
                          <option value={'Flat Rate'}>Flat Rate ($)</option>
                        </select>
                      </>
                    );
                  }}
                />
                {errors.discountType && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountType.message)}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Discount Value"
                  {...register('discountValue', {
                    required: 'Discount value is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]+$/,
                      message: 'Please enter a valid number',
                    },
                  })}
                />
                {errors.discountValue && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountValue.message)}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Discount Code"
                  {...register('discountCodes', {
                    required: 'Discount code is required',
                  })}
                />
                {errors.discountCodes && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountCodes.message)}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModelShown(false)}
                  className="flex-1 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDiscountCodeMutation.isPending}
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createDiscountCodeMutation.isPending
                    ? 'Creating...'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPACT EDIT MODAL */}
      {isEditModelShown && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white">
                Edit Discount
              </h3>
              <button
                onClick={() => setIsEditModelShown(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(handleEditDiscountCode)}
              className="p-4 space-y-3"
            >
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Public Name"
                  {...register('public_name', {
                    required: 'Public name is required',
                  })}
                />
                {errors.public_name && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.public_name.message)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="discountType" className="text-xs">
                  Select Discount Type
                </label>
                <Controller
                  name="discountType"
                  control={control}
                  key={'discountType'}
                  render={({ field }) => {
                    return (
                      <>
                        <select
                          className="w-full mt-2 bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                          {...field}
                        >
                          <option value={'Percentage'}>Percentage (%)</option>
                          <option value={'Flat Rate'}>Flat Rate ($)</option>
                        </select>
                      </>
                    );
                  }}
                />
                {errors.discountType && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountType.message)}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Discount Value"
                  {...register('discountValue', {
                    required: 'Discount value is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]+$/,
                      message: 'Please enter a valid number',
                    },
                  })}
                />
                {errors.discountValue && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountValue.message)}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-xs px-3 py-1 text-white placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
                  placeholder="Discount Code"
                  {...register('discountCodes', {
                    required: 'Discount code is required',
                  })}
                />
                {errors.discountCodes && (
                  <p className="text-[10px] text-red-400 mt-1">
                    {String(errors.discountCodes.message)}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModelShown(false)}
                  className="flex-1 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editDiscountCodeMutation.isPending}
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editDiscountCodeMutation.isPending
                    ? 'Updating...'
                    : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodes;
