import type { Portfolio, Project, ProjectImages } from "generated/prisma";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { FadeIn } from "./motion-primitives";
import { ProjectGallery } from "./project-gallery";
import { SectionLabel } from "./section-label";

type ProjectWithImages = Project & { images: ProjectImages[] };

type ProfileWithRelations = Portfolio & {
  projects: ProjectWithImages[];
};

const pad = (value: number) => String(value).padStart(2, "0");

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

const typeLabel: Record<string, string> = {
  PERSONAL: "Personal",
  PROFESSIONAL: "Professional",
  FREELANCE: "Freelance",
  OTHER: "Other",
};

function PageProjects({ profile }: { profile: ProfileWithRelations }) {
  const projects = (profile.projects ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  if (projects.length === 0) return null;

  return (
    <div id="projects">
      <section className="mx-auto w-full max-w-6xl px-6 pb-0 sm:px-10 sm:pb-8">
        <FadeIn direction="right" amount={0.5}>
          <SectionLabel index="04" label="Projects" />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <FadeIn
            direction="up"
            className="col-span-1 md:col-span-8"
            amount={0.4}
          >
            <h2 className="text-4xl leading-[1.1] font-black tracking-tight uppercase sm:text-4xl md:text-4xl lg:text-5xl">
              Featured <span className={outlineText}>Projects</span>
            </h2>

            <code className="text-muted-foreground mt-2 max-w-md text-sm md:text-base">
              A showcase of web applications, systems, and digital experiences
              I’ve built using modern technologies.
            </code>
          </FadeIn>
        </div>

        <div className="mt-10 flex flex-col border-t">
          {projects.map((project, idx) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={idx}
              total={projects.length}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  total,
}: {
  project: ProjectWithImages;
  index: number;
  total: number;
}) {
  const flip = index % 2 === 1;

  const orderedImages = project.images
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((img) => img.image);

  const galleryImages = Array.from(
    new Set(
      [project.mainImage ?? null, ...orderedImages].filter(
        (src): src is string => Boolean(src),
      ),
    ),
  );

  return (
    <article className="group hover:bg-foreground hover:text-background border-b transition-colors duration-300">
      <div className="grid grid-cols-1 gap-8 p-6 px-0 sm:py-10 md:gap-12 lg:grid-cols-12 lg:px-10">
        <FadeIn
          direction={flip ? "left" : "right"}
          amount={0.2}
          duration={0.8}
          className={cn("col-span-1 md:col-span-7", flip && "md:order-2")}
        >
          <ProjectGallery images={galleryImages} title={project.title} />
        </FadeIn>

        <FadeIn
          direction={flip ? "right" : "left"}
          delay={0.1}
          amount={0.2}
          duration={0.8}
          className={cn(
            "col-span-1 flex flex-col gap-5 md:col-span-5",
            flip && "md:order-1",
          )}
        >
          <div className="text-foreground/60 group-hover:text-background/70 flex flex-row items-center justify-between font-mono text-xs tracking-[0.3em] uppercase">
            <span>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{format(new Date(project.developedAt), "yyyy")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="border-foreground/40 group-hover:border-background/40 inline-flex w-fit items-center border px-2 py-1 font-mono text-[10px] tracking-[0.3em] uppercase">
              {typeLabel[project.type] ?? project.type}
            </span>
          </div>

          <h3 className="text-2xl leading-[1.05] font-black tracking-tight uppercase sm:text-2xl md:text-3xl">
            {project.title}
          </h3>

          <p className="text-muted-foreground group-hover:text-background/80 text-sm leading-relaxed transition-colors duration-300">
            {project.description}
          </p>

          {project.tools.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="border-foreground/30 group-hover:border-background/40 inline-flex items-center border px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase"
                >
                  {tool}
                </span>
              ))}
            </div>
          ) : null}

          {project.url || project.github ? (
            <div className="mt-2 flex flex-row gap-3">
              {project.url ? (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border-foreground/40 hover:border-foreground group-hover:border-background/40 group-hover:hover:border-background inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors"
                >
                  <ArrowUpRight className="size-4" /> Visit
                </Link>
              ) : null}
              {project.github ? (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border-foreground/40 hover:border-foreground group-hover:border-background/40 group-hover:hover:border-background inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors"
                >
                  <FaGithub className="size-4" /> Source
                </Link>
              ) : null}
            </div>
          ) : null}
        </FadeIn>
      </div>
    </article>
  );
}

export default PageProjects;
