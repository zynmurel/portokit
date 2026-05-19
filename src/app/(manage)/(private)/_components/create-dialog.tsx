"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, type FieldPath } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import AlertFormClose from "./alert-form-close";
import {
  portfolioSchema,
  type PortfolioFormValues,
} from "./form-components/schema";
import StepOne from "./form-components/step-1";
import StepTwo from "./form-components/step-2";
import EducationDialog from "./form-components/dialogs/education";
import StepThree from "./form-components/step-3";
import ExperienceDialog from "./form-components/dialogs/experience";
import SkillDialog from "./form-components/dialogs/skill";
import StepFour from "./form-components/step-4";
import ProfessionalTraitDialog from "./form-components/dialogs/traits";
import StepFive from "./form-components/step-5";
import ProjectDialog from "./form-components/dialogs/project";
import { uploadImage } from "@/lib/api/upload-image";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StepSix from "./form-components/step-6";

const steps = [
  "Portfolio Details",
  "Education",
  "Experience",
  "Skills & Traits",
  "Projects",
  "Review",
] as const;

const stepFieldMap: FieldPath<PortfolioFormValues>[][] = [
  [
    "details.logo",
    "details.title",
    "details.name",
    "details.slug",
    "details.description",
    "details.role",
    "details.location",
    "details.email",
    "details.phoneNumber",
    "details.github",
    "details.gitlab",
    "details.linkedin",
    "details.facebook",
    "details.instagram",
    "details.image",
  ],
  ["education"],
  ["experience"],
  ["skills"],
  ["professionalTraits"],
  ["projects"],
  [],
];

