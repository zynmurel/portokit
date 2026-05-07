import React from "react";
import { NextThemeProvider } from "../providers/theme-provider";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      storageKey="portfolio-theme-manage"
      defaultTheme="dark"
      themes={["light", "dark"]}
    >
      {children}
    </NextThemeProvider>
  );
}

export default Layout;
