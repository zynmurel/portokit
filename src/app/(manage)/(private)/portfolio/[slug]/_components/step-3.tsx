import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Experience } from "generated/prisma";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  Dot,
  GraduationCapIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepTwoLoader } from "./loaders";
import { format } from "date-fns";
// import ExperienceFormDialog from "./dialog-forms/experience";
// import ExperienceDeleteDialog from "./dialog-forms/experience-delete";
import { Badge } from "@/components/ui/badge";
import ExperienceFormDialog from "./dialog-forms/experience";
import type { ExperienceSchema } from "../../../_components/form-components/schema";
import ExperienceDeleteDialog from "./dialog-forms/experience-delete";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

function StepThree({ portfolioId }: { portfolioId: string }) {
  const { slug } = useParams<{ slug: string }>();
  const [open, setOpen] = useState<string | null>(null);

  const { data: experiences, isLoading } =
    api.portfolio.getExperiencesBySlug.useQuery(slug ?? "");

  const getActiveExperience = (id: string) => {
    const active = experiences?.find((field) => field.id === id);
    return {
      company: active?.company ?? "",
      position: active?.position ?? "",
      location: active?.location ?? "",
      startDate: active?.startDate ?? new Date(),
      endDate: active?.endDate ?? new Date(),
      isCurrent: active?.isCurrent ?? false,
      tools: active?.tools?.join(",") ?? "",
      description: active?.description?.join("\n") ?? "",
    } as ExperienceSchema;
  };
  return (
    <Card>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Experience</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add or edit your experience details
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen("create")}>
            <Plus className="size-4" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ExperienceFormDialog
          open={open}
          onOpenChange={setOpen}
          portfolioId={portfolioId}
          data={getActiveExperience(open || "")}
        />
        {isLoading ? (
          <StepTwoLoader />
        ) : (
          experiences && (
            <DetailsContent
              portfolioId={portfolioId}
              experiences={experiences}
              setOpen={setOpen}
              getActiveExperience={getActiveExperience}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}

const DetailsContent = ({
  portfolioId,
  experiences,
  setOpen,
  getActiveExperience,
}: {
  portfolioId: string;
  experiences: Experience[];
  setOpen: (open: string | null) => void;
  getActiveExperience: (id: string) => ExperienceSchema;
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

  const handleAddExperience = () => {
    setOpen("create");
  };

  const handleEditExperience = (id: string) => {
    setOpen(id);
  };

  const handleRemoveExperience = (id: string) => {
    setOpenDeleteDialog(id);
  };

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="space-y-3">
        {!experiences?.length ? (
          <div
            className={cn(
              "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            )}
          >
            <GraduationCapIcon
              className="text-muted-foreground size-12"
              strokeWidth={1}
            />
            <p className="text-muted-foreground text-sm">
              Add your experience to your portfolio
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddExperience}
            >
              <Plus className="size-4" />
              Add Experience
            </Button>
          </div>
        ) : (
          <>
            {experiences.map((field, index) => {
              return (
                <div key={field.id} className="rounded-md border">
                  <div className="flex items-center justify-between px-3 py-1">
                    <p className="font-bold">{`Experience ${index + 1}`}</p>
                    <div className="flex flex-row items-center gap-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer"
                        onClick={() => handleEditExperience(field.id)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive size-8 cursor-pointer"
                        onClick={() => handleRemoveExperience(field.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-background flex w-full flex-col items-start gap-2 rounded-b-lg border-t p-4">
                    <div className="flex w-full flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
                          <BriefcaseBusiness className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium md:text-base">
                            {field.company}
                          </p>
                          <p className="text-muted-foreground text-xs md:text-sm">
                            {field.position}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-[10px] md:text-xs">
                        {field.startDate
                          ? format(field.startDate, "MMM yyyy")
                          : "Present"}{" "}
                        –{" "}
                        {field.isCurrent
                          ? "Present"
                          : format(field.endDate || new Date(), "MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-start justify-start gap-x-0.5 gap-y-1">
                      {field.tools?.map((tool) => (
                        <Badge key={tool} variant="outline" className="h-6">
                          <div className="px-1 py-1 text-xs">{tool}</div>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col gap-x-0.5 gap-y-1">
                      {field.description?.map((line) => (
                        <div
                          key={line}
                          className="flex items-start gap-1 sm:gap-2"
                        >
                          <Dot
                            className="text-primary mt-[0.5px] size-3.5 flex-none md:mt-[3.5px]"
                            strokeWidth={6}
                          />
                          <p key={line} className="text-xs md:text-sm">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <ExperienceDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          data={getActiveExperience(openDeleteDialog || "")}
          portfolioId={portfolioId}
        />
      </div>
    </div>
  );
};

export default StepThree;
