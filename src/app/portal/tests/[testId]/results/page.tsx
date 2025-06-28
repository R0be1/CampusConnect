
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, X, ArrowLeft, Clock, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStudent } from "@/context/student-context";
import { getTestResultAction, PortalTestResultData } from "../../../actions";
import { Skeleton } from "@/components/ui/skeleton";

function ResultsLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <Skeleton className="h-6 w-1/4 mx-auto" />
                    <Skeleton className="h-16 w-1/3 mx-auto" />
                    <Skeleton className="h-8 w-1/4 mx-auto" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
}

export default function TestResultPage({ params }: { params: { testId: string } }) {
  const { selectedStudent } = useStudent();
  const [resultData, setResultData] = useState<PortalTestResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!selectedStudent?.id || !params.testId) return;

    setIsLoading(true);
    getTestResultAction(params.testId, selectedStudent.id)
      .then(res => {
        if(res.success) {
          setResultData(res.data);
        } else {
          setError(res.error || "Could not fetch results.");
        }
      })
      .catch(() => setError("An unexpected error occurred."))
      .finally(() => setIsLoading(false));

  }, [selectedStudent, params.testId]);

  if (isLoading) {
    return <ResultsLoadingSkeleton />;
  }

  if (error || !resultData) {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
            <CardContent><p>{error || 'The test results you are looking for could not be found.'}</p></CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/portal/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  if (resultData && !resultData.resultsVisible) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center text-center py-20">
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><Clock className="h-6 w-6"/> Results Pending</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Results for "{resultData.testName}" will be available after {new Date(resultData.endTime).toLocaleString()}. Please check back later.
                </p>
            </CardContent>
            <CardFooter>
                    <Button asChild className="w-full">
                    <Link href="/portal/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
                </Button>
            </CardFooter>
            </Card>
      </div>
    );
  }
  
  const { score, totalMarks, questions, testName } = resultData;
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {resultData.test?.isMock && (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Practice Results</AlertTitle>
            <AlertDescription>
              This was a mock exam. The results are for practice and have not been recorded.
            </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Results: {testName}</CardTitle>
          <CardDescription>Here's a breakdown of your child's performance.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">They Scored</p>
            <p className="text-6xl font-bold text-primary">{score} / {totalMarks}</p>
            <p className="text-2xl font-semibold">{percentage.toFixed(1)}%</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/portal/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
            </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Answer Review</h2>
        {questions.map((question, index) => {
          const studentAnswerObj = resultData.answers.find(a => a.questionId === question.id);
          const studentAnswer = studentAnswerObj?.answer;
          const isCorrect = studentAnswer === question.correctAnswer;
          
          let correctAnswerText: string | undefined = question.correctAnswer;
          let studentAnswerText: string | undefined = studentAnswer;

          if (question.type === 'MULTIPLE_CHOICE' && question.options) {
            const options = JSON.parse(question.options) as string[];
            if (question.correctAnswer) correctAnswerText = options[parseInt(question.correctAnswer)];
            if (studentAnswer) studentAnswerText = options[parseInt(studentAnswer)];
          }

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
                <p className="text-sm"><strong>Student's Answer:</strong> <span className={cn(isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{studentAnswerText || "No answer"}</span></p>
                {!isCorrect && (
                    <p className="text-sm"><strong>Correct Answer:</strong> <span className="text-green-700 dark:text-green-400">{correctAnswerText}</span></p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
