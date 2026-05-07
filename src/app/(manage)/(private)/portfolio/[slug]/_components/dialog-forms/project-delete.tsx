"use client";

import { type ProjectSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpenIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const ProjectDeleteDialog = ({
  open,
  onOpenChange,
  data,
  portfolioId,
}: {
  open: string | null;
  onOpenChange: (open: string | null) => void;
  data: ProjectSchema;
  portfolioId: string;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();

  const { mutateAsync: deleteProject, isPending } =
    api.portfolio.deleteProject.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getProjectsBySlug.invalidate(slug);
        onOpenChange(null);
        toast.success("Project deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete project");
      },
    });

  const onSubmit = async () => {
    if (typeof open !== "string") return;
    try {
      await deleteProject({
        id: open,
        portfolioId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open !== null} onOpenChange={(open) => onOpenChange(open ? null : "create")}>
      <DialogContent className="">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <Trash2 className="text-destructive mt-1 size-6" strokeWidth={2} />
            <div className="flex flex-col gap-0">
              <DialogTitle className="text-base font-medium md:text-base lg:text-base">
                Delete Project
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this project?
              </DialogDescription>
            </div>
          </div>

          <div className="bg-background flex items-center gap-4 rounded-b-lg border-t py-4">
            {/* Content */}

            {/* Icon */}
            <div className="bg-primary text-primary-foreground mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
              <FolderOpenIcon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div>
              <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                <div>
                  <p className="text-foreground text-sm font-medium md:text-base">
                    {data.title}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" text-sm text-destructive">Deleting this project will also delete all associated images.</div>
        </DialogHeader>
        <div className="flex flex-col justify-end gap-2 sm:flex-row">
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
            variant="destructive"
            className="min-w-full sm:min-w-[150px]"
            onClick={onSubmit}
            disabled={isPending}
          >
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteDialog;
