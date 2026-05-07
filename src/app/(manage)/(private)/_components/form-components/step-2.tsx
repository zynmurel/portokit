import React from "react";
import { useFormContext, type FieldArrayWithId } from "react-hook-form";
import { type PortfolioFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { GraduationCapIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "nuqs";

function StepTwo({
  educations,
  remove,
}: {
  educations: FieldArrayWithId<PortfolioFormValues, "education">[];
  remove: (index: number) => void;
}) {
  const form = useFormContext<PortfolioFormValues>();
  const [, setEducationDialogOpen] = useQueryState(
    "educationDialogOpen",
    parseAsInteger,
  );

  const handleAddEducation = async () => {
    await setEducationDialogOpen(-1);
    form.clearErrors("education");
  };

  const handleEditEducation = async (index: number) => {
    await setEducationDialogOpen(index);
  };
  
  const isError = form.formState.errors.education;

  return (
    <div className="space-y-3">
      {!educations.length ? (
        <div
          className={cn(
            "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            isError && "border-red-500/50",
          )}
        >
          <GraduationCapIcon
            className={cn(
              "text-muted-foreground size-12",
              isError && "text-red-500",
            )}
            strokeWidth={1}
          />
          <p className="text-muted-foreground text-sm">
            Add your education to your portfolio
          </p>
          <Button type="button" variant="outline" onClick={handleAddEducation}>
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
                    onClick={() => handleEditEducation(index)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-8 cursor-pointer"
                    onClick={() => remove(index)}
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
                    {format(field.startDate, "MMM yyyy")} –{" "}
                    {format(field.endDate, "MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddEducation()}
            >
              <Plus className="size-4" />
              Add Education
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default StepTwo;
