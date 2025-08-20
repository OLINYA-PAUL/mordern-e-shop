import React, { forwardRef } from 'react';

type ProductInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    type: 'text' | 'number' | 'password' | 'textarea' | 'email';
    className: string;
  };

const ProductInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ProductInputProps
>(({ label, type = 'text', className, ...props }, ref) => {
  return (
    <div>
      {label && (
        <label className="text-xs text-slate-300 font-poppins">{label}</label>
      )}
      {type === 'textarea' ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={` !text-sm w-full py-1 px-5 border-none outline-none bg-slate-200  focus:outline-none  transition duration-200 ease-in-out backdrop-blur-md  ${className}`}
          {...props}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          className={` !text-sm w-full py-1 px-5 border-none outline-none bg-slate-200  focus:outline-none transition duration-200 ease-in-out backdrop-blur-md  ${className}`}
          {...props}
        />
      )}
    </div>
  );
});

export default ProductInput;
