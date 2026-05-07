"use client";

import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { professionalTraitSchema } from "../schema";
import type { ProfessionalTraitSchema } from "../schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: ProfessionalTraitSchema = {
  name: "",
  description: "",
};

const ProfessionalTraitDialog = ({
  append,
  update,
  professionalTraits,
}: {
  append: (data: ProfessionalTraitSchema) => void;
  update: (index: number, data: ProfessionalTraitSchema) => void;
  professionalTraits: ProfessionalTraitSchema[];
}) => {
  const [open, setOpen] = useQueryState(
    "professionalTraitDialogOpen",
    parseAsInteger,
  );
  const isOpen = typeof open === "number";

  const onClearValues = () => {
    professionalTraitForm.reset({
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

  const professionalTraitForm = useForm<ProfessionalTraitSchema>({
    resolver: zodResolver(professionalTraitSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (data: ProfessionalTraitSchema) => {
    if (open === -1) {
      append(data);
    } else if (typeof open === "number" && open >= 0) {
      update(open, {
        ...data,
        name: data.name.trim(),
      });
    }
    await setOpen(null);
    onClearValues();
  };

  useEffect(() => {
    if (open === -1) {
      professionalTraitForm.reset();
    } else if (typeof open === "number" && open >= 0) {
      const professionalTrait = professionalTraits[open];
      professionalTraitForm.reset({
        ...professionalTrait,
      });
    }
  }, [open, professionalTraitForm, professionalTraits]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TrendingUpDown className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Add Professional Trait
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...professionalTraitForm}>
          <form onSubmit={professionalTraitForm.handleSubmit(onSubmit)}>
            <div className="mt-auto flex flex-1 flex-col gap-5">
              <FormField
                control={professionalTraitForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Trait</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Passionate" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={professionalTraitForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. I am a passionate developer who loves to code and build things."
                        {...field}
                      />
                    </FormControl>
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
                className="min-w-full sm:min-w-[180px]"
                onClick={professionalTraitForm.handleSubmit(onSubmit)}
              >
                {open === -1
                  ? "Add Professional Trait"
                  : "Update Professional Trait"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalTraitDialog;
