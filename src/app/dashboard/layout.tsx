
'use client';

import { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { School, UserCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { AcademicYearProvider, useAcademicYear } from '@/context/academic-year-context';
import type { NavItem } from '@/components/dashboard-nav';


const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { 
    label: 'Students', 
    subItems: [
      { href: '/dashboard/students/list', label: 'View Roster' },
      { href: '/dashboard/students/register', label: 'Register New' },
    ]
  },
  { href: '/dashboard/academics', label: 'Academics' },
  { 
    label: 'Attendance',
    subItems: [
      { href: '/dashboard/attendance/mark', label: 'Mark Attendance' },
      { href: '/dashboard/attendance/records', label: 'View Records' },
    ]
  },
  { 
    label: 'Communication',
    subItems: [
      { href: '/dashboard/communication/compose', label: 'Compose Message' },
      { href: '/dashboard/communication/history', label: 'View History' },
    ]
  },
  { 
    label: 'Fees',
    subItems: [
      { href: '/dashboard/fees/invoices', label: 'Invoices' },
      { href: '/dashboard/fees/history', label: 'Payment History' },
      { href: '/dashboard/fees/structure', label: 'Fee Structure' },
    ]
  },
  { 
    label: 'Results',
    subItems: [
      { href: '/dashboard/results/manage-exams', label: 'Manage Exams' },
      { href: '/dashboard/results/enter-results', label: 'Enter Results' },
      { href: '/dashboard/results/approve-results', label: 'Approve Results' },
    ]
  },
  { 
    label: 'Tests',
    subItems: [
        { href: '/dashboard/tests', label: 'Manage Tests' },
        { href: '/dashboard/tests/create', label: 'Create New Test' },
    ]
  },
  { 
    label: 'E-Learning',
    subItems: [
        { href: '/dashboard/e-learning/manage', label: 'Manage Materials' },
        { href: '/dashboard/e-learning/upload', label: 'Upload New' },
    ]
  },
  { href: '/dashboard/live-sessions', label: 'Live Sessions' },
  { 
    label: 'Settings',
    subItems: [
      { href: '/dashboard/settings/courses', label: 'Courses' },
      { href: '/dashboard/settings/grades-sections', label: 'Grades & Sections' },
      { href: '/dashboard/settings/academic-year', label: 'Academic Year' },
    ]
  },
  { href: '/portal/dashboard', label: 'Parent Portal' },
  { href: '/student/dashboard', label: 'Student Portal' },
];

function AcademicYearDisplay() {
    const { selectedYear } = useAcademicYear();
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-4">
            <span>Academic Year:</span>
            <span className="font-semibold text-foreground">{selectedYear}</span>
        </div>
    )
}

function InnerLayout({ children }: { children: ReactNode }) {
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
          <div className="flex-1 overflow-y-auto">
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
          <AcademicYearDisplay />
          <div className="w-full flex-1" />
           <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
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
