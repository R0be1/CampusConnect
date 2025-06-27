
// src/components/dashboard-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { School, LayoutDashboard, BookOpen, UserCheck, MessageSquare, DollarSign, ClipboardCheck, Users, Settings, ClipboardList, UserCircle, BookCopy, Radio, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard: LayoutDashboard,
  Students: Users,
  Academics: BookOpen,
  Attendance: UserCheck,
  Communication: MessageSquare,
  Fees: DollarSign,
  Results: ClipboardCheck,
  Tests: ClipboardList,
  'E-Learning': BookCopy,
  'Live Sessions': Radio,
  Settings: Settings,
  Profile: UserCircle,
  "Parent Portal": UserCircle,
  "Student Portal": UserCircle,
};

export type NavItem = {
  href?: string;
  label: string;
  subItems?: NavItem[];
};

interface DashboardNavProps {
  items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenSections: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(subItem => subItem.href && pathname.startsWith(subItem.href));
        if (isActive) {
          newOpenSections[item.label] = true;
        }
      }
    });
    setOpenSections(newOpenSections);
  }, [pathname, items]);

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className="grid items-start gap-1 px-2 py-2 text-sm font-medium lg:px-4">
      {items.map((item) => {
        const Icon = iconMap[item.label] || LayoutDashboard;

        if (item.subItems) {
          const isParentActive = item.subItems.some(subItem => subItem.href && pathname.startsWith(subItem.href));
          return (
            <Collapsible key={item.label} open={openSections[item.label] || false} onOpenChange={() => toggleSection(item.label)}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isParentActive && "text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 transition-transform duration-200", openSections[item.label] && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="my-1 ml-4 flex flex-col gap-1 border-l pl-4">
                  {item.subItems.map(subItem => {
                    const isSubItemActive = subItem.href ? pathname === subItem.href : false;
                    return (
                      <Link
                        key={subItem.label}
                        href={subItem.href!}
                        className={cn(
                          "rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isSubItemActive && "bg-muted text-primary font-semibold"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        }
        
        const isRootDashboard = item.href === '/dashboard';
        const isActive = item.href ? (isRootDashboard ? pathname === item.href : pathname.startsWith(item.href)) : false;
        
        return (
          <Link
            key={item.label}
            href={item.href!}
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
