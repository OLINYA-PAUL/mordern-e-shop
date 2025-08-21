import React from 'react';
import {
  Control,
  FieldErrors,
  FieldValues,
  useFieldArray,
} from 'react-hook-form';

const CustomSpecification = ({
  control,
  errors,
}: {
  control: Control<FieldValues, any, FieldValues>;
  errors: FieldErrors<FieldValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custome_specification',
  });

  return (
    <div className="w-full font-semibold text-gray-300 mb-1">
      Custome Specification
    </div>
  );
};

export default CustomSpecification;
