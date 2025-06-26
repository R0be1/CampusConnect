import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Edit, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const features = [
    {
      title: "Manage Exams",
      description: "Define exams, set weightage, and assign them to grades and subjects.",
      href: "/dashboard/results/manage-exams",
      icon: <Edit className="h-6 w-6 text-primary" />,
    },
    {
      title: "Enter Results",
      description: "Input student scores for specific exams and submit them for review.",
      href: "/dashboard/results/enter-results",
      icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
    },
    {
      title: "Approve Results",
      description: "Review, approve, or reject submitted exam results from teachers.",
      href: "/dashboard/results/approve-results",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Exam Results</h1>
      </div>
      <p className="text-muted-foreground">
        Manage the entire exam lifecycle, from defining exams to approving final scores.
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
                  Go to {feature.title}
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
