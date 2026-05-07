"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MoreHorizontalIcon,
  FolderIcon,
  Trash2Icon,
  CirclePlusIcon,
  CopyIcon,
  FolderPlus,
  MessagesSquareIcon,
  ArrowUpRight,
} from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { api } from "@/trpc/react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

export function NavDocuments() {
  const router = useRouter();
  const [, setOpen] = useQueryState(
    "create-portfolio",
    parseAsBoolean.withDefault(false),
  );
  const { isMobile } = useSidebar();
  const { data: portfolios, isLoading } = api.portfolio.getAll.useQuery();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Portfolio</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <Skeleton className="bg-primary/10 h-10 animate-pulse" />
        ) : !portfolios?.length ? (
          <div className=" w-full h-10 rounded-md bg-primary/5  items-center text-sm px-3 flex flex-row gap-3 text-primary/50">
            <FolderPlus className="size-4 opacity-70" />
            <span>Add Portfolio to get started</span>
          </div>
        ) : (
          portfolios?.map((item) => (
            <SidebarMenuItem
              key={item.name}
              className="flex items-center gap-2"
            >
              <SidebarMenuButton asChild className="bg-primary/5 h-10">
                <a href={`/portfolio/${item.slug}`}>
                  <Image
                    src={item.logo || ""}
                    alt={item.name}
                    width={20}
                    height={20}
                    onError={(e) => {
                      e.currentTarget.src = "/fallback.png";
                    }}
                  />
                  <span className="max-w-[180px] truncate">{item.title}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent mt-1 mr-2 rounded-sm"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-32 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                <DropdownMenuItem onClick={() => router.push(`/portfolio/${item.slug}`)}>
                  <FolderIcon />
                  <span>Open</span>
                </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/portfolio/${item.slug}`)}>
                    <ArrowUpRight />
                    <span>Visit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CopyIcon />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessagesSquareIcon />
                    <span>Mailbox</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2Icon />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}

        <SidebarSeparator className="my-2" />

        <SidebarMenuItem className="flex items-center gap-2">
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground flex min-w-8 cursor-pointer items-center justify-center gap-2 duration-200 ease-linear"
            onClick={() => setOpen(true)}
          >
            <CirclePlusIcon />
            <span>Create Portfolio</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
