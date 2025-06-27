
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Check, ChevronsUpDown, Search, Edit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAcademicYear } from "@/context/academic-year-context";


// Placeholder data
const examsData = [
  { id: 'exam1', name: 'Mid-term Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 40, gradingType: 'Decimal', academicYear: '2024-2025' },
  { id: 'exam2', name: 'Final Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 60, gradingType: 'Decimal', academicYear: '2024-2025' },
  { id: 'exam3', name: 'Unit Test 1', grade: 'Grade 9', section: 'B', subject: 'Science', weightage: 20, gradingType: 'Decimal', academicYear: '2024-2025' },
  { id: 'exam4', name: 'Mid-term Exam', grade: 'Grade 9', section: 'B', subject: 'History', weightage: 50, gradingType: 'Letter', academicYear: '2024-2025' },
  { id: 'exam5', name: 'Final Exam', grade: 'Grade 11', section: 'C', subject: 'Physics', weightage: 70, gradingType: 'Decimal', academicYear: '2023-2024' },
  { id: 'exam6', name: 'Unit Test 2', grade: 'Grade 10', section: 'C', subject: 'Chemistry', weightage: 30, gradingType: 'Letter', academicYear: '2023-2024' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

type Exam = typeof examsData[0];

export default function ManageExamsPage() {
    const { selectedYear, availableYears } = useAcademicYear();
    const [exams, setExams] = useState<Exam[]>(examsData);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    // State for Add New Exam dialog
    const [gradeOpen, setGradeOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState("");

    const [sectionOpen, setSectionOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState("");

    const [subjectOpen, setSubjectOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");

    // State for Edit Exam dialog
    const [editGradeOpen, setEditGradeOpen] = useState(false);
    const [editSelectedGrade, setEditSelectedGrade] = useState("");

    const [editSectionOpen, setEditSectionOpen] = useState(false);
    const [editSelectedSection, setEditSelectedSection] = useState("");

    const [editSubjectOpen, setEditSubjectOpen] = useState(false);
    const [editSelectedSubject, setEditSelectedSubject] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");

    const filteredExams = exams.filter(exam => {
        const nameMatch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || exam.grade === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || exam.section === sectionFilter;
        const yearMatch = exam.academicYear === selectedYear;
        return nameMatch && gradeMatch && sectionMatch && yearMatch;
    });

    const handleDelete = (id: string) => {
        setExams(currentExams => currentExams.filter(exam => exam.id !== id));
    };

    const handleEditClick = (exam: Exam) => {
        setEditingExam(exam);
        setEditSelectedGrade(exam.grade);
        setEditSelectedSection(exam.section);
        setEditSelectedSubject(exam.subject);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Edit className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Manage Exams</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Exam Definitions</CardTitle>
                            <CardDescription>Define exams for the academic year: {selectedYear}</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4" /> Define New Exam</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Define New Exam</DialogTitle>
                                    <DialogDescription>Fill in the details to create a new exam entry for {selectedYear}.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <Input readOnly disabled value={selectedYear} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="examName">Exam Name</Label>
                                        <Input id="examName" placeholder="e.g., Mid-term Exam" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weightage">Weightage (%)</Label>
                                        <Input id="weightage" type="number" placeholder="e.g., 40" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gradingType">Grading Type</Label>
                                        <Select>
                                            <SelectTrigger id="gradingType">
                                                <SelectValue placeholder="Select Grading Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Decimal">Decimal</SelectItem>
                                                <SelectItem value="Letter">Letter Grade</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="examSearch">Search by Name</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="examSearch"
                                    placeholder="e.g., Mid-term..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="gradeFilter">Filter by Grade</Label>
                            <Select onValueChange={setGradeFilter} defaultValue="all">
                                <SelectTrigger id="gradeFilter">
                                    <SelectValue placeholder="Filter by grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {grades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="sectionFilter">Filter by Section</Label>
                            <Select onValueChange={setSectionFilter} defaultValue="all">
                                <SelectTrigger id="sectionFilter">
                                    <SelectValue placeholder="Filter by section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {sections.map(section => <SelectItem key={section} value={section}>{section}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Weightage (%)</TableHead>
                                    <TableHead>Grading Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExams.length > 0 ? (
                                    filteredExams.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell className="font-medium">{exam.name}</TableCell>
                                            <TableCell>{exam.grade}</TableCell>
                                            <TableCell>{exam.section}</TableCell>
                                            <TableCell>{exam.subject}</TableCell>
                                            <TableCell>{exam.weightage}%</TableCell>
                                            <TableCell>{exam.gradingType}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(exam)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete this exam definition.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(exam.id)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No exams found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                <Dialog open={!!editingExam} onOpenChange={(isOpen) => !isOpen && setEditingExam(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Exam Definition</DialogTitle>
                            <DialogDescription>Make changes to the exam details below.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Input readOnly disabled value={editingExam?.academicYear ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editExamName">Exam Name</Label>
                                <Input id="editExamName" defaultValue={editingExam?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editWeightage">Weightage (%)</Label>
                                <Input id="editWeightage" type="number" defaultValue={editingExam?.weightage} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`edit-gradingType-${editingExam?.id}`}>Grading Type</Label>
                                <Select defaultValue={editingExam?.gradingType}>
                                    <SelectTrigger id={`edit-gradingType-${editingExam?.id}`}>
                                        <SelectValue placeholder="Select Grading Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Decimal">Decimal</SelectItem>
                                        <SelectItem value="Letter">Letter Grade</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Grade</Label>
                                    <Popover open={editGradeOpen} onOpenChange={setEditGradeOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={editGradeOpen} className="w-full justify-between font-normal">
                                                {editSelectedGrade ? editSelectedGrade : "Select Grade..."}
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
                                                                    setEditSelectedGrade(grade === editSelectedGrade ? "" : grade);
                                                                    setEditGradeOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", editSelectedGrade === grade ? "opacity-100" : "opacity-0")} />
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
                                    <Popover open={editSectionOpen} onOpenChange={setEditSectionOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={editSectionOpen} className="w-full justify-between font-normal">
                                                {editSelectedSection ? editSelectedSection : "Select Section..."}
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
                                                                    setEditSelectedSection(section === editSelectedSection ? "" : section);
                                                                    setEditSectionOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", editSelectedSection === section ? "opacity-100" : "opacity-0")} />
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
                                    <Popover open={editSubjectOpen} onOpenChange={setEditSubjectOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={editSubjectOpen} className="w-full justify-between font-normal">
                                            {editSelectedSubject ? editSelectedSubject : "Select Subject..."}
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
                                                                setEditSelectedSubject(subject === editSelectedSubject ? "" : subject);
                                                                setEditSubjectOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", editSelectedSubject === subject ? "opacity-100" : "opacity-0")} />
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
                            <Button type="submit" onClick={() => setEditingExam(null)}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}
