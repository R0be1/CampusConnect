"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, ThumbsDown, ThumbsUp, Loader2, Info, CheckCircle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the type for a student's result
type StudentResult = {
  id: string;
  name: string;
  score: string;
  status: 'Pending' | 'Pending Approval' | 'Approved';
};

// This data should eventually come from a central store/API.
// For now, we are creating a mutable version for the demo.
const examsForSelection = [
  { id: 'exam1', name: 'Mid-term Exam (Grade 10, Section A, Mathematics)' },
  { id: 'exam2', name: 'Final Exam (Grade 10, Section A, Mathematics)' },
  { id: 'exam3', name: 'Unit Test 1 (Grade 9, Section B, Science)' },
  { id: 'exam4', name: 'Mid-term Exam (Grade 9, Section B, History)' },
  { id: 'exam5', name: 'Final Exam (Grade 11, Section C, Physics)' },
  { id: 'exam6', name: 'Unit Test 2 (Grade 10, Section C, Chemistry)' },
];

const initialStudentsData: Record<string, StudentResult[]> = {
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
    exam4: [
      // No data for this exam initially
    ],
    exam5: [
      // No data for this exam initially
    ],
    exam6: [
      { id: 's010', name: 'Tony Stark', score: '100', status: 'Pending Approval' },
      { id: 's011', name: 'Steve Rogers', score: '95', status: 'Pending Approval' },
    ]
};


export default function ApproveResultsPage() {
    const [open, setOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [studentsForApproval, setStudentsForApproval] = useState<StudentResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Using a state that can be mutated to simulate DB changes
    const [allStudentsData, setAllStudentsData] = useState(initialStudentsData);

    const examsWithPendingApprovals = examsForSelection.filter(exam =>
        allStudentsData[exam.id]?.some(s => s.status === 'Pending Approval')
    );

    const handleExamSelect = (examId: string) => {
        setSelectedExam(examId);
        const examStudents = allStudentsData[examId] || [];
        setStudentsForApproval(examStudents.filter(s => s.status === 'Pending Approval'));
    };
    
    const handleAction = async (studentId: string, action: 'approve' | 'reject') => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAllStudentsData(prevData => {
            if (!selectedExam) return prevData;
            const updatedExamStudents = prevData[selectedExam].map(s => 
                s.id === studentId ? { ...s, status: action === 'approve' ? 'Approved' : 'Pending' } : s
            );
            return { ...prevData, [selectedExam]: updatedExamStudents };
        });

        setStudentsForApproval(prevStudents => prevStudents.filter(s => s.id !== studentId));
        setIsLoading(false);
    };

    const handleBulkAction = async (action: 'approve' | 'reject') => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setAllStudentsData(prevData => {
            if (!selectedExam) return prevData;
            const updatedExamStudents = prevData[selectedExam].map(s => 
                s.status === 'Pending Approval' ? { ...s, status: action === 'approve' ? 'Approved' : 'Pending' } : s
            );
            return { ...prevData, [selectedExam]: updatedExamStudents };
        });
        
        setStudentsForApproval([]);
        setIsLoading(false);
    };

    const getBadgeVariant = (status: StudentResult['status']) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending Approval': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Approve Results</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Approve Student Results</CardTitle>
                    <CardDescription>Review and approve or reject submitted exam scores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="max-w-md space-y-2">
                        <Label>Select Exam for Approval</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                    disabled={isLoading}
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
                                        <CommandEmpty>No pending approvals found.</CommandEmpty>
                                        <CommandGroup>
                                            {examsWithPendingApprovals.map((exam) => (
                                                <CommandItem
                                                    key={exam.id}
                                                    value={exam.name}
                                                    onSelect={() => {
                                                        handleExamSelect(exam.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedExam === exam.id ? "opacity-100" : "opacity-0")} />
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
                            {isLoading && (
                                <div className="flex items-center text-sm text-primary">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing request...
                                </div>
                            )}
                            
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Submitted Score</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentsForApproval.length > 0 ? (
                                            studentsForApproval.map(student => (
                                                <TableRow key={student.id} className={isLoading ? 'opacity-50' : ''}>
                                                    <TableCell className="font-medium">{student.name}</TableCell>
                                                    <TableCell className="font-semibold">{student.score}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getBadgeVariant(student.status)}>{student.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="icon" className="h-8 w-8" disabled={isLoading}><ThumbsUp className="h-4 w-4" /></Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Approve Result?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to approve the score of {student.score} for {student.name}? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleAction(student.id, 'approve')}>Approve</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="icon" className="h-8 w-8" disabled={isLoading}><ThumbsDown className="h-4 w-4" /></Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Reject Result?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will return the result to 'Pending' status, allowing the teacher to edit and resubmit it.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleAction(student.id, 'reject')}>Reject</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No pending approvals for this exam.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {studentsForApproval.length > 0 && (
                                <div className="flex justify-end space-x-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" disabled={isLoading}>
                                                <ThumbsDown className="mr-2 h-4 w-4" /> Reject All
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reject All {studentsForApproval.length} Results?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will return all pending results for this exam to 'Pending' status. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleBulkAction('reject')}>Confirm & Reject All</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button disabled={isLoading}>
                                                <ThumbsUp className="mr-2 h-4 w-4" /> Approve All
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve All {studentsForApproval.length} Results?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will approve all {studentsForApproval.length} pending results for this exam. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleBulkAction('approve')}>Confirm & Approve All</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    )}
                    {!selectedExam && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Select an Exam</AlertTitle>
                            <AlertDescription>Please select an exam from the list to view and approve results. Only exams with results pending approval are shown.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
