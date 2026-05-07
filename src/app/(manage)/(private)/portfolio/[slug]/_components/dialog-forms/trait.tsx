"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ProfessionalTraitSchema,
  professionalTraitSchema,
} from "@/app/(manage)/(private)/_components/form-components/schema";
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
import { Pickaxe, UserPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: ProfessionalTraitSchema = {
  name: "",
  description: "",
};

const TraitFormDialog = ({
  open,
  portfolioId,
  onOpenChange,
  data,
}: {
  open: string | null;
  portfolioId: string;
  onOpenChange: (open: string | null) => void;
  data: ProfessionalTraitSchema;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();
  const professionalTraitForm = useForm<ProfessionalTraitSchema>({
    resolver: zodResolver(professionalTraitSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { mutateAsync: upsertTrait, isPending } =
    api.portfolio.upsertProfessionalTrait.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getProfessionalTraitsBySlug.invalidate(slug);
        toast.success(
          open === "create"
            ? "Trait added successfully"
            : "Trait updated successfully",
        );
        onOpenChange(null);
      },
      onError: (error) => {
        toast.error(
          open === "create" ? "Failed to add skill" : "Failed to update skill",
        );
      },
    });

  const onSubmit = async (data: ProfessionalTraitSchema) => {
    if (typeof open !== "string") return;
    const isCreate = open === "create";
    try {
      await upsertTrait({
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
      professionalTraitForm.reset({
        name: data.name,
        description: data.description ?? "",
      });
    }
  }, [data, open]);

  return (
    <Dialog open={open !== null} onOpenChange={(open) => onOpenChange(null)}>
      <DialogContent className="">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {open === "create" ? (
              <Pickaxe className="size-6" strokeWidth={2} />
            ) : (
              <UserPen className="size-6" strokeWidth={2} />
            )}
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              {open === "create" ? "Add Trait" : "Update Trait"}
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
                onClick={() => onOpenChange(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="min-w-full sm:min-w-[150px]"
                onClick={professionalTraitForm.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending
                  ? open === "create"
                    ? "Adding Trait..."
                    : "Updating Trait..."
                  : open === "create"
                    ? "Add Trait"
                    : "Update Trait"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TraitFormDialog;
