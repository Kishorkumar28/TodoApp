
"use client";

import { Navbar } from '@/components/layout/navbar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          {/* SidebarTrigger is usually placed in Navbar or a top bar for mobile */}
          {/* Minimal header content or logo if needed */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/auth/login">
              <span className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
