import React, { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';
import ProductInput from '../ProductInput/page';
import { PlusCircleIcon, Trash } from 'lucide-react';

interface CustomSpecificationProps {
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
}

const CustomProperty: React.FC<CustomSpecificationProps> = ({
  control,
  errors,
}) => {
  const [properties, setProperties] = useState<
    {
      label: string;
      value: string[];
    }[]
  >([]);
  const [newValue, setNewValue] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');

  return (
    <div className="w-full max-w-2xl mx-auto px-1">
      <div onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          {/* Name */}
          <div className="flex-1 min-w-0">
            <Controller
              name={`custom_properties`}
              control={control}
              render={({ field }) => {
                useEffect(() => {
                  field.onChange(properties);
                }, [properties]);

                const addProperties = () => {
                  if (!newLabel.trim()) return;

                  setProperties([
                    ...properties,
                    { label: newLabel.trim(), value: [] },
                  ]);

                  setNewLabel('');
                };

                const addValue = (index: number) => {
                  if (!newValue.trim()) return;
                  const updatedProperties = [...properties];
                  updatedProperties[index].value.push(newValue.trim());
                  setProperties(updatedProperties);
                  setNewValue('');
                };

                const removeProperty = (index: number) => {
                  const updatedProperty = [...properties];
                  const updateProperties = updatedProperty.filter(
                    (_, i) => i !== index
                  );
                  setProperties(updateProperties);
                };

                const removeValue = (
                  propertyIndex: number,
                  valueIndex: number
                ) => {
                  const updatedProperties = [...properties];
                  updatedProperties[propertyIndex].value = updatedProperties[
                    propertyIndex
                  ].value.filter((_, i) => i !== valueIndex);
                  setProperties(updatedProperties);
                };

                return (
                  <div className="w-full">
                    <label className="text-xs font-poppins text-slate-400">
                      Custom Properties
                    </label>

                    <div className="flex flex-col gap-3 mt-2">
                      {properties.map((property, index) => {
                        return (
                          <div
                            key={index}
                            className="w-full border border-gray-700 p-3 rounded-lg bg-gray-900"
                          >
                            <div className="items-center justify-between flex">
                              {' '}
                              <span className="text-white font-medium font-poppins text-xs">
                                {property.label}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeProperty(index)}
                                className="text-red-500 hover:text-red-400"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-auto">
                                <ProductInput
                                  label="Add Value"
                                  type="text"
                                  value={newValue}
                                  onChange={(e) => {
                                    setNewValue(e.target.value);
                                  }}
                                  placeholder="Enter property value"
                                  className="w-full !bg-slate-800 text-white rounded-md text-xs"
                                />
                              </div>

                              <div className="w-auto mt-6">
                                <button
                                  type="button"
                                  onClick={() => addValue(index)}
                                  className="flex items-center justify-center sm:justify-start gap-1 text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors duration-200 py-1 px-2 rounded-md hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40"
                                >
                                  <PlusCircleIcon
                                    size={14}
                                    className="flex-shrink-0"
                                  />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {property.value.map((value, valueIndex) => {
                                return (
                                  <div
                                    key={valueIndex}
                                    className="flex items-center gap-1 py-1 px-2 bg-gray-700 text-white rounded-md text-xs"
                                  >
                                    <span>{value}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeValue(index, valueIndex)
                                      }
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 border border-dashed border-gray-600 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-2">
                        Add New Property
                      </h4>
                      <ProductInput
                        label="Property Name"
                        type="text"
                        value={newLabel}
                        onChange={(e) => {
                          setNewLabel(e.target.value);
                        }}
                        placeholder="Enter property name"
                        className="w-full !bg-slate-800 text-white rounded-md text-xs mb-2"
                      />
                      <button
                        type="button"
                        onClick={addProperties}
                        className="flex items-center justify-center sm:justify-start gap-1 text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors duration-200 py-1 px-2 rounded-md hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40"
                      >
                        <PlusCircleIcon size={14} className="flex-shrink-0" />
                        <span>Add Property</span>{' '}
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomProperty;
