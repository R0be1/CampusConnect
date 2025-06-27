
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, History, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeesPage() {
  const features = [
    {
      title: "Invoices",
      description: "View and manage outstanding and paid invoices for students.",
      href: "/dashboard/fees/invoices",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Payment History",
      description: "Review a complete log of all past payment transactions.",
      href: "/dashboard/fees/history",
      icon: <History className="h-6 w-6 text-primary" />,
    },
    {
      title: "Fee Structure",
      description: "Define fee schemes and penalty rules for different academic years.",
      href: "/dashboard/fees/structure",
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <DollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Fee Management</h1>
      </div>
      <p className="text-muted-foreground">
        Handle all aspects of student fees, from invoicing to managing fee structures.
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
