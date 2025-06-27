
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Book, Users, CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const features = [
    {
      title: "Manage Courses",
      description: "Add, edit, or remove courses and assign them to classes.",
      href: "/dashboard/settings/courses",
      icon: <Book className="h-6 w-6 text-primary" />,
    },
    {
      title: "Manage Grades & Sections",
      description: "Define the available grade levels and sections in the school.",
      href: "/dashboard/settings/grades-sections",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Manage Academic Year",
      description: "Define school years and set the current one for the system.",
      href: "/dashboard/settings/academic-year",
      icon: <CalendarClock className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">School Settings</h1>
      </div>
      <p className="text-muted-foreground">
        Configure the core academic structure of your institution.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                {feature.icon}
                <div className="flex-1">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  Go to {feature.title.split(' ')[1]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
