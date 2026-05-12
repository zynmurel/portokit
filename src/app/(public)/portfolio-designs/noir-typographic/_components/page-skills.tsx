import type { Portfolio, ProfessionalTraits, Skill } from "generated/prisma";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import {
  FadeIn,
  StaggerItemLi,
  StaggerUl,
} from "./motion-primitives";
import { SectionLabel } from "./section-label";

type ProfileWithRelations = Portfolio & {
  skills: Skill[];
  professionalTraits: ProfessionalTraits[];
};

const pad = (value: number) => String(value).padStart(2, "0");

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

function PageSkills({ profile }: { profile: ProfileWithRelations }) {
  const traits = profile.professionalTraits ?? [];
  const skills = profile.skills ?? [];

  return (
    <div id="skills" className="flex flex-col">
      <CoreStrengths traits={traits} />
      <TechnicalSkills skills={skills} />
    </div>
  );
}

function CoreStrengths({ traits }: { traits: ProfessionalTraits[] }) {
  if (traits.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-28">
      <FadeIn direction="right" amount={0.5}>
        <SectionLabel index="01" label="Core Strengths" />
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
        <FadeIn direction="up" className="col-span-1 md:col-span-8" amount={0.4}>
          <h2 className="text-4xl sm:text-5xl leading-[1.1] font-black tracking-tight uppercase md:text-6xl lg:text-7xl">
            What I
            <br />
            <span className={cn("ml-0", outlineText)}>Bring</span> to the table
          </h2>
        </FadeIn>
        <FadeIn
          direction="left"
          delay={0.15}
          className="col-span-1 md:col-span-4 md:mb-2"
          amount={0.4}
        >
          <code className="text-muted-foreground block max-w-md text-base">
            A blend of mindset, discipline, and craft &mdash; the qualities that
            shape how I approach every line of code.
          </code>
        </FadeIn>
      </div>

      <StaggerUl
        staggerChildren={0.12}
        delayChildren={0.1}
        amount={0.1}
        className="border-foreground/20 mt-16 grid grid-cols-1 border-t md:grid-cols-2"
      >
        {traits.map((trait, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <StaggerItemLi
              key={trait.id}
              direction={isLeft ? "right" : "left"}
              className={cn(
                "border-foreground/20 group hover:bg-foreground hover:text-background relative flex flex-col gap-6 border-b p-8 px-0 transition-colors duration-300 sm:px-8 md:p-12",
                !isLeft && "md:border-l",
              )}
            >
              <div className="text-foreground/60 group-hover:text-background/70 flex flex-row items-center justify-between font-mono text-xs tracking-[0.3em] uppercase">
                <span>{pad(idx + 1)}</span>
                <span>/ {pad(traits.length)}</span>
              </div>

              <div className="text-2xl leading-none font-black tracking-tight uppercase sm:text-3xl md:text-4xl">
                {trait.name}
              </div>

              <p className="text-muted-foreground group-hover:text-background/70 max-w-md text-sm leading-relaxed transition-colors duration-300">
                {trait.description}
              </p>
            </StaggerItemLi>
          );
        })}
      </StaggerUl>
    </section>
  );
}

function TechnicalSkills({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-28">
      <FadeIn direction="right" amount={0.5}>
        <SectionLabel index="02" label="Technical Skills" />
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
        <FadeIn direction="up" className="col-span-1 md:col-span-8" amount={0.4}>
          <h2 className="text-4xl sm:text-5xl leading-[1.1] font-black tracking-tight uppercase md:text-6xl lg:text-7xl">
            Tools of
            <br />
            the <span className={outlineText}>Trade</span>
          </h2>
        </FadeIn>
        <FadeIn
          direction="left"
          delay={0.15}
          className="col-span-1 md:col-span-4 md:mb-2"
          amount={0.4}
        >
          <code className="text-muted-foreground block max-w-md text-base">
            The technologies I reach for daily &mdash; from frontend frameworks
            to backend infrastructure and the in-betweens.
          </code>
        </FadeIn>
      </div>

      <StaggerUl
        staggerChildren={0.05}
        delayChildren={0.05}
        amount={0.05}
        className="border-foreground/20 mt-16 grid grid-cols-2 border-t border-l md:grid-cols-3 lg:grid-cols-4"
      >
        {skills.map((skill, idx) => (
          <StaggerItemLi
            key={skill.id}
            direction="scale"
            className="border-foreground/20 group hover:bg-foreground hover:text-background relative flex flex-col justify-between gap-5 border-r border-b p-4 transition-colors duration-300 sm:p-6"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-foreground/60 group-hover:text-background/70 font-mono text-[10px] tracking-[0.3em] uppercase">
                {pad(idx + 1)}
              </span>

              {skill.icon ? (
                <div className="bg-transparent group-hover:bg-background/10 flex size-8 items-center justify-center overflow-hidden border transition-colors duration-300 sm:size-10 sm:p-1.5">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={32}
                    height={32}
                    className="size-full overflow-hidden bg-white object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div className="text-sm leading-none font-black tracking-tight uppercase sm:text-lg md:text-xl lg:text-2xl">
              {skill.name}
            </div>
          </StaggerItemLi>
        ))}
      </StaggerUl>
    </section>
  );
}

export default PageSkills;
