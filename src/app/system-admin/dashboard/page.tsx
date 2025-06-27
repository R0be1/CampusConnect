
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users } from "lucide-react";

export default function SystemAdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">System Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Currently onboarded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,239</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
