
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Eye, FileText, Check, X, CheckCircle, Loader2 } from "lucide-react";
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
import { format } from "date-fns";
import type { TestWithSubmissions } from "@/lib/data";
import { approveSubmissionAction, approveAllSubmissionsAction } from "../actions";
import { useToast } from "@/hooks/use-toast";


export function SubmissionsClient({ test: initialTest }: { test: NonNullable<TestWithSubmissions> }) {
  const { toast } = useToast();
  const [test, setTest] = useState(initialTest);
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  const handleApprove = async (submissionId: string) => {
    const result = await approveSubmissionAction(submissionId, test.id);
    if (result.success) {
      setTest(currentTest => ({
          ...currentTest,
          submissions: currentTest.submissions.map(s => s.id === submissionId ? {...s, status: 'GRADED'} : s)
      }));
      toast({ title: "Success", description: result.message });
      setOpenDialogs(prev => ({ ...prev, [submissionId]: false })); // Close the dialog
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleApproveAll = async () => {
    setIsApprovingAll(true);
    const result = await approveAllSubmissionsAction(test.id);
    if(result.success) {
      setTest(currentTest => ({
        ...currentTest,
        submissions: currentTest.submissions.map(s => s.status === 'AWAITING_APPROVAL' ? {...s, status: 'GRADED'} : s)
      }));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsApprovingAll(false);
  };

  const averageScore = test.submissions.length > 0
    ? test.submissions.reduce((acc, sub) => acc + (sub.score / test.totalMarks * 100), 0) / test.submissions.length
    : 0;

  const pendingSubmissionsCount = test.submissions.filter((s) => s.status === 'AWAITING_APPROVAL').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GRADED':
        return <Badge variant="default">Graded</Badge>;
      case 'AWAITING_APPROVAL':
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
          <p className="text-muted-foreground">Viewing results for: <span className="font-semibold text-foreground">{test.name}</span></p>
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
                <div className="text-2xl font-bold">{test.submissions.length}</div>
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
                {test.submissions.length > 0 ? (
                  test.submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{`${submission.student.user.firstName} ${submission.student.user.lastName}`}</TableCell>
                      <TableCell>{submission.score} / {test.totalMarks}</TableCell>
                      <TableCell>{(submission.score / test.totalMarks * 100).toFixed(1)}%</TableCell>
                      <TableCell>{format(new Date(submission.submittedAt), 'PPp')}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog open={openDialogs[submission.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({...prev, [submission.id]: isOpen}))}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              {submission.status === 'GRADED' ? 'View Graded' : 'Review & Approve'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Answer Review: {`${submission.student.user.firstName} ${submission.student.user.lastName}`}</DialogTitle>
                              <DialogDescription>
                                Test: {test.name} | Score: {submission.score} / {test.totalMarks} ({(submission.score / test.totalMarks * 100).toFixed(1)}%)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 pr-4">
                              {test.questions.map((question, index) => {
                                const studentAnswerObj = submission.answers.find(a => a.questionId === question.id);
                                const studentAnswer = studentAnswerObj?.answer || "No Answer";
                                const isCorrect = studentAnswer === question.correctAnswer;
                                
                                const options = (question.type === 'MULTIPLE_CHOICE' && question.options) ? JSON.parse(question.options) : [];
                                const correctAnswerText = question.type === 'MULTIPLE_CHOICE' ? options[parseInt(question.correctAnswer)] : question.correctAnswer;
                                const studentAnswerText = question.type === 'MULTIPLE_CHOICE' ? options[parseInt(studentAnswer)] : studentAnswer;

                                return (
                                  <Card key={question.id} className={cn("overflow-hidden", isCorrect ? "border-green-500/50" : "border-destructive/50")}>
                                    <CardHeader className="flex flex-row items-start gap-4 bg-muted/30 p-4">
                                      <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full", isCorrect ? "bg-green-500" : "bg-destructive")}>
                                          {isCorrect ? <Check className="h-5 w-5 text-white" /> : <X className="h-5 w-5 text-white" />}
                                      </div>
                                      <div>
                                          <CardTitle className="text-base">Question {index + 1} ({question.points} pts)</CardTitle>
                                          <CardDescription className="mt-1">{question.text}</CardDescription>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2">
                                      <p className="text-sm"><strong>Student's Answer:</strong> <span className={cn(isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{studentAnswerText}</span></p>
                                      {!isCorrect && (
                                          <p className="text-sm"><strong>Correct Answer:</strong> <span className="text-green-700 dark:text-green-400">{correctAnswerText}</span></p>
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
                                {submission.status === 'AWAITING_APPROVAL' && (
                                    <Button onClick={() => handleApprove(submission.id)}>
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
        {pendingSubmissionsCount > 0 && (
          <CardFooter className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isApprovingAll}>
                    {isApprovingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
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
        )}
      </Card>
    </div>
  );
}
