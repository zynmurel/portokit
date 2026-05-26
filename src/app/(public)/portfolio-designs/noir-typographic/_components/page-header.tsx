"use client";
import type { Portfolio } from "generated/prisma";
import { DownloadIcon, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlideDownHeader } from "./motion-primitives";
import Image from "next/image";
import { handleDownloadCV } from "@/app/(public)/[slug]/cv/_components/download-function";

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function PageHeader({ profile }: { profile: Portfolio }) {
  const [downloadingCV, setDownloadingCV] = useState(false);

  const onDownloadCVClick = async() => {
    await handleDownloadCV({
      fileName: `${profile.name}-CV.pdf`,
      setIsDownloading: (e: boolean) => setDownloadingCV(e),
    });
  };

  return (
    <SlideDownHeader className="bg-background/95 border-foreground/10 fixed top-0 left-0 z-50 w-full border-b shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full flex-row items-center justify-between gap-4 px-6 sm:gap-6 sm:px-10">
        <div className="flex flex-row items-center gap-8 lg:gap-14">
          <Link
            href="#home"
            className="flex shrink-0 flex-row items-center gap-2"
          >
            <Image
              src={profile.logo}
              alt={profile.title}
              width={40}
              height={40}
              className="size-4 sm:size-6"
            />
            <code className="text-xs font-bold sm:text-sm md:text-base">
              {profile.title}
              <span className="text-primary">.</span>
            </code>
          </Link>
        </div>

        <div className="flex flex-row items-center gap-2 md:gap-8">
          <nav className="hidden flex-row gap-6 md:flex">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/90 group hover:text-foreground text-xs font-medium tracking-[0.1em] uppercase transition-colors duration-300 lg:text-xs"
              >
                <span className="text-foreground/50 group-hover:text-foreground font-mono text-[1em] transition-colors duration-300">
                  [0{index + 1}]
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="outline"
            className="hidden gap-2 bg-transparent! px-3 sm:flex"
            type="button"
            size={"sm"}
            onClick={onDownloadCVClick}
          >
            {downloadingCV ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <DownloadIcon className="size-3.5" />
            )}
            <code className="text-xs uppercase">Download CV</code>
          </Button>

          {/* <ThemeToggle
            themeName={profile.theme ?? "default"}
            className="border-border"
          /> */}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="border-border md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-3.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 sm:w-80">
              <SheetHeader className="border-foreground/10 border-b">
                <SheetTitle className="font-mono text-xs tracking-[0.3em] uppercase">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col">
                {menuItems.map((item, index) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="border-foreground/10 hover:bg-foreground hover:text-background border-b px-6 py-5 font-mono text-sm tracking-[0.2em] uppercase transition-colors"
                    >
                      [0{index + 1}]{item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </SlideDownHeader>
  );
}

export default PageHeader;
