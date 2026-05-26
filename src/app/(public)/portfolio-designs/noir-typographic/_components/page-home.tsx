"use client";
import type { Portfolio } from "generated/prisma";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import {
  FaGithub,
  FaGitlab,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem } from "./motion-primitives";
import { SectionLabel } from "./section-label";
import { handleDownloadCV } from "@/app/(public)/[slug]/cv/_components/download-function";

function PageHome({ profile }: { profile: Portfolio }) {
  const [downloadingCV, setDownloadingCV] = useState(false);
  const fullName = profile.name.split(" ");
  const lastName = fullName.pop() || "";
  const firstName = fullName.join(" ");

  const socialLinks = [
    {
      label: "GitHub",
      href: profile.github,
      icon: FaGithub,
    },
    {
      label: "GitLab",
      href: profile.gitlab,
      icon: FaGitlab,
    },
    {
      label: "LinkedIn",
      href: profile.linkedin,
      icon: FaLinkedin,
    },
    {
      label: "Facebook",
      href: profile.facebook,
      icon: FaFacebook,
    },
    {
      label: "Instagram",
      href: profile.instagram,
      icon: FaInstagram,
    },
  ].filter((l) => Boolean(l.href));

  const onDownloadCVClick = async () => {
    await handleDownloadCV({
      fileName: `${profile.name}-CV.pdf`,
      setIsDownloading: (e: boolean) => setDownloadingCV(e),
    });
  };

  return (
    <div id="home">
      <div className="mt-14 md:mt-10 lg:mt-16 xl:mt-24">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-16 sm:px-10 sm:py-28">
          <Stagger
            delayChildren={0.25}
            staggerChildren={0.12}
            amount={0.1}
            className="flex w-full flex-col justify-center"
          >
            <FadeIn direction="right" amount={0.5}>
              <SectionLabel
                index="01"
                label="Hi, my name is"
                shouldShowBorder={false}
              />
            </FadeIn>

            <StaggerItem className="flex flex-row justify-between gap-10 py-4">
              <div className="flex flex-col py-4 text-4xl font-black uppercase sm:text-5xl md:text-6xl xl:text-7xl">
                <div>{firstName}</div>
                <div className="text-background uppercase [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]">
                  {lastName}
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-foreground/90 flex flex-row justify-between pb-4 text-sm tracking-wider sm:text-lg">
                <div>{profile.description}</div>
              </div>
            </StaggerItem>
            <StaggerItem className="flex cursor-pointer flex-row gap-2 py-4 sm:gap-4">
              <Link href="#projects" className="flex-1 sm:flex-none">
                <Button className="h-12 w-full cursor-pointer gap-3 sm:h-14 sm:px-8">
                  <LayoutGrid className="size-4 sm:size-5" strokeWidth={2.5} />
                  <code className="text-xs sm:text-sm md:text-base">
                    <span className="hidden sm:inline">View</span> Projects
                  </code>
                </Button>
              </Link>
              <div>
                <Button
                  variant="outline"
                  className="h-12 w-full cursor-pointer gap-3 sm:h-14 sm:px-8"
                  onClick={onDownloadCVClick}
                >
                  {downloadingCV ? (
                    <Loader2 className="size-4 animate-spin sm:size-5" />
                  ) : (
                    <Download
                      className="size-4 sm:size-5"
                      strokeWidth={2.5}
                    />
                  )}
                  <code className="text-xs sm:text-sm md:text-base">
                    Download My CV
                  </code>
                </Button>
              </div>
            </StaggerItem>
            <FadeIn
              direction="up"
              delay={socialLinks.length ? 0.1 : 0}
              className="flex flex-row gap-2 pt-4"
            >
              {socialLinks.map((link, idx) => (
                <FadeIn
                  key={link.href}
                  direction="scale"
                  delay={0.1 + idx * 0.08}
                  duration={0.5}
                >
                  <Link
                    href={link.href || ""}
                    target="_blank"
                    className="hover:bg-muted inline-flex aspect-square rounded-lg border p-3 transition-all duration-300 hover:-translate-y-1"
                  >
                    <link.icon className="size-5" />
                  </Link>
                </FadeIn>
              ))}
            </FadeIn>
          </Stagger>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
