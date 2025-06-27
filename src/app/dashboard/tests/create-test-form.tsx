"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, Trash2, ClipboardList, HelpCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Grade, Section, Staff, User } from "@prisma/client";
import { createTestAction } from "./actions";
import { useRouter } from "next/navigation";

const questionSchema = z.object({
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_THE_BLANK"]),
  text: z.string().min(1, "Question text is required."),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "An answer is required."),
  points: z.coerce.number().min(1, "Points must be at least 1."),
});

const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  gradeId: z.string().min(1, "Grade is required"),
  sectionId: z.string().min(1, "Section is required"),
  subject: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "A teacher must be assigned."),
  startTime: z.date({ required_error: "Start time is required" }),
  endTime: z.date({ required_error: "End time is required" }),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  isMock: z.boolean().default(false),
  resultVisibility: z.enum(["IMMEDIATE", "AFTER_END_TIME"], {
    required_error: "You must select a result visibility option.",
  }),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

type TestFormValues = z.infer<typeof testSchema>;

type TeacherWithUser = Staff & { user: User };

type CreateTestFormProps = {
    grades: Grade[];
    sections: Section[];
    teachers: TeacherWithUser[];
    schoolId: string;
}

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export function CreateTestForm({ grades, sections, teachers, schoolId }: CreateTestFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isStartTimePickerOpen, setStartTimePickerOpen] = React.useState(false);
  const [isEndTimePickerOpen, setEndTimePickerOpen] = React.useState(false);

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      isMock: false,
      questions: [],
      resultVisibility: "IMMEDIATE",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const watchQuestionType = (index: number) => form.watch(`questions.${index}.type`);

  async function onSubmit(data: TestFormValues) {
    setIsSubmitting(true);
    const result = await createTestAction(data, schoolId, data.teacherId);
    if(result.success) {
        toast({ title: "Test Created", description: result.message });
        router.push("/dashboard/tests");
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setIsSubmitting(false);
    }
  }

  const addQuestion = (type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK") => {
    const newQuestion: z.infer<typeof questionSchema> = {
      type,
      text: "",
      correctAnswer: "",
      points: 1,
    };
    if (type === "MULTIPLE_CHOICE") {
      newQuestion.options = ["", "", "", ""];
      newQuestion.correctAnswer = "";
    }
    if (type === "TRUE_FALSE") {
      newQuestion.correctAnswer = "true";
    }
    append(newQuestion);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Create New Test</h1>
        </div>
        
        <Card>
            <CardHeader><CardTitle>Test Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input placeholder="e.g., Mid-term Exam" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="duration" render={({ field }) => (
                        <FormItem><FormLabel>Duration (in minutes)</FormLabel><FormControl><Input type="number" placeholder="e.g., 90" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FormField control={form.control} name="gradeId" render={({ field }) => (
                        <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="sectionId" render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger></FormControl><SelectContent>{sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="teacherId" render={({ field }) => (
                        <FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Assign teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.userId}>{t.user.firstName} {t.user.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="startTime" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Start Time</FormLabel>
                        <Popover open={isStartTimePickerOpen} onOpenChange={setStartTimePickerOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value}
                                    onSelect={(date) => {
                                        if (!date) return;
                                        const currentVal = field.value || new Date();
                                        date.setHours(currentVal.getHours());
                                        date.setMinutes(currentVal.getMinutes());
                                        field.onChange(date);
                                    }}
                                    initialFocus />
                                <div className="p-3 border-t border-border">
                                    <Input type="time"
                                        defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                                        onChange={(e) => {
                                            const time = e.target.value.split(':');
                                            const currentFieldValue = field.value || new Date();
                                            const newDate = new Date(currentFieldValue);
                                            newDate.setHours(Number(time[0]), Number(time[1]));
                                            field.onChange(newDate);
                                            setStartTimePickerOpen(false);
                                        }} />
                                </div>
                            </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="endTime" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Time</FormLabel>
                        <Popover open={isEndTimePickerOpen} onOpenChange={setEndTimePickerOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value}
                                    onSelect={(date) => {
                                        if (!date) return;
                                        const currentVal = field.value || new Date();
                                        date.setHours(currentVal.getHours());
                                        date.setMinutes(currentVal.getMinutes());
                                        field.onChange(date);
                                    }}
                                    initialFocus />
                                <div className="p-3 border-t border-border">
                                    <Input type="time"
                                        defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                                        onChange={(e) => {
                                            const time = e.target.value.split(':');
                                            const currentFieldValue = field.value || new Date();
                                            const newDate = new Date(currentFieldValue);
                                            newDate.setHours(Number(time[0]), Number(time[1]));
                                            field.onChange(newDate);
                                            setEndTimePickerOpen(false);
                                        }} />
                                </div>
                            </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField
                    control={form.control}
                    name="isMock"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Mock Exam
                                </FormLabel>
                                <FormDescription>
                                    Mock exams are for student practice. Results are not recorded or sent for approval.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="resultVisibility"
                    render={({ field }) => (
                        <FormItem className="space-y-3 rounded-lg border p-4">
                            <FormLabel>Result Visibility</FormLabel>
                            <FormDescription>Choose when students can see their results after completing the test. Mock exams always show results immediately.</FormDescription>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    disabled={form.watch('isMock')}
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="IMMEDIATE" /></FormControl>
                                        <FormLabel className="font-normal">
                                            Immediately after submitting
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="AFTER_END_TIME" /></FormControl>
                                        <FormLabel className="font-normal">
                                            After the test end time has passed
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add questions to the test. Select a question type to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative bg-muted/50">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        <div className="space-y-4">
                           <div className="flex gap-4 items-baseline">
                             <span className="text-lg font-semibold">{index + 1}.</span>
                             <FormField control={form.control} name={`questions.${index}.text`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>Question Text</FormLabel><FormControl><Textarea placeholder="What is the capital of France?" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           
                            <div className="pl-8 grid md:grid-cols-[1fr_100px] gap-4">
                                <div>
                                {watchQuestionType(index) === "MULTIPLE_CHOICE" && (
                                    <FormField control={form.control} name={`questions.${index}.correctAnswer`} render={({ field: radioField }) => (
                                    <FormItem><FormLabel>Options (select the correct answer)</FormLabel>
                                        <FormControl><RadioGroup onValueChange={radioField.onChange} defaultValue={radioField.value} className="space-y-2">
                                            {form.getValues(`questions.${index}.options`)?.map((_, optionIndex) => (
                                            <FormField key={`${field.id}-option-${optionIndex}`} control={form.control} name={`questions.${index}.options.${optionIndex}`} render={({ field: optionField }) => (
                                                <FormItem className="flex items-center gap-2"><FormControl><RadioGroupItem value={String(optionIndex)} /></FormControl><Input placeholder={`Option ${optionIndex + 1}`} {...optionField} /></FormItem>
                                            )} />
                                            ))}
                                        </RadioGroup></FormControl><FormMessage /></FormItem>
                                    )} />
                                )}
                                
                                {watchQuestionType(index) === "TRUE_FALSE" && (
                                    <FormField control={form.control} name={`questions.${index}.correctAnswer`} render={({ field }) => (
                                    <FormItem><FormLabel>Correct Answer</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="true" /></FormControl><FormLabel className="font-normal">True</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="false" /></FormControl><FormLabel className="font-normal">False</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage /></FormItem>
                                    )} />
                                )}

                                {watchQuestionType(index) === "FILL_IN_THE_BLANK" && (
                                    <FormField control={form.control} name={`questions.${index}.correctAnswer`} render={({ field }) => (
                                        <FormItem><FormLabel>Correct Answer</FormLabel>
                                        <FormControl><Input placeholder="Enter the correct answer" {...field} /></FormControl>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1"><HelpCircle className="h-3 w-3"/> In the question text, use three underscores (___) to indicate where the blank should appear.</p>
                                        <FormMessage /></FormItem>
                                    )} />
                                )}
                                </div>
                                <FormField control={form.control} name={`questions.${index}.points`} render={({ field }) => (
                                    <FormItem><FormLabel>Points</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    </Card>
                ))}
                 {form.formState.errors.questions && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.message || form.formState.errors.questions.root?.message}</p>
                 )}
                
                <div className="flex gap-2 justify-center border-t pt-4">
                    <Button type="button" variant="outline" onClick={() => addQuestion("MULTIPLE_CHOICE")}><PlusCircle className="mr-2 h-4 w-4" /> Multiple Choice</Button>
                    <Button type="button" variant="outline" onClick={() => addQuestion("TRUE_FALSE")}><PlusCircle className="mr-2 h-4 w-4" /> True/False</Button>
                    <Button type="button" variant="outline" onClick={() => addQuestion("FILL_IN_THE_BLANK")}><PlusCircle className="mr-2 h-4 w-4" /> Fill in the Blank</Button>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Save Test
          </Button>
        </div>
      </form>
    </Form>
  );
}
