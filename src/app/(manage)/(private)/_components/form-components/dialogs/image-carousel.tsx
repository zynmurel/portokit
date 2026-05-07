import { useState } from "react";
import type { CarouselImage } from "../helper";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageCarousel({ images }: { images: CarouselImage[] }) {
    const [index, setIndex] = useState(0);
    const current = images[index];
    const total = images.length;
  
    const prev = () => setIndex((i) => (i - 1 + total) % total);
    const next = () => setIndex((i) => (i + 1) % total);
  
    return (
      <div className="flex w-full flex-col gap-3 overflow-hidden aspect-video">
        {/* Main stage */}
        <div className="bg-muted relative h-full overflow-hidden rounded-lg">
          <Image
            src={current?.src ?? ""}
            alt={current?.alt ?? ""}
            fill
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = "/fallback.png";
            }}
          />
  
          {/* Main image badge */}
          {current?.isMain && (
            <span className="absolute top-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium tracking-wider text-white uppercase">
              Main
            </span>
          )}
  
          {/* Counter */}
          <span className="absolute top-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white">
            {index + 1} / {total}
          </span>
  
          {/* Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
  
        {/* Thumbnail strip */}
        <div className=" w-full overflow-x-auto">
          {total > 1 && (
            <div className="flex w-full gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative h-14 w-16 shrink-0 overflow-hidden rounded-md border-[1.5px] transition",
                    i === index
                      ? "border-foreground"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }