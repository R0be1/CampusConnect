
'use client';

import { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { School, UserCircle, Bell, LogOut, Menu, ClipboardList } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const navItems = [
  { href: '/student/dashboard', label: 'Dashboard' },
  { href: '/student/academics', label: 'Academics' },
  { href: '/student/attendance', label: 'Attendance' },
  { href: '/student/tests', label: 'Tests' },
  { href: '/student/e-learning', label: 'E-Learning' },
  { href: '/student/live-sessions', label: 'Live Sessions' },
  { href: '/student/profile', label: 'Profile' },
];

export default function StudentPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/student/dashboard" className="flex items-center gap-2 font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl">Student Portal</span>
            </Link>
          </div>
          <div className="flex-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/student/dashboard" className="flex items-center gap-2 font-semibold">
                  <School className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl">Student Portal</span>
                </Link>
              </div>
              <DashboardNav items={navItems} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
              </Link>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
