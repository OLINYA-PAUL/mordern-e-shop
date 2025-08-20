'use client';

import { Pencil, WandSparkles, X } from 'lucide-react';
import React from 'react';

interface ImagePlaceHoldersProps {
  size: string;
  small?: boolean;
  onFileChange: (file: File, index: number) => void;
  onFileRemove: (index: number) => void;
  defaultImage: string | null;
  index: number;
  setOpenImageModel: (open: boolean) => void;
}

const ImagePlaceHolders = ({
  small,
  size,
  onFileChange,
  onFileRemove,
  defaultImage,
  index,
  setOpenImageModel,
}: ImagePlaceHoldersProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileChange) {
      setImagePreview(URL.createObjectURL(file));
      onFileChange(file, index ?? 0);
    }
  };

  return (
    <div
      className={`relative ${
        typeof size === 'string' ? `` : size ? 'h-[180px]' : 'h-[450px]'
      } cursor-pointer p-2 border border-dashed border-slate-600 rounded-md bg-gray-800 backdrop-blur-sm flex flex-col justify-center items-center`}
      style={
        typeof size === 'string'
          ? {
              width: size.split('x')[0].trim() + 'px',
              height: size.split('x')[1].trim() + 'px',
            }
          : {}
      }
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        id={`image-upload-${index ?? 0}`}
        onChange={handleImageChange}
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            onClick={() => {
              onFileRemove(index);

              console.log('Image removed ===>', index);
            }}
            className="absolute top-3 right-3 p-2 rounded bg-red-700 shadow-sm cursor-pointer"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={() => setOpenImageModel(true)}
            className="absolute top-14 right-3 p-2 rounded bg-blue-700 shadow-sm cursor-pointer"
          >
            <WandSparkles size={20} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-700 shadow-sm cursor-pointer"
        >
          <Pencil size={16} />
        </label>
      )}

      {imagePreview ? (
        <>
          <img
            src={imagePreview}
            alt="preview"
            className="w-full h-full object-cover rounded-md"
          />
        </>
      ) : (
        <div className="w-full flex items-center flex-col justify-center">
          <img
            src={
              'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'
            }
            alt="preview"
            className="w-[70px] h-[70px] opacity-40 mb-5  rounded-md"
          />
          <p className="text-xs text-gray-400">
            {size
              ? 'Click to upload image'
              : 'Click the pen icon to Upload image'}{' '}
            {size}
          </p>
          <p className="text-gray-400 font-poppins text-xs text-center mt-5">
            Please choose an image with the <br />
            expected ration
          </p>
        </div>
      )}
    </div>
  );
};

export default ImagePlaceHolders;
