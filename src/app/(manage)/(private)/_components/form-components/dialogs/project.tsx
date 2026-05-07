"use client";

import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../schema";
import type { ProjectSchema } from "../schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderOpen, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cleanDescription, cleanTools } from "../helper";
import { ImageUpload } from "@/components/ui/image-upload";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 15MB
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

const defaultValues: ProjectSchema = {
  type: "PERSONAL",
  title: "",
  description: "",
  mainImage: "",
  github: "",
  url: "",
  developedAt: new Date(),
  tools: "",
  images: [],
};

const ProjectDialog = ({
  append,
  update,
  projects,
}: {
  append: (data: ProjectSchema) => void;
  update: (index: number, data: ProjectSchema) => void;
  projects: ProjectSchema[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useQueryState("projectDialogOpen", parseAsInteger);
  const isOpen = typeof open === "number";

  const onClearValues = () => {
    projectForm.reset({
      ...defaultValues,
    });
  };

  const onOpenChange = async (open: boolean) => {
    if (!open) {
      await setOpen(null);
      onClearValues();
    }
  };

  const projectForm = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (data: ProjectSchema) => {
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
      projectForm.reset();
    } else if (typeof open === "number" && open >= 0) {
      const project = projects[open];
      projectForm.reset({
        ...project,
        description: cleanDescription(project?.description),
        tools: cleanTools(project?.tools),
      });
    }
  }, [open, projectForm, projects]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[93%] sm:min-w-[90%] lg:min-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="size-6" strokeWidth={2} />
            <DialogTitle className="text-base font-medium md:text-base lg:text-base">
              Add Project
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...projectForm}>
          <form onSubmit={projectForm.handleSubmit(onSubmit)}>
            <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
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
                        maxSizeMB={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={projectForm.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Other Images</FormLabel>
                    <div className="flex flex-col gap-3 pb-2">
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
                              field.onChange([
                                ...(field.value || []),
                                ...files,
                              ]);
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
                          Choose images
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 flex-row flex-wrap gap-1 sm:grid-cols-3">
                        {field?.value?.map(
                          (file: { file: File }, index: number) => {
                            const imageUrl = URL.createObjectURL(file.file);
                            return (
                              <Dialog key={index}>
                                <DialogTrigger asChild>
                                  <div
                                    key={index}
                                    className="aspect-video overflow-hidden rounded border"
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt={file.file.name}
                                      width={100}
                                      height={100}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="min-w-[80%] overflow-y-auto">
                                  <Image
                                    src={imageUrl}
                                    alt={file.file.name}
                                    width={100}
                                    height={100}
                                    className="h-full w-full object-contain"
                                  />
                                </DialogContent>
                              </Dialog>
                            );
                          },
                        )}
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="min-w-full sm:min-w-[150px]"
                onClick={projectForm.handleSubmit(onSubmit)}
              >
                {open === -1 ? "Add Project" : "Update Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
