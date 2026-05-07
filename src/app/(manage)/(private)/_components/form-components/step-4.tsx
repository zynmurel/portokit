import React from "react";
import {
  useFormContext,
  type Control,
  type FieldArrayWithId,
} from "react-hook-form";
import { type PortfolioFormValues } from "./schema";
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
import { parseAsInteger, useQueryState } from "nuqs";
import { CSS } from "@dnd-kit/utilities";
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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Image from "next/image";

function StepFour({
  skills,
  remove,
  move,
  professionalTraits,
  removeProfessionalTrait,
  moveProfessionalTrait,
}: {
  skills: FieldArrayWithId<PortfolioFormValues, "skills">[];
  remove: (index: number) => void;
  move: (oldIndex: number, newIndex: number) => void;
  professionalTraits: FieldArrayWithId<
    PortfolioFormValues,
    "professionalTraits"
  >[];
  removeProfessionalTrait: (index: number) => void;
  moveProfessionalTrait: (oldIndex: number, newIndex: number) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const form = useFormContext<PortfolioFormValues>();
  const [, setskillDialogOpen] = useQueryState(
    "skillDialogOpen",
    parseAsInteger,
  );
  const [, setprofessionalTraitDialogOpen] = useQueryState(
    "professionalTraitDialogOpen",
    parseAsInteger,
  );

  const handleAddprofessionalTrait = () => {
    setprofessionalTraitDialogOpen(-1);
    form.clearErrors("professionalTraits");
  };

  const handleAddskill = () => {
    setskillDialogOpen(-1);
    form.clearErrors("skills");
  };

  const handleSkillDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = skills.findIndex((item) => item.id === active.id);
    const newIndex = skills.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    move(oldIndex, newIndex);
  };

  const handleProfessionalTraitDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = professionalTraits.findIndex(
      (item) => item.id === active.id,
    );
    const newIndex = professionalTraits.findIndex(
      (item) => item.id === over.id,
    );
    if (oldIndex < 0 || newIndex < 0) return;
    moveProfessionalTrait(oldIndex, newIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-5">
        <div className="overflow-hidden rounded-md border">
          <div className="flex items-center justify-between px-3 py-1">
            <div className="flex flex-row items-center gap-2">
              <Pickaxe className="size-4" />
              <h2 className="text-base font-semibold">Skills</h2>
            </div>
            <div className="flex flex-row items-center gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={handleAddskill}
              >
                <Plus className="size-4" /> Add Skill
              </Button>
            </div>
          </div>
          {!skills.length ? (
            <div
              className={cn(
                "bg-background flex w-full flex-col items-center justify-center gap-2 border-t py-5",
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
            <div className="bg-background grid w-full items-start gap-2 rounded-b-lg border-t p-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSkillDragEnd}
              >
                <SortableContext
                  items={skills.map((field) => field.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex flex-row flex-wrap gap-1">
                    {skills.map((field, index) => (
                      <SortableSkillRow
                        key={field.id}
                        value={field}
                        onRemove={() => remove(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-md border">
          <div className="flex items-center justify-between px-3 py-1">
            <div className="flex flex-row items-center gap-2">
              <TrendingUpDown className="size-4" />
              <h2 className="text-base font-semibold">Professional Traits</h2>
            </div>
            <div className="flex flex-row items-center gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={handleAddprofessionalTrait}
              >
                <Plus className="size-4" /> Add Trait
              </Button>
            </div>
          </div>
          {!professionalTraits.length ? (
            <div
              className={cn(
                "bg-background flex w-full flex-col items-center justify-center gap-2 border-t py-5",
              )}
            >
              <TrendingUpDown
                className={cn("text-muted-foreground size-8")}
                strokeWidth={1}
              />
              <p className="text-muted-foreground text-sm">
                Add your professional traits to your portfolio
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddprofessionalTrait}
              >
                <Plus className="size-4" />
                Add Trait
              </Button>
            </div>
          ) : (
            <div className="bg-background grid w-full items-start gap-2 rounded-b-lg border-t p-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleProfessionalTraitDragEnd}
              >
                <SortableContext
                  items={professionalTraits.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {professionalTraits.map((field, index) => (
                      <SortableProfessionalTraitRow
                        key={field.id}
                        value={field}
                        onRemove={() => removeProfessionalTrait(index)}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableSkillRow({
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
        "flex flex-row items-center gap-1 rounded-md border p-0 pl-1",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-6 flex-none"
        {...attributes}
        {...listeners}
        disabled={disabled}
      >
        <GripVertical className="size-4" />
      </Button>

      <div className="flex flex-row items-center gap-2">
        <Image
          src={iconPreview ?? ""}
          alt={value.name}
          width={32}
          height={32}
          className="size-5 flex-none rounded-md object-contain sm:size-6"
          onError={(e) => {
            e.currentTarget.src = "/fallback.png";
          }}
        />
        <div className="text-xs font-medium">{value.name}</div>
      </div>

      <Button type="button" variant="ghost" onClick={onRemove}>
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}

function SortableProfessionalTraitRow({
  value,
  onRemove,
  index,
  disabled = false,
}: {
  value: FieldArrayWithId<PortfolioFormValues, "professionalTraits">;
  onRemove: () => void;
  index: number;
  disabled?: boolean;
}) {
  const [, setprofessionalTraitDialogOpen] = useQueryState(
    "professionalTraitDialogOpen",
    parseAsInteger,
  );
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
            onClick={() => setprofessionalTraitDialogOpen(index)}
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
      <div className="bg-background flex items-start gap-4 rounded-b-lg border-t p-4">
        {/* Icon */}
        <div className="bg-primary text-primary-foreground mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md md:flex">
          <TrendingUpDown className="h-5 w-5" />
        </div>

        {/* Content */}
        <div>
          <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
            <div>
              <p className="text-foreground text-sm font-medium md:text-base">
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
