"use client";
import React, { useEffect } from "react";
import { useTheme } from "next-themes";

function ThemeSetter({
  children,
  themeName,
}: {
  children: React.ReactNode;
  themeName: string;
}) {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    console.log("themeName", themeName, theme);
    if (themeName === "default") {
      if (["light", "dark"].includes(theme || "")) {
        return;
      }
      setTheme("dark");
    } else {
      if (!theme?.includes(themeName)) {
        setTheme(`${themeName}-dark`);
      }
    }
  }, [themeName, theme, setTheme]);
  return <>{children}</>;
}

export default ThemeSetter;
