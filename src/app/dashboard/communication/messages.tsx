
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const studentsData = [
  { id: 's001', name: 'John Doe', grade: 'Grade 10', section: 'A', parentName: 'Jane Doe', parentEmail: 'jane.doe@example.com' },
  { id: 's002', name: 'Alice Smith', grade: 'Grade 9', section: 'B', parentName: 'Robert Smith', parentEmail: 'robert.smith@example.com' },
  { id: 's003', name: 'Bob Johnson', grade: 'Grade 10', section: 'A', parentName: 'Mary Johnson', parentEmail: 'mary.johnson@example.com' },
  { id: 's004', name: 'Charlie Brown', grade: 'Grade 11', section: 'C', parentName: 'Lucy Brown', parentEmail: 'lucy.brown@example.com' },
  { id: 's005', name: 'Diana Prince', grade: 'Grade 9', section: 'B', parentName: 'Hippolyta Prince', parentEmail: 'hippolyta.prince@example.com' },
  { id: 's006', name: 'Peter Parker', grade: 'Grade 10', section: 'A', parentName: 'May Parker', parentEmail: 'may.parker@example.com' },
  { id: 's007', name: 'Bruce Wayne', grade: 'Grade 11', section: 'C', parentName: 'Alfred Pennyworth', parentEmail: 'alfred.pennyworth@example.com' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];

const formSchema = z.object({
    studentId: z.string().min(1, "Please select a student."),
    subject: z.string().min(1, "Subject is required."),
    message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormData = z.infer<typeof formSchema>;

export function CommunicationComposer() {
    const [isSending, setIsSending] = useState(false);
    const [open, setOpen] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState("all");
    const [selectedSection, setSelectedSection] = useState("all");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            subject: "",
            message: "",
        },
    });

    useEffect(() => {
        form.resetField("studentId");
    }, [selectedGrade, selectedSection, form]);
    
    const filteredStudents = studentsData.filter(student => {
        const gradeMatch = selectedGrade === "all" || student.grade === selectedGrade;
        const sectionMatch = selectedSection === "all" || student.section === selectedSection;
        return gradeMatch && sectionMatch;
    });

    const selectedStudentId = form.watch("studentId");
    const selectedStudent = studentsData.find(s => s.id === selectedStudentId);

    const onSubmit = (data: FormData) => {
        setIsSending(true);
        console.log("Sending message:", data);
        setTimeout(() => {
            setIsSending(false);
            alert("Message sent successfully!");
            form.reset();
            setSelectedGrade("all");
            setSelectedSection("all");
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Filter by class, then select a student to initiate communication with their parent or guardian.</CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6 border-b pb-6">
                         <div className="space-y-2">
                            <Label>Filter by Grade</Label>
                             <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                <SelectTrigger><SelectValue placeholder="All Grades" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Filter by Section</Label>
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger><SelectValue placeholder="All Sections" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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
                                                    <CommandEmpty>No students found for this class.</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredStudents.map((student) => (
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
