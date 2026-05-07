import React from "react";
import { NextThemeProvider } from "../providers/theme-provider";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      storageKey="portfolio-theme-public"
      defaultTheme="light"
      themes={[
        "light",
        "dark",
        "neo-mint",
        "neo-mint-dark",
        "minimal-slate",
        "minimal-slate-dark",
        "graphite-amber",
        "graphite-amber-dark",
        "sunset-minimal",
        "sunset-minimal-dark",
        "pinky",
        "pinky-dark",
        "indigo-aurora",
        "indigo-aurora-dark",

        "gray-minimal",
        "gray-minimal-dark",
      ]}
    >
      {children}
    </NextThemeProvider>
  );
}

export default Layout;
