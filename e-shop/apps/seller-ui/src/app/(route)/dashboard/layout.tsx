export const metadata = {
  title: 'E-shop',
  description:
    'Welcome to the biggest e-shop in the world, where you can find everything you need! From Home use property to fashion, we have it all.',
};

import SidebarWrapper from 'apps/seller-ui/src/shared/components/sidebar/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full bg-black min-h-screen text-white flex gap-5 overflow-hidden font-poppins">
      <aside className="w-[250px] min-w-[200px] max-w-[300px]  h-screen border-r border-r-slate-900 p-4 text-white">
        <div className="sticky top-0">
          <SidebarWrapper />
        </div>
      </aside>
      <main className="w-full flex-1 p-3">{children}</main>
    </div>
  );
}
