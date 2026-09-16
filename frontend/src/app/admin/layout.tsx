'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Users, Settings, History, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pcs_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { label: 'Contacts', href: '/admin/contacts', icon: Users },
    { label: 'Services', href: '/admin/services', icon: Settings },
    { label: 'Audit Log', href: '/admin/audit', icon: History },
  ];

  const handleLogout = () => {
    localStorage.removeItem('pcs_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <span className="font-bold text-lg text-slate-900 dark:text-white">Admin Portal</span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 absolute md:relative z-30 h-full transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-xl text-slate-900 dark:text-white">PCS Admin</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded">PRO</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 hidden md:flex">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right mr-2 hidden sm:block">
              <p className="font-medium text-slate-900 dark:text-white">Admin User</p>
              <p className="text-xs text-slate-500">admin@primecooling.pk</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
}
