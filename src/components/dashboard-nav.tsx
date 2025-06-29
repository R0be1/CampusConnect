
// src/components/dashboard-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { School, LayoutDashboard, BookOpen, UserCheck, MessageSquare, DollarSign, ClipboardCheck, Users, Settings, ClipboardList, UserCircle, BookCopy, Radio, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  "Manage Schools": School,
};

export type NavItem = {
  href?: string;
  label: string;
  subItems?: NavItem[];
};

interface DashboardNavProps {
  items: NavItem[];
  isCollapsed: boolean;
}

export function DashboardNav({ items, isCollapsed }: DashboardNavProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isCollapsed) {
      setOpenSections({});
      return;
    }
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
  }, [pathname, items, isCollapsed]);

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid items-start gap-1 px-2 py-2 text-sm font-medium lg:px-4">
        {items.map((item) => {
          const Icon = iconMap[item.label] || LayoutDashboard;
          const isParentActive = item.subItems?.some(subItem => subItem.href && pathname.startsWith(subItem.href));

          if (item.subItems) {
            return (
              <Collapsible key={item.label} open={!isCollapsed && (openSections[item.label] || false)} onOpenChange={() => toggleSection(item.label)}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-primary", isParentActive && "text-sidebar-primary", isCollapsed && "justify-center")}
                      >
                        <Icon className="h-5 w-5" />
                        <span className={cn("truncate", isCollapsed && "sr-only")}>{item.label}</span>
                        {!isCollapsed && <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 transition-transform duration-200", openSections[item.label] && "rotate-180")} />}
                      </button>
                    </CollapsibleTrigger>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
                
                {!isCollapsed && (
                    <CollapsibleContent>
                        <div className="my-1 ml-4 flex flex-col gap-1 border-l pl-4 border-sidebar-border">
                            {item.subItems.map(subItem => {
                                const isSubItemActive = subItem.href ? pathname === subItem.href : false;
                                return (
                                <Link
                                    key={subItem.label}
                                    href={subItem.href!}
                                    className={cn(
                                    "rounded-md px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-primary",
                                    isSubItemActive && "bg-sidebar-accent text-sidebar-primary font-semibold"
                                    )}
                                >
                                    {subItem.label}
                                </Link>
                                )
                            })}
                        </div>
                    </CollapsibleContent>
                )}
              </Collapsible>
            );
          }
          
          const isRootDashboard = item.href === '/dashboard' || item.href === '/system-admin/dashboard';
          const isActive = item.href ? (isRootDashboard ? pathname === item.href : pathname.startsWith(item.href)) : false;
          
          return (
            <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                    <Link
                        href={item.href!}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-primary", isActive && "bg-sidebar-accent text-sidebar-primary", isCollapsed && "h-9 w-9 justify-center p-0")}
                    >
                        <Icon className={cn("h-5 w-5")} />
                        <span className={cn(isCollapsed && "sr-only")}>{item.label}</span>
                    </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
