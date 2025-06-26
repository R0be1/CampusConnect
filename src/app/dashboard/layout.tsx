'use client';

import { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { School, UserCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/students', label: 'Students' },
  { href: '/dashboard/academics', label: 'Academics' },
  { href: '/dashboard/attendance', label: 'Attendance' },
  { href: '/dashboard/communication', label: 'Communication' },
  { href: '/dashboard/fees', label: 'Fees' },
  { href: '/dashboard/results', label: 'Results' },
  { href: '/dashboard/tests', label: 'Tests' },
  { href: '/dashboard/settings', label: 'Settings' },
  { href: '/portal/dashboard', label: 'Parent Portal' },
  { href: '/student/dashboard', label: 'Student Portal' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl">CampusConnect</span>
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
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <School className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl">CampusConnect</span>
                </Link>
              </div>
              <DashboardNav items={navItems} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search bar here later */}
          </div>
          <Button variant="secondary" size="icon" className="rounded-full">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
