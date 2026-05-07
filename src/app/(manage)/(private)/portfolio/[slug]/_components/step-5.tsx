import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Project, ProjectImages } from "generated/prisma";
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
import { StepTwoLoader } from "./loaders";
import { Badge } from "@/components/ui/badge";
import type { ProjectSchema } from "../../../_components/form-components/schema";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { cleanTools } from "../../../_components/form-components/helper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageCarousel from "../../../_components/form-components/dialogs/image-carousel";
import Link from "next/link";
import ProjectDeleteDialog from "./dialog-forms/project-delete";
import ProjectFormDialog from "./dialog-forms/project";

function StepFive({ portfolioId }: { portfolioId: string }) {
  const { slug } = useParams<{ slug: string }>();
  const [open, setOpen] = useState<string | null>(null);

  const { data: projects, isLoading } =
    api.portfolio.getProjectsBySlug.useQuery(slug ?? "");

  const getActiveProject = (id: string) => {
    const active = projects?.find((field) => field.id === id);
    return {
      ...active,
      images: active?.images?.map((image) => image) ?? [],
      tools: cleanTools(active?.tools?.join(",") ?? ""),
    } as ProjectSchema;
  };
  return (
    <Card>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Projects</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add or edit your project details
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen("create")}>
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ProjectFormDialog
          open={open}
          onOpenChange={setOpen}
          portfolioId={portfolioId}
          data={getActiveProject(open || "")}
        />
        {isLoading ? (
          <StepTwoLoader />
        ) : (
          projects && (
            <DetailsContent
              portfolioId={portfolioId}
              projects={projects}
              setOpen={setOpen}
              getActiveProject={getActiveProject}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}

const DetailsContent = ({
  portfolioId,
  projects,
  setOpen,
  getActiveProject,
}: {
  portfolioId: string;
  projects: (Project & { images: ProjectImages[] })[];
  setOpen: (open: string | null) => void;
  getActiveProject: (id: string) => ProjectSchema;
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

  const handleAddProject = () => {
    setOpen("create");
  };

  const handleEditProject = (id: string) => {
    setOpen(id);
  };

  const handleRemoveProject = (id: string) => {
    setOpenDeleteDialog(id);
  };

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="space-y-3">
        {!projects.length ? (
          <div
            className={cn(
              "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            )}
          >
            <FolderOpen
              className={cn("text-muted-foreground size-12")}
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
              const tools = cleanTools(field.tools.join(","))
                .split(",")
                .filter((tool) => tool.length);

              const mainImage = field.mainImage
                ? [
                    {
                      src: field.mainImage,
                      alt: field.title,
                      isMain: true,
                    },
                  ]
                : [];

              const images = [
                ...mainImage,
                ...field.images.map((image) => ({
                  src: image.image,
                  alt: image.description ?? "",
                })),
              ];
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
                        onClick={() => handleEditProject(field.id)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive size-8 cursor-pointer"
                        onClick={() => handleRemoveProject(field.id)}
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
                          <div className="flex flex-row items-center gap-2">
                            <p className="text-foreground text-sm font-medium md:text-base">
                              {field.title}
                            </p>
                            <Badge>
                              <div className="px-1 text-[10px] sm:text-xs capitalize sm:py-1.5">
                                {field.type.toLowerCase().replace("_", " ")} Project
                              </div>
                            </Badge>
                          </div>
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
                              <p className="text-[10px] md:text-xs">
                                Repository
                              </p>
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

        <ProjectDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          data={getActiveProject(openDeleteDialog || "")}
          portfolioId={portfolioId}
        />
      </div>
    </div>
  );
};

export default StepFive;
