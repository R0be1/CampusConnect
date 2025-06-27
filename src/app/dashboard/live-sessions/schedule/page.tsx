
"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Radio, ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D', 'All'];
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

const sessionSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  subject: z.string().min(1, "Please select a subject."),
  grade: z.string().min(1, "Please select a grade."),
  dateTime: z.date({ required_error: "Please select a date and time." }),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes."),
  fee: z.coerce.number().min(0, "Fee cannot be negative."),
}).refine(data => data.dateTime > new Date(), {
    message: "Start time must be in the future.",
    path: ["dateTime"],
});
type SessionFormValues = z.infer<typeof sessionSchema>;

export default function ScheduleLiveSessionPage() {
    const { toast } = useToast();
    const form = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        defaultValues: { fee: 0, duration: 60 }
    });

    const onSubmit = (data: SessionFormValues) => {
        console.log(data);
        toast({
            title: "Session Scheduled",
            description: `The session "${data.topic}" has been created successfully.`
        });
        form.reset({ fee: 0, duration: 60 });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Radio className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold font-headline">Schedule New Session</h1>
                    </div>
                     <Button asChild variant="outline">
                        <Link href="/dashboard/live-sessions">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sessions
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>Fill out the form to create a new live learning session for students.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="topic" render={({ field }) => (
                            <FormItem><FormLabel>Session Topic</FormLabel><FormControl><Input placeholder="e.g., Mastering Quadratic Equations" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief summary of what will be covered in the session." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <div className="grid md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="grade" render={({ field }) => (
                                <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         <div className="grid md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="dateTime" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date & Time</FormLabel>
                                <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus fromDate={new Date()} />
                                    <div className="p-3 border-t border-border">
                                        <Input type="time" onChange={(e) => {
                                            const time = e.target.value.split(':');
                                            const newDate = new Date(field.value || new Date());
                                            newDate.setHours(Number(time[0]), Number(time[1]));
                                            field.onChange(newDate);
                                        }}/>
                                    </div>
                                </PopoverContent></Popover>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" placeholder="e.g., 60" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="fee" render={({ field }) => (
                                <FormItem><FormLabel>Additional Fee ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 25 (0 for free)" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end">
                             <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                Schedule Session
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
