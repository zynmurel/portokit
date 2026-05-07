import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function StepOneLoader() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-start gap-4 border-b p-5">
        <Skeleton className="h-18 w-18 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <div className="border-b p-5">
        <Skeleton className="mb-3 h-3 w-16" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="col-span-2 h-14 w-full" />
        </div>
      </div>

      <div className="border-b p-5">
        <Skeleton className="mb-3 h-3 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </div>

      <div className="p-5">
        <Skeleton className="mb-3 h-3 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

export function StepTwoLoader() {
  return (
    <div className="overflow-hidden rounded-lg">
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-md border">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2">
              <Skeleton className="h-5 w-28" />

              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            </div>

            {/* Content */}
            <div className="bg-background flex items-center gap-4 rounded-b-lg border-t p-4">
              {/* Icon */}
              <Skeleton className="hidden h-10 w-10 rounded-md md:flex" />

              {/* Text Content */}
              <div className="flex flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-56" />
                </div>

                {/* Date */}
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for the skills drag row (chips: grip, icon, label, action). */
export function StepFourSkillsLoader() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-row items-center gap-1 rounded-md border p-0 pl-1 pr-2 h-14"
        >
          <Skeleton className="size-6 flex-none rounded-md" />
          <div className="flex flex-row items-center gap-2 py-1 pr-1 flex-1">
            <Skeleton className="size-5 flex-none rounded-md sm:size-6" />
            <Skeleton className="h-3 w-14 sm:w-20" />
          </div>
          <Skeleton className="size-8 flex-none rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function StepFourProfessionalTraitsLoader() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-md border">
          {/* Header */}
          <div className="flex items-center justify-between py-2 pr-3 pl-2">
            <div className="flex items-center gap-2">
              {/* Drag Handle */}
              <Skeleton className="size-6 rounded-md" />

              {/* Title */}
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>

          {/* Content */}
          <div className="bg-background flex items-start gap-4 rounded-b-lg border-t p-2 px-3 md:p-3 md:px-4">
            {/* Icon */}
            <Skeleton className="mt-0.5 hidden h-10 w-10 rounded-md md:flex" />

            {/* Text Content */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full max-w-md" />
              <Skeleton className="h-3 w-5/6 max-w-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
