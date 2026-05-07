"use client";

import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema } from "../schema";
import type { SkillSchema } from "../schema";
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
import { Pickaxe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";

const defaultValues: SkillSchema = {
  name: "",
  icon: undefined,
};

const SkillDialog = ({
  append,
  update,
  skills,
}: {
  append: (data: SkillSchema) => void;
  update: (index: number, data: SkillSchema) => void;
  skills: SkillSchema[];
}) => {
  const [open, setOpen] = useQueryState("skillDialogOpen", parseAsInteger);
  const isOpen = typeof open === "number";

  const onClearValues = () => {
    skillForm.reset({
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

  const skillForm = useForm<SkillSchema>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = (data: SkillSchema) => {
    if (!data.icon) {
      skillForm.setError("icon", { message: "Icon is required" });
      return;
    }
    if (open === -1) {
      append(data);
    } else if (typeof open === "number" && open >= 0) {
      update(open, {
        ...data,
        name: data.name.trim(),
      });
    }
    setOpen(null);
    onClearValues();
  };

  useEffect(() => {
    if (open === -1) {
      skillForm.reset();
    } else if (typeof open === "number" && open >= 0) {
      const skill = skills[open];
      skillForm.reset({
        ...skill,
      });
    }
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Pickaxe className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Add Skill
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...skillForm}>
          <form onSubmit={skillForm.handleSubmit(onSubmit)}>
            <div className="mt-auto flex flex-1 flex-col gap-2">
              <FormField
                control={skillForm.control}
                name="icon"
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <FormItem className="flex w-full flex-col items-center justify-center gap-1">
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={onChange}
                        variant="icon"
                        maxSizeMB={1}
                        isError={fieldState.invalid}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={skillForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React" {...field} />
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
                className="min-w-full sm:min-w-[150px]"
                onClick={skillForm.handleSubmit(onSubmit)}
              >
                {open === -1 ? "Add Skill" : "Update Skill"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDialog;
