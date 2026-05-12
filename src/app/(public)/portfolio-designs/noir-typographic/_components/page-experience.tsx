import type { Experience, Portfolio } from "generated/prisma";
import { format } from "date-fns";
import React from "react";
import {
  FadeIn,
  StaggerItemLi,
  StaggerOl,
} from "./motion-primitives";
import { SectionLabel } from "./section-label";

type ProfileWithRelations = Portfolio & {
  experiences: Experience[];
};

const pad = (value: number) => String(value).padStart(2, "0");

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

function formatRange(start: Date, end: Date | null, isCurrent: boolean) {
  const startLabel = format(new Date(start), "MMM yyyy");
  const endLabel =
    isCurrent || !end ? "Present" : format(new Date(end), "MMM yyyy");
  return `${startLabel} — ${endLabel}`;
}

function durationLabel(start: Date, end: Date | null, isCurrent: boolean) {
  const s = new Date(start);
  const e = isCurrent || !end ? new Date() : new Date(end);
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth()) +
    (e.getDate() >= s.getDate() ? 0 : -1);
  if (months < 1) return "< 1 mo";
  if (months < 12) return `${months} mo${months > 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0
    ? `${years} yr${years > 1 ? "s" : ""}`
    : `${years} yr ${rem} mo`;
}

function PageExperience({ profile }: { profile: ProfileWithRelations }) {
  const experiences = (profile.experiences ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

  if (experiences.length === 0) return null;

  return (
    <div id="experience">
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-28">
        <FadeIn direction="right" amount={0.5}>
          <SectionLabel index="03" label="Experience" />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <FadeIn
            direction="up"
            className="col-span-1 md:col-span-8"
            amount={0.4}
          >
            <h2 className="text-4xl sm:text-5xl leading-[1.1] font-black tracking-tight uppercase md:text-6xl lg:text-7xl">
              Where I&rsquo;ve
              <br />
              <span className={outlineText}>Worked</span>
            </h2>
          </FadeIn>
          <FadeIn
            direction="left"
            delay={0.15}
            className="col-span-1 md:col-span-4 md:mb-2"
            amount={0.4}
          >
            <code className="text-muted-foreground block max-w-md text-base">
              A timeline of the teams, tools, and problems that shaped how I
              build today.
            </code>
          </FadeIn>
        </div>

        <StaggerOl
          staggerChildren={0.15}
          delayChildren={0.1}
          amount={0.05}
          className="border-foreground/20 mt-16 flex flex-col border-t"
        >
          {experiences.map((exp, idx) => (
            <StaggerItemLi
              key={exp.id}
              direction="up"
              className="border-foreground/20 group hover:bg-foreground hover:text-background border-b transition-colors duration-300"
            >
              <div className="grid grid-cols-1 gap-8  p-6 px-0 lg:px-10 sm:py-10 md:grid-cols-12">
                <div className="col-span-1 flex flex-col gap-3 md:col-span-3">
                  <div className="text-foreground/60 group-hover:text-background/70 flex flex-row items-center justify-between font-mono text-xs tracking-[0.3em] uppercase">
                    <span>{pad(idx + 1)}</span>
                    <span>/ {pad(experiences.length)}</span>
                  </div>

                  <div className="font-mono text-xs tracking-[0.2em] uppercase">
                    {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </div>

                  <div className="text-muted-foreground group-hover:text-background/70 font-mono text-[10px] tracking-[0.2em] uppercase">
                    {durationLabel(exp.startDate, exp.endDate, exp.isCurrent)}
                  </div>

                  {exp.isCurrent ? (
                    <div className="border-foreground/40 group-hover:border-background/40 mt-1 inline-flex w-fit items-center gap-2 border px-2 py-1 font-mono text-[10px] tracking-[0.3em] uppercase">
                      <span className="bg-foreground group-hover:bg-background size-1.5 rounded-full" />
                      Currently
                    </div>
                  ) : null}
                </div>

                <div className="col-span-1 flex flex-col gap-5 md:col-span-9">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl leading-[1.05] font-black tracking-tight uppercase sm:text-4xl md:text-4xl md:text-5xl">
                      {exp.position}
                    </h3>
                    <div className="text-foreground/70 group-hover:text-background/70 font-mono text-xs tracking-[0.3em] uppercase">
                      <span>{exp.company}</span>
                      {exp.location ? (
                        <>
                          <span className="mx-2 opacity-60">/</span>
                          <span>{exp.location}</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {exp.description.length > 0 ? (
                    <ul className="text-muted-foreground group-hover:text-background/80 flex flex-col gap-2 text-sm leading-relaxed transition-colors duration-300">
                      {exp.description.map((line, i) => (
                        <li key={i} className="flex flex-row gap-3">
                          <span className="text-foreground/40 group-hover:text-background/50 select-none">
                            &mdash;
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {exp.tools.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {exp.tools.map((tool) => (
                        <span
                          key={tool}
                          className="border-foreground/30 group-hover:border-background/40 inline-flex items-center border px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </StaggerItemLi>
          ))}
        </StaggerOl>
      </section>
    </div>
  );
}

export default PageExperience;
