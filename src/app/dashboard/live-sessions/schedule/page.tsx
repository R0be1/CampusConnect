
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Radio, ArrowLeft, CalendarIcon } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D', 'All'];
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export default function ScheduleLiveSessionPage() {
    const [date, setDate] = React.useState<Date>();
    const [isDatePickerOpen, setDatePickerOpen] = React.useState(false);

    return (
        <div className="flex flex-col gap-6">
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
                    <div className="space-y-2">
                        <Label htmlFor="topic">Session Topic</Label>
                        <Input id="topic" placeholder="e.g., Mastering Quadratic Equations" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="A brief summary of what will be covered in the session." />
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Select><SelectTrigger id="subject"><SelectValue placeholder="Select a subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Select><SelectTrigger id="grade"><SelectValue placeholder="Select a grade" /></SelectTrigger><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                        </div>
                    </div>
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <Label>Date & Time</Label>
                           <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                              <PopoverTrigger asChild>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={(d) => {setDate(d); setDatePickerOpen(false);}} initialFocus />
                                <div className="p-3 border-t border-border">
                                    <Input type="time" onChange={(e) => {
                                        const time = e.target.value.split(':');
                                        const newDate = new Date(date || new Date());
                                        newDate.setHours(Number(time[0]), Number(time[1]));
                                        setDate(newDate);
                                    }}/>
                                </div>
                              </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input id="duration" type="number" placeholder="e.g., 60" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fee">Additional Fee ($)</Label>
                            <Input id="fee" type="number" placeholder="e.g., 25 (0 for free)" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button>Schedule Session</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
