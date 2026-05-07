"use client";

import { ThemeToggle } from "@/app/_components/dark-mode";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const titleMap = {
    "/dashboard": "Dashboard",
    "/portfolios": "Portfolios",
    "/create": "Create Portfolio",
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-0 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex h-full items-center justify-center">
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <h1 className="text-base font-medium">
          {titleMap[pathname as keyof typeof titleMap]}
        </h1>
        <div className=" ml-auto">
          <ThemeToggle className=" rounded-full" />
        </div>
      </div>
    </header>
  );
}
