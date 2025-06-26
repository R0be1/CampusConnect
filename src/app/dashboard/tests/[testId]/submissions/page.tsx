
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Eye, FileText, Check, X } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Mock data for a specific test's submissions, now including questions and individual answers.
const testsWithSubmissions = {
  "test-001": {
    name: "Algebra II - Mid-term",
    questions: [
        { id: "q1", text: "Solve for x: 2x + 3 = 7", correctAnswer: "2" },
        { id: "q2", text: "What is the formula for the area of a circle?", correctAnswer: "pi * r^2" },
    ],
    submissions: [],
  },
  "test-002": {
    name: "Mechanics - Unit Test",
    questions: [
      { id: "q1", text: "Which of the following is a vector quantity?", correctAnswer: "Velocity" },
      { id: "q2", text: "Inertia is the property of a body to resist changes in its state of motion.", correctAnswer: "true" },
      { id: "q3", text: "The rate of change of velocity is called ___.", correctAnswer: "acceleration" },
      { id: "q4", text: "What is the SI unit of force?", correctAnswer: "Newton" },
    ],
    submissions: [
      { studentId: "s001", studentName: "John Doe", score: "3/4", percentage: 75, submittedAt: "2024-08-10 10:15 AM", answers: { q1: "Velocity", q2: "true", q3: "acceleration", q4: "Pascal" } },
      { studentId: "s005", studentName: "Diana Prince", score: "4/4", percentage: 100, submittedAt: "2024-08-10 10:22 AM", answers: { q1: "Velocity", q2: "true", q3: "acceleration", q4: "Newton" } },
    ],
  },
  "test-003": {
      name: "American Revolution",
      questions: [
        { id: "q1", text: "The American Revolution was a conflict between Great Britain and thirteen of its North American colonies.", correctAnswer: "true" },
        { id: "q2", text: "The Declaration of Independence was signed in what year?", correctAnswer: "1776" },
      ],
      submissions: [
        { studentId: "s002", studentName: "Alice Smith", score: "2/2", percentage: 100, submittedAt: "2024-08-05 09:30 AM", answers: { q1: "true", q2: "1776" } },
        { studentId: "s008", studentName: "Clark Kent", score: "1/2", percentage: 50, submittedAt: "2024-08-05 09:32 AM", answers: { q1: "true", q2: "1775" } },
        { studentId: "s009", studentName: "Tony Stark", score: "2/2", percentage: 100, submittedAt: "2024-08-05 09:35 AM", answers: { q1: "true", q2: "1776" } },
      ]
  }
};

export default function TestSubmissionsPage({ params }: { params: { testId: string } }) {
  const testId = params.testId as keyof typeof testsWithSubmissions;
  const testData = testsWithSubmissions[testId];

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

  const averageScore = testData.submissions.length > 0
    ? testData.submissions.reduce((acc, sub) => acc + sub.percentage, 0) / testData.submissions.length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Test Submissions</h1>
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
          <CardDescription>A list of all students who have completed this test.</CardDescription>
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
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testData.submissions.length > 0 ? (
                  testData.submissions.map((submission) => (
                    <TableRow key={submission.studentId}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>{submission.percentage}%</TableCell>
                      <TableCell>{submission.submittedAt}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Answers
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
                              {testData.questions.map((question, index) => {
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
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No submissions received for this test yet.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
