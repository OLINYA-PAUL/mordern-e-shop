export const metadata = {
  title: 'E-shop',
  description:
    'Welcome to the biggest e-shop in the world, where you can find everything you need! From Home use property to fashion, we have it all.',
};

import SidebarWrapper from 'apps/seller-ui/src/shared/components/sidebar/sidebar';
import { Roboto, Poppins } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      <body className="w-full">
        {/* <Header /> */}
        <div className="w-full h-full bg-black min-h-screen text-white flex gap-5 overflow-hidden">
          <aside className="w-[250px] min-w-[200px] max-w-[300px]  h-screen border-r border-r-slate-900 p-4 text-white">
            <div className="sticky top-0">
              <SidebarWrapper />
            </div>
          </aside>
          <main className="w-full flex-1 p-3">{children}</main>
        </div>
      </body>
    </html>
  );
}
