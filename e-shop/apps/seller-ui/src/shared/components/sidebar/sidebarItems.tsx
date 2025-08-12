import Link from 'next/link';
import React from 'react';

const SidebarItems = ({
  icons,
  title,
  href,
  isActive,
}: {
  icons: any;
  title: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link href={href} className="w-full my-3">
      <div
        className={`w-full flex items-center p-2 gap-3  cursor-pointer ${
          isActive
            ? 'bg-[#053158] scale-[.98]  hover:!bg-[#053158d6]'
            : 'hover:!bg-[#053158d6]'
        }`}
      >
        <span className="text-xs">{icons}</span>
        <p className="text-xs font-medium tracking-wide mt-1">{title}</p>
      </div>
    </Link>
  );
};

export default SidebarItems;
