"use client";

import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

function CvActions({ slug, fileName }: { slug: string; fileName: string }) {
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "1";
  const printedRef = React.useRef(false);

  const handlePrint = React.useCallback(() => {
    const previousTitle = document.title;
    document.title = fileName.replace(/\.pdf$/i, "");
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  }, [fileName]);

  React.useEffect(() => {
    if (!autoPrint || printedRef.current) return;
    printedRef.current = true;
    const t = setTimeout(() => {
      handlePrint();
    }, 350);
    return () => clearTimeout(t);
  }, [autoPrint, handlePrint]);

  return (
    <div className="bg-sidebar/85 sticky top-0 left-0 right-0 z-40 border-b backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/${slug}`}>
          <Button variant="ghost" size="sm" className="gap-2 px-0">
            <ArrowLeft className="size-4" />
            Back to portfolio
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handlePrint}>
            <Download className="size-4" />
            Download CV
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CvActions;
