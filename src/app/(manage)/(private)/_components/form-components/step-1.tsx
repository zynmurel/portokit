import React from "react";
import { useFormContext } from "react-hook-form";
import type { PortfolioFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function StepOne() {
  const form = useFormContext<PortfolioFormValues>();
  return (
    <div className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
      <div className="flex flex-col gap-8 sm:flex-row md:col-span-2">
        <FormField
          control={form.control}
          name="details.image"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Portfolio Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-auto flex flex-1 flex-col gap-5">
          <FormField
            control={form.control}
            name="details.logo"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Portfolio Logo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={onChange}
                    variant="icon"
                    maxSizeMB={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details.title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Think of a title for your portfolio</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe Portfolio" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="details.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe Portfolio" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="details.role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Role</FormLabel>
            <FormControl>
              <Input placeholder="Full Stack Developer" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug/Username</FormLabel>
            <FormControl>
              <Input placeholder="Building digital products" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Cebu, PH" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john.doe@example.com" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your profile and what you do."
                className="min-h-28"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-row gap-2 md:col-span-2">
        <p className="text-sm font-semibold">Social Links</p>
      </div>
      <FormField
        control={form.control}
        name="details.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/username" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.gitlab"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitLab URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/username" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn URL (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.linkedin.com/in/username"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook URL (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.facebook.com/username"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="details.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram URL (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.instagram.com/username"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default StepOne;
