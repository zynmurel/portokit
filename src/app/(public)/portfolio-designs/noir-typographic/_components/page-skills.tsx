import type { Portfolio, ProfessionalTraits, Skill } from "generated/prisma";
import { SkillCategory } from "generated/prisma";
import React from "react";
import { cn } from "@/lib/utils";
import { FadeIn, StaggerItemLi, StaggerUl } from "./motion-primitives";
import { SectionLabel } from "./section-label";

type ProfileWithRelations = Portfolio & {
  skills: Skill[];
  professionalTraits: ProfessionalTraits[];
};

const pad = (value: number) => String(value).padStart(2, "0");

const outlineText =
  "text-background [text-shadow:-2px_0_var(--foreground),2px_0_var(--foreground),0_-2px_var(--foreground),0_2px_var(--foreground)]";

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.FRONTEND]: "Frontend",
  [SkillCategory.BACKEND]: "Backend",
  [SkillCategory.FULLSTACK]: "Fullstack",
  [SkillCategory.DATABASE]: "Database",
  [SkillCategory.DEVOPS]: "DevOps & Tools",
  [SkillCategory.DESIGN]: "Design",
  [SkillCategory.OTHER]: "Other",
};

const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  SkillCategory.FRONTEND,
  SkillCategory.BACKEND,
  SkillCategory.FULLSTACK,
  SkillCategory.DATABASE,
  SkillCategory.DEVOPS,
  SkillCategory.DESIGN,
  SkillCategory.OTHER,
];

function PageSkills({ profile }: { profile: ProfileWithRelations }) {
  const traits = profile.professionalTraits ?? [];
  const skills = profile.skills ?? [];
  const aboutme = profile.aboutme ?? "";

  return (
    <div id="about" className="flex flex-col">
      <AboutMe aboutme={aboutme} traits={traits} skills={skills} />
    </div>
  );
}

function AboutMe({
  aboutme,
  traits,
  skills,
}: {
  aboutme: string;
  traits: ProfessionalTraits[];
  skills: Skill[];
}) {
  const hasAbout = aboutme.trim().length > 0;
  const hasTraits = traits.length > 0;

  const skillsByCategory = SKILL_CATEGORY_ORDER.map((category) => ({
    category,
    label: SKILL_CATEGORY_LABELS[category],
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);
  const hasSkills = skillsByCategory.length > 0;

  if (!hasAbout && !hasTraits && !hasSkills) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-28">
      <FadeIn direction="right" amount={0.5}>
        <SectionLabel index="02" label="About" />
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 items-start gap-10 gap-y-5 md:grid-cols-12">
        <FadeIn
          direction="up"
          className="col-span-1 md:col-span-full"
          amount={0.4}
        >
          <h2 className="text-3xl leading-[1.1] font-black tracking-tight uppercase sm:text-3xl md:text-4xl lg:text-5xl">
            Developer <span className={cn("ml-0", outlineText)}> Profile</span>
          </h2>
        </FadeIn>

        {hasAbout || hasSkills ? (
          <FadeIn
            direction="up"
            delay={0.15}
            className={cn(
              "col-span-1 flex flex-col gap-10",
              hasTraits ? "md:col-span-6" : "md:col-span-7",
            )}
            amount={0.4}
          >
            {hasAbout ? (
              <p className="text-foreground/80 max-w-2xl text-sm leading-relaxed whitespace-pre-line sm:text-base">
                {aboutme}
              </p>
            ) : null}

            {hasSkills ? (
              <div className="flex flex-col gap-4">
                <div className="text-foreground/60 flex flex-row items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase">
                  <span>Tools of the Trade</span>
                  <div className="border-foreground/30 flex-1 border-b" />
                </div>

                {/* <p className="text-foreground/80 max-w-2xl text-sm leading-relaxed sm:text-base">
                  These are the tools I reach for to build{" "}
                  <span className="text-foreground font-semibold">
                    scalable, reliable
                  </span>{" "}
                  products &mdash; organized by where they sit in the stack.
                </p> */}

                <div className="flex flex-col gap-3">
                  {skillsByCategory.map((group) => (
                    <div
                      key={group.category}
                      className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="text-foreground/60 shrink-0 font-mono text-[10px] tracking-[0.25em] uppercase sm:w-28">
                        {group.label}
                      </span>
                      <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((skill) => (
                          <li
                            key={skill.id}
                            className="border-foreground/30 hover:bg-foreground hover:text-background border px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors duration-200 sm:text-xs"
                          >
                            {skill.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </FadeIn>
        ) : null}

        {hasTraits ? (
          <FadeIn
            direction="left"
            delay={0.2}
            className={cn(
              "col-span-1",
              hasAbout || hasSkills ? "md:col-span-6" : "md:col-span-full",
            )}
            amount={0.3}
          >
            <div className="text-foreground/60 mb-4 flex flex-row items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase">
              <span>Core Strengths</span>
              <div className="border-foreground/30 flex-1 border-b" />
            </div>

            <StaggerUl
              staggerChildren={0.1}
              delayChildren={0.05}
              amount={0.05}
              className="flex flex-col"
            >
              {traits.map((trait, idx) => (
                <StaggerItemLi
                  key={trait.id}
                  direction="left"
                  className=" group hover:bg-foreground hover:text-background flex flex-col gap-2 border-b p-4 transition-colors duration-300 sm:p-5"
                >
                  <div className="text-foreground/60 group-hover:text-background/70 flex flex-row items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase">
                    <span>{pad(idx + 1)}</span>
                    <span>/ {pad(traits.length)}</span>
                  </div>

                  <div className="text-lg leading-tight font-black tracking-tight uppercase sm:text-xl md:text-2xl">
                    {trait.name}
                  </div>

                  {trait.description ? (
                    <p className="text-muted-foreground group-hover:text-background/70 text-xs leading-relaxed transition-colors duration-300 sm:text-sm">
                      {trait.description}
                    </p>
                  ) : null}
                </StaggerItemLi>
              ))}
            </StaggerUl>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}

export default PageSkills;
