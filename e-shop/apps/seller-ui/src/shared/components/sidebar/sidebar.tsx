'use client';

import UseSidebar from 'apps/seller-ui/src/useHook/useSideBar';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect } from 'react';
import Box from '../box';
import { Sidebar } from './sidebarStyles';

import Link from 'next/link';
import Image from 'next/image';
import useSeller from 'apps/seller-ui/src/useHook/useSeller';

const SidebarWrapper = () => {
  const pathName = usePathname();
  const { activeSidebar, setActiveSidebar } = UseSidebar();
  const { error, seller, isLoading } = useSeller();

  console.log({ 'useSller====>': seller });

  const { Header } = Sidebar;

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconsColor = (route: string) =>
    activeSidebar === route ? '#0085ff' : '#969696';

  return (
    <div className="w-full text-xs font-poppins">
      <Box
        css={{
          height: '100vh',
          zIndex: 220,
          position: 'sticky',
          padding: '8px',
          top: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
        className="sidebar-wraper"
      >
        <Header>
          <Box>
            <Link href={`${'/'}`} className="flex gap-2 items-center">
              <Image
                src={
                  'https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg'
                }
                alt="Seller_image_profile"
                height={20}
                width={20}
                className="object-contain  rounded-full"
              />
              <h2 className="text-white font-poppins text-xs ">
                {seller?.shops.map((x) => x.name)}
              </h2>
            </Link>
          </Box>
        </Header>
      </Box>
    </div>
  );
};

export default SidebarWrapper;
