"use client";

import { ThemeProvider } from "next-themes";

type NextThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
  defaultTheme?: string;
  themes?: string[];
};

export function NextThemeProvider({
  children,
  storageKey = "portfolio-theme",
  defaultTheme = "system",
  themes = ["light", "dark"],
}: NextThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey={storageKey}
      defaultTheme={defaultTheme}
      enableSystem
      themes={themes}
    >
      {children}
    </ThemeProvider>
  );
}
