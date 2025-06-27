
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Eye, FileText, Check, X, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const initialTestsWithSubmissions: Record<string, any> = {};

type Submission = {
  studentId: string;
  studentName: string;
  score: string;
  percentage: number;
  submittedAt: string;
  answers: Record<string, string>;
  status: 'Awaiting Approval' | 'Graded';
};

export default function TestSubmissionsPage({ params }: { params: { testId: string } }) {
  const testId = params.testId as keyof typeof initialTestsWithSubmissions;
  const [tests, setTests] = useState(initialTestsWithSubmissions);
  const testData = tests[testId];

  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleApprove = (studentId: string) => {
    setTests(currentTests => {
        const newSubmissions = currentTests[testId].submissions.map((sub: Submission) => {
            if (sub.studentId === studentId) {
                return { ...sub, status: 'Graded' as const };
            }
            return sub;
        });

        const newTestData = {
            ...currentTests[testId],
            submissions: newSubmissions
        };

        return {
            ...currentTests,
            [testId]: newTestData
        };
    });
    setOpenDialogs(prev => ({ ...prev, [studentId]: false })); // Close the dialog
  };

  const handleApproveAll = () => {
    setTests(currentTests => {
        const newSubmissions = currentTests[testId].submissions.map((sub: Submission) => {
            if (sub.status === 'Awaiting Approval') {
                return { ...sub, status: 'Graded' as const };
            }
            return sub;
        });

        const newTestData = {
            ...currentTests[testId],
            submissions: newSubmissions
        };

        return {
            ...currentTests,
            [testId]: newTestData
        };
    });
  };

  if (!testData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Not Found</CardTitle>
          <CardDescription>The test you are looking for could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/tests">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (testData.isMock) {
     return (
       <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline">Test Submissions & Approval</h1>
              <p className="text-muted-foreground">Viewing results for: <span className="font-semibold text-foreground">{testData.name}</span></p>
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

  const averageScore = testData.submissions.length > 0
    ? testData.submissions.reduce((acc: number, sub: Submission) => acc + sub.percentage, 0) / testData.submissions.length
    : 0;

  const pendingSubmissionsCount = testData.submissions.filter((s: Submission) => s.status === 'Awaiting Approval').length;

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'Graded':
        return <Badge variant="default">Graded</Badge>;
      case 'Awaiting Approval':
        return <Badge variant="outline">Awaiting Approval</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Test Submissions & Approval</h1>
          <p className="text-muted-foreground">Viewing results for: <span className="font-semibold text-foreground">{testData.name}</span></p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/tests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test List
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{testData.submissions.length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>Review and approve submissions. Once graded, the results become final.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testData.submissions.length > 0 ? (
                  testData.submissions.map((submission: Submission) => (
                    <TableRow key={submission.studentId}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>{submission.percentage}%</TableCell>
                      <TableCell>{submission.submittedAt}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog open={openDialogs[submission.studentId] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({...prev, [submission.studentId]: isOpen}))}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              {submission.status === 'Graded' ? 'View Graded' : 'Review & Approve'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Answer Review: {submission.studentName}</DialogTitle>
                              <DialogDescription>
                                Test: {testData.name} | Score: {submission.score} ({submission.percentage}%)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4">
                              {testData.questions.map((question: any, index: number) => {
                                const studentAnswer = submission.answers[question.id as keyof typeof submission.answers];
                                const isCorrect = studentAnswer === question.correctAnswer;
                                return (
                                  <Card key={question.id} className={cn("overflow-hidden", isCorrect ? "border-green-500/50" : "border-destructive/50")}>
                                    <CardHeader className="flex flex-row items-start gap-4 bg-muted/30 p-4">
                                      <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full", isCorrect ? "bg-green-500" : "bg-destructive")}>
                                          {isCorrect ? <Check className="h-5 w-5 text-white" /> : <X className="h-5 w-5 text-white" />}
                                      </div>
                                      <div>
                                          <CardTitle className="text-base">Question {index + 1}</CardTitle>
                                          <CardDescription className="mt-1">{question.text}</CardDescription>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2">
                                      <p className="text-sm"><strong>Student's Answer:</strong> <span className={cn(isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{studentAnswer || "No answer"}</span></p>
                                      {!isCorrect && (
                                          <p className="text-sm"><strong>Correct Answer:</strong> <span className="text-green-700 dark:text-green-400">{question.correctAnswer}</span></p>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                             <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DialogClose>
                                {submission.status === 'Awaiting Approval' && (
                                    <Button onClick={() => handleApprove(submission.studentId)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve & Finalize Grade
                                    </Button>
                                )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No submissions received for this test yet.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={pendingSubmissionsCount === 0}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve All Pending ({pendingSubmissionsCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will approve all {pendingSubmissionsCount} pending submissions for this test. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApproveAll}>Confirm & Approve All</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
