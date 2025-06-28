
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ArrowRight, Clock, CheckCircle, Ban, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useStudent } from "@/context/student-context";
import { getTestsAction, PortalTestsData } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function TestsLoadingSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent><Skeleton className="h-5 w-1/3" /></CardContent>
                    <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default function StudentTestsPage() {
  const { selectedStudent } = useStudent();
  const [tests, setTests] = useState<PortalTestsData>([]);
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
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "UPCOMING": return "secondary";
      case "COMPLETED": return "outline";
      case "SUBMITTED": return "default";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Clock className="h-4 w-4 text-green-500" />;
      case "UPCOMING": return <Clock className="h-4 w-4" />;
      case "COMPLETED": return <Ban className="h-4 w-4 text-destructive" />;
      case "SUBMITTED": return <CheckCircle className="h-4 w-4 text-primary" />;
      default: return null;
    }
  }

  const getStatusText = (status: string) => {
    if (status === 'SUBMITTED') return 'Completed';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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

      {isLoading && <TestsLoadingSkeleton />}
      
      {!isLoading && error && (
          <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      )}

      {!isLoading && !error && tests.length === 0 && (
           <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Tests Found</AlertTitle>
                <AlertDescription>
                    There are no tests assigned to {selectedStudent?.name || 'this student'} at the moment.
                </AlertDescription>
            </Alert>
      )}

      {!isLoading && !error && tests.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="flex flex-col">
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                          <CardTitle>{test.name}</CardTitle>
                          <CardDescription className="mt-1">{test.subject}</CardDescription>
                      </div>
                      {test.isMock && <Badge variant={'secondary'}>Mock</Badge>}
                  </div>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                      <Badge variant={getStatusVariant(test.status) as any} className="flex-shrink-0">
                          {getStatusIcon(test.status)}
                          <span className="ml-2">{getStatusText(test.status)}</span>
                      </Badge>
                      {test.status === 'UPCOMING' && (
                          <span className="ml-2">on {new Date(test.startTime).toLocaleDateString()}</span>
                      )}
                  </div>
              </CardContent>
              <CardFooter className="mt-auto">
                  {test.status === 'ACTIVE' && (
                      <Button asChild className="w-full">
                          <Link href={`/portal/tests/${test.id}`}>
                              {test.isMock ? 'Start Practice' : 'Start Exam'} <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                  )}
                   {test.status === 'UPCOMING' && (
                      <Button disabled className="w-full">
                          <Ban className="mr-2 h-4 w-4" /> Not Yet Active
                      </Button>
                  )}
                   {(test.status === 'COMPLETED' || test.status === 'SUBMITTED') && (
                      <Button variant="outline" className="w-full" asChild>
                          <Link href={`/portal/tests/${test.id}/results`}>View Results</Link>
                      </Button>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
