import { api, HydrateClient } from "@/trpc/server";
import ThemeSetter from "../portfolio-designs/noir-typographic/_components/theme-setter";
import NoirTypographic from "../portfolio-designs/noir-typographic/main";
import { portfolioDesigns } from "../portfolio-designs/const";

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
      <ThemeSetter themeName={profile.theme ?? "default"}>
        {DesignComponent ? (
          <DesignComponent.component profile={profile} />
        ) : (
          <NoirTypographic profile={profile} />
        )}
      </ThemeSetter>
    </HydrateClient>
  );
}
