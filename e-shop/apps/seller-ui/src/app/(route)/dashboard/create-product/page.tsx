'use client';

import ColorSelector from 'apps/seller-ui/src/shared/components/ColorSelector/ColorSelector';
import ImagePlaceHolders from 'apps/seller-ui/src/shared/components/image-placeholders/page';
import ProductInput from 'apps/seller-ui/src/shared/components/ProductInput/page';
import { ChevronRightIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomSpecification from 'apps/seller-ui/src/shared/components/customeSpecification/customeSpecification';
import CustomProperty from 'apps/seller-ui/src/shared/components/CustomProperty/CustomProperty';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'apps/seller-ui/src/configs/axios';
import RichTextEditor from 'apps/seller-ui/src/shared/components/richTextEditors';
import { useRouter } from 'next/navigation';
import SizeSlector from 'packages/components/SizeSlector';
import toast from 'react-hot-toast';
const CreateProduct = () => {
  const handleCreateProduct = (data: any) => {
    console.log('Product created:', data);
  };

  const handleSveDraft = (data: any) => {};

  const [isChange, setIsChange] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const productImageSizes = [
    { width: 400, height: 200 },
    { width: 480, height: 200 },
  ];

  const {
    data: discountCodes,
    error: discountCodeError,
    isLoading: discountCodeLoading,
  } = useQuery({
    queryKey: ['shop-discount-codes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/get-discount-codes');
      return res?.data?.discountCodes;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const [openImageModel, setOpenImageModel] = useState<boolean>(false);

  const [selectedSize, setSelectedSize] = useState<string>(
    `${productImageSizes[0].width}x${productImageSizes[0].height}`
  );

  interface UploadedFile {
    file_url: string;
    file_id: string;
  }

  const [filId, setFileId] = useState<string>('');
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  const onFileChange = async (file: File, index: number) => {
    if (!file) return;

    // Set loading for THIS specific index
    setImageLoading((prev) => ({ ...prev, [index]: true }));

    const files = await fileToBase64(file);

    try {
      const res = await axiosInstance.post('/products/upload-image', {
        files,
      });

      const updatedImages = [...images];
      const uploadedImage = {
        file_url: res.data.file_url,
        file_id: res.data.file_id,
      };

      updatedImages[index] = uploadedImage;

      // Add a new placeholder if we're at the last position and haven't reached the limit
      if (index === images.length - 1 && images.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      console.log('Updated images:', updatedImages);

      setValue(
        'images',
        updatedImages.filter((img) => img !== null)
      );

      toast.success(res.data.message || 'Image uploaded successfully');
    } catch (error) {
      console.log('Error uploading image:', (error as Error).message);
      toast.error('Failed to upload image');
    } finally {
      setImageLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const [images, setImages] = useState<(UploadedFile | null)[]>([null]);

  const onFileRemove = async (index: number) => {
    try {
      if (index < 0 || index >= images.length) return;

      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if (imageToDelete && typeof imageToDelete === 'object') {
        const res = await axiosInstance.delete('/products/delete-image-file', {
          data: { file_id: imageToDelete.file_id },
        });
        toast.success(res.data.message || 'Image deleted successfully');
      }

      updatedImages.splice(index, 1);

      // Ensure there's always at least one null placeholder
      if (
        updatedImages.length === 0 ||
        !updatedImages.some((img) => img === null)
      ) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue(
        'images',
        updatedImages.filter((img) => img !== null)
      );
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Failed to delete image');
    }
  };

  const navigate = useRouter();

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).length;
  };

  const {
    data,
    error,
    isError,
    isSuccess,
    isPending: categoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/get-product-categories');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const categoriesData = data?.categories ?? [];
  const subCategoriesData = data?.subCategories ?? [];

  const selectedCategory = watch('categories');
  const regularPrice = watch('regular_price');

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData?.[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  return (
    <form
      className="w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 shadow-md rounded-md text-white"
      onSubmit={handleSubmit(handleCreateProduct)}
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-poppins py-2 font-semibold">
        Create New Product
      </h2>

      <div className="flex items-center gap-1">
        <span
          className="text-[10px] sm:text-xs text-slate-300 cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate.push('/dashboard')}
        >
          Dashboard
        </span>
        <ChevronRightIcon className="opacity-70 cursor-pointer" size={12} />
        <span className="text-[10px] sm:text-xs text-slate-300 cursor-pointer">
          Create Product
        </span>
      </div>

      {/* Responsive Wrapper */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 py-4 w-full">
        {/* Left Section - Images */}
        <div className="w-full lg:w-[35%] xl:w-[30%] rounded-md h-auto space-y-3">
          {images.length > 0 && (
            <div className="w-full">
              <ImagePlaceHolders
                small={false}
                size={selectedSize}
                onFileChange={onFileChange}
                onFileRemove={onFileRemove}
                defaultImage="https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"
                index={0}
                setOpenImageModel={setOpenImageModel}
                currentImage={images[0]?.file_url || null} // ✅ Pass the URL string or null
                imageLoading={imageLoading[0] || false}
              />

              <select
                className="w-full mt-2 cursor-pointer bg-slate-800 text-white text-xs sm:text-sm rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-600"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
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
            </div>
          )}

          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.slice(1).map((image, idx) => (
                <ImagePlaceHolders
                  small
                  key={`thumb-${idx + 1}`}
                  size={'100 x 100'}
                  onFileChange={onFileChange}
                  onFileRemove={onFileRemove}
                  defaultImage="https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"
                  index={idx + 1} // ✅ Pass the actual array index
                  setOpenImageModel={setOpenImageModel}
                  currentImage={image?.file_url || null} // ✅ Pass the URL string or null
                  imageLoading={imageLoading[idx + 1] || false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Form Fields */}
        <div className="w-full lg:w-[65%] xl:w-[70%] rounded-md h-auto">
          <div className="w-full flex flex-col xl:flex-row gap-4 md:gap-5">
            {/* Left Column */}
            <div className="w-full xl:w-1/2 space-y-2">
              <div className="w-full">
                <ProductInput
                  label={'Product name'}
                  type={'text'}
                  className="mt-2 !bg-slate-800 text-white rounded-md text-sm"
                  placeholder="enter Product name"
                  {...register('title', {
                    required: 'Value is required',
                  })}
                />
                {errors.title && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.title.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label={'product description'}
                  type={'textarea'}
                  className="mt-2 !bg-slate-800 text-white rounded-md text-sm"
                  placeholder="enter Product name"
                  cols={5}
                  rows={5}
                  {...register('product_description', {
                    validate: (value) => {
                      if (!value) return true;
                      return (
                        countWords(value) <= 100 ||
                        'Bio must be less than 100 words'
                      );
                    },
                  })}
                />
                {errors.product_description && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.product_description.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label={'Product tags *'}
                  type={'text'}
                  className="mt-2 !bg-slate-800 text-white rounded-md text-sm"
                  placeholder="Separate tags with commas: electronics, gadgets, etc."
                  {...register('tags', {
                    required: 'Value is required',
                  })}
                />
                {errors.tags && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.tags.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label={'Product Waranty *'}
                  type={'text'}
                  className="mt-2 !bg-slate-800 text-white rounded-md text-sm"
                  placeholder="Product Waranty"
                  {...register('Waranty', {
                    required: 'Value is required',
                  })}
                />
                {errors.Waranty && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.Waranty.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label="Product Slug *"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-md text-xs sm:text-sm"
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
                      value: /^[a-z0-9]+(-[a-z0-9]+)+$/,
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
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.slug.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label={'Brand *'}
                  type={'text'}
                  className="mt-2 !bg-slate-800 text-white rounded-md text-sm"
                  placeholder="Product Brand"
                  {...register('brand', {
                    required: 'Value is required',
                  })}
                />
                {errors.brand && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.brand.message)}
                  </p>
                )}
              </div>

              <div className="w-full pt-3">
                <ColorSelector control={control} error={errors} />
              </div>

              <div className="w-full pt-3">
                <CustomSpecification
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>

              <div className="w-full pt-3">
                <CustomProperty
                  control={control}
                  errors={errors}
                  register={register}
                />
              </div>

              <div className="w-full">
                <label className="text-xs sm:text-sm font-poppins text-slate-300">
                  Cash On Delivery <span className="text-red-500">*</span>
                </label>

                <div className="w-full mt-1">
                  <select
                    {...register('cash_on_delivery', {
                      required: 'Cash deleivery is required',
                    })}
                    defaultValue="Yes"
                    className="w-full bg-slate-800 cursor-pointer text-white text-xs sm:text-sm font-poppins px-2 py-1.5 rounded-md border border-slate-600 focus:outline-none focus:ring-1 transition-colors"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.cash_on_delivery && (
                    <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                      {String(errors.cash_on_delivery.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full xl:w-1/2 space-y-2">
              <div>
                <label className="text-xs sm:text-sm font-poppins text-slate-300">
                  Category <span className="">*</span>
                </label>
                <div className="w-full mt-2">
                  {categoriesLoading ? (
                    <div className="text-xs sm:text-sm">Loading...</div>
                  ) : isError ? (
                    <div className="w-full text-red-500 text-xs sm:text-sm">
                      {error?.message && String(error?.message)}
                    </div>
                  ) : (
                    <>
                      <Controller
                        name={`categories`}
                        control={control}
                        rules={{ required: 'Category is required' }}
                        render={({ field }) => (
                          <select
                            className="w-full bg-black cursor-pointer p-1.5 sm:p-2 border border-gray-400 text-xs sm:text-sm"
                            {...field}
                          >
                            <option className="text-white text-xs sm:text-sm bg-black cursor-pointer">
                              select category
                            </option>

                            {categoriesData.map(
                              (category: string, id: string) => (
                                <option
                                  key={id}
                                  value={category}
                                  className="text-white text-xs sm:text-sm cursor-pointer overflow-y-auto bg-black"
                                  onChange={() => field.onChange}
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      />
                      {errors.categories && (
                        <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                          {String(errors.categories.message)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-poppins text-slate-300">
                  Sub categories <span className="">*</span>
                </label>
                <div className="w-full mt-2">
                  {categoriesLoading ? (
                    <div className="text-xs sm:text-sm">Loading...</div>
                  ) : isError ? (
                    <div className="w-full text-red-500 text-xs sm:text-sm">
                      {error?.message && String(error?.message)}
                    </div>
                  ) : (
                    <>
                      <Controller
                        name={`sub_categories`}
                        control={control}
                        rules={{ required: 'Category is required' }}
                        render={({ field }) => (
                          <select
                            className="w-full bg-black cursor-pointer p-1.5 sm:p-2 border border-gray-400 text-xs sm:text-sm"
                            {...field}
                          >
                            <option className="text-white text-xs sm:text-sm bg-black cursor-pointer">
                              select sub category
                            </option>

                            {subCategories.map(
                              (category: string, id: number) => {
                                console.log(
                                  'am i getting Sub category',
                                  category
                                );

                                return (
                                  <option
                                    key={id}
                                    value={category}
                                    className="text-white text-xs sm:text-sm cursor-pointer overflow-y-auto bg-black"
                                    onChange={() => field.onChange}
                                  >
                                    {category}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        )}
                      />
                      {errors.sub_categories && (
                        <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                          {String(errors.sub_categories.message)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-poppins text-xs sm:text-sm">
                  Detailed Descriptions *(Min 100 words)
                </label>
                <Controller
                  control={control}
                  name="deatils_description"
                  rules={{
                    required: 'please enters a description',
                    validate: (value: string) => {
                      const words = value
                        .split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        words >= 100 || 'Description must be at least 100 words'
                      );
                    },
                  }}
                  key={'details description'}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.deatils_description && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.deatils_description.message)}
                  </p>
                )}
              </div>

              <div className="w-full">
                <ProductInput
                  label="Video URL *"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-sm text-xs sm:text-sm"
                  placeholder="https://www.youtube.com/embed/xyz123"
                  {...register('slug', {
                    required: 'URL is required',
                    pattern: {
                      value:
                        /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message:
                        'Invalid YouTube embed URL! Use format: https://www.youtube.com/embed/VIDEO_ID',
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-[10px] sm:text-[11px] font-poppins text-red-500 mt-1">
                    {String(errors.slug.message)}
                  </p>
                )}
              </div>

              <div>
                <ProductInput
                  label="Regular Price"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-sm text-xs sm:text-sm"
                  placeholder="$20"
                  {...register('regular_price', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Price must be at least 1' },
                    validate: (value) =>
                      !isNaN(value) || 'Only numbers are allowed',
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div>
                <ProductInput
                  label="Sales Price"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-sm text-xs sm:text-sm"
                  placeholder="$10"
                  {...register('Sales_price', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Price must be at least 1' },
                    validate: (value: number) => {
                      if (isNaN(value)) {
                        return 'Only numbers are allowed';
                      }

                      if (regularPrice && value > regularPrice) {
                        return 'Sale price must be less than regular price';
                      }

                      return true;
                    },
                  })}
                />
                {errors.Sales_Price && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1">
                    {errors.Sales_Price.message as string}
                  </p>
                )}
              </div>

              <div>
                <ProductInput
                  label="Stock Quantity *"
                  type="text"
                  className="mt-2 !bg-slate-800 text-white rounded-sm text-xs sm:text-sm"
                  placeholder="1000"
                  {...register('Stock_Quantity', {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Stock Quantity must be at least 1',
                    },
                    max: {
                      value: 1000,
                      message: 'Stock Quantity can not exceed 1000',
                    },
                    validate: (value: number) => {
                      if (isNaN(value)) {
                        return 'Only numbers are allowed';
                      }
                      if (!Number.isInteger(value)) {
                        return 'Stock quantity must be a whole number';
                      }
                      return true;
                    },
                  })}
                />
                {errors.Stock_Quantity && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1">
                    {errors.Stock_Quantity.message as string}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <SizeSlector control={control} errors={error} />
              </div>

              <div className="w-full">
                <label className="font-poppins text-slate-300 text-xs sm:text-sm">
                  Select Discount Code (Optional)
                </label>

                {discountCodeLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mb-3"></div>
                    <h2 className="text-xs sm:text-sm font-medium text-slate-400">
                      Loading discount codes...
                    </h2>
                  </div>
                ) : (
                  <div className="flex items-center justify-start mt-2 sm:mt-3 gap-2 flex-wrap">
                    {discountCodes?.map((code: any) => {
                      return (
                        <button
                          key={code.id}
                          type="button"
                          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold border transition-colors ${
                            watch('discountCodes')?.includes(code.id)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            const currentSelection =
                              watch('discountCodes') || [];
                            const updatedSelection = currentSelection?.includes(
                              code.id
                            )
                              ? currentSelection.filter(
                                  (id: string) => id !== code.id
                                )
                              : [...currentSelection, code.id];
                            setValue('discountCodes', updatedSelection);
                          }}
                        >
                          {code.public_name} {code.discountValue}
                          {code.type === 'percentage' ? '%' : '$'} Off
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isChange && (
        <div className="w-full my-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 p-2">
          <button
            type="button"
            onClick={handleSveDraft}
            className="bg-slate-800 outline-none border-none text-xs sm:text-sm text-center py-2 px-4 rounded-[5px] hover:bg-slate-700 transition-colors w-full sm:w-auto"
          >
            Save Draft
          </button>
          <button
            type="submit"
            onClick={handleSveDraft}
            className="bg-blue-900 outline-none border-none text-xs sm:text-sm text-center py-2 px-4 rounded-[5px] hover:bg-blue-800 transition-colors w-full sm:w-auto"
          >
            {isLoading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      )}
    </form>
  );
};

export default CreateProduct;
