
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ArrowRight, Clock, CheckCircle, Ban } from "lucide-react";
import Link from "next/link";

const testsData = [
  { id: "test-001", name: "Algebra II - Mid-term", grade: "Grade 10", subject: "Mathematics", status: "Upcoming", startTime: "2024-09-10T09:00:00" },
  { id: "test-002", name: "Mechanics - Unit Test", grade: "Grade 11", subject: "Physics", status: "Active", duration: 45 },
  { id: "test-003", name: "American Revolution", grade: "Grade 9", subject: "History", status: "Completed" },
];

type Test = typeof testsData[0];

export default function StudentTestsPage() {

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Upcoming": return "secondary";
      case "Completed": return "outline";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <Clock className="h-4 w-4 text-green-500" />;
      case "Upcoming": return <Clock className="h-4 w-4" />;
      case "Completed": return <CheckCircle className="h-4 w-4 text-primary" />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Tests</h1>
      </div>
       <p className="text-muted-foreground">
        Here are the tests assigned to you. Active tests can be started immediately.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testsData.map((test) => (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{test.name}</CardTitle>
                    <Badge variant={getStatusVariant(test.status) as any}>{test.status}</Badge>
                </div>
                <CardDescription>{test.subject} - {test.grade}</CardDescription>
            </CardHeader>
            <CardContent>
                {test.status === 'Upcoming' && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Starts on: {new Date(test.startTime).toLocaleString()}</span>
                    </div>
                )}
                 {test.status === 'Completed' && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>You have completed this test.</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="mt-auto">
                {test.status === 'Active' && (
                    <Button asChild className="w-full">
                        <Link href={`/student/tests/${test.id}`}>
                            Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                 {test.status === 'Upcoming' && (
                    <Button disabled className="w-full">
                        <Ban className="mr-2 h-4 w-4" /> Not Yet Active
                    </Button>
                )}
                 {test.status === 'Completed' && (
                    <Button variant="outline" className="w-full">
                        View Results
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
