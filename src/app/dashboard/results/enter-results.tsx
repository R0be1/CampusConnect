
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileUp, Info, Search, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the type for a student's result
type StudentResult = {
  id: string;
  name: string;
  score: string;
  status: 'Pending' | 'Pending Approval' | 'Approved';
};

// Placeholder data
const examsForSelection = [
  { id: 'exam1', name: 'Mid-term Exam (Grade 10, Section A, Mathematics)' },
  { id: 'exam2', name: 'Final Exam (Grade 10, Section A, Mathematics)' },
  { id: 'exam3', name: 'Unit Test 1 (Grade 9, Section B, Science)' },
  { id: 'exam4', name: 'Mid-term Exam (Grade 9, Section B, History)' },
  { id: 'exam5', name: 'Final Exam (Grade 11, Section C, Physics)' },
  { id: 'exam6', name: 'Unit Test 2 (Grade 10, Section C, Chemistry)' },
];

const studentsForResults: Record<string, StudentResult[]> = {
    exam1: [
      { id: 's001', name: 'John Doe', score: '85', status: 'Approved' },
      { id: 's003', name: 'Bob Johnson', score: '65', status: 'Pending Approval' },
      { id: 's006', name: 'Peter Parker', score: '78', status: 'Pending Approval' },
      { id: 's007', name: 'Bruce Wayne', score: '', status: 'Pending' },
    ],
    exam2: [
        { id: 's001', name: 'John Doe', score: '', status: 'Pending' },
        { id: 's003', name: 'Bob Johnson', score: '', status: 'Pending' },
        { id: 's006', name: 'Peter Parker', score: '', status: 'Pending' },
        { id: 's007', name: 'Bruce Wayne', score: '', status: 'Pending' },
    ],
    exam3: [
        { id: 's002', name: 'Alice Smith', score: '92', status: 'Pending Approval' },
        { id: 's005', name: 'Diana Prince', score: '', status: 'Pending' },
        { id: 's008', name: 'Clark Kent', score: '99', status: 'Approved' },
    ],
    exam6: [
      { id: 's010', name: 'Tony Stark', score: '100', status: 'Pending Approval' },
      { id: 's011', name: 'Steve Rogers', score: '95', status: 'Pending Approval' },
    ]
};


export function EnterResults() {
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResult[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExamSelect = (examId: string) => {
        setSelectedExam(examId);
        setStudents(studentsForResults[examId] || []);
        setSearchTerm("");
        setIsSubmitting(false);
    };
    
    const handleScoreChange = (studentId: string, score: string) => {
        setStudents(students.map(s => s.id === studentId ? {...s, score} : s));
    };

    const handleSubmitForApproval = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStudents(prevStudents => prevStudents.map(s => {
            // Only move students from 'Pending' to 'Pending Approval' if they have a score
            if (s.status === 'Pending' && s.score) {
                return { ...s, status: 'Pending Approval' };
            }
            return s;
        }));
        setIsSubmitting(false);
    };

    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasPendingScores = students.some(s => s.status === 'Pending' && s.score);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enter Student Results</CardTitle>
                <CardDescription>Select an exam to begin entering scores for students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-w-md space-y-2">
                    <Label>Select Exam</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            >
                            {selectedExam
                                ? examsForSelection.find((exam) => exam.id === selectedExam)?.name
                                : "Select an exam..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search for an exam..." />
                                <CommandList>
                                    <CommandEmpty>No exam found.</CommandEmpty>
                                    <CommandGroup>
                                        {examsForSelection.map((exam) => (
                                            <CommandItem
                                                key={exam.id}
                                                value={exam.name}
                                                onSelect={() => {
                                                    handleExamSelect(exam.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedExam === exam.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {exam.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {selectedExam && (
                    <div className="space-y-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="searchStudent"
                                placeholder="Search by student name..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-mono">{student.id.toUpperCase()}</TableCell>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Enter score" 
                                                        className="w-32"
                                                        value={student.score}
                                                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        disabled={isSubmitting || student.status !== 'Pending'}
                                                     />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        student.status === 'Approved' ? 'default' :
                                                        student.status === 'Pending Approval' ? 'outline' :
                                                        'secondary'
                                                    }>{student.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                         <div className="flex justify-end">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={isSubmitting || !hasPendingScores}>
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <FileUp className="mr-2 h-4 w-4" />
                                        )}
                                        {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will submit all entered scores for this exam for approval. You will not be able to edit them afterwards.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmitForApproval}>
                                            Confirm and Submit
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )}
                 {!selectedExam && (
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No Exam Selected</AlertTitle>
                        <AlertDescription>Please select an exam from the dropdown list to enter results.</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
