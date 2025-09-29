import React from 'react';
import { Controller } from 'react-hook-form';

const SizeSlector = ({ control, errors }: { control: any; errors: any }) => {
  const size = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  return (
    <div className="w-ful">
      <label className="font-poppins text-slate-300 ">
        Select Product Size
      </label>
      <Controller
        name="Size"
        rules={{ required: 'Size is required' }}
        control={control}
        render={({ field }) => {
          return (
            <div className="flex gap-2 items-center mt-2 cursor-pointer">
              {size.map((item) => {
                const isSelected = (field.value || []).includes(item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        isSelected
                          ? field.value.filter((s: any) => s !== item)
                          : [...(field.value || []), item]
                      )
                    }
                    className={`${
                      isSelected ? 'bg-blue-500 text-white border-none' : ''
                    } py-1 px-3 outline-none border border-x-slate-300 rounded-md font-poppins text-sm cursor-pointer hover:opacity-75 transition-all duration-150`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          );
        }}
      />
      {errors.size && (
        <p className="text-red-500 text-xs mt-1">
          {errors.size.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSlector;
