
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
import { Exam, ResultStatus } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { getResultsForExamAction, submitResultsForApprovalAction } from "./actions";


type StudentResult = {
  id: string; // studentId
  name: string;
  score: string;
  status: ResultStatus;
};

type EnterResultsClientProps = {
    examsForSelection: Exam[];
}


export default function EnterResultsClient({ examsForSelection }: EnterResultsClientProps) {
    const { toast } = useToast();
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResult[]>([]);
    const [initialStudents, setInitialStudents] = useState<StudentResult[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gradingType, setGradingType] = useState<'DECIMAL' | 'LETTER'>('DECIMAL');

    const handleExamSelect = async (examId: string) => {
        setSelectedExam(examId);
        setIsLoading(true);
        setStudents([]);
        
        const result = await getResultsForExamAction(examId);

        if (result.success && result.data) {
            setStudents(result.data);
            setInitialStudents(JSON.parse(JSON.stringify(result.data))); // Deep copy for initial state
            setGradingType(result.gradingType || 'DECIMAL');
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        
        setSearchTerm("");
        setIsLoading(false);
    };
    
    const handleScoreChange = (studentId: string, score: string) => {
        setStudents(students.map(s => s.id === studentId ? {...s, score} : s));
    };

    const handleSubmitForApproval = async () => {
        if (!selectedExam) return;
        setIsSubmitting(true);
        
        const changedResults = students.filter(s => {
            const initialStudent = initialStudents.find(is => is.id === s.id);
            if (!initialStudent) return true; // Should not happen
            return s.score !== initialStudent.score && s.score !== '';
        });
        
        if (changedResults.length === 0) {
            toast({ title: "No Changes", description: "No new or modified scores to submit." });
            setIsSubmitting(false);
            return;
        }

        const resultsToSubmit = changedResults.map(s => ({ studentId: s.id, score: s.score, status: s.status }));
        const result = await submitResultsForApprovalAction(selectedExam, resultsToSubmit);
        
        if (result.success) {
            toast({ title: "Success", description: result.message });
            handleExamSelect(selectedExam); // Refresh data
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }

        setIsSubmitting(false);
    };

    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasScoresToSubmit = students.some(s => {
      const initialStudent = initialStudents.find(is => is.id === s.id);
      if (s.score && s.score !== (initialStudent?.score || '')) {
         return ['PENDING', 'APPROVED'].includes(s.status);
      }
      return false;
    });

    const getBadgeVariant = (status: StudentResult['status']) => {
        switch (status) {
            case 'APPROVED':
            case 'FINALIZED':
                return 'default';
            case 'PENDING_APPROVAL':
                return 'outline';
            case 'PENDING_REAPPROVAL':
                return 'destructive';
            default:
                return 'secondary';
        }
    }

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

                    {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

                    {!isLoading && selectedExam && (
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
                                                    <TableCell className="font-mono">{student.id.split('-')[0].toUpperCase()}</TableCell>
                                                    <TableCell className="font-medium">{student.name}</TableCell>
                                                    <TableCell>
                                                        {gradingType === 'DECIMAL' ? (
                                                            <Input 
                                                                type="number" 
                                                                placeholder="Enter score" 
                                                                className="w-32"
                                                                value={student.score}
                                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                                disabled={isSubmitting || !['PENDING', 'APPROVED'].includes(student.status)}
                                                            />
                                                        ) : (
                                                            <Input 
                                                                type="text" 
                                                                placeholder="Enter grade" 
                                                                className="w-32"
                                                                value={student.score}
                                                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                                disabled={isSubmitting || !['PENDING', 'APPROVED'].includes(student.status)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Badge variant={getBadgeVariant(student.status)}>{student.status}</Badge>
                                                            {student.status === 'FINALIZED' && (
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
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
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
                    {!isLoading && !selectedExam && (
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

