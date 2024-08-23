import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'REST/GraphiQL Client',
  description: 'Final project of the react RS School course',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
