import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Education, Prisma } from "generated/prisma";
import { Button } from "@/components/ui/button";
import { GraduationCapIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepTwoLoader } from "./loaders";
import { format } from "date-fns";
import EducationFormDialog from "./dialog-forms/education";
import EducationDeleteDialog from "./dialog-forms/education-delete";
import type { EducationSchema } from "../../../_components/form-components/schema";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

function StepTwo({ portfolioId }: { portfolioId: string }) {
  const { slug } = useParams<{ slug: string }>();
  const [open, setOpen] = useState<string | null>(null);

  const { data: educations, isLoading } =
    api.portfolio.getEducationBySlug.useQuery(slug ?? "");

  const getActiveEducation = (id: string) => {
    const active = educations?.find((field) => field.id === id);
    return {
      school: active?.school ?? "",
      degree: active?.degree ?? "",
      field: active?.field ?? "",
      startDate: active?.startDate ?? new Date(),
      endDate: active?.endDate ?? new Date(),
    } as EducationSchema;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Education</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add or edit your education details
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen("create")}>
            <Plus className="size-4" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <EducationFormDialog
          open={open}
          onOpenChange={setOpen}
          portfolioId={portfolioId}
          data={getActiveEducation(open || "")}
        />
        {isLoading ? (
          <StepTwoLoader />
        ) : (
          educations && (
            <DetailsContent
              portfolioId={portfolioId}
              educations={educations}
              setOpen={setOpen}
              getActiveEducation={getActiveEducation}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}

const DetailsContent = ({
  portfolioId,
  educations,
  setOpen,
  getActiveEducation,
}: {
  portfolioId: string;
  educations: Education[];
  setOpen: (open: string | null) => void;
  getActiveEducation: (id: string) => EducationSchema;
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

  const handleAddEducation = () => {
    setOpen("create");
  };

  const handleEditEducation = (id: string) => {
    setOpen(id);
  };

  const handleRemoveEducation = (id: string) => {
    setOpenDeleteDialog(id);
  };

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="space-y-3">
        {!educations?.length ? (
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
              Add your education to your portfolio
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddEducation}
            >
              <Plus className="size-4" />
              Add Education
            </Button>
          </div>
        ) : (
          <>
            {educations.map((field, index) => (
              <div key={field.id} className="rounded-md border">
                <div className="flex items-center justify-between px-3 py-1">
                  <p className="font-bold">{`Education ${index + 1}`}</p>
                  <div className="flex flex-row items-center gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => handleEditEducation(field.id)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive size-8 cursor-pointer"
                      onClick={() => handleRemoveEducation(field.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-background flex items-center gap-4 rounded-b-lg border-t p-4">
                  {/* Icon */}
                  <div className="bg-primary text-primary-foreground hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
                    <GraduationCapIcon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                    <div>
                      <p className="text-foreground text-sm font-medium md:text-base">
                        {field.school}
                      </p>
                      <p className="text-muted-foreground text-xs md:text-sm">
                        {field.degree} · {field.field}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-[10px] md:text-xs">
                      {format(field.startDate ?? new Date(), "MMM yyyy")} –{" "}
                      {format(field.endDate ?? new Date(), "MMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <EducationDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        data={getActiveEducation(openDeleteDialog || "")}
        portfolioId={portfolioId}
      />
    </div>
  );
};

export default StepTwo;
