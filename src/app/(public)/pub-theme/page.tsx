"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";

export default function ThemePage() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen space-y-10 p-10">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">ShadCN UI Showcase</h1>
        <p className="text-muted-foreground">
          Current Theme:{" "}
          {mounted
            ? `${theme ?? "system"} (resolved: ${resolvedTheme ?? "system"})`
            : "loading..."}
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="flex flex-col items-center gap-6">
        {/* System Themes */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => setTheme("light")}>
            Light
          </Button>

          <Button variant="outline" onClick={() => setTheme("dark")}>
            Dark
          </Button>
        </div>

        {/* Mint / Green */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-emerald-500 text-white hover:bg-emerald-600"
            onClick={() => setTheme("neo-mint")}
          >
            Neo Mint
          </Button>

          <Button
            className="bg-emerald-900 text-white hover:bg-emerald-800"
            onClick={() => setTheme("neo-mint-dark")}
          >
            Neo Mint Dark
          </Button>
        </div>

        {/* Slate / Blue */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setTheme("minimal-slate")}
          >
            Minimal Slate
          </Button>

          <Button
            className="bg-blue-900 text-white hover:bg-blue-800"
            onClick={() => setTheme("minimal-slate-dark")}
          >
            Minimal Slate Dark
          </Button>
        </div>

        {/* Amber / Warm */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            onClick={() => setTheme("graphite-amber")}
          >
            Graphite Amber
          </Button>

          <Button
            className="bg-amber-900 text-white hover:bg-amber-800"
            onClick={() => setTheme("graphite-amber-dark")}
          >
            Graphite Amber Dark
          </Button>
        </div>

        {/* Sunset / Orange */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => setTheme("sunset-minimal")}
          >
            Sunset Minimal
          </Button>

          <Button
            className="bg-orange-900 text-white hover:bg-orange-800"
            onClick={() => setTheme("sunset-minimal-dark")}
          >
            Sunset Minimal Dark
          </Button>
        </div>

        {/* Pink */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-pink-500 text-white hover:bg-pink-600"
            onClick={() => setTheme("pinky")}
          >
            Pinky
          </Button>

          <Button
            className="bg-pink-900 text-white hover:bg-pink-800"
            onClick={() => setTheme("pinky-dark")}
          >
            Pinky Dark
          </Button>
        </div>

        {/* Indigo */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-indigo-500 text-white hover:bg-indigo-600"
            onClick={() => setTheme("indigo-aurora")}
          >
            Indigo Aurora
          </Button>

          <Button
            className="bg-indigo-900 text-white hover:bg-indigo-800"
            onClick={() => setTheme("indigo-aurora-dark")}
          >
            Indigo Aurora Dark
          </Button>
        </div>

        {/* Gray Minimal */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => setTheme("gray-minimal")}
          >
            Gray Minimal
          </Button>

          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => setTheme("gray-minimal-dark")}
          >
            Gray Minimal Dark
          </Button>
        </div>
      </div>

      <Separator />

      {/* Grid Showcase */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card */}
        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold">Card Component</h2>
          <p className="text-muted-foreground">
            This is a shadcn card example with badge + avatar.
          </p>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>

            <Badge>Developer</Badge>
          </div>
        </Card>

        {/* Form */}
        <Card className="space-y-4 p-5">
          <h2 className="text-lg font-semibold">Form Components</h2>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea placeholder="Write something..." />
          </div>

          <Button
            onClick={() => toast.success("Form submitted!")}
            className="w-full"
          >
            Submit
          </Button>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-5">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <p className="text-muted-foreground mt-3">
              This is the preview tab content.
            </p>
          </TabsContent>

          <TabsContent value="code">
            <pre className="bg-muted mt-3 overflow-auto rounded-md p-3 text-xs">
              {`<Button>Example</Button>`}
            </pre>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog + Sheet + Dropdown */}
      <div className="flex flex-wrap justify-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Example</DialogTitle>
            </DialogHeader>
            <p>This is a shadcn dialog component.</p>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Sheet</Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Example</SheetTitle>
            </SheetHeader>
            <p className="mt-4">This is a slide-over panel.</p>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Dropdown</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toast("Profile clicked")}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => toast("Settings clicked")}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
