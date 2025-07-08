'use client';
import { navItems } from 'apps/user-ui/src/configs/constants/constants';
import { AlignLeft, ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import UserProfile from './UserProfile';

const HeaderBottom = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isActive, setIsActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY !== undefined && window.scrollY > 20) {
        setIsSticky(true);
      } else setIsSticky(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log(isSticky + '======');

  return (
    <div
      className={` w-full transition duration-300 ease-in-out  bg-white h-[60px]  text-black flex items-center justify-center flex-col ${
        isSticky ? ' z-[100] top-0 left-0 shadow-sm  fixed mt-0  ' : 'relative'
      }`}
    >
      <div
        className={` w-[90%]  relative mx-auto flex items-center justify-between   `}
      >
        <div
          className={`${
            isSticky && 'mb-[-15px]'
          }  w-[200px] flex items-center justify-between px-3 bg-[#3489ff]  h-[45px] cursor-pointer rounded-tr-[20px] rounded-tl-[20px] `}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <div className="flex items-center justify-between gap-2">
            <AlignLeft color="white" size={20} />
            <span className="font-poppins font-normal text-white text-sm">
              Categories
            </span>
          </div>
          {!isVisible ? (
            <ChevronsUpIcon color="white" size={20} />
          ) : (
            <ChevronsDownIcon color="white" size={20} />
          )}
        </div>

        {isVisible && (
          <div
            className={`w-[200px] shadow-md absolute bg-white/90 left-0 z-10 [4000px] h-[400px] ${
              isSticky ? 'top-[90px]' : 'top-[50px] '
            }`}
          ></div>
        )}
        <div className="flex items-center gap-3">
          {navItems.map((items, index) => (
            <div onClick={() => setIsActive(index)} key={items.title || index}>
              <Link
                href={items.href}
                className="text-sm font-medium font-poppins"
              >
                <p
                  className={`${
                    isActive === index && 'text-blue-400'
                  } hover:text-blue-400`}
                >
                  {items.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
        {isSticky && <UserProfile />}
      </div>
    </div>
  );
};

export default HeaderBottom;