const defaultValues = {
  details: {
    name: "",
    title: "",
    slug: "",
    summary:"",
    role: "",
    location: "",
    profileImage: null,
    logo: null,
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
};

const getFileFromUnknown = (value: unknown): File | null => {
  if (value instanceof File) return value;
  if (
    value &&
    typeof value === "object" &&
    "file" in value &&
    value.file instanceof File
  ) {
    return value.file;
  }
  return null;
};

function CreatePortfolioDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alertFormCloseOpen, setAlertFormCloseOpen] = useState(false);
  const createPortfolio = api.portfolio.create.useMutation({
    onSuccess: (data) => {
      onOpenChange(false);
      form.reset();
      setStep(0);
      toast.success("Portfolio created successfully");
      router.push(`/portfolio/${data.slug}`);
    },
    onError: (error) => {
      if (error.message.includes("Unique constraint failed on the fields")) {
        toast.error("Portfolio with this slug already exists");
      } else {
        toast.error(error.message || "Create portfolio failed");
      }
      console.error("Create portfolio failed", error);
    },
  });
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues,
  });

  const {
    fields: educationFields,
    append: appendEducation,
    update: updateEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
    update: updateExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    move: moveSkill,
    update: updateSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: professionalTraitFields,
    append: appendProfessionalTrait,
    remove: removeProfessionalTrait,
    move: moveProfessionalTrait,
    update: updateProfessionalTrait,
  } = useFieldArray({
    control: form.control,
    name: "professionalTraits",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
    update: updateProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const nextStep = async () => {
    const isValid = await form.trigger(stepFieldMap[step] ?? []);
    if (!isValid) return;
    setStep((prev) => {
      console.log(Math.min(prev + 1, steps.length - 1));
      return Math.min(prev + 1, steps.length - 1);
    });
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: PortfolioFormValues) => {
    try {
      setIsLoading(true);
      const uploadIfFile = async (value: unknown, folder: string) => {
        const file = getFileFromUnknown(value);
        if (!file) return value;
        const uploaded = await uploadImage({ file, folder });
        return uploaded.publicUrl;
      };

      const profileImage = await uploadIfFile(
        values.details.image,
        "portfolio/profile",
      );
      const logo = await uploadIfFile(values.details.logo, "portfolio/logo");

      const skills = await Promise.all(
        values.skills.map(async (skill) => ({
          ...skill,
          icon: await uploadIfFile(skill.icon, "portfolio/skills"),
        })),
      );

      const projects = await Promise.all(
        values.projects.map(async (project) => {
          const mainImage = await uploadIfFile(
            project.mainImage,
            "portfolio/projects/main",
          );

          const images = await Promise.all(
            (project.images ?? []).map((image) =>
              uploadIfFile(image, "portfolio/projects/images"),
            ),
          );

          return {
            ...project,
            mainImage,
            images,
          };
        }),
      );

      await createPortfolio.mutateAsync({
        ...values,
        details: {
          ...values.details,
          image : profileImage,
          logo,
        },
        skills,
        projects,
      });

      onOpenChange(false);
      form.reset();
      setStep(0);
    } catch (error) {
      console.error("Create portfolio failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reviewValues = form.watch();

  const handleAlertFormCloseOpenChange = (e: boolean) => {
    if (form.formState.isDirty && !e) {
      setAlertFormCloseOpen(true);
      return;
    }
    onOpenChange(e);
    if (!e) {
      setStep(0);
      form.reset();
    }
  };

  const handleFormOpenChange = (e: boolean) => {
    onOpenChange(e);
    if (!e) {
      setStep(0);
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleAlertFormCloseOpenChange}>
      <DialogContent className="min-w-[98%] sm:min-w-[95%] lg:min-w-4xl">
        <AlertFormClose
          open={alertFormCloseOpen}
          onOpenChange={setAlertFormCloseOpen}
          setFormOpen={handleFormOpenChange}
        />
        <DialogHeader className="gap-1">
          <DialogTitle className="text-lg font-bold md:text-xl lg:text-2xl">
            Create Portfolio
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs md:text-sm">
            Create a new portfolio to showcase your work and projects.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 sm:gap-10">
          <EducationDialog
            append={appendEducation}
            update={updateEducation}
            educations={educationFields}
          />
          <ExperienceDialog
            append={appendExperience}
            update={updateExperience}
            experiences={experienceFields}
          />
          <SkillDialog
            append={appendSkill}
            update={updateSkill}
            skills={skillFields}
          />
          <ProfessionalTraitDialog
            append={appendProfessionalTrait}
            update={updateProfessionalTrait}
            professionalTraits={professionalTraitFields}
          />
          <ProjectDialog
            append={appendProject}
            update={updateProject}
            projects={projectFields}
          />
          <div>
            <div className="flex w-full items-center justify-center">
              <div className="flex min-w-max items-center gap-1 px-1 sm:gap-2 md:justify-between">
                {steps.map((stepLabel, index) => {
                  const isActive = index === step;
                  const isDone = index < step;

                  return (
                    <div
                      key={stepLabel}
                      className="flex flex-1 items-center gap-1 sm:gap-2"
                    >
                      {/* Circle */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition lg:h-10 lg:w-10 lg:text-sm",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "scale-100 sm:scale-100",
                            isDone &&
                              "border-emerald-500 bg-emerald-500 text-white",
                            !isActive &&
                              !isDone &&
                              "border-muted bg-background text-muted-foreground",
                          )}
                        >
                          {isDone ? "✓" : index + 1}
                        </div>

                        {/* Label (hidden on mobile) */}
                        <p
                          className={cn(
                            "absolute top-10 mt-2 hidden text-center text-[10px] text-nowrap sm:inline md:text-xs",
                            isActive && "text-primary font-medium",
                            isDone && "text-emerald-600",
                            !isActive && !isDone && "text-muted-foreground/80",
                          )}
                        >
                          {stepLabel}
                        </p>
                      </div>

                      {/* Line */}
                      {index !== steps.length - 1 && (
                        <div
                          className={cn(
                            "h-px w-full min-w-3 flex-1 sm:h-[2px] sm:min-w-10 xl:min-w-16",
                            isDone ? "bg-emerald-500" : "bg-muted",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-primary mt-5 text-base font-semibold sm:hidden">
              {steps[step]}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 overflow-hidden"
            >
              <div className="max-h-[50svh] w-full space-y-4 overflow-hidden overflow-y-auto">
                {step === 0 && <StepOne />}

                {step === 1 && (
                  <StepTwo
                    educations={educationFields}
                    remove={removeEducation}
                  />
                )}

                {step === 2 && (
                  <StepThree
                    experiences={experienceFields}
                    remove={removeExperience}
                  />
                )}

                {step === 3 && (
                  <StepFour
                    skills={skillFields}
                    remove={removeSkill}
                    move={moveSkill}
                    professionalTraits={professionalTraitFields}
                    removeProfessionalTrait={removeProfessionalTrait}
                    moveProfessionalTrait={moveProfessionalTrait}
                  />
                )}

                {step === 4 && (
                  <StepFive projects={projectFields} remove={removeProject} />
                )}

                {step === 5 && (
                  <StepSix reviewValues={reviewValues} />
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  key="previous"
                  type="button"
                  className="min-w-[100px]"
                  variant="outline"
                  onClick={previousStep}
                  disabled={step === 0}
                >
                  Previous
                </Button>

                {step < steps.length - 1 ? (
                  <Button
                    key="next"
                    type="button"
                    className="min-w-[100px]"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    key="submit"
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={createPortfolio.isPending || isLoading}
                  >
                    {createPortfolio.isPending || isLoading
                      ? "Creating..."
                      : "Confirm & Create"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePortfolioDialog;
