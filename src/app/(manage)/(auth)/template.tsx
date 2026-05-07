import { ThemeToggle } from "@/app/_components/dark-mode";
import PortoIcon from "@/app/_components/porto-icon";
import React from "react";

function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen overflow-y-auto">
      {children}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <PortoIcon />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Template;
