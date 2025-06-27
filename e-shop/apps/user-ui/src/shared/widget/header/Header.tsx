import Link from 'next/link';
import React from 'react';
import styles from '../../../styles/styles';
import { Search, User } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full shadow-md mx-auto backdrop-blur-sm sticky top-0 z-50 bg-white mb-5">
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
      </div>
    </div>
  );
};

export default Header;
