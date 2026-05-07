import type { Portfolio } from "generated/prisma";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Dot, LayoutGrid } from "lucide-react";
import {
  FaGithub,
  FaGitlab,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

function PageHome({ profile }: { profile: Portfolio }) {
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

  return (
    <div id="home">
      <div className="mt-8 md:mt-10 lg:mt-16 xl:mt-24">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-16 sm:px-10 sm:py-28">
          <div className="flex w-full flex-col justify-center">
            <div className="text-foreground/70 flex flex-row items-center gap-5 font-mono text-xs tracking-widest uppercase sm:text-sm md:text-base">
              <div className="border-foreground/70 hidden w-8 border-b-2 sm:block" />{" "}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div>{profile.role}</div>{" "}
                <Dot className="hidden size-6 sm:block" />{" "}
                <div className="text-[10px] sm:text-sm">{profile.location}</div>
              </div>
            </div>

            <div className="flex flex-row justify-between gap-10 py-4">
              <div className="flex flex-col py-4 text-5xl font-black uppercase sm:text-6xl md:text-7xl xl:text-8xl">
                <div>{firstName}</div>
                <div className="text-background uppercase [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]">
                  {lastName}
                </div>
              </div>
            </div>
            <code className="text-muted-foreground flex flex-row justify-between pb-4 text-sm sm:text-lg">
              <div>{profile.description}</div>
            </code>
            <div className="flex cursor-pointer flex-row  gap-2 sm:gap-4 py-4">
              <Link href="#projects" className=" flex-1 sm:flex-none">
                <Button className="h-12 sm:h-14 cursor-pointer gap-3 sm:px-8 w-full">
                  <LayoutGrid className="size-4 sm:size-5" strokeWidth={2.5} />
                  <code className="text-xs sm:text-sm md:text-base"><span className="hidden sm:inline">View</span> Projects</code>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-12 sm:h-14 cursor-pointer gap-3 sm:px-8 flex-1 sm:flex-none"
              >
                <ArrowDownToLine className="size-4 sm:size-5" strokeWidth={2.5} />
                <code className="text-xs sm:text-sm md:text-base">Download CV</code>
              </Button>
            </div>
            <div className="flex flex-row gap-2 pt-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href || ""}
                  target="_blank"
                  className="hover:bg-muted aspect-square rounded-lg border p-3 transition-colors duration-300"
                >
                  <link.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
