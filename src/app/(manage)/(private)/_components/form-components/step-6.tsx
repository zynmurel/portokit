import React from "react";
import type { PortfolioFormValues } from "./schema";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Briefcase, GraduationCap, LayoutGrid } from "lucide-react";
import { cleanTools } from "./helper";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function StepSix({ reviewValues }: { reviewValues: PortfolioFormValues }) {
  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Page header */}
      <div className="border-b pb-3">
        <p className="text-sm font-medium">Review before submitting</p>
        <p className="text-muted-foreground text-xs">
          Check the information below and confirm everything is correct.
        </p>
      </div>

      {/* Portfolio Details */}
      <ReviewSection title="Portfolio details">
        <div className="grid grid-cols-2 gap-2">
          <ReviewField label="Name" value={reviewValues.details.name} />
          <ReviewField label="Title" value={reviewValues.details.title} />
          <ReviewField label="Slug" value={reviewValues.details.slug} />
          <ReviewField label="Role" value={reviewValues.details.role} />
          <ReviewField label="Location" value={reviewValues.details.location} />
          <ReviewField
            label="Profile image"
            value={reviewValues.details.image ? "Selected" : undefined}
          />
        </div>

        <Separator />

        <ReviewField label="Summary">
          <p className="text-foreground text-sm leading-relaxed">
            {reviewValues.details.description || <EmptyValue />}
          </p>
        </ReviewField>

        <Separator />

        <div>
          <p className="text-muted-foreground mb-2 text-[11px]">Social links</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              reviewValues.details.github,
              reviewValues.details.gitlab,
              reviewValues.details.linkedin,
              reviewValues.details.facebook,
              reviewValues.details.instagram,
            ]
              .filter(Boolean)
              .map((link) => (
                <span
                  key={link}
                  className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                >
                  {link}
                </span>
              ))}
            {![
              reviewValues.details.github,
              reviewValues.details.gitlab,
              reviewValues.details.linkedin,
              reviewValues.details.facebook,
              reviewValues.details.instagram,
            ].some(Boolean) && (
              <p className="text-muted-foreground text-xs">
                No social links added.
              </p>
            )}
          </div>
        </div>
      </ReviewSection>

      {/* Education */}
      <ReviewSection title="Education" count={reviewValues.education.length}>
        {reviewValues.education.map((item, index) => (
          <ReviewCard
            key={`${item.school}-${index}`}
            icon={<GraduationCap className="h-4 w-4" />}
            iconClass="bg-primary text-primary-foreground"
            title={item.school}
            subtitle={`${item.degree}${item.field ? ` · ${item.field}` : ""}`}
            date={`${format(item.startDate, "MMM yyyy")} – ${format(item.endDate, "MMM yyyy")}`}
          />
        ))}
      </ReviewSection>

      {/* Experience */}
      <ReviewSection title="Experience" count={reviewValues.experience.length}>
        {reviewValues.experience.map((item, index) => (
          <ReviewCard
            key={`${item.company}-${index}`}
            icon={<Briefcase className="h-4 w-4" />}
            iconClass="bg-primary text-primary-foreground"
            title={`${item.position} · ${item.company}`}
            date={`${format(item.startDate ?? new Date(), "MMM yyyy")} – ${item.isCurrent ? "Present" : format(item.endDate ?? new Date(), "MMM yyyy")}`}
          >
            {item.description && (
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                {item.description}
              </p>
            )}
            <TagList tools={cleanTools(item.tools).split(",")} />
          </ReviewCard>
        ))}
      </ReviewSection>

      {/* Skills + Traits side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReviewSection title="Skills" count={reviewValues.skills.length}>
          <div className="flex flex-wrap gap-1.5">
            {reviewValues.skills.map((skill, index) => (
              <Tag key={`${skill.name}-${index}`}>{skill.name}</Tag>
            ))}
          </div>
        </ReviewSection>

        <ReviewSection
          title="Professional traits"
          count={reviewValues.professionalTraits.length}
        >
          <div className="flex flex-col gap-1.5">
            {reviewValues.professionalTraits.map((trait, index) => (
              <div
                key={`${trait.name}-${index}`}
                className="bg-muted/60 rounded-md px-3 py-2"
              >
                <p className="text-xs font-medium">{trait.name}</p>
                <p className="text-muted-foreground text-[11px] leading-snug">
                  {trait.description}
                </p>
              </div>
            ))}
          </div>
        </ReviewSection>
      </div>

      {/* Projects */}
      <ReviewSection title="Projects" count={reviewValues.projects.length}>
        {reviewValues.projects.map((project, index) => (
          <ReviewCard
            key={`${project.title}-${index}`}
            icon={<LayoutGrid className="h-4 w-4" />}
            iconClass="bg-primary text-primary-foreground"
            title={project.title}
            date={project.developedAt ? format(project.developedAt, "MMM dd, yyyy") : undefined}
          >
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {project.description}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.url && <LinkBadge>{project.url}</LinkBadge>}
              {project.github && <LinkBadge>{project.github}</LinkBadge>}
            </div>
            <TagList tools={cleanTools(project.tools).split(",")} />
          </ReviewCard>
        ))}
      </ReviewSection>
    </div>
  );
}

export default StepSix;

function ReviewSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/40 flex items-center justify-between px-4 py-2.5 h-10">
        <p className="text-xs font-medium">{title}</p>
        {count !== undefined && (
          <span className="bg-background text-muted-foreground rounded-full border px-2 py-0.5 text-[11px]">
            {count}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">{children}</div>
    </div>
  );
}

function ReviewField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-muted/50 rounded-md px-3 py-2">
      <p className="text-muted-foreground mb-0.5 text-[11px]">{label}</p>
      {children ?? (
        <p
          className={cn(
            "text-sm font-medium",
            !value && "text-muted-foreground font-normal",
          )}
        >
          {value || "—"}
        </p>
      )}
    </div>
  );
}

function ReviewCard({
  icon,
  iconClass,
  title,
  subtitle,
  date,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  subtitle?: string;
  date?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-md border p-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          iconClass,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3">
          <p className="text-sm font-medium">{title}</p>
          {date && (
            <span className="text-muted-foreground text-[11px]">{date}</span>
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}

function TagList({ tools }: { tools: string[] }) {
  if (!tools.length) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tools.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline">
      {children}
    </Badge>
  );
}

function LinkBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className=" text-blue-500 border-blue-500/50">
      {children}
    </Badge>
  );
}
function EmptyValue() {
  return <span className="text-muted-foreground">—</span>;
}
