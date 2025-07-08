import Link from 'next/link';
import React from 'react';
import styles from '../../../styles/styles';
import { Search } from 'lucide-react';
import HeaderBottom from './HeaderBottom';
import UserProfile from './UserProfile';

const Header = () => {
  return (
    <div className="w-full">
      <div className="w-full shadow-sm mx-auto backdrop-blur-sm sticky top-0 z-50 bg-white ">
        <div className="w-[90%] mx-auto  text-black text-center flex items-center justify-between py-5 px-0">
          <Link href="/">
            <span className="text-xl font-bold text-black font-poppins">
              e-Shop
            </span>
          </Link>
          <div className="relative w-[50%]">
            <input
              type="text"
              className={`${styles.input} `}
              placeholder="Search for mordern Products..."
            />

            <div className={`${styles.searchIoncs} `}>
              <Search className="w-5 h-5 text-white font-bold" />
            </div>
          </div>
          <UserProfile />
        </div>
      </div>
      <div className="  w-[100%] mx-auto">
        <HeaderBottom />
      </div>
    </div>
  );
};

export default Header;
