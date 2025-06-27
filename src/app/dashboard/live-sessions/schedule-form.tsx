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
import { scheduleSessionAction } from "./actions";
import { Grade } from "@prisma/client";
import { useRouter } from "next/navigation";

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

const sessionSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  description: z.string().optional(),
  subject: z.string().min(1, "Please select a subject."),
  gradeId: z.string().min(1, "Please select a grade."),
  startTime: z.date({ required_error: "Please select a date and time." }),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes."),
  fee: z.coerce.number().min(0, "Fee cannot be negative."),
}).refine(data => data.startTime > new Date(), {
    message: "Start time must be in the future.",
    path: ["startTime"],
});
type SessionFormValues = z.infer<typeof sessionSchema>;

type ScheduleFormProps = {
    grades: Grade[];
    schoolId: string;
    teacherId: string;
}

export function ScheduleForm({ grades, schoolId, teacherId }: ScheduleFormProps) {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        defaultValues: { fee: 0, duration: 60 }
    });

    const onSubmit = async (data: SessionFormValues) => {
        const result = await scheduleSessionAction(data, schoolId, teacherId);
        if (result.success) {
            toast({
                title: "Session Scheduled",
                description: result.message
            });
            router.push('/dashboard/live-sessions');
        } else {
             toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
        }
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
                            <FormField control={form.control} name="gradeId" render={({ field }) => (
                                <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         <div className="grid md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="startTime" render={({ field }) => (
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
