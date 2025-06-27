
'use client';

import { ReactNode } from 'react';
import { School, UserCircle, Bell, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
    const pathname = usePathname();
  return (
     <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/student/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
            <School className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">Student Portal</span>
          </Link>
           {navItems.map(item => (
             <Link key={item.label} href={item.href!} className={cn("transition-colors hover:text-foreground", pathname.startsWith(item.href!) ? "text-foreground font-semibold" : "text-muted-foreground")}>{item.label}</Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium p-6">
              <Link href="/student/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <School className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl">Student Portal</span>
              </Link>
              {navItems.map(item => (
                 <SheetClose asChild key={item.label}>
                   <Link href={item.href!} className={cn("hover:text-foreground", pathname.startsWith(item.href!) ? "text-foreground font-semibold" : "text-muted-foreground")}>{item.label}</Link>
                 </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
