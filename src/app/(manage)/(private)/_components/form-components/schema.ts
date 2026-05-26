import { ProjectType, SkillCategory } from "generated/prisma";
import z from "zod";

export const skillCategoryOptions = [
  { value: SkillCategory.FRONTEND, label: "Frontend" },
  { value: SkillCategory.BACKEND, label: "Backend" },
  { value: SkillCategory.DATABASE, label: "Database" },
  { value: SkillCategory.FULLSTACK, label: "Fullstack" },
  { value: SkillCategory.DEVOPS, label: "DevOps/Tools" },
  { value: SkillCategory.DESIGN, label: "Design" },
  { value: SkillCategory.OTHER, label: "Other" },
] as const;

export const detailsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(20, "Summary should be at least 20 characters"),
  aboutme: z.string().optional().or(z.literal("")),
  role: z.string().min(2, "Primary role is required"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().optional().or(z.literal("")),
  github: z.string().url("Use a valid URL").optional().or(z.literal("")),
  gitlab: z.string().url("Use a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Use a valid URL").optional().or(z.literal("")),
  facebook: z.string().url("Use a valid URL").optional().or(z.literal("")),
  instagram: z.string().url("Use a valid URL").optional().or(z.literal("")),
  image: z.any().optional(),
  logo: z.any().optional(),
});

export const educationSchema = z.object({
  school: z.string().min(2, "School is required"),
  degree: z.string().min(2, "Degree is required"),
  field: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export const experienceSchema = z.object({
  company: z.string().min(2, "Company is required"),
  position: z.string().min(2, "Position is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().min(2, "Description is required"),
  tools: z.string().optional(),
  isCurrent : z.boolean()
});

export const skillSchema = z.object({
  icon: z.any().optional(),
  name: z.string().min(1, "Skill name is required"),
  category: z.nativeEnum(SkillCategory),
});

export const professionalTraitSchema = z.object({
  name: z.string().min(1, "Trait name is required"),
  description: z.string().min(1, "Trait description is required"),
});

export const projectSchema = z.object({
  type: z.nativeEnum(ProjectType).default(ProjectType.PERSONAL).optional(),
  mainImage: z.any().optional(),
  title: z.string().min(2, "Project title is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  github: z.string().url("Use a valid URL").optional().or(z.literal("")),
  url: z.string().url("Use a valid URL").optional().or(z.literal("")),
  developedAt: z.date().optional(),
  images: z.array(z.any()).optional(),
  tools: z.string().optional(),
});

export const portfolioSchema = z.object({
  details: detailsSchema,
  education: z
    .array(educationSchema)
    .min(1, "Add at least one education entry"),
  experience: z
    .array(experienceSchema)
    .min(1, "Add at least one experience entry"),
  skills: z.array(skillSchema),
  professionalTraits: z.array(professionalTraitSchema),
  projects: z.array(projectSchema).min(1, "Add at least one project"),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export type DetailsSchema = z.infer<typeof detailsSchema>;
export type EducationSchema = z.infer<typeof educationSchema>;
export type ExperienceSchema = z.infer<typeof experienceSchema>;
export type SkillSchema = z.infer<typeof skillSchema>;
export type ProfessionalTraitSchema = z.infer<typeof professionalTraitSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
