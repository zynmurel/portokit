import type { Portfolio } from "generated/prisma";
import { CodeIcon, Menu, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-button";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

function PageHeader({ profile }: { profile: Portfolio }) {
  return (
    <header className="bg-background/95 border-foreground/10 fixed top-0 left-0 z-50 w-full border-b shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl flex-row items-center justify-between gap-4 px-6 sm:h-20 sm:gap-6 sm:px-10 md:h-24">
        <div className="flex flex-row items-center gap-8 lg:gap-14">
          <Link href="#home" className="shrink-0">
            <code className="text-base font-bold sm:text-lg md:text-xl">
              {profile.title}
              <span className="text-primary">.</span>
            </code>
          </Link>

          <nav className="hidden flex-row gap-8 md:flex lg:gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/70 hover:text-foreground font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-300 lg:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Link href="#contact" className="hidden sm:inline-flex">
            <Button variant="outline" className="gap-2 px-5 bg-transparent!" type="button">
              <MessageCircleMore />
              <code>Contact Me</code>
            </Button>
          </Link>

          <ThemeToggle
            themeName={profile.theme ?? "default"}
            className="border-border"
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 sm:w-80">
              <SheetHeader className="border-foreground/10 border-b">
                <SheetTitle className="font-mono text-xs tracking-[0.3em] uppercase">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="border-foreground/10 hover:bg-foreground hover:text-background border-b px-6 py-5 font-mono text-sm tracking-[0.2em] uppercase transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="#contact"
                    className="border-foreground/10 hover:bg-foreground hover:text-background flex items-center gap-2 border-b px-6 py-5 font-mono text-sm tracking-[0.2em] uppercase transition-colors"
                  >
                    <CodeIcon className="size-4" />
                    Contact Me
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
