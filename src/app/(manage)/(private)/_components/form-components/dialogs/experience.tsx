"use client";

import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "../schema";
import type { ExperienceSchema } from "../schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BriefcaseBusiness } from "lucide-react";
import { Input } from "@/components/ui/input";
import MonthYearPicker from "@/components/ui/date-month-picker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cleanDescription, cleanTools } from "../helper";
import { Checkbox } from "@/components/ui/checkbox";

const defaultValues: ExperienceSchema = {
  company: "",
  position: "",
  description: "",
  tools: "",
  startDate: new Date(),
  endDate: undefined,
  isCurrent: false,
};

const ExperienceDialog = ({
  append,
  update,
  experiences,
}: {
  append: (data: ExperienceSchema) => void;
  update: (index: number, data: ExperienceSchema) => void;
  experiences: ExperienceSchema[];
}) => {
  const [open, setOpen] = useQueryState("experienceDialogOpen", parseAsInteger);
  const isOpen = typeof open === "number";

  const onClearValues = () => {
    experienceForm.reset({
      ...defaultValues,
    });
  };

  const onOpenChange = async (open: boolean) => {
    if (!open) {
      await setOpen(null);
      console.log("resetting");
      onClearValues();
    }
  };

  const experienceForm = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const isCurrent = experienceForm.watch("isCurrent");

  const onSubmit = async (data: ExperienceSchema) => {
    if (!data.isCurrent) {
      if (!data.endDate) {
        experienceForm.setError("endDate", {
          message: "End date is required",
        });
        return;
      }
      if (data.startDate > data.endDate) {
        experienceForm.setError("startDate", {
          message: "Start date must be before end date",
        });
        return;
      }
    }
    const cleanedData = {
      ...data,
      description: cleanDescription(data.description),
      tools: cleanTools(data.tools),
    };
    if (open === -1) {
      append(cleanedData);
    } else if (typeof open === "number" && open >= 0) {
      update(open, cleanedData);
    }
    await setOpen(null);
    onClearValues();
  };

  useEffect(() => {
    if (open === -1) {
      experienceForm.reset();
    } else if (typeof open === "number" && open >= 0) {
      const experience = experiences[open];
      experienceForm.reset({
        ...experience,
        description: cleanDescription(experience?.description),
        tools: cleanTools(experience?.tools),
      });
    }
  }, [open, experienceForm, experiences]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Add Experience
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...experienceForm}>
          <form onSubmit={experienceForm.handleSubmit(onSubmit)}>
            <div className="max-h-[65vh]overflow-y-auto grid grid-cols-1 gap-3 gap-y-5 sm:max-h-[80vh] md:grid-cols-2">
              <FormField
                control={experienceForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={experienceForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormField
                  control={experienceForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <MonthYearPicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={experienceForm.control}
                  name="isCurrent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                            if (e) {
                              experienceForm.setValue("endDate", undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel>Currently working here</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={experienceForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <MonthYearPicker
                        date={isCurrent ? undefined : field.value}
                        setDate={field.onChange}
                        disabled={isCurrent}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={experienceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Description{" "}
                      <span className="text-muted-foreground text-xs">
                        Separate with a new line
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={experienceForm.control}
                name="tools"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Tools{" "}
                      <span className="text-muted-foreground text-xs">
                        Separate each tool with a comma &quot;,&quot;
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5 flex flex-col justify-end gap-2 sm:flex-row md:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="min-w-full sm:min-w-[100px]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="min-w-full sm:min-w-[150px]"
                onClick={experienceForm.handleSubmit(onSubmit)}
              >
                {open === -1 ? "Add Experience" : "Update Experience"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDialog;
