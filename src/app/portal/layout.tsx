
import { ReactNode } from 'react';
import { School, UserCircle, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <header className="sticky top-0 z-30 flex h-[60px] items-center gap-4 border-b bg-background px-6">
        <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
          <School className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl">CampusConnect Portal</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
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
      <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
        {children}
      </main>
    </div>
  );
}
