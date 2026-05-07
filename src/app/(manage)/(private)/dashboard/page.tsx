import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preview (Manage)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Change theme in <code>/pri-theme</code> and come back here. This
            page now uses semantic color tokens so theme changes are clearly
            visible.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Badge>Badge</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-muted text-muted-foreground rounded-md border p-4">
              Muted surface
            </div>
            <div className="bg-sidebar text-sidebar-foreground border-sidebar-border rounded-md border p-4">
              Sidebar surface
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
