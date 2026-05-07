"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ProjectSchema,
  projectSchema,
} from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FolderOpenIcon,
  Trash2Icon,
  Upload,
  UserPen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  cleanTools,
} from "@/app/(manage)/(private)/_components/form-components/helper";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
import type { ProjectImages } from "generated/prisma";
import { uploadImage } from "@/lib/api/upload-image";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

const defaultValues: ProjectSchema = {
  title: "",
  description: "",
  mainImage: "",
  github: "",
  url: "",
  developedAt: new Date(),
  tools: "",
  images: [],
};

const ProjectFormDialog = ({
  open,
  portfolioId,
  onOpenChange,
  data,
}: {
  open: string | null;
  portfolioId: string;
  onOpenChange: (open: string | null) => void;
  data: ProjectSchema;
}) => {
  const [deleteImage, setDeleteImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();
  const projectForm = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: projectForm.control,
    name: "images",
  });

  const { mutateAsync: upsertProject, isPending } =
    api.portfolio.upsertProject.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getProjectsBySlug.invalidate(slug);
        toast.success(
          open === "create"
            ? "Project added successfully"
            : "Project updated successfully",
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

  const { mutateAsync: deleteProjectImage, isPending: isDeletingImage } =
    api.portfolio.deleteProjectImage.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getProjectsBySlug.invalidate(slug);
        toast.success("Image deleted successfully");
        setDeleteImage(null);
      },
      onError: () => {
        toast.error("Failed to delete image");
      },
    });

  console.log(projectForm.formState.errors);

  const onSubmit = async (data: ProjectSchema) => {
    setIsUploading(true);
    if (typeof open !== "string") return;
    try {
      if (data.mainImage instanceof File) {
        const upload = await uploadImage({
          file: data.mainImage,
        });
        data.mainImage = upload.publicUrl;
      }
      if (data.images?.length) {
        const images = await Promise.all(
          data.images?.map(async (image: { file: File }) => {
            const upload = await uploadImage({
              file: image.file,
            });
            return upload.publicUrl;
          }),
        );
        data.images = images;
      }
      await upsertProject({
        id: open,
        portfolioId,
        data,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const next: { file: File }[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file || !ACCEPT.includes(file.type)) {
        toast.error(
          <div>
            <p>Invalid file type</p>
            <p>{file?.name}: use JPEG, PNG, or WebP.</p>
          </div>,
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          <div>
            <p>File too large</p>
            <p>{file.name}: max 15MB.</p>
          </div>,
        );
        continue;
      }
      next.push({ file });
    }
    return next;
  };

  const onDeleteImage = async (id?: string) => {
    if (id) {
      await deleteProjectImage({
        id,
      });
    }
  };

  useEffect(() => {
    if (!open) {  
      projectForm.reset({
        ...defaultValues,
      });
    } else if (typeof open === "string") {
      const project = data;
      projectForm.reset({
        ...project,
        type: project?.type || "PERSONAL",
        github: project?.github || "",
        url: project?.url || "",
        tools: cleanTools(project?.tools || ""),
        images: [],
      });
    }
  }, [open, projectForm, data]);

  return (
    <Dialog open={open !== null} onOpenChange={(open) => onOpenChange(open ? null : "create")}>
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {open === "create" ? (
              <FolderOpenIcon className="size-6" strokeWidth={2} />
            ) : (
              <UserPen className="size-6" strokeWidth={2} />
            )}
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              {open === "create" ? "Add Project" : "Update Project"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...projectForm}>
          <form onSubmit={projectForm.handleSubmit(onSubmit)}>
            <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto px-1 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <FormField
                  control={projectForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Portfolio CRM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={projectForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERSONAL">Personal</SelectItem>
                            <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                            <SelectItem value="FREELANCE">Freelance</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something about the project"
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="tools"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Tools
                      <span className="text-muted-foreground text-xs">
                        Separate each tool with a comma &quot;,&quot;
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="React, Next.js, Tailwind CSS"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={projectForm.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/you/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://app.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={projectForm.control}
                name="mainImage"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={onChange}
                        variant="full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={projectForm.control}
                name="images"
                render={() => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Other Images</FormLabel>

                    <AlertDialog
                      open={deleteImage !== null}
                      onOpenChange={(open) =>
                        setDeleteImage(open ? deleteImage : null)
                      }
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this image?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteImage(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeletingImage}
                            onClick={() =>
                              onDeleteImage(deleteImage ?? undefined)
                            }
                          >
                            {isDeletingImage ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="grid grid-cols-2 flex-row flex-wrap gap-1 sm:grid-cols-3">
                      {data?.images?.map(
                        (image: ProjectImages, index: number) => {
                          return (
                            <Dialog key={index}>
                              <DialogTrigger asChild>
                                <div
                                  key={index}
                                  className="relative aspect-video overflow-hidden rounded border"
                                >
                                  <Image
                                    src={image.image}
                                    alt={`Project image ${index + 1}`}
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full object-cover"
                                  />

                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="bg-destructive text-muted absolute top-2 right-2"
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      setDeleteImage(image.id);
                                    }}
                                  >
                                    <Trash2Icon className="size-4" />
                                  </Button>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="min-w-[80%] overflow-y-auto">
                                <Image
                                  src={image.image}
                                  alt={`Project image ${index + 1}`}
                                  width={1000}
                                  height={1000}
                                  className="h-full w-full object-contain"
                                />
                              </DialogContent>
                            </Dialog>
                          );
                        },
                      )}
                    </div>
                    <div className="flex flex-col gap-3 pb-2">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">To Upload Images</p>
                        <div className="grid grid-cols-2 flex-row flex-wrap gap-1 sm:grid-cols-3">
                          {fields?.map(
                            (field: { file: File }, index: number) => {
                              const imageUrl = URL.createObjectURL(field.file);
                              return (
                                <Dialog key={index}>
                                  <DialogTrigger asChild>
                                    <div
                                      key={index}
                                      className="relative aspect-video overflow-hidden rounded border"
                                    >
                                      <Image
                                        src={imageUrl}
                                        alt={`Project image ${index + 1}`}
                                        width={1000}
                                        height={1000}
                                        className="h-full w-full object-cover"
                                      />

                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="bg-destructive text-muted absolute top-2 right-2"
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          remove(index);
                                        }}
                                      >
                                        <Trash2Icon className="size-4" />
                                      </Button>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <Image
                                      src={imageUrl}
                                      alt={`Project image ${index + 1}`}
                                      width={1000}
                                      height={1000}
                                      className="h-full w-full object-contain"
                                    />
                                  </DialogContent>
                                </Dialog>
                              );
                            },
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = addFiles(e.target.files);
                            if (files) {
                              append(files);
                            }
                            e.target.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="size-4" />
                          Add images
                        </Button>
                      </div>
                    </div>
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
                onClick={projectForm.handleSubmit(onSubmit)}
                disabled={isPending || isUploading}
              >
                {isPending || isUploading
                  ? open === "create"
                    ? "Adding Project..."
                    : "Updating Project..."
                  : open === "create"
                    ? "Add Project"
                    : "Update Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
