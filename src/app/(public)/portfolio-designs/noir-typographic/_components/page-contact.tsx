"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Portfolio } from "generated/prisma";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof schema>;

function PageContact({ profile }: { profile: Portfolio }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const messageMe = api.portfolio.messageMe.useMutation({
    onSuccess: () => {
      toast.success("Message sent. I'll get back to you soon.");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message ?? "Could not send message");
    },
  });

  const onSubmit = (values: FormValues) => {
    messageMe.mutate({ ...values, portfolioId: profile.id });
  };

  const socialLinks = [
    { label: "GitHub", href: profile.github, icon: FaGithub },
    { label: "GitLab", href: profile.gitlab, icon: FaGitlab },
    { label: "LinkedIn", href: profile.linkedin, icon: FaLinkedin },
    { label: "Facebook", href: profile.facebook, icon: FaFacebook },
    { label: "Instagram", href: profile.instagram, icon: FaInstagram },
  ].filter((l) => Boolean(l.href));

  const errors = form.formState.errors;

  return (
    <div id="contact">
      <section className="mx-auto w-full max-w-7xl  px-6 pb-16 sm:px-10 sm:pb-28">
        {/* <SectionLabel index="05" label="Contact" /> */}

        <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <h2 className="col-span-1 text-4xl sm:text-5xl leading-[1.1] font-black tracking-tight uppercase md:col-span-8 md:text-6xl lg:text-7xl">
            Let&rsquo;s
            <span className={outlineText}> Talk</span>
          </h2>
          <code className="text-muted-foreground col-span-1 max-w-md text-base md:col-span-4 md:mb-2">
            Have a project, a question, or just want to say hi? Drop a message
            below &mdash; I&rsquo;ll get back to you.
          </code>
        </div>

        <div className="border-foreground/20 mt-16 grid grid-cols-1 border-t md:grid-cols-12">
          <aside className="border-foreground/20 col-span-1 flex flex-col gap-8 border-b p-0 py-10 sm:p-10 md:col-span-5 md:border-r md:border-b-0">
            <div className="flex flex-col gap-3">
              <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
                Reach out
              </span>
              <p className="text-2xl leading-tight font-black tracking-tight uppercase sm:text-3xl">
                Available for new
                <br />
                <span className={outlineText}>opportunities</span>
              </p>
            </div>

            {profile.location ? (
              <div className="text-foreground/70 flex flex-row items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
                <MapPin className="size-4" />
                {profile.location}
              </div>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className="flex flex-col gap-3">
                <span className="text-foreground/60 font-mono text-xs tracking-[0.3em] uppercase">
                  Connect
                </span>
                <div className="flex flex-row flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href || ""}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="border-foreground/30 hover:bg-foreground hover:text-background flex aspect-square size-11 items-center justify-center border transition-colors duration-300"
                    >
                      <link.icon className="size-4" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="col-span-1 flex flex-col gap-6 p-0 py-10 sm:p-10 md:col-span-7"
            noValidate
          >
            <FieldLabel label="Name" error={errors.name?.message}>
              <input
                {...form.register("name")}
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={fieldClass}
              />
            </FieldLabel>

            <FieldLabel label="Email" error={errors.email?.message}>
              <input
                {...form.register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </FieldLabel>

            <FieldLabel label="Message" error={errors.message?.message}>
              <textarea
                {...form.register("message")}
                rows={6}
                placeholder="Tell me about your idea, role, or anything on your mind."
                className={cn(fieldClass, "resize-none")}
              />
            </FieldLabel>

            <button
              type="submit"
              disabled={messageMe.isPending}
              className="border-foreground hover:bg-foreground hover:text-background mt-2 inline-flex h-14 cursor-pointer items-center justify-center gap-3 border-2 px-8 font-mono text-xs tracking-[0.3em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUpRight className="size-4" />
              {messageMe.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

const fieldClass =
  "border-foreground/30 focus:border-foreground placeholder:text-foreground/30 w-full border-b-2 bg-transparent px-0 py-3 text-base font-medium outline-none transition-colors";

function FieldLabel({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-foreground/60 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase">
        <span>{label}</span>
        {error ? (
          <span className="text-destructive normal-case tracking-normal">
            {error}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export default PageContact;
