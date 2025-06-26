
// src/components/dashboard-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { School, Home, BookOpen, UserCheck, MessageSquare, DollarSign, ClipboardList, Users, Settings, ClipboardCheck, LayoutDashboard, UserCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard: LayoutDashboard,
  Students: Users,
  Academics: BookOpen,
  Attendance: UserCheck,
  Communication: MessageSquare,
  Fees: DollarSign,
  Results: ClipboardCheck,
  Tests: ClipboardList,
  Settings: Settings,
  Profile: UserCircle,
  "Parent Portal": UserCircle,
  "Student Portal": UserCircle,
};

interface DashboardNavProps {
  items: { href: string; label: string }[];
  isMobile?: boolean;
}

export function DashboardNav({ items, isMobile = false }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start px-2 text-sm font-medium lg:px-4", isMobile && 'mt-6')}>
      {isMobile && (
        <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <School className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">CampusConnect</span>
        </Link>
      )}
      {items.map((item) => {
        const Icon = iconMap[item.label] || Home;
        const isRootDashboard = item.href.endsWith('/dashboard') || item.href === '/dashboard';
        const isActive = isRootDashboard ? pathname === item.href : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
