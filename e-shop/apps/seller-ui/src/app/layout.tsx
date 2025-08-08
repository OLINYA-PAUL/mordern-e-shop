import { Provider } from '../Provider';
import { Toaster } from 'react-hot-toast';

// import { Header } from '../shared';
import './global.css';

export const metadata = {
  title: 'E-shop',
  description:
    'Welcome to the biggest e-shop in the world, where you can find everything you need! From Home use property to fashion, we have it all.',
};

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
        <Provider>
          {/* <Header /> */}
          <main className="w-full min-h-screen bg-slate-900 font-sans antialiased">
            {children}
            <Toaster />
          </main>
        </Provider>
      </body>
    </html>
  );
}
