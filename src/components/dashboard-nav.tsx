// src/components/dashboard-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { School, Home, BookOpen, UserCheck, MessageSquare, CreditCard, FileText, UserPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard: Home,
  Students: UserPlus,
  Academics: BookOpen,
  Attendance: UserCheck,
  Communication: MessageSquare,
  Fees: CreditCard,
  Tests: FileText,
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
        const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
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
