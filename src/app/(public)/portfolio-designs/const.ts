import NoirTypographic from "./noir-typographic/noir-typographic";
import type {
  Portfolio,
  Experience,
  Education,
  Project,
  ProjectImages,
  Skill,
  ProfessionalTraits,
} from "generated/prisma";

type DesingSlug = "noir-typographic";

export type PortfolioWithRelations = Portfolio & {
  experiences: Experience[];
  education: Education[];
  projects: (Project & { images: ProjectImages[] })[];
  skills: Skill[];
  professionalTraits: ProfessionalTraits[];
};

export const portfolioDesigns: {
  slug: DesingSlug;
  component: React.ComponentType<{ profile: PortfolioWithRelations }>;
}[] = [
  {
    slug: "noir-typographic",
    component: NoirTypographic,
  },
];
