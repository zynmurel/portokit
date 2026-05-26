import React from "react";
import { type Metadata } from "next";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await api.portfolio.getPortfolioBySlug(slug);

  if (!profile) {
    return { title: "Portfolio not found" };
  }

  const description = profile.description ?? profile.role;

  return {
    title: profile.name,
    description: description ?? "Portfolio",
    openGraph: {
      title: profile.name,
      description: description ?? "Portfolio",
      images: profile.image ? [{ url: profile.image }] : undefined,
    },
    icons: {
      icon: profile.logo ? [{ url: profile.logo }] : undefined,
    },
  };
}
function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
