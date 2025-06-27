
'use client';

import { ReactNode, useState } from 'react';
import {
  School,
  UserCircle,
  Bell,
  LogOut,
  Menu,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardNav, NavItem } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';

const navItems: NavItem[] = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/academics', label: 'Academics' },
  { href: '/portal/attendance', label: 'Attendance' },
  { href: '/portal/fees', label: 'Fees' },
  { href: '/portal/communication', label: 'Communication' },
  { href: '/portal/tests', label: 'Tests' },
  { href: '/portal/e-learning', label: 'E-Learning' },
  { href: '/portal/live-sessions', label: 'Live Sessions' },
  { href: '/portal/profile', label: 'Profile' },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out',
        isCollapsed ? 'md:grid-cols-[68px_1fr]' : 'md:grid-cols-[280px_1fr]'
      )}
    >
      <div className="hidden border-r bg-muted/40 md:flex md:flex-col justify-between">
        <div>
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <Link
              href="/portal/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <School className="h-6 w-6 text-primary" />
              <span className={cn('font-headline text-xl', isCollapsed && 'hidden')}>
                Parent Portal
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <DashboardNav items={navItems} isCollapsed={isCollapsed} />
          </div>
        </div>
        <div className="mt-auto p-4 border-t">
          <Button
            variant="outline"
            size={isCollapsed ? 'icon' : 'default'}
            className="w-full"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <PanelRight className="h-5 w-5" />
            ) : (
              <>
                <PanelLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-16 items-center border-b px-4 lg:px-6">
                <Link
                  href="/portal/dashboard"
                  className="flex items-center gap-2 font-semibold"
                >
                  <School className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl">Parent Portal</span>
                </Link>
              </div>
              <nav className="flex-1 overflow-auto">
                <DashboardNav items={navItems} isCollapsed={false} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
