import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Portfolio } from "generated/prisma";
import DetailsFormDialog from "./dialog-forms/details";
import { Button } from "@/components/ui/button";
import { MapPinIcon, PencilIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FaGithub,
  FaGitlab,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { StepOneLoader } from "./loaders";

function StepOne({
  portfolio,
  isLoading,
}: {
  portfolio: Portfolio | null | undefined;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Portfolio Details</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Manage your portfolio details
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <PencilIcon className="size-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <StepOneLoader />
        ) : (
          portfolio && (
            <DetailsContent
              portfolio={portfolio}
              open={open}
              setOpen={setOpen}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}

const DetailsContent = ({
  portfolio,
  open,
  setOpen,
}: {
  portfolio: Portfolio;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {

  const socialLinks = [
    {
      label: "GitHub",
      href: portfolio.github,
      icon: <FaGithub className="h-3.5 w-3.5" />,
    },
    {
      label: "GitLab",
      href: portfolio.gitlab,
      icon: <FaGitlab className="h-3.5 w-3.5" />,
    },
    {
      label: "LinkedIn",
      href: portfolio.linkedin,
      icon: <FaLinkedin className="h-3.5 w-3.5" />,
    },
    {
      label: "Facebook",
      href: portfolio.facebook,
      icon: <FaFacebook className="h-3.5 w-3.5" />,
    },
    {
      label: "Instagram",
      href: portfolio.instagram,
      icon: <FaInstagram className="h-3.5 w-3.5" />,
    },
  ].filter((l) => Boolean(l.href));

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Hero — avatar, name, role, location */}
      <div className="flex items-start gap-4 border-b p-5">
        {/* Profile image */}
        <div className="bg-muted relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border">
          {portfolio.image ? (
            <Image
              src={portfolio.image}
              alt={portfolio.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm font-medium">
              {portfolio.name?.slice(0, 2).toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium">{portfolio.name || "—"}</p>
          <p className="text-muted-foreground text-sm">{portfolio.title || "—"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {portfolio.role && (
              <span className="text-muted-foreground flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
                <UserIcon className="h-3 w-3" />
                {portfolio.role}
              </span>
            )}
            {portfolio.location && (
              <span className="text-muted-foreground flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
                <MapPinIcon className="h-3 w-3" />
                {portfolio.location}
              </span>
            )}
          </div>
        </div>

        {/* Logo */}
        {portfolio.logo && (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border">
            <Image
              src={portfolio.logo}
              alt="logo"
              fill
              className="object-contain p-1.5"
            />
          </div>
        )}
      </div>

      {/* Core fields grid */}
      <div className="border-b p-5">
        <p className="text-muted-foreground mb-3 text-[11px] font-medium tracking-wider uppercase">
          Details
        </p>
        <div className="grid grid-cols-2 gap-2">
          <DetailField label="Name" value={portfolio.name} />
          <DetailField label="Title" value={portfolio.title} />
          <DetailField label="Slug" value={portfolio.slug} />
          <DetailField label="Role" value={portfolio.role} />
          <DetailField label="Email" value={portfolio.email} />
          <DetailField label="Phone" value={portfolio.phoneNumber} />
          <DetailField
            label="Location"
            value={portfolio.location}
            className="col-span-2"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="border-b p-5">
        <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase">
          Summary
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {portfolio.description || "—"}
        </p>
      </div>

      {/* Social links */}
      <div className="p-5">
        <p className="text-muted-foreground mb-3 text-[11px] font-medium tracking-wider uppercase">
          Social links
        </p>
        {socialLinks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2.5 text-sm"
              >
                <span className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-md border">
                  {icon}
                </span>
                {href}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            No social links added.
          </p>
        )}
      </div>

      <DetailsFormDialog
        open={open}
        onOpenChange={setOpen}
        data={{
          name: portfolio.name,
          title: portfolio.title,
          slug: portfolio.slug,
          location: portfolio.location ?? "",
          description: portfolio.description ?? "",
          role: portfolio.role,
          logo: portfolio.logo,
          github: portfolio.github ?? undefined,
          gitlab: portfolio.gitlab ?? undefined,
          linkedin: portfolio.linkedin ?? undefined,
          facebook: portfolio.facebook ?? undefined,
          instagram: portfolio.instagram ?? undefined,
          email: portfolio.email ?? "",
          phoneNumber: portfolio.phoneNumber ?? "",
          image: portfolio.image,
        }}
      />
    </div>
  );
};

// Small helper
function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted/50 rounded-md px-3 py-2", className)}>
      <p className="text-muted-foreground mb-0.5 text-[11px]">{label}</p>
      <p
        className={cn(
          "text-sm font-medium",
          !value && "text-muted-foreground font-normal",
        )}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export default StepOne;
