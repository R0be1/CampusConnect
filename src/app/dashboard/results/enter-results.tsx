
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileUp, Info, Search, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Placeholder data
const examsForSelection = [
  { id: 'exam1', name: 'Mid-term Exam (Grade 10, Section A, Mathematics)' },
  { id: 'exam3', name: 'Unit Test 1 (Grade 9, Section B, Science)' },
];

const studentsForResults: Record<string, {id: string, name: string, score: string, status: string}[]> = {
    exam1: [
      { id: 's001', name: 'John Doe', score: '', status: 'Pending' },
      { id: 's003', name: 'Bob Johnson', score: '', status: 'Pending' },
    ],
    exam3: [
        { id: 's002', name: 'Alice Smith', score: '', status: 'Pending' },
        { id: 's005', name: 'Diana Prince', score: '', status: 'Pending' },
    ]
};

export function EnterResults() {
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);

    const handleExamSelect = (examId: string) => {
        setSelectedExam(examId);
        setStudents(studentsForResults[examId] || []);
        setSearchTerm("");
    };
    
    const handleScoreChange = (studentId: string, score: string) => {
        setStudents(students.map(s => s.id === studentId ? {...s, score} : s));
    };

    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                                     />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={student.status === 'Approved' ? 'default' : 'secondary'}>{student.status}</Badge>
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
                            <Button>
                                <FileUp className="mr-2 h-4 w-4" />
                                Submit for Approval
                            </Button>
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
