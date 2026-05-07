import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <>{children}</>;
}

export default PrivateLayout;
