'use client';

import useUser from 'apps/user-ui/src/hooks/useUser';
import { Heart, Loader2, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const UserProfile = () => {
  const { user, isLoading, isError } = useUser();

  return (
    <div className="w-auto flex items-center justify-center gap-3">
      {/* User info */}

      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      ) : !user ? (
        <Link href="/login" className="flex items-center gap-3">
          <div className="flex items-center justify-center gap-2 w-10 h-10 bg-slate-200 hover:bg-blue-300 transition duration-200 ease-in-out py-2 px-3 rounded-full cursor-pointer">
            <User className="w-5 h-5 text-black hover:text-white hover:font-bold" />
          </div>
          <div>
            <h3 className="font-poppins text-[12px] font-bold max-sm:hidden sm:block">
              Hello,
            </h3>
            <p className="font-poppins text-[12px] max-sm:hidden sm:block">
              Sign In
            </p>
          </div>
        </Link>
      ) : (
        <Link href="/profile" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center gap-2 w-10 h-10 bg-slate-200 hover:bg-blue-300 transition duration-200 ease-in-out py-2 px-3 rounded-full cursor-pointer">
              <User className="w-5 h-5 text-black hover:text-white hover:font-bold" />
            </div>
            <div className="text-left">
              <h3 className="font-poppins text-[12px] font-bold max-sm:hidden sm:block">
                Hello,
              </h3>
              <p className="font-poppins text-[12px] max-sm:hidden sm:block">
                {user.name.length > 5 ? user.name.slice(0, 6) : user.name}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Wishlist icon */}
      <Link href="/wishlist" className="relative">
        <Heart className="size-6 text-black hover:text-blue-500 cursor-pointer hover:font-bold" />
        <div className="w-[15px] h-[15px] flex items-center justify-center absolute bg-red-700 font-poppins font-bold rounded-full text-white text-[10px] top-[-1px] right-[-5px]">
          0
        </div>
      </Link>

      {/* Cart icon */}
      <Link href="/cart" className="relative">
        <ShoppingCart className="size-6 text-black hover:text-blue-500 cursor-pointer hover:font-bold" />
        <div className="w-[15px] h-[15px] flex items-center justify-center absolute bg-red-700 font-poppins font-bold rounded-full text-white text-[10px] top-[-1px] right-[-5px]">
          0
        </div>
      </Link>
    </div>
  );
};

export default UserProfile;
