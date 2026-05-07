import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { ProfessionalTraits, Skill } from "generated/prisma";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Pencil,
  Pickaxe,
  Plus,
  Trash2,
  TrendingUpDown,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepFourProfessionalTraitsLoader, StepFourSkillsLoader } from "./loaders";
import type {
  PortfolioFormValues,
  ProfessionalTraitSchema,
  SkillSchema,
} from "../../../_components/form-components/schema";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SkillFormDialog from "./dialog-forms/skill";
import SkillDeleteDialog from "./dialog-forms/skill-delete";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import TraitFormDialog from "./dialog-forms/trait";
import type { FieldArrayWithId } from "react-hook-form";
import { parseAsInteger, useQueryState } from "nuqs";
import { CSS } from "@dnd-kit/utilities";
import TraitDeleteDialog from "./dialog-forms/trait-delete";
import Image from "next/image";

function StepFour({ portfolioId }: { portfolioId: string }) {
  return (
    <Card>
      <SkillHeaderAndContent portfolioId={portfolioId} />
      <Separator />
      <TraitHeaderAndContent portfolioId={portfolioId} />
    </Card>
  );
}

const SkillHeaderAndContent = ({ portfolioId }: { portfolioId: string }) => {
  const { slug } = useParams<{ slug: string }>();
  const [open, setOpen] = useState<string | null>(null);

  const { data: skills, isLoading } = api.portfolio.getSkillsBySlug.useQuery(
    slug ?? "",
  );

  const getActiveSkill = (id: string) => {
    const active = skills?.find((field) => field.id === id);
    return {
      name: active?.name ?? "",
      icon: active?.icon ?? "",
    } as SkillSchema;
  };
  return (
    <>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Skills</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add or edit your skills
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen("create")}>
            <Plus className="size-4" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SkillFormDialog
          open={open}
          onOpenChange={setOpen}
          portfolioId={portfolioId}
          data={getActiveSkill(open || "")}
        />
        {isLoading ? (
          <StepFourSkillsLoader />
        ) : (
          skills && (
            <SkillsDetailsContent
              portfolioId={portfolioId}
              skills={skills}
              setOpen={setOpen}
              getActiveSkill={getActiveSkill}
            />
          )
        )}
      </CardContent>
    </>
  );
};

