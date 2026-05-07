import React from "react";
import { useFormContext, type FieldArrayWithId } from "react-hook-form";
import { type PortfolioFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  CornerDownRight,
  Dot,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { cleanDescription, cleanTools } from "./helper";

function StepThree({
  experiences,
  remove,
}: {
  experiences: FieldArrayWithId<PortfolioFormValues, "experience">[];
  remove: (index: number) => void;
}) {
  const form = useFormContext<PortfolioFormValues>();
  const [, setExperienceDialogOpen] = useQueryState(
    "experienceDialogOpen",
    parseAsInteger,
  );

  const handleAddExperience = () => {
    setExperienceDialogOpen(-1);
    form.clearErrors("experience");
  };

  const handleEditExperience = (index: number) => {
    setExperienceDialogOpen(index);
  };

  const isError = form.formState.errors.experience;

  return (
    <div className="space-y-3">
      {!experiences.length ? (
        <div
          className={cn(
            "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            isError && "border-red-500/50",
          )}
        >
          <BriefcaseBusiness
            className={cn(
              "text-muted-foreground size-12",
              isError && "text-red-500",
            )}
            strokeWidth={1}
          />
          <p className="text-muted-foreground text-sm">
            Add your experience to your portfolio
          </p>
          <Button type="button" variant="outline" onClick={handleAddExperience}>
            <Plus className="size-4" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {experiences.map((field, index) => {
            const description = cleanDescription(field.description)
              .split("\n")
              .filter((line) => line.length);
            const tools = cleanTools(field.tools)
              .split(",")
              .filter((tool) => tool.length);
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
                      onClick={() => handleEditExperience(index)}
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
                      {format(field.startDate, "MMM yyyy")} –{" "}
                      {field.isCurrent
                        ? "Present"
                        : format(field.endDate || new Date(), "MMM yyyy")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-x-0.5 gap-y-1">
                    {tools?.map((tool) => (
                      <Badge key={tool} variant="outline" className="h-6">
                        <div className="px-1 py-1 text-xs">{tool}</div>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col gap-x-0.5 gap-y-1">
                    {description?.map((line) => (
                      <div
                        key={line}
                        className="flex items-start gap-1 sm:gap-2"
                      >
                        <Dot
                          className="text-primary mt-[0.5px] size-3.5 flex-none md:mt-[3.5px]"
                          strokeWidth={6}
                        />
                        <p key={line} className="text-xs md:text-sm">
                          {line} ada das asdsadssadsa das asdas asd asd
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddExperience()}
            >
              <Plus className="size-4" />
              Add Experience
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default StepThree;
