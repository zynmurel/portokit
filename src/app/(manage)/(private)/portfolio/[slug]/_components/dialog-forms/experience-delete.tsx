"use client";

import { type ExperienceSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BriefcaseBusiness,
  Dot,
  GraduationCapIcon,
  Trash2,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ExperienceDeleteDialog = ({
  open,
  onOpenChange,
  data,
  portfolioId,
}: {
  open: string | null;
  onOpenChange: (open: string | null) => void;
  data: ExperienceSchema;
  portfolioId: string;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();

  const { mutateAsync: deleteExperience, isPending } =
    api.portfolio.deleteExperience.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getExperiencesBySlug.invalidate(slug);
        onOpenChange(null);
        toast.success("Experience deleted successfully");
      },
      onError: (error) => {
        toast.error("Failed to delete education");
      },
    });

  const onSubmit = async () => {
    if (typeof open !== "string") return;
    try {
      await deleteExperience({
        id: open,
        portfolioId: portfolioId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open !== null} onOpenChange={(open) => onOpenChange(null)}>
      <DialogContent className="min-w-[93%] gap-1 sm:min-w-[90%] lg:min-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <Trash2 className="text-destructive mt-1 size-6" strokeWidth={2} />
            <div className="flex flex-col gap-0">
              <DialogTitle className="text-base font-medium md:text-base lg:text-base">
                Delete Experience
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this education?
              </DialogDescription>
            </div>
          </div>

          <div className="bg-background flex w-full flex-col items-start gap-2 rounded-b-lg border-t p-4">
            <div className="flex w-full flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium md:text-base">
                    {data.company}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {data.position}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-[10px] md:text-xs">
                {data.startDate
                  ? format(data.startDate, "MMM yyyy")
                  : "Present"}{" "}
                – {data.endDate ? format(data.endDate, "MMM yyyy") : "Present"}
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-x-0.5 gap-y-1">
              {data.tools?.split(",")?.map((tool) => (
                <Badge key={tool} variant="outline" className="h-6">
                  <div className="px-1 py-1 text-xs">{tool}</div>
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-x-0.5 gap-y-1">
              {data.description?.split("\n")?.map((line) => (
                <div key={line} className="flex items-start gap-1 sm:gap-2">
                  <Dot
                    className="text-primary mt-[0.5px] size-3.5 flex-none md:mt-[3.5px]"
                    strokeWidth={6}
                  />
                  <p key={line} className="text-xs md:text-sm">
                    {line} ada das asdsadssadsa das asdas asd asd
                  </p>
                </div>
              ))}
            </div>
          </div>
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
            Delete Experience
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDeleteDialog;
