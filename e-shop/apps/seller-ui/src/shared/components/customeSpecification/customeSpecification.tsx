import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import ProductInput from '../ProductInput/page';
import { PlusCircleIcon, Trash } from 'lucide-react';

interface CustomSpecificationProps {
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
}

const CustomSpecification: React.FC<CustomSpecificationProps> = ({
  control,
  errors,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_specification',
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-1">
      <div onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <label className="block w-full font-semibold text-gray-300 text-xs">
          Custom Specification
        </label>

        <div className="space-y-1">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative p-1 bg-slate-900/50 rounded-md border border-slate-700"
            >
              {/* Remove Button */}
              <div className="absolute top-1 right-1 z-10">
                <button
                  type="button"
                  title={`${
                    index === 0 && fields.length === 1
                      ? 'Cannot remove last specification'
                      : 'Remove Specification'
                  }`}
                  onClick={() => {
                    if (index === 0 && fields.length === 1) return;
                    remove(index);
                  }}
                  disabled={index === 0 && fields.length === 1}
                  className={`p-1 rounded-md transition-all duration-200 ${
                    index === 0 && fields.length === 1
                      ? 'text-gray-500 cursor-not-allowed bg-slate-800/80'
                      : 'text-red-400 hover:text-red-300 hover:bg-red-500/10 bg-slate-800/80 hover:bg-slate-700'
                  }`}
                >
                  <Trash size={12} />
                </button>
              </div>

              {/* Inputs */}
              <div className="pt-1 pr-6">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <Controller
                      name={`custom_specification.${index}.name`}
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <ProductInput
                          label="Name"
                          type="text"
                          {...field}
                          placeholder="Battery Life, Weight, Material"
                          className="w-full !bg-slate-800 text-white rounded-md text-xs"
                        />
                      )}
                    />
                    {errors?.custom_specification?.[index]?.name && (
                      <p className="text-red-400 text-[10px] mt-1">
                        {errors.custom_specification[index].name.message}
                      </p>
                    )}
                  </div>

                  {/* Value */}
                  <div className="flex-1 min-w-0">
                    <Controller
                      name={`custom_specification.${index}.value`}
                      control={control}
                      rules={{ required: 'Value is required' }}
                      render={({ field }) => (
                        <ProductInput
                          label="Value"
                          type="text"
                          {...field}
                          placeholder="24 hours, 1.2kg, Aluminum"
                          className="w-full !bg-slate-800 text-white rounded-md text-xs"
                        />
                      )}
                    />
                    {errors?.custom_specification?.[index]?.value && (
                      <p className="text-red-400 text-[10px] mt-1">
                        {errors.custom_specification[index].value.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:justify-between sm:items-center pt-2 border-t border-slate-700">
          <button
            type="button"
            onClick={() => append({ name: '', value: '' })}
            className="flex items-center justify-center sm:justify-start gap-1 text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors duration-200 py-1 px-2 rounded-md hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40"
          >
            <PlusCircleIcon size={14} className="flex-shrink-0" />
            <span>Add Specification</span>
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-slate-900 min-w-[70px]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomSpecification;
