import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'apps/seller-ui/src/configs/axios';
import { createShopSchema } from 'apps/seller-ui/src/configs/constants/constants';
import styles from 'apps/seller-ui/src/styles/styles';
import { categories } from 'apps/seller-ui/src/utils/categories/categories';
import { AxiosError } from 'axios';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export interface formData {
  name: string;
  address: string;
  bio: string;
  opening_hours: string;
  website: string;
  categories: string;
}

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: any;
  setActiveStep: (activeState: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(createShopSchema),
  } as any);

  const watchedValues = watch();

  // Fixed dataEmpty logic
  const dataEmpty =
    !watchedValues.name ||
    !watchedValues.address ||
    !watchedValues.bio ||
    !watchedValues.opening_hours ||
    !watchedValues.website ||
    !watchedValues.categories;

  const onSubmit: SubmitHandler<formData> = (data) => {
    const shopData = { ...data, sellerId };

    console.log('Shop data to be submitted:', shopData);
    cretaeShopMutation.mutate(shopData);
  };

  const cretaeShopMutation = useMutation({
    mutationFn: async (data: formData) => {
      const res = await axiosInstance.post(`/create-shop`, data);
      console.log({ resbody: res.data });

      const msg = res?.data?.message || 'Shop created successfully';
      toast.success(msg);
      return res.data;
    },
    onSuccess: (_, formData) => {
      toast.success('Shop created successfully');
      setActiveStep(3);
    },
    onError: (err: any) => {
      console.log('user error', err);
      if (err instanceof AxiosError) {
        const msg = err?.response?.data?.error || 'Failed to create account';
        toast.error(msg);
      }
    },
  });

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).length;
  };

  console.log('sellerId in CreateShop:', sellerId);
  return (
    <div className=" w-full flex flex-col items-center min-h-screen mt-3 mx-auto">
      <div className="min-h-screen w-full mx-auto bg-[#fcfcf3] flex items-center flex-1 flex-col h-auto  p-6 ">
        <div className="w-full">
          <div className="text-xl font-roboto font-semibold text-black text-center">
            Create a new Shop
          </div>
          <p className="text-xs font-roboto text-center py-1 mb-2 text-[#00000099]">
            We are happy to have you creating a shop!
          </p>
          <div className="w-full flex items-center justify-center flex-col">
            <div className="w-full sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[25%] shadow-sm bg-white p-4 sm:p-5 rounded-md">
              <h3 className="text-sm font-extrabold font-roboto text-center text-[#00000099] mb-2">
                Startup your new shop
              </h3>

              <form onSubmit={handleSubmit(onSubmit)}>
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
                {/* Bio */}
                <div className="w-full mb-2">
                  <textarea
                    rows={3}
                    cols={3}
                    className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px] resize-none`}
                    placeholder="Enter your shop bio"
                    {...register('bio', {
                      validate: (value) => {
                        if (!value) return true; // Let required validation handle empty values
                        return (
                          countWords(value) <= 100 ||
                          'Bio must be less than 100 words'
                        );
                      },
                    })}
                  />
                  {errors.bio && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.bio.message)}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div className="w-full mb-2">
                  <textarea
                    rows={2}
                    cols={2}
                    className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px] resize-none`}
                    placeholder="Enter your shop address"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.address.message)}
                    </p>
                  )}
                </div>

                {/* Opening Hours */}
                <div className="w-full mb-2">
                  <textarea
                    rows={2}
                    cols={2}
                    className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px] resize-none`}
                    placeholder="Enter your shop opening hours"
                    {...register('opening_hours', {
                      validate: (value) => {
                        if (!value) return true; // Let required validation handle empty values
                        return (
                          countWords(value) <= 100 ||
                          'Opening hours must be less than 100 words'
                        );
                      },
                    })}
                  />
                  {errors.opening_hours && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.opening_hours.message)}
                    </p>
                  )}
                </div>

                {/* website */}
                <div className="w-full mb-2">
                  <input
                    type="url"
                    className={`${styles.input} !bg-[#f3f3ec] !rounded-md text-xs px-3 py-[6px]`}
                    placeholder="Enter your Website URL"
                    {...register('website', {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                  />
                  {errors.website && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.website.message)}
                    </p>
                  )}
                </div>

                <div className="w-full mb-2">
                  <select
                    className="w-full text-xs px-3 py-[6px] rounded-md !bg-[#f3f3ec] border border-[#f3f3ec] focus:outline-none"
                    {...register('categories', {
                      required: 'categories is required',
                    })}
                  >
                    <option value="" className="bg-slate-900 text-slate-300">
                      Select category
                    </option>
                    {categories.map((categories: any) => (
                      <option
                        key={categories.value}
                        value={categories.value}
                        className="bg-slate-900 text-white cursor-pointer"
                      >
                        {categories.label}
                      </option>
                    ))}
                  </select>

                  {errors.categories && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.categories.message)}
                    </p>
                  )}
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  className={`${
                    cretaeShopMutation.isPending ||
                    (dataEmpty && 'cursor-not-allowed bg-slate-400')
                  } w-full bg-black text-white py-2 px-3 mt-2 rounded-md font-medium text-xs transition-colors`}
                  disabled={cretaeShopMutation.isPending || dataEmpty}
                >
                  {cretaeShopMutation.isPending
                    ? 'Please wait...'
                    : 'Create Shop'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShop;
