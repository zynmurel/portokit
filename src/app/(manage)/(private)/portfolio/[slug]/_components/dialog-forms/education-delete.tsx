"use client";

import { type EducationSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GraduationCapIcon, Trash2, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

const EducationDeleteDialog = ({
  open,
  onOpenChange,
  data,
  portfolioId,
}: {
  open: string | null;
  onOpenChange: (open: string | null) => void;
  data: EducationSchema;
  portfolioId: string;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();

  const { mutateAsync: deleteEducation, isPending } =
    api.portfolio.deleteEducation.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getEducationBySlug.invalidate(slug);
        onOpenChange(null);
        toast.success("Education deleted successfully");
      },
      onError: (error) => {
        toast.error("Failed to delete education");
      },
    });

  const onSubmit = async () => {
    if (typeof open !== "string") return;
    try {
      await deleteEducation({
        id: open,
        portfolioId,
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
                Delete Education
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this education?
              </DialogDescription>
            </div>
          </div>

          <div className="bg-background flex items-center gap-4 rounded-b-lg border-t py-4">
            {/* Icon */}
            <div className="bg-primary text-primary-foreground hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
              <GraduationCapIcon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
              <div>
                <p className="text-foreground text-sm font-medium md:text-base">
                  {data.school}
                </p>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {data.degree} · {data.field}
                </p>
              </div>
              <p className="text-muted-foreground text-[10px] md:text-xs">
                {format(data.startDate ?? new Date(), "MMM yyyy")} –{" "}
                {format(data.endDate ?? new Date(), "MMM yyyy")}
              </p>
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
            Delete Education
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EducationDeleteDialog;
