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
import { ActivityIcon, Home } from 'lucide-react';
import SidebarItems from './sidebarItems';
import SidebarMenu from './sidebarMenu';
import { MdOutlinePayments } from 'react-icons/md';
import { AiFillProduct } from 'react-icons/ai';
import { FaSquarePlus } from 'react-icons/fa6';
import { BsCalendarEventFill } from 'react-icons/bs';
import { IoNotifications } from 'react-icons/io5';
import { IoMail } from 'react-icons/io5';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdEventRepeat } from 'react-icons/md';

const SidebarWrapper = () => {
  const pathName = usePathname();
  const { activeSidebar, setActiveSidebar } = UseSidebar();
  const { error, seller, isLoading } = useSeller();

  console.log({ 'useSller====>': seller });

  const { Header, Body } = Sidebar;

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
          <Box
            css={{
              width: '100%',
            }}
          >
            <Link
              href={`${'/profile'}`}
              className="flex gap-3 items-center p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-600/20 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="relative">
                <Image
                  src={
                    'https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg'
                  }
                  alt="Seller_image_profile"
                  height={36}
                  width={36}
                  className="object-cover rounded-full ring-2 ring-blue-500/20"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-poppins text-[11px] font-semibold leading-tight">
                  {seller?.shops.name}
                </h2>
                <h5 className="text-gray-300 font-poppins text-[10px] font-normal truncate max-w-[140px] mt-0.5">
                  {seller?.shops.address}
                </h5>
              </div>
            </Link>
            <Header>
              <div className="w-full h-full  my-5">
                <Body className="body sidebar">
                  <SidebarItems
                    title={'Dashboard'}
                    icons={
                      <Home color={getIconsColor('/dashboard')} size={20} />
                    }
                    isActive={activeSidebar === '/dashboard'}
                    href={'/dashboard'}
                  />
                  <div className="w-full block mt-5">
                    <SidebarMenu title="Main menu">
                      <SidebarItems
                        title={'orders'}
                        icons={
                          <ActivityIcon
                            color={getIconsColor('/dashboard/orders')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/orders'}
                        href={'/dashboard/orders'}
                      />
                      <SidebarItems
                        title={'Payments'}
                        icons={
                          <MdOutlinePayments
                            color={getIconsColor('/dashboard/payments')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/payments'}
                        href={'/dashboard/payments'}
                      />
                    </SidebarMenu>
                    <SidebarMenu title="Products">
                      <SidebarItems
                        title={'Create Products'}
                        icons={
                          <FaSquarePlus
                            color={getIconsColor('/dashboard/create-product')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/create-product'}
                        href={'/dashboard/create-product'}
                      />
                      <SidebarItems
                        title={'All Products'}
                        icons={
                          <AiFillProduct
                            color={getIconsColor('/dashboard/all-product')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/all-product'}
                        href={'/dashboard/all-product'}
                      />
                    </SidebarMenu>

                    <SidebarMenu title="Events">
                      <SidebarItems
                        title={'Create Events'}
                        icons={
                          <BsCalendarEventFill
                            color={getIconsColor('/dashboard/create-Events')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/create-Events'}
                        href={'/dashboard/create-Events'}
                      />
                      <SidebarItems
                        title={'All Events'}
                        icons={
                          <MdEventRepeat
                            color={getIconsColor('/dashboard/all-Events')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/all-Events'}
                        href={'/dashboard/all-Events'}
                      />
                    </SidebarMenu>
                    <SidebarMenu title="Controllers">
                      <SidebarItems
                        title={'Inbox'}
                        icons={
                          <IoMail
                            color={getIconsColor('/dashboard/inbox')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/inbox'}
                        href={'/dashboard/inbox'}
                      />
                      <SidebarItems
                        title={'Settings'}
                        icons={
                          <IoSettingsSharp
                            color={getIconsColor('/dashboard/settings')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/settings'}
                        href={'/dashboard/settings'}
                      />
                      <SidebarItems
                        title={'Notifications'}
                        icons={
                          <IoNotifications
                            color={getIconsColor('/dashboard/notifications')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/notifications'}
                        href={'/dashboard/notifications'}
                      />
                    </SidebarMenu>
                    <SidebarMenu title="Extras">
                      <SidebarItems
                        title={'Discount Codes'}
                        icons={
                          <MdEventRepeat
                            color={getIconsColor('/dashboard/discount-codes')}
                            size={20}
                          />
                        }
                        isActive={activeSidebar === '/dashboard/discount-codes'}
                        href={'/dashboard/discount-codes'}
                      />
                    </SidebarMenu>
                  </div>
                </Body>
              </div>
            </Header>
          </Box>
        </Header>
      </Box>
    </div>
  );
};

export default SidebarWrapper;
