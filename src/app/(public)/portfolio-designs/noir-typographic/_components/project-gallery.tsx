"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);

  const total = images.length;
  const hasMultiple = total > 1;
  const cover = images[0] ?? null;

  const goPrev = React.useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = React.useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, goPrev, goNext]);

  React.useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  if (!cover) {
    return (
      <div className="border-foreground/20 group-hover:border-background/30 bg-muted/40 relative aspect-16/10 w-full overflow-hidden border transition-colors duration-300">
        <div className="text-foreground/30 group-hover:text-background/40 flex size-full items-center justify-center font-mono text-xs tracking-[0.3em] uppercase">
          No preview
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${title} gallery`}
        className="border-foreground/20 group-hover:border-background/30 bg-muted/40 relative aspect-16/10 w-full cursor-pointer overflow-hidden border transition-colors duration-300"
      >
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 720px, (min-width: 640px) 60vw, 100vw"
        />

        <span className="border-foreground/40 group-hover:border-background/40 bg-background/80 group-hover:bg-foreground/90 group-hover:text-background absolute top-3 right-3 inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] tracking-[0.3em] uppercase backdrop-blur-sm transition-colors">
          <Maximize2 className="size-3" />
          {hasMultiple ? `${pad(total)} images` : "Preview"}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="bg-background gap-0 overflow-hidden p-0 sm:max-w-[min(1200px,calc(100%-2rem))]"
        >
          <DialogTitle className="border-foreground/20 border-b px-4 py-3 pr-12 font-mono text-xs tracking-[0.3em] uppercase">
            {title}
          </DialogTitle>

          <div className="bg-muted/40 relative aspect-16/10 w-full overflow-hidden">
            <Image
              key={images[active] ?? cover}
              src={images[active] ?? cover}
              alt={`${title} preview ${active + 1}`}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 1200px, 100vw"
              priority
            />

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="border-foreground/40 hover:border-foreground bg-background/80 hover:bg-foreground hover:text-background absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer border p-2 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="border-foreground/40 hover:border-foreground bg-background/80 hover:bg-foreground hover:text-background absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border p-2 backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            ) : null}
          </div>

          <div className="text-foreground/60 flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.3em] uppercase">
            <span className="truncate">{title}</span>
            <span className="shrink-0">
              {pad(active + 1)} / {pad(total)}
            </span>
          </div>

          {hasMultiple ? (
            <div className="border-foreground/20 flex gap-2 overflow-x-auto border-t p-3">
              {images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={cn(
                    "border-foreground/20 relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden border transition-colors",
                    idx === active
                      ? "border-foreground"
                      : "hover:border-foreground/60",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
