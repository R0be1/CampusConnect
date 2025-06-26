
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Send, Sparkles, User, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getRecommendationsAction } from "./actions";

const studentsData = [
  { id: 's001', name: 'John Doe', parentName: 'Jane Doe', parentEmail: 'jane.doe@example.com' },
  { id: 's002', name: 'Alice Smith', parentName: 'Robert Smith', parentEmail: 'robert.smith@example.com' },
  { id: 's003', name: 'Bob Johnson', parentName: 'Mary Johnson', parentEmail: 'mary.johnson@example.com' },
  { id: 's004', name: 'Charlie Brown', parentName: 'Lucy Brown', parentEmail: 'lucy.brown@example.com' },
  { id: 's005', name: 'Diana Prince', parentName: 'Hippolyta Prince', parentEmail: 'hippolyta.prince@example.com' },
];

const formSchema = z.object({
    studentId: z.string().min(1, "Please select a student."),
    subject: z.string().min(1, "Subject is required."),
    message: z.string().min(10, "Message must be at least 10 characters."),
    // AI fields
    studentPerformanceData: z.string().optional(),
    studentBehavioralData: z.string().optional(),
    communicationHistory: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CommunicationComposer() {
    const [useAI, setUseAI] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const selectedStudentId = form.watch("studentId");
    const selectedStudent = studentsData.find(s => s.id === selectedStudentId);

    const handleGenerateDraft = async () => {
        const aiInputs = form.getValues();
        if (!aiInputs.studentPerformanceData || !aiInputs.studentBehavioralData || !aiInputs.communicationHistory) {
            form.setError("studentPerformanceData", { message: "Please fill out all AI input fields to generate a draft." });
            return;
        }

        setIsGenerating(true);
        const result = await getRecommendationsAction({
            studentPerformanceData: aiInputs.studentPerformanceData,
            studentBehavioralData: aiInputs.studentBehavioralData,
            communicationHistory: aiInputs.communicationHistory,
        });

        if ('error' in result) {
            console.error(result.error);
        } else if (result) {
            form.setValue("subject", result.subject, { shouldValidate: true });
            form.setValue("message", result.messageBody, { shouldValidate: true });
        }
        setIsGenerating(false);
    };

    const onSubmit = (data: FormData) => {
        setIsSending(true);
        console.log("Sending message:", data);
        setTimeout(() => {
            setIsSending(false);
            alert("Message sent successfully!");
            form.reset();
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Select a student to initiate communication with their parent or guardian.</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                             <Label>Select Student</Label>
                            <Controller
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                                {field.value ? studentsData.find((s) => s.id === field.value)?.name : "Select student..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search student..." />
                                                <CommandList>
                                                    <CommandEmpty>No student found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {studentsData.map((student) => (
                                                            <CommandItem
                                                                key={student.id}
                                                                value={student.name}
                                                                onSelect={() => {
                                                                    field.onChange(student.id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", field.value === student.id ? "opacity-100" : "opacity-0")} />
                                                                {student.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {form.formState.errors.studentId && <p className="text-destructive text-sm">{form.formState.errors.studentId.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>To (Parent/Guardian)</Label>
                            <Input readOnly value={selectedStudent ? `${selectedStudent.parentName} <${selectedStudent.parentEmail}>` : ''} placeholder="Parent details appear here" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" {...form.register("subject")} placeholder="e.g., Update on John's Progress in Mathematics" />
                        {form.formState.errors.subject && <p className="text-destructive text-sm">{form.formState.errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" {...form.register("message")} className="min-h-[150px]" placeholder="Write your message here..."/>
                        {form.formState.errors.message && <p className="text-destructive text-sm">{form.formState.errors.message.message}</p>}
                    </div>
                    
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-accent" />
                                <Label htmlFor="use-ai" className="font-semibold">AI Assistance</Label>
                            </div>
                            <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
                        </div>
                        {useAI && (
                            <div className="space-y-4 animate-in fade-in-50">
                                <p className="text-sm text-muted-foreground">Provide context below for the AI to generate a message draft.</p>
                                <div>
                                    <Label htmlFor="studentPerformanceData">Student Performance Data</Label>
                                    <Textarea id="studentPerformanceData" {...form.register("studentPerformanceData")} placeholder="e.g., Grades: Math A, Science B. Attendance: 95%..." />
                                </div>
                                <div>
                                    <Label htmlFor="studentBehavioralData">Student Behavioral Data</Label>
                                    <Textarea id="studentBehavioralData" {...form.register("studentBehavioralData")} placeholder="e.g., Consistently participates in class. Occasionally disruptive..." />
                                </div>
                                <div>
                                    <Label htmlFor="communicationHistory">Previous Communication</Label>
                                    <Textarea id="communicationHistory" {...form.register("communicationHistory")} placeholder="e.g., Emailed parents on 03/15 about missing homework..."/>
                                </div>
                                {form.formState.errors.studentPerformanceData && <p className="text-destructive text-sm">{form.formState.errors.studentPerformanceData.message}</p>}
                                <Button type="button" variant="secondary" onClick={handleGenerateDraft} disabled={isGenerating}>
                                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Draft
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSending}>
                        {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
