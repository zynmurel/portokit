"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
