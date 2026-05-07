"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  themeName = "default",
}: {
  className?: string;
  themeName?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // fix hydration mismatch
  useEffect(() => setMounted(true), []);

  const light = themeName === "default" ? "light" : themeName;
  const dark = themeName === "default" ? "dark" : `${themeName}-dark`;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === light ? dark : light)}
      className={cn("relative", className)}
      disabled={!mounted}
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === light ? "scale-0 rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          theme === light ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
