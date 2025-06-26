
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, X, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock database of tests and their settings
const testDatabase = {
  "test-002": {
    id: "test-002",
    name: "Mechanics - Unit Test",
    resultVisibility: "immediate",
    endTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    questions: [
      { id: "q1", text: "Which of the following is a vector quantity?", correctAnswer: "Velocity" },
      { id: "q2", text: "Inertia is the property of a body to resist changes in its state of motion.", correctAnswer: "true" },
      { id: "q3", text: "The rate of change of velocity is called ___.", correctAnswer: "acceleration" },
      { id: "q4", text: "What is the SI unit of force?", correctAnswer: "Newton" },
    ],
    studentAnswers: { q1: "Velocity", q2: "true", q3: "acceleration", q4: "Pascal" },
  },
  "test-003": {
    id: "test-003",
    name: "American Revolution",
    resultVisibility: "immediate",
    endTime: "2024-08-01T12:00:00",
    questions: [
        { id: "q1", text: "The American Revolution was a conflict between Great Britain and thirteen of its North American colonies.", correctAnswer: "true" },
        { id: "q2", text: "The Declaration of Independence was signed in what year?", correctAnswer: "1776" },
    ],
    studentAnswers: { q1: "true", q2: "1776" },
  },
  "test-004": {
    id: "test-004",
    name: "Chemistry Basics",
    resultVisibility: "after-end-time",
    endTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    questions: [
        { id: "q1", text: "What is the chemical symbol for water?", correctAnswer: "H2O" },
        { id: "q2", text: "The pH of a neutral solution is 7.", correctAnswer: "true" },
    ],
    studentAnswers: { q1: "H2O", q2: "false" },
  }
};

export default function TestResultPage({ params }: { params: { testId: string } }) {
  const testId = params.testId as keyof typeof testDatabase;
  const testData = testDatabase[testId];

  if (!testData) {
    return (
        <Card>
            <CardHeader><CardTitle>Test Not Found</CardTitle></CardHeader>
            <CardContent><p>The test you are looking for could not be found.</p></CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/student/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  const studentAnswers = testData.studentAnswers;
  const areResultsVisible = () => {
    if (testData.resultVisibility === "immediate") return true;
    if (testData.resultVisibility === "after-end-time") {
      return new Date() > new Date(testData.endTime);
    }
    return false;
  };

  if (!areResultsVisible()) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center text-center py-20">
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2"><Clock className="h-6 w-6"/> Results Pending</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Results for "{testData.name}" will be available after {new Date(testData.endTime).toLocaleString()}. Please check back later.
                </p>
            </CardContent>
            <CardFooter>
                    <Button asChild className="w-full">
                    <Link href="/student/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
                </Button>
            </CardFooter>
            </Card>
      </div>
    );
  }
  
  const score = testData.questions.reduce((acc, question) => {
    const studentAnswer = studentAnswers[question.id as keyof typeof studentAnswers];
    return acc + (studentAnswer === question.correctAnswer ? 1 : 0);
  }, 0);
  const totalQuestions = testData.questions.length;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Results: {testData.name}</CardTitle>
          <CardDescription>Here's a breakdown of your performance.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">You Scored</p>
            <p className="text-6xl font-bold text-primary">{score} / {totalQuestions}</p>
            <p className="text-2xl font-semibold">{percentage.toFixed(0)}%</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/student/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
            </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Answer Review</h2>
        {testData.questions.map((question, index) => {
          const studentAnswer = studentAnswers[question.id as keyof typeof studentAnswers];
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
                <p className="text-sm"><strong>Your Answer:</strong> <span className={cn(isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{studentAnswer || "No answer"}</span></p>
                {!isCorrect && (
                    <p className="text-sm"><strong>Correct Answer:</strong> <span className="text-green-700 dark:text-green-400">{question.correctAnswer}</span></p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
