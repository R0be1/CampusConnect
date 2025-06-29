
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function SystemAdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Image src="https://play-lh.googleusercontent.com/bXqMt9ROsGd0H9vPhib5hG-0NB-EJcAwZy6UUDhvlP-ykE595IMQtzr14R6IRWtJiGTh" width={64} height={64} alt="CampusConnect Logo" className="rounded-full" />
            </div>
            <CardTitle className="font-headline text-3xl">System Administration</CardTitle>
            <CardDescription>Please login to manage the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Admin Phone Number</Label>
                <Input id="phone" type="tel" placeholder="e.g., (123) 456-7890" required />
              </div>
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2 pt-2">
                <Button asChild type="submit" className="w-full font-bold">
                  <Link href="/system-admin/dashboard">SysAdmin Login</Link>
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <Link href="/" className="text-accent hover:underline">
                Are you a Staff, Student, or Parent? Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
