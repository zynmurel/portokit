"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceSchema,
  type ExperienceSchema,
} from "@/app/(manage)/(private)/_components/form-components/schema";
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
import { GraduationCapIcon, UserPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import MonthYearPicker from "@/components/ui/date-month-picker";
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

const ExperienceFormDialog = ({
  open,
  portfolioId,
  onOpenChange,
  data,
}: {
  open: string | null;
  portfolioId: string;
  onOpenChange: (open: string | null) => void;
  data: ExperienceSchema;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();
  const experienceForm = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const isCurrent = experienceForm.watch("isCurrent");

  const { mutateAsync: upsertExperience, isPending } =
    api.portfolio.upsertExperience.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getExperiencesBySlug.invalidate(slug);
        toast.success(
          open === "create"
            ? "Experience added successfully"
            : "Experience updated successfully",
        );
        onOpenChange(null);
      },
      onError: () => {
        toast.error(
          open === "create"
            ? "Failed to add experience"
            : "Failed to update experience",
        );
      },
    });

  const onSubmit = async (data: ExperienceSchema) => {
    if (typeof open !== "string") return;
    const isCreate = open === "create";
    try {
      await upsertExperience({
        id: isCreate ? "" : open,
        portfolioId,
        data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      experienceForm.reset({
        company: data.company,
        position: data.position,
        description: data.description,
        tools: data.tools,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent: data.isCurrent,
      });
    }
  }, [data, open, experienceForm]);

  return (
    <Dialog
      open={open !== null}
      onOpenChange={(open) => onOpenChange(open ? null : "create")}
    >
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {open === "create" ? (
              <GraduationCapIcon className="size-6" strokeWidth={2} />
            ) : (
              <UserPen className="size-6" strokeWidth={2} />
            )}
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              {open === "create" ? "Add Experience" : "Update Experience"}
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
                onClick={() => onOpenChange(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="min-w-full sm:min-w-[150px]"
                onClick={experienceForm.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {open === "create" ? "Add Experience" : "Update Experience"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceFormDialog;
