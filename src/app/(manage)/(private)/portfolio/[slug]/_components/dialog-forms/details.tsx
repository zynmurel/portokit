"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { detailsSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import type { DetailsSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { uploadImage } from "@/lib/api/upload-image";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const defaultValues: DetailsSchema = {
  name: "",
  title: "",
  slug: "",
  description: "",
  role: "",
  location: "",
  image: null,
  email: "",
  phoneNumber: "",
  logo: null,
};

const DetailsFormDialog = ({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DetailsSchema;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const detailsForm = useForm<DetailsSchema>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { mutate: updatePortfolio, isPending } =
    api.portfolio.update.useMutation({
      onSuccess: async () => {
        await Promise.all([
          utils.portfolio.getBySlug.invalidate(slug),
          utils.portfolio.getAll.invalidate(),
        ]);
        toast.success("Portfolio updated successfully");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to update portfolio");
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });

  const onSubmit = async (data: DetailsSchema) => {
    try {
      setIsLoading(true);
      if (!data.image) {
        detailsForm.setError("image", {
          message: "Profile image is required",
        });
        return;
      }
      if (!data.logo) {
        detailsForm.setError("logo", { message: "Logo is required" });
        return;
      }
      //check if data.image is a file
      if (data.image instanceof File) {
        const newProfileImage = await uploadImage({
          file: data.image,
          folder: "portfolio",
        });
        if (newProfileImage.publicUrl) {
          data.image = newProfileImage.publicUrl;
        }
      }
      if (data.logo instanceof File) {
        const newLogo = await uploadImage({
          file: data.logo,
          folder: "portfolio",
        });
        if (newLogo.publicUrl) {
          data.logo = newLogo.publicUrl;
        }
      }
      updatePortfolio({
        slug: slug,
        data,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      detailsForm.reset(data);
    }
  }, [data, open, detailsForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <UserPen className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Update Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...detailsForm}>
          <form onSubmit={detailsForm.handleSubmit(onSubmit)}>
            <div className="grid max-h-[75vh] grid-cols-1 gap-4 overflow-y-auto p-1 md:grid-cols-2">
              <div className="flex flex-col gap-8 sm:flex-row md:col-span-2">
                <FormField
                  control={detailsForm.control}
                  name="image"
                  render={({
                    field: { onChange, ...field },
                    formState: { errors },
                  }) => (
                    <FormItem>
                      <FormLabel>Portfolio Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={onChange}
                          isError={!!errors.image}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-auto flex flex-1 flex-col gap-5">
                  <FormField
                    control={detailsForm.control}
                    name="logo"
                    render={({
                      field: { onChange, ...field },
                      formState: { errors },
                    }) => (
                      <FormItem>
                        <FormLabel>Portfolio Logo</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={onChange}
                            variant="icon"
                            maxSizeMB={1}
                            isError={!!errors.logo}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={detailsForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          Think of a title for your portfolio
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. John Doe Portfolio"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={detailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe Portfolio" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={detailsForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Stack Developer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug/Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Building digital products"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Cebu, PH" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your profile and what you do."
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2 md:col-span-2">
                <p className="text-sm font-semibold">Social Links</p>
              </div>
              <FormField
                control={detailsForm.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="gitlab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitLab URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.linkedin.com/in/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.facebook.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.instagram.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-28"
                disabled={isLoading || isPending}
              >
                {isPending || isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsFormDialog;
