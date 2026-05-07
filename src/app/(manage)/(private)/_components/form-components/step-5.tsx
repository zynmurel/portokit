import React from "react";
import { useFormContext, type FieldArrayWithId } from "react-hook-form";
import { type PortfolioFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  GitBranch,
  ImageIcon,
  LinkIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseAsInteger, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { buildImages, cleanTools } from "./helper";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageCarousel from "./dialogs/image-carousel";

function StepFive({
  projects,
  remove,
}: {
  projects: FieldArrayWithId<PortfolioFormValues, "projects">[];
  remove: (index: number) => void;
}) {
  const form = useFormContext<PortfolioFormValues>();
  const [, setProjectDialogOpen] = useQueryState(
    "projectDialogOpen",
    parseAsInteger,
  );

  const handleAddProject = async () => {
    await setProjectDialogOpen(-1);
    form.clearErrors("projects");
  };

  const handleEditProject = async (index: number) => {
    await setProjectDialogOpen(index);
  };

  const isError = form.formState.errors.projects;

  return (
    <div className="space-y-3">
      {!projects.length ? (
        <div
          className={cn(
            "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            isError && "border-red-500/50",
          )}
        >
          <FolderOpen
            className={cn(
              "text-muted-foreground size-12",
              isError && "text-red-500",
            )}
            strokeWidth={1}
          />
          <p className="text-muted-foreground text-sm">
            Add your project to your portfolio
          </p>
          <Button type="button" variant="outline" onClick={handleAddProject}>
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      ) : (
        <>
          {projects.map((field, index) => {
            const tools = cleanTools(field.tools)
              .split(",")
              .filter((tool) => tool.length);

            const images = buildImages(field);
            // if (!images.length) return null;
            return (
              <div key={field.id} className="rounded-md border">
                <div className="flex items-center justify-between px-3 py-1">
                  <p className="font-bold">{`Project ${index + 1}`}</p>
                  <div className="flex flex-row items-center gap-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => handleEditProject(index)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive size-8 cursor-pointer"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-background flex flex-col gap-4 rounded-b-lg border-t p-4">
                  <div className="flex w-full flex-1 flex-col flex-wrap items-start justify-between gap-x-4 gap-y-2 sm:flex-row">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-foreground text-sm font-medium md:text-base">
                          {field.title}
                        </p>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          {field.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5">
                      {field.url && (
                        <Link
                          href={field.url}
                          target="_blank"
                          className="hover:text-blue-600"
                        >
                          <div className="flex flex-row items-center gap-1">
                            <LinkIcon className="size-3.5" />
                            <p className="text-[10px] md:text-xs">Website</p>
                          </div>
                        </Link>
                      )}
                      {field.github && (
                        <Link
                          href={field.github}
                          target="_blank"
                          className="hover:text-blue-600"
                        >
                          <div className="flex flex-row items-center gap-1">
                            <GitBranch className="size-3.5" />
                            <p className="text-[10px] md:text-xs">Repository</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap justify-between gap-2">
                    <div className="flex flex-wrap items-start gap-x-0.5 gap-y-1">
                      {tools?.map((tool) => (
                        <Badge key={tool} variant="outline" className="h-6">
                          <div className="px-1 py-1 text-xs">{tool}</div>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex w-full flex-row flex-wrap justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className="flex flex-row gap-2"
                          >
                            <ImageIcon />
                            View Images
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="md:min-w-[80%]">
                          <DialogHeader>
                            <DialogTitle className="text-sm font-medium">
                              {field.title}
                            </DialogTitle>
                            <p className="text-muted-foreground text-xs">
                              {images.length} image
                              {images.length !== 1 ? "s" : ""}
                            </p>
                          </DialogHeader>

                          <ImageCarousel images={images} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddProject()}
            >
              <Plus className="size-4" />
              Add Project
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default StepFive;
