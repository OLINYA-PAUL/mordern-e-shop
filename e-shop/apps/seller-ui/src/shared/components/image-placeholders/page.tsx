'use client';

import { Pencil, WandSparkles, X, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

interface ImagePlaceHoldersProps {
  size: string;
  small?: boolean;
  onFileChange: (file: File, index: number) => void;
  onFileRemove: (index: number) => void;
  defaultImage: string | null;
  index: any;
  setOpenImageModel: (open: boolean) => void;
  currentImage?: any;
  imageLoading: boolean;
}

const ImagePlaceHolders = ({
  small,
  size,
  onFileChange,
  onFileRemove,
  defaultImage,
  index,
  setOpenImageModel,
  currentImage,
  imageLoading,
}: ImagePlaceHoldersProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  // ✅ Sync preview with currentImage or default
  useEffect(() => {
    if (!currentImage) {
      setImagePreview(defaultImage);
      return;
    }

    if (currentImage instanceof File) {
      const objectUrl = URL.createObjectURL(currentImage);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof currentImage === 'string') {
      setImagePreview(currentImage);
    }
  }, [currentImage, defaultImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onFileChange(file, index);
    setImagePreview(objectUrl); // ✅ instant preview
  };

  const handleRemove = () => {
    setImagePreview(null);
    onFileRemove(index);
  };

  const getDimensions = () => {
    if (typeof size === 'string' && size.includes('x')) {
      const [width, height] = size.split('x').map((s) => s.trim());
      return { width: `${width}px`, height: `${height}px` };
    }
    return small ? { height: '140px' } : { height: '220px' };
  };

  const dimensions = getDimensions();

  return (
    <div
      className={`w-full relative cursor-pointer p-1.5 border border-dashed border-slate-600 rounded-lg bg-gray-800/80 backdrop-blur-md flex flex-col justify-center items-center transition-all duration-300 hover:border-slate-500 ${
        small ? 'w-full' : ''
      }`}
      style={dimensions}
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        id={`image-upload-${index}`}
        onChange={handleImageChange}
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 p-1 rounded bg-red-700 hover:bg-red-600 shadow-sm cursor-pointer z-10 transition-colors"
            title="Remove image"
          >
            <X size={small ? 14 : 18} />
          </button>

          <button
            type="button"
            onClick={() => setOpenImageModel(true)}
            className="absolute top-10 right-1.5 p-1 rounded bg-blue-700 hover:bg-blue-600 shadow-sm cursor-pointer z-10 transition-colors"
            title="Edit with AI"
          >
            <WandSparkles size={small ? 14 : 18} />
          </button>

          {/* Image with loading overlay */}
          <div className="relative w-full h-full">
            <img
              src={imagePreview}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover rounded-md shadow-md"
            />

            {imageLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <Loader2 className="animate-spin text-white" size={28} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <label
            htmlFor={`image-upload-${index}`}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-700 hover:bg-slate-600 shadow-sm cursor-pointer z-10 transition-colors"
            title="Upload image"
          >
            <Pencil size={14} />
          </label>

          <div className="w-full flex items-center flex-col justify-center px-1">
            <img
              src={defaultImage as string}
              alt="Upload placeholder"
              className={`${
                small ? 'w-[38px] h-[38px]' : 'w-[55px] h-[55px]'
              } opacity-40 mb-2 rounded-md`}
            />
            <p
              className={`${
                small ? 'text-[9px]' : 'text-[11px]'
              } text-gray-400 text-center`}
            >
              Click to upload image
            </p>
            {!small && (
              <p className="text-gray-400 font-poppins text-[9px] text-center mt-2">
                Choose an image with ratio: {size}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePlaceHolders;
