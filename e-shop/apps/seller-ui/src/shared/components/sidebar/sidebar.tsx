'use client';

import UseSidebar from 'apps/seller-ui/src/useHook/useSideBar';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useEffect } from 'react';
import Box from '../box';
import { Sidebar, sidebarWrapper } from './sidebarStyles';

const SidebarWrapper = () => {
  const pathName = usePathname();
  const { activeSidebar, setActiveSidebar } = UseSidebar();

  const { Wrapper } = Sidebar;

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
      ></Box>
    </div>
  );
};

export default SidebarWrapper;
