
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, Trash2, ClipboardList, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const questionSchema = z.object({
  type: z.enum(["multiple-choice", "true-false", "fill-in-the-blank"]),
  text: z.string().min(1, "Question text is required."),
  options: z.array(z.string()).optional(),
  answer: z.string().min(1, "An answer is required."),
});

const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.date({ required_error: "Start time is required" }),
  endTime: z.date({ required_error: "End time is required" }),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

type TestFormValues = z.infer<typeof testSchema>;

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D', 'All'];
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export default function CreateTestPage() {
  const { toast } = useToast();
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const watchQuestionType = (index: number) => form.watch(`questions.${index}.type`);

  function onSubmit(data: TestFormValues) {
    console.log("Test form submitted successfully with data:", data);
    toast({
      title: "Test Saved Successfully",
      description: `The test "${data.name}" is now ready.`,
    });
    form.reset();
  }

  const addQuestion = (type: "multiple-choice" | "true-false" | "fill-in-the-blank") => {
    const newQuestion: z.infer<typeof questionSchema> = {
      type,
      text: "",
      answer: "",
    };
    if (type === "multiple-choice") {
      newQuestion.options = ["", "", "", ""];
      newQuestion.answer = ""; // This will be invalid until a radio is selected
    }
    if (type === "true-false") {
      newQuestion.answer = "true";
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
                <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="grade" render={({ field }) => (
                        <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="section" render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger></FormControl><SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="startTime" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Start Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /><div className="p-3 border-t border-border"><Input type="time" onChange={(e) => { const time = e.target.value.split(':'); if(field.value) { const date = new Date(field.value); date.setHours(Number(time[0]), Number(time[1])); field.onChange(date); } else { const date = new Date(); date.setHours(Number(time[0]), Number(time[1])); field.onChange(date); } }} /></div></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="endTime" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /><div className="p-3 border-t border-border"><Input type="time" onChange={(e) => { const time = e.target.value.split(':'); if(field.value) { const date = new Date(field.value); date.setHours(Number(time[0]), Number(time[1])); field.onChange(date); } else { const date = new Date(); date.setHours(Number(time[0]), Number(time[1])); field.onChange(date); } }} /></div></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
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
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        <div className="space-y-4">
                           <div className="flex gap-4 items-baseline">
                             <span className="text-lg font-semibold">{index + 1}.</span>
                             <FormField control={form.control} name={`questions.${index}.text`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel>Question Text</FormLabel><FormControl><Textarea placeholder="What is the capital of France?" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>

                            {watchQuestionType(index) === "multiple-choice" && (
                                <FormField control={form.control} name={`questions.${index}.answer`} render={({ field }) => (
                                  <FormItem className="pl-8"><FormLabel>Options (select the correct answer)</FormLabel>
                                    <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                        {form.getValues(`questions.${index}.options`)?.map((_, optionIndex) => (
                                          <FormField key={`${field.id}-option-${optionIndex}`} control={form.control} name={`questions.${index}.options.${optionIndex}`} render={({ field: optionField }) => (
                                            <FormItem className="flex items-center gap-2"><FormControl><RadioGroupItem value={String(optionIndex)} /></FormControl><Input placeholder={`Option ${optionIndex + 1}`} {...optionField} /></FormItem>
                                          )} />
                                        ))}
                                    </RadioGroup></FormControl><FormMessage /></FormItem>
                                )} />
                            )}
                            
                            {watchQuestionType(index) === "true-false" && (
                                <FormField control={form.control} name={`questions.${index}.answer`} render={({ field }) => (
                                  <FormItem className="pl-8"><FormLabel>Correct Answer</FormLabel>
                                    <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="true" /></FormControl><FormLabel className="font-normal">True</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="false" /></FormControl><FormLabel className="font-normal">False</FormLabel></FormItem>
                                    </RadioGroup></FormControl><FormMessage /></FormItem>
                                )} />
                            )}

                            {watchQuestionType(index) === "fill-in-the-blank" && (
                                <FormField control={form.control} name={`questions.${index}.answer`} render={({ field }) => (
                                    <FormItem className="pl-8"><FormLabel>Correct Answer</FormLabel>
                                    <FormControl><Input placeholder="Enter the correct answer" {...field} /></FormControl>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><HelpCircle className="h-3 w-3"/> In the question text, use three underscores (___) to indicate where the blank should appear.</p>
                                    <FormMessage /></FormItem>
                                )} />
                            )}
                        </div>
                    </Card>
                ))}
                 {form.formState.errors.questions?.message && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.message}</p>
                 )}
                
                <div className="flex gap-2 justify-center border-t pt-4">
                    <Button type="button" variant="outline" onClick={() => addQuestion("multiple-choice")}><PlusCircle className="mr-2 h-4 w-4" /> Add Multiple Choice</Button>
                    <Button type="button" variant="outline" onClick={() => addQuestion("true-false")}><PlusCircle className="mr-2 h-4 w-4" /> Add True/False</Button>
                    <Button type="button" variant="outline" onClick={() => addQuestion("fill-in-the-blank")}><PlusCircle className="mr-2 h-4 w-4" /> Add Fill in the Blank</Button>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Test</Button>
        </div>
      </form>
    </Form>
  );
}
