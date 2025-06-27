import { getTestWithSubmissions } from "@/lib/data";
import { SubmissionsClient } from "./submissions-client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default async function TestSubmissionsPage({ params }: { params: { testId: string } }) {
    const test = await getTestWithSubmissions(params.testId);

    if (!test) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Test Not Found</CardTitle>
                    <CardDescription>The test you are looking for could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/tests">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    if (test.isMock) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Test Submissions & Approval</h1>
                        <p className="text-muted-foreground">Viewing results for: <span className="font-semibold text-foreground">{test.name}</span></p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/tests">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Test List
                        </Link>
                    </Button>
                </div>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Mock Exam</AlertTitle>
                    <AlertDescription>
                        This is a mock exam for student practice. Submissions are not recorded or approved.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return <SubmissionsClient test={test} />;
}
