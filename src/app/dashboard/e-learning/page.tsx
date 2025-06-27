
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCopy, Upload, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ELearningAdminPage() {
  const features = [
    {
      title: "Manage Materials",
      description: "View, edit, or delete existing e-learning resources.",
      href: "/dashboard/e-learning/manage",
      icon: <BookCopy className="h-6 w-6 text-primary" />,
    },
    {
      title: "Upload New Material",
      description: "Add new videos, documents, or other resources for students.",
      href: "/dashboard/e-learning/upload",
      icon: <Upload className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BookCopy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">E-Learning Management</h1>
      </div>
      <p className="text-muted-foreground">
        Manage your digital library of learning resources.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
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
                  Go to {feature.title.split(' ')[0]}
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
