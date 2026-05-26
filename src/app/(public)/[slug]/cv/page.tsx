import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import CvDocument from "./_components/cv-document";

export const metadata = {
  title: "CV",
};

export default async function CvPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await api.portfolio.getCvBySlug(slug);

  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen print:bg-white">
      <div className="mx-auto flex max-w-5xl justify-center px-4 py-8 print:p-0">
        <CvDocument profile={profile} projects={profile.projects} />
      </div>
    </div>
  );
}
