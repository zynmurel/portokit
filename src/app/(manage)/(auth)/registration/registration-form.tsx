"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "./actions";
import { type RegistrationValues, registrationSchema } from "./schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PortoIcon from "@/app/_components/porto-icon";
import toast from "react-hot-toast";

export function RegistrationForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegistrationValues) {
    startTransition(async () => {
      const result = await registerUser(values);
      if (result.success) {
        toast.success(
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-muted-foreground text-sm">{result.message}</p>
          </div>,
        );
        form.reset();
      } else {
        toast.error(result.message);
      }
      if (result.success) form.reset();
    });
  }

  return (
    <div className="container mx-auto flex h-full max-w-lg items-center px-4">
      <Card className="w-full overflow-hidden rounded-2xl border shadow-sm">
        <CardHeader className="border-b px-8 pt-2 pb-5">
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Register first, then build and edit your portfolio.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pt-2 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs font-medium">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Dela Cruz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs font-medium">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password row — side by side */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min. 8 characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-medium">
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-muted-foreground text-[11px] leading-snug">
                Use at least 8 characters. Your password is only used to secure
                this account.
              </p>

              <hr className="border-border" />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account…" : "Create account"}
              </Button>

              <p className="text-muted-foreground text-center text-xs">
                Already have an account?{" "}
                <a href="/login" className="hover:text-foreground underline">
                  Sign in
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
