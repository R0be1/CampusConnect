
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data - In a real app, this would be fetched based on the test submission.
const testData = {
  id: "test-002",
  name: "Mechanics - Unit Test",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Which of the following is a vector quantity?",
      options: ["Speed", "Distance", "Mass", "Velocity"],
      correctAnswer: "Velocity",
    },
    {
      id: "q2",
      type: "true-false",
      text: "Inertia is the property of a body to resist changes in its state of motion.",
      correctAnswer: "true",
    },
    {
      id: "q3",
      type: "fill-in-the-blank",
      text: "The rate of change of velocity is called ___.",
      correctAnswer: "acceleration",
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "What is the SI unit of force?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctAnswer: "Newton",
    },
  ],
};

const studentAnswers = {
    q1: "Velocity",
    q2: "true",
    q3: "acceleration",
    q4: "Pascal", // Incorrect answer
};

export default function TestResultPage({ params }: { params: { testId: string } }) {
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
          <CardDescription>Here's a breakdown of your child's performance.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">They Scored</p>
            <p className="text-6xl font-bold text-primary">{score} / {totalQuestions}</p>
            <p className="text-2xl font-semibold">{percentage.toFixed(0)}%</p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/portal/tests"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tests</Link>
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
                <p className="text-sm"><strong>Student's Answer:</strong> <span className={cn(isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{studentAnswer || "No answer"}</span></p>
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
