
'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardNav, NavItem } from '@/components/dashboard-nav';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut, Menu, PanelLeft, PanelRight, School, Shield } from 'lucide-react';

const navItems: NavItem[] = [
  { href: '/system-admin/dashboard', label: 'Dashboard' },
  { href: '/system-admin/schools', label: 'Manage Schools' },
];

function AdminPanelDisplay({ isCollapsed }: { isCollapsed: boolean }) {
    return (
         <Link href="/system-admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span className={cn("font-headline text-xl", isCollapsed && "hidden")}>System Admin</span>
        </Link>
    )
}

function InnerLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed ? "md:grid-cols-[68px_1fr]" : "md:grid-cols-[280px_1fr]"
    )}>
      <div className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col justify-between">
        <div>
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <AdminPanelDisplay isCollapsed={isCollapsed} />
          </div>
          <div className="flex-1 overflow-auto">
            <DashboardNav items={navItems} isCollapsed={isCollapsed} />
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button variant="outline" size={isCollapsed ? "icon" : "default"} className="w-full text-foreground" onClick={() => setIsCollapsed(!isCollapsed)}>
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
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                <AdminPanelDisplay isCollapsed={false} />
              </div>
              <nav className="flex-1 overflow-auto">
                <DashboardNav items={navItems} isCollapsed={false} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
              </Link>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function SystemAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/system-admin/login') {
    return <>{children}</>;
  }

  return (
    <InnerLayout>{children}</InnerLayout>
  );
}
