import React from 'react';

const SidebarMenu = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement | React.ReactNode;
}) => {
  return (
    <main className="w-full block">
      <h3 className="font-poppins tracking-[0.5]">{title}</h3>
      <div className="font-poppins w-full">{children}</div>
    </main>
  );
};

export default SidebarMenu;
