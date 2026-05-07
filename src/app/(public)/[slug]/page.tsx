import { api, HydrateClient } from "@/trpc/server";
import ThemeSetter from "./_components/theme-setter";
import PageHeader from "./_components/page-header";
import PageHome from "./_components/page-home";
import PageSkills from "./_components/page-skills";
import PageExperience from "./_components/page-experience";
import PageProjects from "./_components/page-projects";
import PageContact from "./_components/page-contact";
import PageFooter from "./_components/page-footer";

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

  return (
    <HydrateClient>
      <ThemeSetter themeName={profile.theme ?? "default"}>
        <main className="bg-background relative min-h-screen">
          <div className="from-primary/5 fixed top-0 right-0 bottom-0 left-0 z-0 bg-linear-to-br from-0% via-transparent via-15% to-transparent to-100%" />
          <div className="from-primary/5 fixed top-0 right-0 bottom-0 left-0 z-0 bg-linear-to-tl from-0% via-transparent via-15% to-transparent to-100%" />
          <div className="relative z-10 flex min-h-screen flex-col gap-8 overflow-y-auto xl:gap-10">
            <PageHeader profile={profile} />
            <PageHome profile={profile} />
            <PageSkills profile={profile} />
            <PageExperience profile={profile} />
            <PageProjects profile={profile} />
            <PageContact profile={profile} />
            <PageFooter profile={profile} />
          </div>
        </main>
      </ThemeSetter>
    </HydrateClient>
  );
}
