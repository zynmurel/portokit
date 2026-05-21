"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  skillCategoryOptions,
  type SkillSchema,
  skillSchema,
} from "@/app/(manage)/(private)/_components/form-components/schema";
import { SkillCategory } from "generated/prisma";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {  Pickaxe, UserPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { uploadImage } from "@/lib/api/upload-image";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const defaultValues: SkillSchema = {
  name: "",
  icon: "",
  category: SkillCategory.FRONTEND,
};

const SkillFormDialog = ({
  open,
  portfolioId,
  onOpenChange,
  data,
}: {
  open: string | null;
  portfolioId: string;
  onOpenChange: (open: string | null) => void;
  data: SkillSchema;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();
  const skillForm = useForm<SkillSchema>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { mutateAsync: upsertSkill, isPending } =
    api.portfolio.upsertSkill.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getSkillsBySlug.invalidate(slug);
        toast.success(
          open === "create"
            ? "Skill added successfully"
            : "Skill updated successfully",
        );
        onOpenChange(null);
      },
      onError: () => {
        toast.error(
          open === "create" ? "Failed to add skill" : "Failed to update skill",
        );
      },
      onSettled: () => {
        setIsUploading(false);
      },
    });

  const onSubmit = async (data: SkillSchema) => {
    if (typeof open !== "string") return;
    const isCreate = open === "create";
    try {
      setIsUploading(true);
      if (data.icon instanceof File) {
        const file = await uploadImage({
          file: data.icon,
        });
        data.icon = file.publicUrl;
      }
      await upsertSkill({
        id: isCreate ? "" : open,
        portfolioId,
        data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (data) {
      skillForm.reset({
        name: data.name,
        icon: data.icon ?? "",
        category: data.category ?? SkillCategory.FRONTEND,
      });
    }
  }, [data, open, skillForm]);

  return (
    <Dialog open={open !== null} onOpenChange={(open) => onOpenChange(open ? null : "create")}>
      <DialogContent className="">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {open === "create" ? (
              <Pickaxe className="size-6" strokeWidth={2} />
            ) : (
              <UserPen className="size-6" strokeWidth={2} />
            )}
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              {open === "create" ? "Add Skill" : "Update Skill"}
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
              <FormField
                control={skillForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillCategoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                onClick={skillForm.handleSubmit(onSubmit)}
                disabled={isPending || isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : open === "create"
                    ? "Add Skill"
                    : "Update Skill"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillFormDialog;
