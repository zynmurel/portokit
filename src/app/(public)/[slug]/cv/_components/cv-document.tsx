import { format } from "date-fns";
import React from "react";
import { SkillCategory } from "generated/prisma";
import type { PortfolioWithRelations } from "../../../portfolio-designs/const";

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.FRONTEND]: "Frontend",
  [SkillCategory.BACKEND]: "Backend",
  [SkillCategory.DATABASE]: "Database",
  [SkillCategory.FULLSTACK]: "Fullstack",
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
const PRIMARY_BORDER = "border-[#2553f7]";

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
  return `${s} - ${e}`;
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

  const contacts: { label: string; href: string }[] = [];
  if (profile.phoneNumber)
    contacts.push({
      label: profile.phoneNumber,
      href: `tel:${profile.phoneNumber.replace(/\s/g, "")}`,
    });
  if (profile.email)
    contacts.push({
      label: profile.email,
      href: `mailto:${profile.email}`,
    });

  return (
    <article
      id="cv-document"
      className="cv-page font-sans text-[11px] leading-[1.45] text-zinc-800 antialiased"
      style={{
        // 1mm = ~3.78px; A4 = 210mm x 297mm — we use a fixed pixel width that
        // looks right both on screen and when printed.
        width: "794px",
        minHeight: "1123px",
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
        padding: "44px 52px 56px",
      }}
    >
      <header className="mb-2">
        <h1
          className={`${PRIMARY} text-[34px] leading-[1.05] font-bold tracking-tight`}
        >
          {profile.name}
        </h1>
        <div className="mt-2 text-xs font-bold text-zinc-500">
          {profile.role}
        </div>
        {profile.description ? (
          <p className="mt-1 max-w-[560px] text-[11px] leading-[1.55] text-zinc-600">
            {profile.description}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-12 gap-x-8">
        <div className="col-span-8 flex flex-col gap-3">
          {experiences.length > 0 ? (
            <Section title="Professional Experience">
              <div className="flex flex-col gap-2">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12px] font-medium text-zinc-900">
                        {exp.position},
                      </span>
                      <span className="text-[12px] font-bold text-zinc-900">
                        {exp.company}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {fmtRange(exp.startDate, exp.endDate, exp.isCurrent)}
                      </span>
                    </div>
                    {exp.tools.length > 0 ? (
                      <div className="mt-0.5 text-[9px] text-zinc-500">
                        {joinList(exp.tools)}
                      </div>
                    ) : null}
                    {exp.description.length > 0 ? (
                      <ul className="mt-1 flex list-disc flex-col gap-0 pl-3.5">
                        {exp.description.map((line, i) => (
                          <li
                            key={i}
                            className="relative text-[10.5px] leading-[1.55] text-zinc-700"
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

          {orderedProjects.length > 0 ? (
            <Section title="Selected Projects">
              <div className="flex flex-col gap-2">
                {orderedProjects.map((project) => (
                  <div key={project.id} className="flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12px] font-bold text-zinc-900">
                        {project.title}
                      </span>
                      {project.tools.length > 0 ? (
                        <span className="text-[9px] text-zinc-500">
                          {joinList(project.tools)}
                        </span>
                      ) : null}
                    </div>
                    {project.description ? (
                      <p className="mt-0.5 text-[10.5px] leading-[1.55] text-zinc-700">
                        {project.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
          {education.length > 0 ? (
            <Section title="Education">
              <div className="flex flex-col gap-3">
                {education.map((edu) => {
                  const range = fmtRange(edu.startDate, edu.endDate);
                  return (
                    <div key={edu.id} className="flex flex-col">
                      <div className="text-[11px] font-bold text-zinc-900">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          {edu.school}{" "}
                          <span className="font-normal">
                            {range ? (
                              <div className="mt-0.5 text-[10px] text-zinc-500">
                                {range}
                              </div>
                            ) : null}
                          </span>
                        </p>
                      </div>
                      {edu.degree || edu.field ? (
                        <div className="mt-0.5 text-[10.5px] leading-[1.55] text-zinc-700">
                          {[edu.degree, edu.field].filter(Boolean).join(" - ")}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}
        </div>

        <aside className="col-span-4 flex flex-col gap-5">
          {skills.length > 0 ? (
            <Section title="Expertise">
              <div className="flex flex-col gap-2">
                {SKILL_CATEGORY_ORDER.map((category) => {
                  const items = skills.filter((s) => s.category === category);
                  if (items.length === 0) return null;
                  return (
                    <SidebarBlock
                      key={category}
                      label={SKILL_CATEGORY_LABELS[category]}
                    >
                      <p className="text-[10.5px] leading-[1.55] text-zinc-700">
                        {joinList(items.map((s) => s.name))}
                      </p>
                    </SidebarBlock>
                  );
                })}
              </div>
            </Section>
          ) : null}
          {traits.length > 0 ? (
            <Section title="Core Strengths">
              <div className="flex flex-col gap-2">
                {traits.map((trait) => (
                  <div
                    key={trait.id}
                    className="relative text-[10.5px] leading-[1.55] text-zinc-700 before:absolute before:top-[6px]"
                  >
                    <p className="font-bold text-zinc-900">{trait.name}</p>
                    {trait.description ? (
                      <p className="text-zinc-700">{trait.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {profile.location ? (
            <Section title="Address">
              <p className="text-[10.5px] leading-[1.55] text-zinc-700">
                {profile.location}
              </p>
            </Section>
          ) : null}

          {contacts.length > 0 ? (
            <Section title="Contacts">
              <ul className="flex flex-col gap-1">
                {contacts.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-medium text-zinc-900 underline-offset-2 hover:underline"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section title="Portfolio">
            <ul className="flex flex-col gap-1">
              <a
                href={`/portfolio/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-zinc-900 underline-offset-2 hover:underline"
              >
                {`https://portokit.vercel.app/${profile.slug}`}
              </a>
            </ul>
          </Section>
        </aside>
      </div>

      <CvPrintStyles primaryBorderClass={PRIMARY_BORDER} />
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
    <section className="break-inside-avoid">
      <h2 className={`${PRIMARY} mb-1 text-[15px] font-bold tracking-tight`}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SidebarBlock({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0">
      {label ? (
        <div className="text-[10.5px] font-bold text-zinc-900">{label}</div>
      ) : null}
      {children}
    </div>
  );
}

function CvPrintStyles({
  primaryBorderClass: _primaryBorderClass,
}: {
  primaryBorderClass: string;
}) {
  return (
    <style>{`
      @media print {
        @page { size: A4; margin: 0; }
        html, body { background: #ffffff !important; }
        .cv-page {
          box-shadow: none !important;
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 14mm 16mm 18mm !important;
        }
      }
    `}</style>
  );
}

export default CvDocument;
