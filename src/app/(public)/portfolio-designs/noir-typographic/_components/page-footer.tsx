import type { Portfolio } from "generated/prisma";
import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FadeIn, Stagger, StaggerItem } from "./motion-primitives";

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

const sectionLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function PageFooter({ profile }: { profile: Portfolio }) {

  const socialLinks = [
    { label: "GitHub", href: profile.github, icon: FaGithub },
    { label: "GitLab", href: profile.gitlab, icon: FaGitlab },
    { label: "LinkedIn", href: profile.linkedin, icon: FaLinkedin },
    { label: "Facebook", href: profile.facebook, icon: FaFacebook },
    { label: "Instagram", href: profile.instagram, icon: FaInstagram },
  ].filter((l) => Boolean(l.href));

  return (
    <footer className="border-foreground/20 mt-10 border-t">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:px-10 sm:pt-24">
        <Stagger
          staggerChildren={0.12}
          delayChildren={0.05}
          amount={0.15}
          className="grid grid-cols-1 gap-10 md:grid-cols-12"
        >
          <StaggerItem
            direction="up"
            className="col-span-1 flex flex-col gap-6 md:col-span-6 items-center md:items-start"
          >
            <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
              Made it to the bottom
            </span>
            <h2 className="text-3xl leading-[0.95] font-black tracking-tight uppercase sm:text-3xl md:text-4xl text-center md:text-left">
              
                <>
                  Thank you
                  <br />
                </>
              <span className={outlineText}>for visiting</span>
            </h2>
            {profile.description ? (
              <code className="text-muted-foreground max-w-md text-sm text-center md:text-left hidden">
                {profile.description}
              </code>
            ) : null}
          </StaggerItem>

          <StaggerItem
            direction="up"
            className="col-span-1 flex flex-col items-center gap-4 md:items-start md:col-span-3"
          >
            <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
              [ Sections ]
            </span>
            <ul className="flex flex-col gap-3 items-center md:items-start">
              {sectionLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground font-mono text-sm tracking-[0.2em] uppercase transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem
            direction="up"
            className="col-span-1 flex flex-col items-center gap-4 md:items-start md:col-span-3"
          >
            <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
              [ Connect ]
            </span>
            {socialLinks.length > 0 ? (
              <ul className="flex flex-col gap-3 items-center md:items-start">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href || ""}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 hover:text-foreground inline-flex flex-row items-center gap-3 font-mono text-sm tracking-[0.2em] uppercase transition-colors"
                    >
                      <link.icon className="size-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-foreground/40 font-mono text-xs">
                &mdash;
              </span>
            )}
          </StaggerItem>
        </Stagger>

        <FadeIn
          direction="fade"
          delay={0.3}
          amount={0.4}
          className="border-foreground/20 mt-16 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row"
        >
          <code className="text-foreground/60 text-xs text-center md:text-left">
             <span className="">{profile.title}</span>
          </code>
          <code className="text-foreground/60 font-mono text-[10px] tracking-[0.3em] uppercase">
            {profile.location ? `${profile.location}` : ""}
          </code>
        </FadeIn>
      </div>
    </footer>
  );
}

export default PageFooter;
