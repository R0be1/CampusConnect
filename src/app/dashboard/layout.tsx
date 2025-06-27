
'use client';

import { ReactNode, useState } from 'react';
import { School, UserCircle, Menu, PanelLeft, PanelRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AcademicYearProvider, useAcademicYear } from '@/context/academic-year-context';
import { DashboardNav, NavItem } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';

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
      { href: '/dashboard/communication/compose', label: 'Compose' },
      { href: '/dashboard/communication/history', label: 'History' },
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
      { href: '/dashboard/tests/create', label: 'Create Test' },
      { href: '/dashboard/tests', label: 'Manage Tests' },
    ]
  },
  { 
    label: 'E-Learning',
    subItems: [
      { href: '/dashboard/e-learning/manage', label: 'Manage Materials' },
      { href: '/dashboard/e-learning/upload', label: 'Upload New' },
    ]
  },
  { 
    label: 'Live Sessions',
    subItems: [
      { href: '/dashboard/live-sessions/schedule', label: 'Schedule Session' },
      { href: '/dashboard/live-sessions', label: 'View Sessions' },
    ]
  },
  {
    label: 'Settings',
    subItems: [
      { href: '/dashboard/settings/academic-year', label: 'Academic Year' },
      { href: '/dashboard/settings/grades-sections', label: 'Grades & Sections' },
      { href: '/dashboard/settings/courses', label: 'Courses' },
    ]
  },
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed ? "md:grid-cols-[68px_1fr]" : "md:grid-cols-[280px_1fr]"
    )}>
      <div className="hidden border-r bg-muted/40 md:flex md:flex-col justify-between">
        <div>
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className={cn("font-headline text-xl", isCollapsed && "hidden")}>CampusConnect</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <DashboardNav items={navItems} isCollapsed={isCollapsed} />
          </div>
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" size={isCollapsed ? "icon" : "default"} className="w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <PanelRight className="h-5 w-5" /> : <><PanelLeft className="h-5 w-5" /><span>Collapse</span></>}
              <span className="sr-only">Toggle Sidebar</span>
          </Button>
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
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <School className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl">CampusConnect</span>
                </Link>
              </div>
              <nav className="flex-1 overflow-auto">
                <DashboardNav items={navItems} isCollapsed={false} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <AcademicYearDisplay />
          </div>
          <Button variant="secondary" size="icon" className="rounded-full">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
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
