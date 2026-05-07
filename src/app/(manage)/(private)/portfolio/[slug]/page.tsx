"use client";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import StepOne from "./_components/step-1";
import StepTwo from "./_components/step-2";
import StepThree from "./_components/step-3";
import StepFour from "./_components/step-4";
import { parseAsString, useQueryState } from "nuqs";
import StepFive from "./_components/step-5";

const tabs = [
  "Portfolio Details",
  "Education",
  "Experience",
  "Skills & Traits",
  "Projects",
] as const;

function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useQueryState("activeTab", parseAsString.withDefault("Portfolio Details"));
  const { data: portfolio, isLoading } = api.portfolio.getBySlug.useQuery(slug);

  return (
    <div className="flex w-full flex-col gap-5 overflow-hidden p-5 max-w-[1300px] mx-auto">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold"> Manage Portfolio</p>
        <p className="text-muted-foreground text-sm">
          Manage your portfolio and keep it up to date
        </p>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={cn(
                  "rounded-md px-4 py-2",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer",
                )}
                onClick={() => setActiveTab(tab)}
              >
                <p className="text-xs font-medium text-nowrap sm:text-sm">
                  {tab}
                </p>
              </div>
            ))}
          </div>
          {activeTab === "Portfolio Details" && (
            <StepOne portfolio={portfolio} isLoading={isLoading} />
          )}
          {activeTab === "Education" && (
            <StepTwo portfolioId={portfolio?.id || ""} />
          )}
          {activeTab === "Experience" && (
            <StepThree portfolioId={portfolio?.id || ""} />
          )}
          {activeTab === "Skills & Traits" && (
            <StepFour portfolioId={portfolio?.id || ""} />
          )}
            {activeTab === "Projects" && (
              <StepFive portfolioId={portfolio?.id || ""} />
            )}
        </div>
      </div>
    </div>
  );
}

export default Page;
