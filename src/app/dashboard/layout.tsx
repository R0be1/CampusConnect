
'use client';

import { ReactNode } from 'react';
import { School, UserCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { AcademicYearProvider, useAcademicYear } from '@/context/academic-year-context';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/students', label: 'Students' },
  { href: '/dashboard/academics', label: 'Academics' },
  { href: '/dashboard/attendance', label: 'Attendance' },
  { href: '/dashboard/communication', label: 'Communication' },
  { href: '/dashboard/fees', label: 'Fees' },
  { href: '/dashboard/results', label: 'Results' },
  { href: '/dashboard/tests', label: 'Tests' },
  { href: '/dashboard/e-learning', label: 'E-Learning' },
  { href: '/dashboard/live-sessions', label: 'Live Sessions' },
  { href: '/dashboard/settings', label: 'Settings' },
  { href: '/portal/dashboard', label: 'Parent Portal' },
  { href: '/student/dashboard', label: 'Student Portal' },
];

function AcademicYearDisplay() {
    const { selectedYear } = useAcademicYear();
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-auto">
            <span>Academic Year:</span>
            <span className="font-semibold text-foreground">{selectedYear}</span>
        </div>
    )
}

function InnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
            <School className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">CampusConnect</span>
          </Link>
           {navItems.slice(1, 11).map(item => (
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
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <School className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl">CampusConnect</span>
              </Link>
              {navItems.map(item => (
                 <SheetClose asChild key={item.label}>
                   <Link href={item.href!} className={cn("hover:text-foreground", pathname.startsWith(item.href!) ? "text-foreground font-semibold" : "text-muted-foreground")}>{item.label}</Link>
                 </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <AcademicYearDisplay />
            <Button variant="secondary" size="icon" className="rounded-full ml-4">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  return (
    <AcademicYearProvider>
      <InnerLayout>{children}</InnerLayout>
    </AcademicYearProvider>
  );
}
