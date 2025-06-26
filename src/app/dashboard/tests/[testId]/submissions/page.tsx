
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Eye, FileText } from "lucide-react";
import Link from "next/link";

// Mock data for a specific test's submissions.
const testSubmissionsData = {
  "test-001": {
    name: "Algebra II - Mid-term",
    submissions: [],
  },
  "test-002": {
    name: "Mechanics - Unit Test",
    submissions: [
      { studentId: "s001", studentName: "John Doe", score: "3/4", percentage: 75, submittedAt: "2024-08-10 10:15 AM" },
      { studentId: "s005", studentName: "Diana Prince", score: "4/4", percentage: 100, submittedAt: "2024-08-10 10:22 AM" },
    ],
  },
  "test-003": {
      name: "American Revolution",
      submissions: [
        { studentId: "s002", studentName: "Alice Smith", score: "2/2", percentage: 100, submittedAt: "2024-08-05 09:30 AM" },
        { studentId: "s008", studentName: "Clark Kent", score: "1/2", percentage: 50, submittedAt: "2024-08-05 09:32 AM" },
        { studentId: "s009", studentName: "Tony Stark", score: "2/2", percentage: 100, submittedAt: "2024-08-05 09:35 AM" },
      ]
  }
};

export default function TestSubmissionsPage({ params }: { params: { testId: string } }) {
  const testId = params.testId as keyof typeof testSubmissionsData;
  const data = testSubmissionsData[testId];

  if (!data) {
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

  const averageScore = data.submissions.length > 0
    ? data.submissions.reduce((acc, sub) => acc + sub.percentage, 0) / data.submissions.length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Test Submissions</h1>
          <p className="text-muted-foreground">Viewing results for: <span className="font-semibold text-foreground">{data.name}</span></p>
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
                <div className="text-2xl font-bold">{data.submissions.length}</div>
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
                {data.submissions.length > 0 ? (
                  data.submissions.map((submission) => (
                    <TableRow key={submission.studentId}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>{submission.percentage}%</TableCell>
                      <TableCell>{submission.submittedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Answers
                        </Button>
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
