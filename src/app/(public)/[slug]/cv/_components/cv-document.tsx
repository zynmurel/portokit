import { format } from "date-fns";
import React from "react";
import { SkillCategory } from "generated/prisma";
import type { PortfolioWithRelations } from "../../../portfolio-designs/const";

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

type CvProject = PortfolioWithRelations["projects"][number];

const PRIMARY = "text-[#2553f7]";

function fmtMonthYear(date?: Date | null) {
  if (!date) return "";
  return format(new Date(date), "MMM yyyy");
}

function fmtRange(
  start: Date | null | undefined,
  end: Date | null | undefined,
  isCurrent = false,
) {
  const s = start ? fmtMonthYear(start) : "";
  const e = isCurrent || !end ? "Present" : fmtMonthYear(end);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

function joinList(values: string[]) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return values.join(" and ");
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function CvDocument({
  profile,
  projects,
}: {
  profile: PortfolioWithRelations;
  projects: CvProject[];
}) {
  const experiences = (profile.experiences ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

  const traits = (profile.professionalTraits ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  const skills = (profile.skills ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);

  const education = (profile.education ?? []).slice().sort((a, b) => {
    const aTime = a.endDate
      ? new Date(a.endDate).getTime()
      : a.startDate
        ? new Date(a.startDate).getTime()
        : 0;
    const bTime = b.endDate
      ? new Date(b.endDate).getTime()
      : b.startDate
        ? new Date(b.startDate).getTime()
        : 0;
    return bTime - aTime;
  });

  const orderedProjects = projects.slice().sort((a, b) => a.order - b.order);

  const skillsByCategory = SKILL_CATEGORY_ORDER.map((category) => ({
    category,
    label: SKILL_CATEGORY_LABELS[category],
    items: skills.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  const contacts: { label: string; value: string; href: string }[] = [];
  if (profile.email)
    contacts.push({
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    });
  if (profile.phoneNumber)
    contacts.push({
      label: "Phone",
      value: profile.phoneNumber,
      href: `tel:${profile.phoneNumber.replace(/\s/g, "")}`,
    });

  return (
    <article
      id="cv-document"
      className="cv-page font-sans text-xs leading-normal text-[#27272a] antialiased"
      style={{
        width: "794px",
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
        padding: "44px 52px 56px",
      }}
    >
      {/* Header — Name, Position, Location */}
      <header className="mb-6 flex flex-row items-start justify-between gap-6">
        <div className="flex flex-col">
          <h1
            className={`${PRIMARY} text-[34px] leading-[1.05] font-bold tracking-tight pb-1.5`}
          >
            {profile.name}
          </h1>
          <div className=" text-[12px] font-semibold tracking-wide text-[#3f3f46] uppercase">
            {profile.role}
          </div>

          <p className="mt-2 text-xs leading-[1.6] text-[#3f3f46]">
            {profile.description}
          </p>
        </div>

        {/* {profile.location ? (
          <div className="text-right text-[10px] text-[#71717a]">
            <div className="font-semibold tracking-wider text-[#52525b] uppercase">
              Based in
            </div>
            <div className="mt-0.5 text-xs text-[#3f3f46]">
              {profile.location}
            </div>
          </div>
        ) : null} */}
      </header>

      <div className="flex flex-col gap-5">
        {/* About Me + Core Strengths + Tools */}
        {profile.aboutme || traits.length > 0 || skillsByCategory.length > 0 ? (
          <Section title="About Me">
            {profile.aboutme ? (
              <p className="text-xs leading-[1.6] whitespace-pre-line text-[#3f3f46]">
                {profile.aboutme}
              </p>
            ) : null}

            {traits.length > 0 ? (
              <div className="mt-5">
                <SubSectionLabel>Core Strengths</SubSectionLabel>
                <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {traits.map((trait) => (
                    <div key={trait.id} className="flex flex-col">
                      <p className="text-xs font-bold text-[#18181b]">
                        {trait.name}
                      </p>
                      {trait.description ? (
                        <p className="text-[10.5px] leading-[1.55] text-[#3f3f46]">
                          {trait.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {skillsByCategory.length > 0 ? (
              <div className="mt-5">
                <SubSectionLabel>Tools &amp; Technologies</SubSectionLabel>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {skillsByCategory.map((group) => (
                    <li
                      key={group.category}
                      className="flex flex-row items-baseline gap-2"
                    >
                      <span className="w-[110px] shrink-0 text-[10px] font-bold tracking-wider text-[#52525b] uppercase">
                        {group.label}
                      </span>
                      <span className="text-[10.5px] leading-[1.55] text-[#3f3f46]">
                        {group.items.map((s) => s.name).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* Experience */}
        {experiences.length > 0 ? (
          <Section title="Professional Experience">
            <div className="flex flex-col gap-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex break-inside-avoid flex-col">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12px] font-bold text-[#18181b]">
                        {exp.position}
                      </span>
                      <span className="text-xs text-[#71717a]">·</span>
                      <span className="text-[12px] font-semibold text-[#27272a]">
                        {exp.company}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-[#71717a]">
                      {fmtRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>

                  {exp.tools.length > 0 ? (
                    <div className="mt-0.5 text-[9.5px] text-[#71717a]">
                      {joinList(exp.tools)}
                    </div>
                  ) : null}

                  {exp.description.length > 0 ? (
                    <ul className="mt-1 flex list-disc flex-col gap-0.5 pl-4">
                      {exp.description.map((line, i) => (
                        <li
                          key={i}
                          className="text-[10.5px] leading-[1.55] text-[#3f3f46]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Featured Projects */}
        {orderedProjects.length > 0 ? (
          <Section title="Featured Projects">
            <div className="flex flex-col gap-2.5">
              {orderedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex break-inside-avoid flex-col"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-[12px] font-bold text-[#18181b]">
                      {project.title}
                    </span>
                    {project.developedAt ? (
                      <span className="text-[10px] font-medium tracking-wide text-[#71717a]">
                        {fmtMonthYear(project.developedAt)}
                      </span>
                    ) : null}
                  </div>

                  {project.tools.length > 0 ? (
                    <div className="mt-0.5 text-[9.5px] text-[#71717a]">
                      {joinList(project.tools)}
                    </div>
                  ) : null}

                  {project.description ? (
                    <p className="mt-1 text-[10.5px] leading-[1.55] text-[#3f3f46]">
                      {project.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Education */}
        {education.length > 0 ? (
          <Section title="Education">
            <div className="flex flex-col gap-2">
              {education.map((edu) => {
                const range = fmtRange(edu.startDate, edu.endDate);
                return (
                  <div
                    key={edu.id}
                    className="flex break-inside-avoid flex-col"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-[12px] font-bold text-[#18181b]">
                        {edu.school}
                      </span>
                      {range ? (
                        <span className="text-[10px] font-medium tracking-wide text-[#71717a]">
                          {range}
                        </span>
                      ) : null}
                    </div>
                    {edu.degree || edu.field ? (
                      <div className="mt-0.5 text-[10.5px] leading-[1.55] text-[#3f3f46]">
                        {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Section>
        ) : null}

        {/* Contacts + Portfolio link */}
        {contacts.length > 0 || profile.slug ? (
          <Section title="Contacts">
            <div className="flex flex-col gap-1">
              {contacts.map((c) => (
                <div
                  key={c.href}
                  className="flex flex-row items-baseline gap-2"
                >
                  <span className="w-[70px] shrink-0 text-[10px] font-bold tracking-wider text-[#52525b] uppercase">
                    {c.label}
                  </span>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-[#18181b] underline-offset-2 hover:underline"
                  >
                    {c.value}
                  </a>
                </div>
              ))}
              {profile.slug ? (
                <div className="flex flex-row items-baseline gap-2">
                  <span className="w-[70px] shrink-0 text-[10px] font-bold tracking-wider text-[#52525b] uppercase">
                    Portfolio
                  </span>
                  <a
                    href={`https://portokit.vercel.app/${profile.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${PRIMARY} text-xs font-medium underline-offset-2 hover:underline`}
                  >
                    {`portokit.vercel.app/${profile.slug}`}
                  </a>
                </div>
              ) : null}
            </div>
          </Section>
        ) : null}
      </div>

    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex break-inside-avoid flex-col">
      <div className="mb-2 flex flex-row items-center gap-2">
        <h2
          className={`${PRIMARY} text-[13px] font-bold tracking-[0.08em] uppercase`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function SubSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-[0.15em] text-[#52525b] uppercase">
      {children}
    </div>
  );
}

export default CvDocument;