const SkillsDetailsContent = ({
  portfolioId,
  skills,
  setOpen,
  getActiveSkill,
}: {
  portfolioId: string;
  skills: Skill[];
  setOpen: (open: string | null) => void;
  getActiveSkill: (id: string) => SkillSchema;
}) => {
  const [skillLists, setSkillLists] = useState<Skill[]>(skills);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddskill = () => {
    setOpen("create");
  };

  const handleRemoveSkill = (id: string) => {
    setOpenDeleteDialog(id);
  };

  const { mutateAsync: switchSkillOrder, isPending } =
    api.portfolio.switchSkillOrder.useMutation({
      onError: (error) => {
        setSkillLists(skillLists);
        toast.error("Failed to switch skill order");
      },
    });

  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

  const handleAddSkill = () => {
    setOpen("create");
  };

  const handleSkillDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log(active, over);

    const oldIndex = skillLists.findIndex((item) => item.id === active.id);
    const newIndex = skillLists.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setSkillLists(arrayMove(skillLists, oldIndex, newIndex));
    await toast.promise(
      switchSkillOrder({
        idOne: active.id as string,
        idTwo: over.id as string,
        portfolioId,
      }),
      {
        loading: "Switching order...",
        success: "Switched successfully",
        error: "Failed to switch",
      },
    );
  };

  useEffect(() => {
    setSkillLists(skills);
  }, [skills]);

  return (
    <div className="rounded-lg">
      <div className="space-y-3">
        {!skillLists?.length ? (
          <div
            className={cn(
              "flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            )}
          >
            <Pickaxe
              className="text-muted-foreground size-12"
              strokeWidth={1}
            />
            <p className="text-muted-foreground text-sm">
              Add your skills to your portfolio
            </p>
            <Button type="button" variant="outline" onClick={handleAddSkill}>
              <Plus className="size-4" />
              Add Skill
            </Button>
          </div>
        ) : !skillLists.length ? (
          <div
            className={cn(
              "bg-background flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-5",
            )}
          >
            <Pickaxe
              className={cn("text-muted-foreground size-8")}
              strokeWidth={1}
            />
            <p className="text-muted-foreground text-sm">
              Add your skills to your portfolio
            </p>
            <Button type="button" variant="outline" onClick={handleAddskill}>
              <Plus className="size-4" />
              Add Skill
            </Button>
          </div>
        ) : (
          <div className="grid w-full items-start gap-2 rounded-b-lg pb-5">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSkillDragEnd}
            >
              <SortableContext
                items={skillLists.map((field) => field.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid sm:grid-cols-2 gap-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {skillLists.map((field) => (
                    <SortableSkillRow
                      key={field.id}
                      value={field}
                      onRemove={() => handleRemoveSkill(field.id)}
                      disabled={isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <SkillDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          data={getActiveSkill(openDeleteDialog || "")}
          portfolioId={portfolioId}
        />
      </div>
    </div>
  );
};

const TraitHeaderAndContent = ({ portfolioId }: { portfolioId: string }) => {
  const { slug } = useParams<{ slug: string }>();
  const [open, setOpen] = useState<string | null>(null);

  const { data: professionalTraits, isLoading } =
    api.portfolio.getProfessionalTraitsBySlug.useQuery(slug ?? "");

  const getActiveProfessionalTrait = (id: string) => {
    const active = professionalTraits?.find((field) => field.id === id);
    return {
      name: active?.name ?? "",
      description: active?.description ?? "",
    } as ProfessionalTraitSchema;
  };
  return (
    <>
      <CardHeader className="flex flex-col gap-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="font-bold">Professional Traits</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Add or edit your traits
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setOpen("create")}>
            <Plus className="size-4" />
            Add Trait
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TraitFormDialog
          open={open}
          onOpenChange={setOpen}
          portfolioId={portfolioId}
          data={getActiveProfessionalTrait(open || "")}
        />
        {isLoading ? (
          <StepFourProfessionalTraitsLoader />
        ) : (
          professionalTraits && (
            <ProfessionalTraitsDetailsContent
              portfolioId={portfolioId}
              professionalTraits={professionalTraits}
              setOpen={setOpen}
              getActiveProfessionalTrait={getActiveProfessionalTrait}
            />
          )
        )}
      </CardContent>
    </>
  );
};
const ProfessionalTraitsDetailsContent = ({
  portfolioId,
  professionalTraits,
  setOpen,
  getActiveProfessionalTrait,
}: {
  portfolioId: string;
  professionalTraits: ProfessionalTraits[];
  setOpen: (open: string | null) => void;
  getActiveProfessionalTrait: (id: string) => ProfessionalTraitSchema;
}) => {
  const [professionalTraitLists, setProfessionalTraitLists] =
    useState<ProfessionalTraits[]>(professionalTraits);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddskill = () => {
    setOpen("create");
  };

  const handleRemoveSkill = (id: string) => {
    setOpenDeleteDialog(id);
  };

  const { mutateAsync: switchProfessionalTraitOrder, isPending } =
    api.portfolio.switchProfessionalTraitOrder.useMutation({
      onError: (error) => {
        setProfessionalTraitLists(professionalTraitLists);
        toast.error("Failed to switch professional trait order");
      },
    });

  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);

  const handleSkillDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log(active, over);

    const oldIndex = professionalTraitLists.findIndex(
      (item) => item.id === active.id,
    );
    const newIndex = professionalTraitLists.findIndex(
      (item) => item.id === over.id,
    );
    if (oldIndex < 0 || newIndex < 0) return;
    setProfessionalTraitLists(
      arrayMove(professionalTraitLists, oldIndex, newIndex),
    );
    await toast.promise(
      switchProfessionalTraitOrder({
        idOne: active.id as string,
        idTwo: over.id as string,
        portfolioId,
      }),
      {
        loading: "Switching order...",
        success: "Switched successfully",
        error: "Failed to switch",
      },
    );
  };

  useEffect(() => {
    setProfessionalTraitLists(professionalTraits);
  }, [professionalTraits]);

  return (
    <div className="rounded-lg">
      <div className="space-y-3">
        {!professionalTraitLists.length ? (
          <div
            className={cn(
              "bg-background flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-5",
            )}
          >
            <TrendingUpDown
              className={cn("text-muted-foreground size-8")}
              strokeWidth={1}
            />
            <p className="text-muted-foreground text-sm">
              Add your professional traits to your portfolio
            </p>
            <Button type="button" variant="outline" onClick={handleAddskill}>
              <Plus className="size-4" />
              Add Professional Trait
            </Button>
          </div>
        ) : (
          <div className="grid w-full items-start gap-2 rounded-b-lg pb-5">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSkillDragEnd}
            >
              <SortableContext
                items={professionalTraitLists.map((field) => field.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  {professionalTraitLists.map((field, index) => (
                    <SortableProfessionalTraitRow
                      key={field.id}
                      value={field}
                      index={index}
                      onRemove={() => handleRemoveSkill(field.id)}
                      onEdit={setOpen}
                      disabled={isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <TraitDeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          data={getActiveProfessionalTrait(openDeleteDialog || "")}
          portfolioId={portfolioId}
        />
      </div>
    </div>
  );
};

export function SortableSkillRow({
  value,
  onRemove,
  disabled = false,
}: {
  value: FieldArrayWithId<PortfolioFormValues, "skills">;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: value.id,
    });

  const icon: File | null | string = value.icon;
  const iconPreview = icon
    ? typeof icon === "string"
      ? icon
      : URL.createObjectURL(icon)
    : null;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex flex-row items-center gap-1 rounded-md border p-0 py-2 pl-1 bg-background",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 flex-none w-6 pl-2 pr-2"
        {...attributes}
        {...listeners}
        disabled={disabled}
      >
        <GripVertical className="size-4" />
      </Button>

      <div className="flex flex-row items-center gap-2 bg-white rounded overflow-hidden">
        <Image
          src={iconPreview ?? ""}
          alt={value.name}
          width={32}
          height={32}
          className="size-6 flex-none rounded-md object-contain sm:size-7"
          onError={(e) => {
            e.currentTarget.src = "/fallback.png";
          }}
        />
      </div>
      <div className="w-full truncate text-xs font-medium md:text-sm flex-1 pl-1">
        {value.name}
      </div>

      <Button type="button" variant="ghost" onClick={onRemove} className=" pl-3 pr-3">
        <Trash2 className="text-destructive size-4" />
      </Button>
    </div>
  );
}

function SortableProfessionalTraitRow({
  value,
  onRemove,
  onEdit,
  index,
  disabled = false,
}: {
  value: FieldArrayWithId<PortfolioFormValues, "professionalTraits">;
  onRemove: () => void;
  onEdit: (open: string | null) => void;
  index: number;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: value.id,
    });

  return (
    <div
      key={value.id}
      className="rounded-md border"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center justify-between py-1 pr-3 pl-2">
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-6 flex-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </Button>
          <p className="font-bold">{`Trait ${index + 1}`}</p>
        </div>
        <div className="flex flex-row items-center gap-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => onEdit(value.id)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive size-8 cursor-pointer"
            onClick={() => onRemove()}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="bg-background flex items-start gap-4 rounded-b-lg border-t p-2 px-3 md:p-3 md:px-4">
        {/* Icon */}
        <div className="bg-primary text-primary-foreground mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
          <TrendingUpDown className="h-5 w-5" />
        </div>

        {/* Content */}
        <div>
          <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
            <div>
              <p className="text-foreground text-xs font-semibold md:text-sm">
                {value.name}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {value.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepFour;
