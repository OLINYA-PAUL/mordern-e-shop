'use client';

import ImagePlaceHolders from 'apps/seller-ui/src/shared/components/image-placeholders/page';
import ProductInput from 'apps/seller-ui/src/shared/components/ProductInput/page';
import { ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CreateProduct = () => {
  const handleCreateProduct = (data: any) => {
    console.log('Product created:', data);
    // Add your product creation logic here
  };

  const {
    handleSubmit,
    register,
    watch,
    control,
    setFocus,
    setValue,
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
  const [loading, setLoading] = useState<boolean>(false);

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

  // const updatedImages = images.filter((_, i) => i !== index);
  // setImages(updatedImages);
  const onFileRemove = (index: number) => {
    console.log('Removing image at index:', index);

    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      console.log('Updated images before removal:', updatedImages);

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      // Update form value with the new images array
      setValue('images', updatedImages);

      return updatedImages;
    });
  };
  return (
    <form
      className="w-full m-auto p-4 shadow-md rounded-md text-white "
      onSubmit={handleSubmit(handleCreateProduct)}
    >
      <h2 className="text-xl font-poppins py-2 font-semibold">
        Create New Product
      </h2>
      <div className="flex items-center ">
        <span className="text-xs text-slate-300 cursor-pointer">Dashboard</span>
        <ChevronRightIcon className="opacity-70 cursor-pointer" size={15} />
        <span className="text-xs text-slate-300 cursor-pointer">
          Create Product
        </span>
      </div>
      <div className="flex gap-10 py-4 w-full">
        <div className="md:w-[35%]  rounded-md h-auto ">
          {images.length > 0 && (
            <>
              <ImagePlaceHolders
                small={false}
                size={selectedSize}
                onFileChange={onFileChange}
                onFileRemove={onFileRemove}
                defaultImage={
                  'https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg'
                }
                index={0}
                setOpenImageModel={setOpenImageModel}
              />
            </>
          )}

          <select
            className="w-full mt-2 cursor-pointer  mb-2 bg-slate-800 text-white text-sm rounded p-1 focus:outline-none focus:ring-0 border-0"
            onChange={(e: any) => {
              setSelectedSize(e.target.value);
            }}
          >
            {productImageSizes.map((size, index) => (
              <option
                key={index}
                value={`${size.width} x ${size.height}`}
                className="bg-slate-800 text-white cursor-pointer "
              >
                {size.width} x {size.height}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 mt-3 gap-4">
            {images.slice(1).map((image, index) => (
              <>
                <ImagePlaceHolders
                  small
                  key={index}
                  size={'300 x 300'}
                  onFileChange={onFileChange}
                  onFileRemove={onFileRemove}
                  defaultImage={
                    'https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg'
                  }
                  index={index + 1}
                  setOpenImageModel={setOpenImageModel}
                />
              </>
            ))}
          </div>
        </div>
        <div className="md:w-[65%]  rounded-md h-auto  ">
          <div className="w-full flex gap-5">
            <div className="w-2/4">
              <ProductInput
                label={'Product name'}
                type={'text'}
                className={
                  'mt-2  text-black !bg-slate-600 !border-0 !outline-0 !focus:outline-0 !focus:border-0 rounded-full'
                }
                placeholder="enter Product name"
                {...register('title', {
                  required: 'Value is required',
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateProduct;
