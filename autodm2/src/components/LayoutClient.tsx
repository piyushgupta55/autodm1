'use client';

import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';

  // For now, let's treat the landing page (/) as non-dashboard too if it's just a splash
  // But the user wants a full redesign, so / is likely login or dashboard.
  // The PRD says /login, /signup, /dashboard.
  
  return (
    <div className="flex min-h-screen">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 transition-all ${!isAuthPage ? 'pl-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}
