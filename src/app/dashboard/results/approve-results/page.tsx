
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
  status: 'Pending' | 'Pending Approval' | 'Approved' | 'Pending Re-approval' | 'Finalized';
};

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const examsForSelection: { id: string; name: string }[] = [];
const initialStudentsData: Record<string, StudentResult[]> = {};


export default function ApproveResultsPage() {
    const [open, setOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [studentsForApproval, setStudentsForApproval] = useState<StudentResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Using a state that can be mutated to simulate DB changes
    const [allStudentsData, setAllStudentsData] = useState(initialStudentsData);

    const examsWithPendingApprovals = examsForSelection.filter(exam =>
        allStudentsData[exam.id]?.some(s => ['Pending Approval', 'Pending Re-approval'].includes(s.status))
    );

    const handleExamSelect = (examId: string) => {
        setSelectedExam(examId);
        const examStudents = allStudentsData[examId] || [];
        setStudentsForApproval(examStudents.filter(s => ['Pending Approval', 'Pending Re-approval'].includes(s.status)));
    };
    
    const handleAction = async (studentId: string, action: 'approve' | 'reject') => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAllStudentsData(prevData => {
            if (!selectedExam) return prevData;
            const updatedExamStudents = prevData[selectedExam].map(s => {
                if (s.id === studentId) {
                    let newStatus: StudentResult['status'] = s.status;
                    if (action === 'approve') {
                        newStatus = s.status === 'Pending Approval' ? 'Approved' : 'Finalized';
                    } else { // reject
                        newStatus = s.status === 'Pending Approval' ? 'Pending' : 'Approved';
                    }
                    return { ...s, status: newStatus };
                }
                return s;
            });
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
            const updatedExamStudents = prevData[selectedExam].map(s => {
                if (['Pending Approval', 'Pending Re-approval'].includes(s.status)) {
                    let newStatus: StudentResult['status'] = s.status;
                     if (action === 'approve') {
                        newStatus = s.status === 'Pending Approval' ? 'Approved' : 'Finalized';
                    } else { // reject
                        newStatus = s.status === 'Pending Approval' ? 'Pending' : 'Approved';
                    }
                    return { ...s, status: newStatus };
                }
                return s;
            });
            return { ...prevData, [selectedExam]: updatedExamStudents };
        });
        
        setStudentsForApproval([]);
        setIsLoading(false);
    };

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
                    <CardDescription>Review and approve or reject submitted exam scores. You can also finalize results that have been re-submitted.</CardDescription>
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
                                                                        Are you sure you want to approve the score of {student.score} for {student.name}? 
                                                                        {student.status === 'Pending Re-approval' && " This result will be finalized and cannot be edited further."}
                                                                        {student.status === 'Pending Approval' && " The teacher can make exceptional edits later, which will require re-approval."}
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
                                                                        This will return the result to '{student.status === 'Pending Approval' ? 'Pending' : 'Approved'}' status, allowing the teacher to edit and resubmit it.
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
                                                    This will return all pending results for this exam to their previous status. This action cannot be undone.
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
