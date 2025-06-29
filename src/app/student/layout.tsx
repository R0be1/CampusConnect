
'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import {
  UserCircle,
  Bell,
  LogOut,
  Menu,
  PanelLeft,
  PanelRight,
  ChevronDown,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardNav, NavItem } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';
import { SchoolProvider, useSchool } from '@/context/school-context';
import { AcademicYearProvider, useAcademicYear } from '@/context/academic-year-context';
import { StudentProvider, useStudent } from '@/context/student-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';


const navItems: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard' },
  { href: '/student/academics', label: 'Academics' },
  { href: '/student/attendance', label: 'Attendance' },
  { href: '/student/tests', label: 'Tests' },
  { href: '/student/e-learning', label: 'E-Learning' },
  { href: '/student/live-sessions', label: 'Live Sessions' },
  { href: '/student/profile', label: 'Profile' },
];

function SchoolDisplay({ isCollapsed }: { isCollapsed: boolean }) {
    const { currentSchool } = useSchool();
    return (
         <Link href="/student/dashboard" className="flex items-center gap-2 font-semibold">
            <Image src={currentSchool.logoUrl} width={24} height={24} alt="School Logo" data-ai-hint="logo" className="h-6 w-6" />
            <span className={cn("font-headline text-xl", isCollapsed && "hidden")}>Student Portal</span>
        </Link>
    )
}

function AcademicYearDisplay() {
    const { selectedYear } = useAcademicYear();
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-auto">
            <span>Academic Year:</span>
            <span className="font-semibold text-foreground">{selectedYear}</span>
        </div>
    )
}

function StudentSelector() {
    const { availableStudents, selectedStudent, setSelectedStudent, isLoading } = useStudent();
    
    if (isLoading) {
        return (
             <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-24 hidden sm:block" />
            </div>
        )
    }

    if (!selectedStudent) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                No students found.
            </div>
        );
    }
    
    // For demo purposes, we show a dropdown if there's more than one student in the system.
    // In a real app, this would likely be locked to the single logged-in student.
    if (availableStudents.length <= 1) {
        return (
             <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedStudent.avatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{selectedStudent.name.split(' ').map(n=>n[0] || '').join('')}</AvatarFallback>
                </Avatar>
                <span className="font-semibold hidden sm:inline-block">{selectedStudent.name}</span>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                         <AvatarImage src={selectedStudent.avatar} data-ai-hint="person portrait" />
                         <AvatarFallback>{selectedStudent.name.split(' ').map(n=>n[0] || '').join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold hidden sm:inline-block">{selectedStudent.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {availableStudents.map(student => (
                    <DropdownMenuItem key={student.id} onSelect={() => setSelectedStudent(student)}>
                        {student.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


function InnerLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out',
        isCollapsed ? 'md:grid-cols-[68px_1fr]' : 'md:grid-cols-[280px_1fr]'
      )}
    >
      <div className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col justify-between">
        <div>
          <div className="flex h-16 items-center border-b border-sidebar-border px-4 lg:px-6">
            <SchoolDisplay isCollapsed={isCollapsed} />
          </div>
          <div className="flex-1 overflow-auto">
            <DashboardNav items={navItems} isCollapsed={isCollapsed} />
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            size={isCollapsed ? 'icon' : 'default'}
            className="w-full text-foreground"
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
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground">
              <div className="flex h-16 items-center border-b border-sidebar-border px-4 lg:px-6">
                <SchoolDisplay isCollapsed={false} />
              </div>
              <nav className="flex-1 overflow-auto">
                <DashboardNav items={navItems} isCollapsed={false} />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            <AcademicYearDisplay />
          </div>
          <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
            <StudentSelector />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full"
              asChild
            >
              <Link href="/student/profile">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">View Profile</span>
              </Link>
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


export default function StudentPortalLayout({ children }: { children: ReactNode }) {
  return (
    <SchoolProvider>
      <AcademicYearProvider>
        <StudentProvider>
          <InnerLayout>{children}</InnerLayout>
        </StudentProvider>
      </AcademicYearProvider>
    </SchoolProvider>
  )
}
