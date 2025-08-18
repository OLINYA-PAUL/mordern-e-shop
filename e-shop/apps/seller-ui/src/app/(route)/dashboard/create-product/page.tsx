'use client';

import ImagePlaceHolders from 'apps/seller-ui/src/shared/components/image-placeholders/page';
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

  const [openImageModel, setOpenImageModel] = useState<boolean>(false);
  const [images, setImages] = useState<(File | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    <div
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
      <div className="flex gap-4 py-4 w-full">
        <div className="w-[35%]  rounded-md h-auto p-3">
          {images.length <= 0 && (
            <>
              <ImagePlaceHolders
                small={false}
                size={'500 x 300'}
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

          <div className="grid grid-cols-2 mt-3 gap-4">
            {images.slice(1).map((image, index) => (
              <>
                <ImagePlaceHolders
                  small
                  key={index}
                  size={'500 x 300'}
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
      </div>
    </div>
  );
};

export default CreateProduct;
