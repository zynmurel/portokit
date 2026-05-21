import { type Metadata } from "next";
import { api, HydrateClient } from "@/trpc/server";
import ThemeSetter from "../portfolio-designs/noir-typographic/_components/theme-setter";
import NoirTypographic from "../portfolio-designs/noir-typographic/main";
import { portfolioDesigns } from "../portfolio-designs/const";

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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await api.portfolio.getPortfolioBySlug(slug);

  if (!profile) {
    return <></>;
  }

  const DesignComponent = portfolioDesigns.find(
    (design) => design.slug === profile.design,
  );

  return (
    <HydrateClient>
      <ThemeSetter themeName={profile.theme ?? "dark"}>
        {DesignComponent ? (
          <DesignComponent.component profile={profile} />
        ) : (
          <NoirTypographic profile={profile} />
        )}
      </ThemeSetter>
    </HydrateClient>
  );
}
