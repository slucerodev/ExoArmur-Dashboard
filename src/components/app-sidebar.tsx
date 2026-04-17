"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  ScrollText,
  Brain,
  ShieldCheck,
  Network,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Workflow, label: "Pipeline", href: "/pipeline" },
  { icon: ScrollText, label: "Audit Trail", href: "/audit" },
  { icon: Brain, label: "Beliefs", href: "/beliefs" },
  { icon: ShieldCheck, label: "Approvals", href: "/approvals" },
  { icon: Network, label: "Federation", href: "/federation" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            className="h-7 w-7 shrink-0"
          >
            <path
              d="M16 3 L28 8 L28 20 C28 26 16 31 16 31 C16 31 4 26 4 20 L4 8 Z"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            />
            <path
              d="M11 16 L14 19 L21 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none">
              ExoArmur
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              v2.0.2
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 w-full text-sm transition-colors px-2 py-1.5 rounded-md",
                        isActive
                          ? "text-accent-foreground font-medium bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          Governance overlay — not a SIEM replacement
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
