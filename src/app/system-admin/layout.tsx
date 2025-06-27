
'use client';

import { ReactNode } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SystemAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
     <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/system-admin/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">System Admin</span>
          </Link>
           <Link href="/system-admin/dashboard" className={cn("transition-colors hover:text-foreground", pathname === "/system-admin/dashboard" ? "text-foreground font-semibold" : "text-muted-foreground")}>Dashboard</Link>
           <Link href="/system-admin/schools" className={cn("transition-colors hover:text-foreground", pathname === "/system-admin/schools" ? "text-foreground font-semibold" : "text-muted-foreground")}>Manage Schools</Link>
        </nav>
        
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
          <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
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
