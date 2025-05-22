
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

type IconName = keyof typeof Icons;

const getIcon = (name: string): LucideIcon => {
  const iconName = name as IconName;
  return Icons[iconName] || Icons.HelpCircle; // Fallback icon
};

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {siteConfig.sidebarNav.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <span className="flex items-center gap-2"> {/* Wrapper span */}
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </nav>
  );
}
