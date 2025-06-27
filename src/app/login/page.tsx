
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";
import Link from "next/link";

export default function SchoolLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
              <School className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-3xl">CampusConnect</CardTitle>
            <CardDescription>Welcome! Please login to your respective portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="e.g., (123) 456-7890" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2 pt-2">
                <Button asChild type="submit" className="w-full font-bold">
                  <Link href="/dashboard">Admin / Staff Login</Link>
                </Button>
                 <Button asChild variant="outline" className="w-full">
                  <Link href="/student/dashboard">Student Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/portal/dashboard">Parent Portal Login</Link>
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link href="#" className="text-accent hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
