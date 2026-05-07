import { BriefcaseIcon } from "lucide-react";
import React from "react";

function PortoIcon() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
        <BriefcaseIcon className="size-4" strokeWidth={2} />
      </div>
      <p className="text-lg font-bold">PortoKit</p>
    </div>
  );
}

export default PortoIcon;
