
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileUp, Info, Search, Check, ChevronsUpDown, Loader2, ClipboardCheck, Lock } from "lucide-react";
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
  status: 'Pending' | 'Pending Approval' | 'Approved' | 'Pending Re-approval' | 'Finalized';
};

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const examsForSelection: { id: string; name: string; gradingType: string; }[] = [];
const studentsForResults: Record<string, StudentResult[]> = {};


export default function EnterResultsPage() {
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResult[]>([]);
    const [initialStudents, setInitialStudents] = useState<StudentResult[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExamSelect = (examId: string) => {
        setSelectedExam(examId);
        const examStudents = studentsForResults[examId] || [];
        setStudents(JSON.parse(JSON.stringify(examStudents)));
        setInitialStudents(JSON.parse(JSON.stringify(examStudents)));
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
            const initialStudent = initialStudents.find(is => is.id === s.id);
            if (s.status === 'Pending' && s.score) {
                return { ...s, status: 'Pending Approval' };
            }
            if (s.status === 'Approved' && s.score && s.score !== initialStudent?.score) {
                return { ...s, status: 'Pending Re-approval' };
            }
            return s;
        }));
        setIsSubmitting(false);
    };

    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasScoresToSubmit = students.some(s => {
      if (s.status === 'Pending' && s.score) {
        return true;
      }
      if (s.status === 'Approved') {
        const initialStudent = initialStudents.find(is => is.id === s.id);
        return s.score && s.score !== initialStudent?.score;
      }
      return false;
    });

    const getBadgeVariant = (status: StudentResult['status']) => {
        switch (status) {
            case 'Approved':
            case 'Finalized':
                return 'default';
            case 'Pending Approval':
                return 'outline';
            case 'Pending Re-approval':
                return 'destructive';
            default:
                return 'secondary';
        }
    }

    const selectedExamDetails = examsForSelection.find(exam => exam.id === selectedExam);
    const gradingType = selectedExamDetails?.gradingType || 'Decimal';

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <ClipboardCheck className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Enter Results</h1>
            </div>
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
                                                        {gradingType === 'Decimal' ? (
                                                            <Input 
                                                                type="number" 
                                                                placeholder="Enter score" 
                                                                className="w-32"
                                                                value={student.score}
                                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                                disabled={isSubmitting || !['Pending', 'Approved'].includes(student.status)}
                                                            />
                                                        ) : (
                                                            <Input 
                                                                type="text" 
                                                                placeholder="Enter grade" 
                                                                className="w-32"
                                                                value={student.score}
                                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                                disabled={isSubmitting || !['Pending', 'Approved'].includes(student.status)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Badge variant={getBadgeVariant(student.status)}>{student.status}</Badge>
                                                            {student.status === 'Finalized' && (
                                                                <Lock className="ml-2 h-3 w-3 text-muted-foreground" />
                                                            )}
                                                        </div>
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
                                        <Button disabled={isSubmitting || !hasScoresToSubmit}>
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
                                                This action will submit all new and edited scores for approval. You will not be able to edit them further until they are reviewed.
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
        </div>
    );
}
