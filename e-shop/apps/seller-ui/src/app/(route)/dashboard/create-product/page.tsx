'use client';

import ColorSelector from 'apps/seller-ui/src/shared/components/ColorSelector/ColorSelector';
import ImagePlaceHolders from 'apps/seller-ui/src/shared/components/image-placeholders/page';
import ProductInput from 'apps/seller-ui/src/shared/components/ProductInput/page';
import { ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomSpecification from 'apps/seller-ui/src/shared/components/customeSpecification/customeSpecification';
import CustomProperty from 'apps/seller-ui/src/shared/components/CustomProperty/CustomProperty';

const CreateProduct = () => {
  const handleCreateProduct = (data: any) => {
    console.log('Product created:', data);
  };

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const productImageSizes = [
    { width: 400, height: 200 },
    { width: 600, height: 400 },
    { width: 800, height: 600 },
    { width: 1000, height: 500 },
    { width: 1200, height: 800 },
    { width: 1500, height: 500 },
    { width: 1080, height: 1080 },
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1600, height: 900 },
    { width: 1920, height: 1080 },
    { width: 2048, height: 2048 },
    { width: 2560, height: 1440 },
    { width: 2560, height: 1600 },
    { width: 3000, height: 1000 },
    { width: 3840, height: 2160 },
    { width: 4000, height: 3000 },
    { width: 4500, height: 1500 },
    { width: 5000, height: 5000 },
  ];

  const [openImageModel, setOpenImageModel] = useState<boolean>(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [selectedSize, setSelectedSize] = useState<string>(
    `${productImageSizes[0].width}x${productImageSizes[0].height}`
  );

  const onFileChange = (file: File, index: number) => {
    const updatedImages = images ? [...images] : [];
    updatedImages[index] = file;

    if (index === images?.length - 1 && images?.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue('images', updatedImages);
    setOpenImageModel(false);
  };

  const onFileRemove = (index: number) => {
    if (index < 0 || index >= images.length) return;

    // Copy current images
    let updatedImages = [...images];

    // Remove the selected image
    updatedImages.splice(index, 1);

    // Ensure at least one null placeholder exists
    if (!updatedImages.includes(null)) {
      updatedImages.push(null);
    }

    // Update state and form value
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).length;
  };

  return (
    <form
      className="w-full m-auto p-4 shadow-md rounded-md text-white"
      onSubmit={handleSubmit(handleCreateProduct)}
    >
      <h2 className="text-xl font-poppins py-2 font-semibold">
        Create New Product
      </h2>

      <div className="flex items-center">
        <span className="text-xs text-slate-300 cursor-pointer">Dashboard</span>
        <ChevronRightIcon className="opacity-70 cursor-pointer" size={15} />
        <span className="text-xs text-slate-300 cursor-pointer">
          Create Product
        </span>
      </div>

      {/* ✅ Responsive Wrapper */}
      <div className="flex flex-col md:flex-row gap-10 py-4 w-full">
        {/* Left Section */}
        <div className="md:w-[35%] w-full rounded-md h-auto">
          {images.length > 0 && (
            <ImagePlaceHolders
              small={false}
              size={selectedSize}
              onFileChange={onFileChange}
              onFileRemove={onFileRemove}
              defaultImage="https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"
              index={0}
              setOpenImageModel={setOpenImageModel}
            />
          )}

          <select
            className="w-full mt-2 cursor-pointer mb-2 bg-slate-800 text-white text-sm rounded p-1 focus:outline-none focus:ring-0 border-0"
            onChange={(e: any) => {
              setSelectedSize(e.target.value);
            }}
          >
            {productImageSizes.map((size, index) => (
              <option
                key={index}
                value={`${size.width} x ${size.height}`}
                className="bg-slate-800 text-white cursor-pointer"
              >
                {size.width} x {size.height}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 mt-3 gap-4">
            {images.slice(1).map((_, index) => {
              console.log(index, 'image index');

              return (
                <ImagePlaceHolders
                  small
                  key={index}
                  size={'300 x 300'}
                  onFileChange={onFileChange}
                  onFileRemove={onFileRemove}
                  defaultImage="https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"
                  index={index}
                  setOpenImageModel={setOpenImageModel}
                />
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-[65%] w-full rounded-md h-auto">
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="w-full sm:w-2/4">
              <div className="w-full">
                <ProductInput
                  label={'Product name'}
                  type={'text'}
                  className="mt-2  !bg-slate-800 text-white  rounded-md"
                  placeholder="enter Product name"
                  {...register('title', {
                    required: 'Value is required',
                  })}
                />
                {errors.title && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.title.message)}
                  </p>
                )}
              </div>
              <div className="w-full mt-2">
                <ProductInput
                  label={'product description'}
                  type={'textarea'}
                  className=" mt-2 !bg-slate-800 text-white  rounded-md"
                  placeholder="enter Product name"
                  cols={5}
                  rows={5}
                  {...register('product_description', {
                    validate: (value) => {
                      if (!value) return true; // Let required validation handle empty values
                      return (
                        countWords(value) <= 100 ||
                        'Bio must be less than 100 words'
                      );
                    },
                  })}
                />
                {errors.product_description && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.product_description.message)}
                  </p>
                )}
              </div>
              <div className="w-full">
                <ProductInput
                  label={'Product tags *'}
                  type={'text'}
                  className="mt-2  !bg-slate-800 text-white  rounded-md"
                  placeholder="Separate tags with commas: electronics, gadgets, etc."
                  {...register('tags', {
                    required: 'Value is required',
                  })}
                />
                {errors.tags && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.tags.message)}
                  </p>
                )}
              </div>
              <div className="w-full mt-2">
                <ProductInput
                  label={'Product Waranty *'}
                  type={'text'}
                  className="mt-2  !bg-slate-800 text-white  rounded-md"
                  placeholder="Product Waranty"
                  {...register('Waranty', {
                    required: 'Value is required',
                  })}
                />
                {errors.Waranty && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.Waranty.message)}
                  </p>
                )}
              </div>
              <div className="w-full mt-2">
                <ProductInput
                  label="Product Slug *"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-md text-xs"
                  placeholder="enter product slug"
                  {...register('slug', {
                    required: 'Slug is required',
                    maxLength: {
                      value: 50,
                      message: 'Slug must be less than 50 characters',
                    },
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters long',
                    },
                    pattern: {
                      value: /^[a-z0-9]+(-[a-z0-9]+)+$/, // must have at least one hyphen
                      message:
                        'Slug must be lowercase, hyphen-separated, and have at least two words',
                    },
                    validate: (value: string) => {
                      const words = value.split('-');
                      if (words.length > 5)
                        return 'Slug must not exceed 5 words';
                      return true;
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.slug.message)}
                  </p>
                )}
              </div>

              <div className="w-full mt-2">
                <ProductInput
                  label={'Brand *'}
                  type={'text'}
                  className="mt-2  !bg-slate-800 text-white  rounded-md"
                  placeholder="Product Brand"
                  {...register('brand', {
                    required: 'Value is required',
                  })}
                />
                {errors.brand && (
                  <p className="text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.brand.message)}
                  </p>
                )}
              </div>
              <div className="w- mt-5">
                <ColorSelector control={control} error={errors} />
              </div>
              <div className="w- mt-5">
                <CustomSpecification
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="w- mt-5">
                <CustomProperty
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="w-full mt-2">
                <label className="text-xs font-poppins text-slate-300">
                  Cash On Delivery <span className="text-red-500">*</span>
                </label>

                <div className="w-full mt-1">
                  <select
                    {...register('cash_on_delivery', {
                      required: 'Cash deleivery is required',
                    })}
                    defaultValue="Yes"
                    className="w-full bg-slate-800 cursor-pointer text-white text-xs font-poppins px-2 py-1.5 rounded-md border border-slate-600 focus:outline-none focus:ring-1  transition-colors"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.cash_on_delivery && (
                    <p className="text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.cash_on_delivery.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-2/4">
              <label className="text-xs font-poppins text-slate-300">
                Category <span className="">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateProduct;
