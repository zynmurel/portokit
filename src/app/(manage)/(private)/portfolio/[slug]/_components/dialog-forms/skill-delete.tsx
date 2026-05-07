"use client";

import { type SkillSchema } from "@/app/(manage)/(private)/_components/form-components/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const SkillDeleteDialog = ({
  open,
  onOpenChange,
  data,
  portfolioId,
}: {
  open: string | null;
  onOpenChange: (open: string | null) => void;
  data: SkillSchema;
  portfolioId: string;
}) => {
  const { slug } = useParams<{ slug: string }>();
  const utils = api.useUtils();

  const { mutateAsync: deleteSkill, isPending } =
    api.portfolio.deleteSkill.useMutation({
      onSuccess: async () => {
        await utils.portfolio.getSkillsBySlug.invalidate(slug);
        onOpenChange(null);
        toast.success("Skill deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete skill");
      },
    });

  const onSubmit = async () => {
    if (typeof open !== "string") return;
    try {
      await deleteSkill({
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
                Delete Skill
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this skill?
              </DialogDescription>
            </div>
          </div>

          <div className="bg-background flex items-center gap-4 rounded-b-lg border-t py-4">

            {/* Content */}

            <div className="flex flex-row items-center gap-1 rounded-md p-0 pl-1">


              <div className="flex flex-row items-center gap-2">
                <Image
                  src={data.icon ?? ""}
                  alt={data.name}
                  width={32}
                  height={32}
                  className="size-8 flex-none rounded-md object-contain sm:size-6"
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.png";
                  }}
                />
                <div className="text-base font-medium">{data.name}</div>
              </div>
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
            Delete Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDeleteDialog;
