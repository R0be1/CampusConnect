
"use client";

import { useState, useEffect } from "react";
import TestsClient from "./tests-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudent } from "@/context/student-context";
import { getTestsAction, StudentPortalTestsData } from "../actions";

function TestsLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <ClipboardList className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-72" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
        </div>
    )
}

export default function StudentTestsPage() {
  const { selectedStudent, isLoading: isStudentLoading } = useStudent();
  const [tests, setTests] = useState<StudentPortalTestsData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.id) {
        setIsLoading(true);
        setError(null);
        setTests([]);
        getTestsAction(selectedStudent.id)
            .then(result => {
                if (result.success && result.data) {
                    setTests(result.data);
                } else {
                    setError(result.error || "Failed to load tests.");
                }
            })
            .catch(() => setError("An unexpected error occurred."))
            .finally(() => setIsLoading(false));
    }
  }, [selectedStudent]);

  if (isLoading || isStudentLoading) {
      return <TestsLoadingSkeleton />;
  }

  if (!selectedStudent) {
    return (
         <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Student Selected</AlertTitle>
            <AlertDescription>Please select a student to view their tests.</AlertDescription>
        </Alert>
    )
  }

  if(error) {
      return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
  }

  return (
    <TestsClient tests={tests} />
  );
}
