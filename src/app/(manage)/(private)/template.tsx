"use client";
import { AppSidebar } from "@/components/app-sidebar";
import CreatePortfolioDialog from "@/app/(manage)/(private)/_components/create-dialog";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function Template({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useQueryState(
    "create-portfolio",
    parseAsBoolean.withDefault(false),
  );
  return (
    <>
      <CreatePortfolioDialog open={open} onOpenChange={setOpen} />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-sidebar-primary-foreground overflow-hidden border">
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
