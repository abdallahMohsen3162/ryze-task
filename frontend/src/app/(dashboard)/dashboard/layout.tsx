import React from 'react';
import { Navbar } from '@/app/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
}
