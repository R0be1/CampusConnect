
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Send, ShieldAlert, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Mock data for a specific test. In a real app, this would be fetched.
const testData = {
  id: "test-002",
  name: "Mechanics - Unit Test",
  duration: 45, // in minutes
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Which of the following is a vector quantity?",
      options: '["Speed", "Distance", "Mass", "Velocity"]',
    },
    {
      id: "q2",
      type: "true-false",
      text: "Inertia is the property of a body to resist changes in its state of motion.",
      options: '[]',
    },
    {
      id: "q3",
      type: "fill-in-the-blank",
      text: "The rate of change of velocity is called ___.",
      options: '[]',
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "What is the SI unit of force?",
      options: '["Joule", "Watt", "Newton", "Pascal"]',
    },
  ],
};

const answerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, "Please provide an answer."),
});
const examSchema = z.object({
  answers: z.array(answerSchema),
});
type ExamFormValues = z.infer<typeof examSchema>;

const Timer = ({ durationInMinutes, onTimeUp, isPaused }: { durationInMinutes: number; onTimeUp: () => void; isPaused: boolean; }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((durationInMinutes * 60 - timeLeft) / (durationInMinutes * 60)) * 100;

  return (
    <Card className="sticky top-4">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Time Remaining
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-4xl font-bold text-center mb-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
};

const WarningOverlay = ({ onResume }: { onResume: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                        Exam Paused
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        You have exited fullscreen mode or switched to another window.
                        This action has been logged. Please remain on the exam screen to avoid disqualification.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={onResume}>
                        I Understand, Resume Exam
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};


export default function ExamPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const form = useForm<ExamFormValues>({
    defaultValues: {
      answers: testData.questions.map(q => ({ questionId: q.id, answer: "" })),
    },
  });

  const [examStarted, setExamStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => {
        if (document.hidden) {
            setIsPaused(true);
            console.log("User switched tabs/windows. Pausing exam.");
        }
    };

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            setIsPaused(true);
            console.log("User exited fullscreen. Pausing exam.");
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examStarted]);

  const handleStartExam = async () => {
    try {
        await document.documentElement.requestFullscreen();
        setExamStarted(true);
    } catch (err) {
        console.error("Failed to enter fullscreen mode:", err);
        alert("Could not enter fullscreen mode. Please enable it in your browser settings.");
        setExamStarted(true); 
    }
  };

  const handleResumeExam = () => {
      setIsPaused(false);
      document.documentElement.requestFullscreen().catch(err => console.error("Could not re-enter fullscreen:", err));
  };

  const onSubmit = (data: ExamFormValues) => {
    console.log("Submitting exam:", data);
    if(document.fullscreenElement) {
        document.exitFullscreen();
    }
    router.push(`/student/tests/${params.testId}/results`);
  };

  const handleTimeUp = () => {
    console.log("Time's up! Submitting automatically.");
    form.handleSubmit(onSubmit)();
  };

  if (!examStarted) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-6 w-6" /> Exam Rules</CardTitle>
                    <CardDescription>Please read the following rules before you begin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>The exam will be conducted in fullscreen mode.</li>
                        <li>Do not exit fullscreen or switch to another tab or application.</li>
                        <li>Leaving the exam window will pause the test and the action will be noted.</li>
                        <li>The test will be submitted automatically when the timer runs out.</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleStartExam}>Start Exam</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <>
        {isPaused && <WarningOverlay onResume={handleResumeExam} />}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
            <div className="flex-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">{testData.name}</CardTitle>
                        <CardDescription>Answer all questions to the best of your ability. The test will be submitted automatically when the time runs out.</CardDescription>
                    </CardHeader>
                </Card>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {testData.questions.map((q, index) => (
                        <Card key={q.id}>
                            <CardHeader>
                                <CardTitle className="text-base">Question {index + 1}</CardTitle>
                                <CardDescription>{q.text}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {q.type === 'multiple-choice' && (
                                    <RadioGroup onValueChange={(value) => form.setValue(`answers.${index}.answer`, value)}>
                                        {(JSON.parse(q.options) as string[]).map((opt, optIndex) => (
                                            <div key={optIndex} className="flex items-center space-x-2">
                                                <RadioGroupItem value={opt} id={`${q.id}-${optIndex}`} />
                                                <Label htmlFor={`${q.id}-${optIndex}`} className="font-normal">{opt}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                                {q.type === 'true-false' && (
                                    <RadioGroup onValueChange={(value) => form.setValue(`answers.${index}.answer`, value)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id={`${q.id}-true`} />
                                            <Label htmlFor={`${q.id}-true`} className="font-normal">True</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id={`${q.id}-false`} />
                                            <Label htmlFor={`${q.id}-false`} className="font-normal">False</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                                {q.type === 'fill-in-the-blank' && (
                                    <Input
                                        {...form.register(`answers.${index}.answer`)}
                                        placeholder="Your answer..."
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button type="button" size="lg"><Send className="mr-2"/> Submit Test</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will not be able to change your answers after submitting. Please review your answers before you proceed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Confirm and Submit</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </form>
            </div>
            <div className="lg:sticky lg:top-6">
                <Timer durationInMinutes={testData.duration} onTimeUp={handleTimeUp} isPaused={isPaused} />
            </div>
        </div>
    </>
  );
}
