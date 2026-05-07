import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}

export default PublicLayout;
