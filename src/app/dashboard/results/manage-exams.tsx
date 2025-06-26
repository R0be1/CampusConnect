
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Placeholder data
const examsData = [
  { id: 'exam1', name: 'Mid-term Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 40 },
  { id: 'exam2', name: 'Final Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 60 },
  { id: 'exam3', name: 'Unit Test 1', grade: 'Grade 9', section: 'B', subject: 'Science', weightage: 20 },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export function ManageExams() {
    const [gradeOpen, setGradeOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState("");

    const [sectionOpen, setSectionOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState("");

    const [subjectOpen, setSubjectOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Exam Definitions</CardTitle>
                        <CardDescription>Define exams and their weightage for different grades, sections, and subjects.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Define New Exam</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Define New Exam</DialogTitle>
                                <DialogDescription>Fill in the details to create a new exam entry.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="examName">Exam Name</Label>
                                    <Input id="examName" placeholder="e.g., Mid-term Exam" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weightage">Weightage (%)</Label>
                                    <Input id="weightage" type="number" placeholder="e.g., 40" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Grade</Label>
                                        <Popover open={gradeOpen} onOpenChange={setGradeOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" aria-expanded={gradeOpen} className="w-full justify-between font-normal">
                                                    {selectedGrade ? grades.find((g) => g === selectedGrade) : "Select Grade..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search grade..." />
                                                    <CommandList>
                                                        <CommandEmpty>No grade found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {grades.map((grade) => (
                                                                <CommandItem
                                                                    key={grade}
                                                                    value={grade}
                                                                    onSelect={() => {
                                                                        setSelectedGrade(grade === selectedGrade ? "" : grade);
                                                                        setGradeOpen(false);
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedGrade === grade ? "opacity-100" : "opacity-0")} />
                                                                    {grade}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Section</Label>
                                        <Popover open={sectionOpen} onOpenChange={setSectionOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" aria-expanded={sectionOpen} className="w-full justify-between font-normal">
                                                    {selectedSection ? sections.find((s) => s === selectedSection) : "Select Section..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search section..." />
                                                    <CommandList>
                                                        <CommandEmpty>No section found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {sections.map((section) => (
                                                                <CommandItem
                                                                    key={section}
                                                                    value={section}
                                                                    onSelect={() => {
                                                                        setSelectedSection(section === selectedSection ? "" : section);
                                                                        setSectionOpen(false);
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedSection === section ? "opacity-100" : "opacity-0")} />
                                                                    {section}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                     <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={subjectOpen} className="w-full justify-between font-normal">
                                                {selectedSubject ? subjects.find((s) => s === selectedSubject) : "Select Subject..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search subject..." />
                                                <CommandList>
                                                    <CommandEmpty>No subject found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {subjects.map((subject) => (
                                                            <CommandItem
                                                                key={subject}
                                                                value={subject}
                                                                onSelect={() => {
                                                                    setSelectedSubject(subject === selectedSubject ? "" : subject);
                                                                    setSubjectOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", selectedSubject === subject ? "opacity-100" : "opacity-0")} />
                                                                {subject}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Exam</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam Name</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Weightage (%)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {examsData.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell className="font-medium">{exam.name}</TableCell>
                                <TableCell>{exam.grade}</TableCell>
                                <TableCell>{exam.section}</TableCell>
                                <TableCell>{exam.subject}</TableCell>
                                <TableCell>{exam.weightage}%</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
