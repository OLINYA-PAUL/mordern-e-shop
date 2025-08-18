'use client';

import React from 'react';

interface ImagePlaceHoldersProps {
  size?: boolean;
  small?: boolean | string;
  onFileChange?: (file: File, index: number) => void;
  onFileRemove?: (index: number) => void;
  defaultImage?: string | null;
  index?: number | null;
  setOpenImageModel: (open: boolean) => void;
}

const ImagePlaceHolders = ({
  size,
  small,
  onFileChange,
  onFileRemove,
  defaultImage = null,
  index = null,
  setOpenImageModel,
}: ImagePlaceHoldersProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    defaultImage
  );
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileChange) {
      setImagePreview(URL.createObjectURL(file));
      onFileChange(file, index ?? 0);
    }
  };
  return (
    <div
      className={`w-full relative ${
        small ? 'h-[180px]' : 'h-[450px]'
      } cursor-pointer p-2 border border-dashed border-slate-600 rounded-md bg-gray-800 backdrop-blur-sm flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        className="w-full cursor-pointer h-full hidden hover:block "
        accept="image/*"
        id={`image-upload-${index ?? 0}`}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImagePlaceHolders;
