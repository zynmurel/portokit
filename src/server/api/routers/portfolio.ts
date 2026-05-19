import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  detailsSchema,
  educationSchema,
  experienceSchema,
  portfolioSchema,
  professionalTraitSchema,
  projectSchema,
  skillSchema,
} from "@/app/(manage)/(private)/_components/form-components/schema";
import { TRPCError } from "@trpc/server";
import { getClientIp, rateLimit } from "@/server/rate-limit";
import { z } from "zod";

const splitCsv = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const portfolioRouter = createTRPCRouter({
  create: protectedProcedure
    .input(portfolioSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.portfolio.create({
        data: {
          userId: ctx.session.user.id,
          title: input.details.title,
          role: input.details.role,
          name: input.details.name,
          description: input.details.description,
          slug: input.details.slug,
          image:
            typeof input.details.image === "string" ? input.details.image : "",
          logo:
            typeof input.details.logo === "string" ? input.details.logo : "",
          location: input.details.location,
          email: input.details.email,
          phoneNumber: input.details.phoneNumber || null,
          github: input.details.github || null,
          gitlab: input.details.gitlab || null,
          linkedin: input.details.linkedin || null,
          facebook: input.details.facebook || null,
          instagram: input.details.instagram || null,
          education: {
            create: input.education.map((item) => ({
              school: item.school,
              degree: item.degree,
              field: item.field,
              startDate: item.startDate,
              endDate: item.endDate,
            })),
          },
          experiences: {
            create: input.experience.map((item) => ({
              company: item.company,
              position: item.position,
              startDate: item.startDate,
              endDate: item.endDate,
              tools: splitCsv(item.tools),
              description: item.description
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })),
          },
          skills: {
            create: input.skills.map((item, index) => ({
              name: item.name,
              icon: typeof item.icon === "string" ? item.icon : null,
              order: index,
            })),
          },
          professionalTraits: {
            create: input.professionalTraits.map((item, index) => ({
              name: item.name,
              description: item.description,
              order: index,
            })),
          },
          projects: {
            create: input.projects.map((project) => ({
              title: project.title,
              description: project.description,
              github: project.github || null,
              url: project.url || null,
              developedAt: project.developedAt || new Date(),
              tools: splitCsv(project.tools),
              type: project.type || "PERSONAL",
              mainImage:
                typeof project.mainImage === "string"
                  ? project.mainImage
                  : null,
              images: {
                create: (project.images ?? [])
                  .filter((image): image is string => typeof image === "string")
                  .map((imageUrl, index) => ({
                    image: imageUrl,
                    order: index,
                  })),
              },
            })),
          },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.portfolio.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getPortfolioBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.portfolio.findUnique({
        where: {
          slug: input,
        },
        include: {
          experiences: true,
          education: true,
          projects: {
            where: {
              isInPortfolio: true,
            },
            include: {
              images: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          skills: true,
          professionalTraits: true,
        },
      });
    }),
  getCvBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.portfolio.findUnique({
        where: {
          slug: input,
        },
        include: {
          experiences: true,
          education: true,
          projects: {
            where: {
              isInCV: true,
            },
            include: {
              images: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          skills: true,
          professionalTraits: true,
        },
      });
    }),
  getBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.portfolio.findUnique({
        where: {
          slug: input,
        },
      });
    }),
  getEducationBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.education.findMany({
        where: {
          portfolio: { slug: input },
        },
      });
    }),

  getExperiencesBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.experience.findMany({
        where: {
          portfolio: {
            slug: input,
          },
        },
      });
    }),

  getSkillsBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.skill.findMany({
        where: { portfolio: { slug: input } },
        orderBy: { order: "asc" },
      });
    }),
  getProfessionalTraitsBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.professionalTraits.findMany({
        where: { portfolio: { slug: input } },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        data: detailsSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.portfolio.update({
        where: { slug: input.slug },
        data: { ...input.data },
      });
    }),
  upsertEducation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
        data: educationSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.education.upsert({
        where: { id: input.id },
        update: input.data,
        create: {
          ...input.data,
          portfolioId: input.portfolioId,
        },
      });
    }),
  upsertExperience: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
        data: experienceSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.upsert({
        where: { id: input.id },
        update: {
          ...input.data,
          tools: splitCsv(input.data.tools),
          description: input.data.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        },
        create: {
          ...input.data,
          tools: splitCsv(input.data.tools),
          description: input.data.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          portfolioId: input.portfolioId,
        },
      });
    }),
  deleteEducation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.education.delete({
        where: { id: input.id, portfolioId: input.portfolioId },
      });
    }),
  deleteExperience: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.delete({
        where: { id: input.id, portfolioId: input.portfolioId },
      });
    }),
  upsertSkill: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
        data: skillSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const skill = await ctx.db.skill.findFirst({
        orderBy: { order: "desc" },
      });

      return ctx.db.skill.upsert({
        where: { id: input.id },
        update: input.data,
        create: {
          ...input.data,
          portfolioId: input.portfolioId,
          order: (skill?.order || 0) + 1,
        },
      });
    }),
  deleteSkill: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.skill.delete({
        where: { id: input.id, portfolioId: input.portfolioId },
      });
    }),

  switchSkillOrder: protectedProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        idOne: z.string(),
        idTwo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const skillOne = await ctx.db.skill.findUnique({
        where: { id: input.idOne, portfolioId: input.portfolioId },
      });
      const skillTwo = await ctx.db.skill.findUnique({
        where: { id: input.idTwo, portfolioId: input.portfolioId },
      });
      if (!skillOne || !skillTwo) {
        throw new Error("Skill not found");
      }
      return ctx.db.$transaction(async (tx) => {
        await Promise.all([
          tx.skill.update({
            where: { id: input.idOne, portfolioId: input.portfolioId },
            data: { order: skillTwo.order },
          }),
          tx.skill.update({
            where: { id: input.idTwo, portfolioId: input.portfolioId },
            data: { order: skillOne.order },
          }),
        ]);
      });
    }),
  upsertProfessionalTrait: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
        data: professionalTraitSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const professionalTrait = await ctx.db.professionalTraits.findFirst({
        orderBy: { order: "desc" },
      });
      return ctx.db.professionalTraits.upsert({
        where: { id: input.id },
        update: {
          ...input.data,
        },
        create: {
          ...input.data,
          portfolioId: input.portfolioId,
          order: (professionalTrait?.order || 0) + 1,
        },
      });
    }),
  deleteProfessionalTrait: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.professionalTraits.delete({
        where: { id: input.id, portfolioId: input.portfolioId },
      });
    }),
  switchProfessionalTraitOrder: protectedProcedure
    .input(
      z.object({
        portfolioId: z.string(),
        idOne: z.string(),
        idTwo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const professionalTraitOne = await ctx.db.professionalTraits.findUnique({
        where: { id: input.idOne, portfolioId: input.portfolioId },
      });
      const professionalTraitTwo = await ctx.db.professionalTraits.findUnique({
        where: { id: input.idTwo, portfolioId: input.portfolioId },
      });
      if (!professionalTraitOne || !professionalTraitTwo) {
        throw new Error("Professional trait not found");
      }
      return ctx.db.$transaction(async (tx) => {
        await Promise.all([
          tx.professionalTraits.update({
            where: { id: input.idOne, portfolioId: input.portfolioId },
            data: { order: professionalTraitTwo.order },
          }),
          tx.professionalTraits.update({
            where: { id: input.idTwo, portfolioId: input.portfolioId },
            data: { order: professionalTraitOne.order },
          }),
        ]);
      });
    }),

  getProjectsBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: {
          portfolio: {
            slug: input,
          },
        },
        orderBy: { order: "asc" },
        include: {
          images: true,
        },
      });
    }),
  upsertProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
        data: projectSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.upsert({
        where: { id: input.id === "create" ? "" : input.id },
        update: {
          title: input.data.title,
          description: input.data.description,
          github: input.data.github || null,
          url: input.data.url || null,
          developedAt: input.data.developedAt,
          tools: splitCsv(input.data.tools),
          type: input.data.type || "PERSONAL",
          mainImage:
            typeof input.data.mainImage === "string"
              ? input.data.mainImage
              : null,
          images: {
            create: (input.data.images ?? [])
              .filter((image): image is string => typeof image === "string")
              .map((imageUrl) => ({
                image: imageUrl as string,
              })),
          },
        },
        create: {
          title: input.data.title,
          description: input.data.description,
          github: input.data.github || null,
          url: input.data.url || null,
          developedAt: input.data.developedAt || new Date(),
          tools: splitCsv(input.data.tools),
          mainImage:
            typeof input.data.mainImage === "string"
              ? input.data.mainImage
              : null,
          images: {
            create: (input.data.images ?? [])
              .filter((image): image is string => typeof image === "string")
              .map((imageUrl, index) => ({
                image: imageUrl as string,
                order: index,
              })),
          },
          portfolioId: input.portfolioId,
        },
      });
    }),
  deleteProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({
        where: { id: input.id, portfolioId: input.portfolioId },
      });
    }),
  deleteProjectImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectImages.deleteMany({
        where: { id: input.id },
      });
    }),

  messageMe: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        message: z.string(),
        portfolioId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ip = getClientIp(ctx.headers);
      const { success, resetAt } = rateLimit(
        `message:${ip}:${input.portfolioId}`,
        3,
        60 * 60 * 1000,
      );
      if (!success) {
        const seconds = Math.ceil((resetAt - Date.now()) / 1000);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Too many messages. Try again in ${seconds}s.`,
        });
      }

      return ctx.db.portfolioReachOut.create({
        data: input,
      });
    }),
});
