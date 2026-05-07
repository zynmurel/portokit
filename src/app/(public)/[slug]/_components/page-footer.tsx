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

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

const sectionLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function PageFooter({ profile }: { profile: Portfolio }) {
  const fullName = profile.name.split(" ");
  const lastName = fullName.pop() || "";
  const firstName = fullName.join(" ");

  const socialLinks = [
    { label: "GitHub", href: profile.github, icon: FaGithub },
    { label: "GitLab", href: profile.gitlab, icon: FaGitlab },
    { label: "LinkedIn", href: profile.linkedin, icon: FaLinkedin },
    { label: "Facebook", href: profile.facebook, icon: FaFacebook },
    { label: "Instagram", href: profile.instagram, icon: FaInstagram },
  ].filter((l) => Boolean(l.href));

  const year = new Date().getFullYear();

  return (
    <footer className="border-foreground/20 mt-10 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10 sm:px-10 sm:pt-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="col-span-1 flex flex-col gap-6 md:col-span-6 items-center md:items-start">
            <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
              Thanks for scrolling
            </span>
            <h2 className="text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-5xl md:text-6xl text-center md:text-left">
              {firstName ? (
                <>
                  {firstName}
                  <br />
                </>
              ) : null}
              <span className={outlineText}>{lastName}</span>
            </h2>
            {profile.description ? (
              <code className="text-muted-foreground max-w-md text-sm text-center md:text-left">
                {profile.description}
              </code>
            ) : null}
          </div>

          <div className="col-span-1 flex flex-col items-center gap-4 md:items-start md:col-span-3">
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
          </div>

          <div className="col-span-1 flex flex-col items-center gap-4 md:items-start md:col-span-3">
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
          </div>
        </div>

        <div className="border-foreground/20 mt-16 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <code className="text-foreground/60 text-xs text-center md:text-left">
            © {year} {profile.name}. All rights reserved.
          </code>
          <code className="text-foreground/60 font-mono text-[10px] tracking-[0.3em] uppercase">
            {profile.location ? `${profile.location}` : ""}
          </code>
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;
