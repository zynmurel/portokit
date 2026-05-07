"use client";

import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "../schema";
import type { EducationSchema } from "../schema";
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
import { GraduationCapIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import MonthYearPicker from "@/components/ui/date-month-picker";
import { Button } from "@/components/ui/button";

const defaultValues: EducationSchema = {
  school: "",
  degree: "",
  field: "",
  startDate: new Date(),
  endDate: new Date(),
};

const EducationDialog = ({
  append,
  update,
  educations,
}: {
  append: (data: EducationSchema) => void;
  update: (index: number, data: EducationSchema) => void;
  educations: EducationSchema[];
}) => {
  const [open, setOpen] = useQueryState("educationDialogOpen", parseAsInteger);
  const isOpen = typeof open === "number";

  const onClearValues = () => {
    educationForm.reset({
      ...defaultValues,
    });
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(null);
      console.log("resetting");
      onClearValues();
    }
  };

  const educationForm = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = (data: EducationSchema) => {
    if (data.startDate > data.endDate) {
      educationForm.setError("startDate", {
        message: "Start date must be before end date",
      });
      return;
    }
    if (open === -1) {
      append(data);
    } else if (typeof open === "number" && open >= 0) {
      update(open, data);
    }
    setOpen(null);
    onClearValues();
  };

  useEffect(() => {
    if (open === -1) {
      educationForm.reset();
    } else if (typeof open === "number" && open >= 0) {
      const education = educations[open];
      educationForm.reset(education);
    }
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Add Education
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...educationForm}>
          <form onSubmit={educationForm.handleSubmit(onSubmit)}>
            <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto sm:max-h-[80vh] md:grid-cols-2">
              <FormField
                control={educationForm.control}
                name="school"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input placeholder="University Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="BS Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="field"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Field of Study (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid w-full grid-cols-2 gap-3 sm:col-span-2">
                <FormField
                  control={educationForm.control}
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
                  control={educationForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
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
              </div>
              <div className="mt-3 flex flex-col justify-end gap-2 sm:flex-row md:col-span-2">
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
                  onClick={educationForm.handleSubmit(onSubmit)}
                >
                  {open === -1 ? "Add Education" : "Update Education"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EducationDialog;
