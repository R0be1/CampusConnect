
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Trash2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcademicYear } from "@/context/academic-year-context";
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

// MOCK DATA

const studentsData = [
  { id: 's001', name: 'John Doe', grade: 'Grade 10', section: 'A' },
  { id: 's002', name: 'Alice Smith', grade: 'Grade 9', section: 'B' },
  { id: 's003', name: 'Bob Johnson', grade: 'Grade 10', section: 'A' },
  { id: 's004', name: 'Charlie Brown', grade: 'Grade 11', section: 'C' },
  { id: 's005', name: 'Diana Prince', grade: 'Grade 9', section: 'A' },
];

const concessionSchemes = [
    { id: 'con01', name: 'Merit-Based Scholarship' },
    { id: 'con02', name: 'Sibling Discount' },
    { id: 'con03', name: 'Early Bird Discount' },
    { id: 'con04', name: 'Staff Child Discount' },
];

const initialAssignedConcessions = [
    { id: 'ac1', studentId: 's001', studentName: 'John Doe', concessionId: 'con01', concessionName: 'Merit-Based Scholarship', academicYear: '2024-2025' },
    { id: 'ac2', studentId: 's002', studentName: 'Alice Smith', concessionId: 'con02', concessionName: 'Sibling Discount', academicYear: '2024-2025' },
    { id: 'ac3', studentId: 's005', studentName: 'Diana Prince', concessionId: 'con02', concessionName: 'Sibling Discount', academicYear: '2023-2024' },
]

export default function AssignConcessionPage() {
    const { selectedYear } = useAcademicYear();
    const [assignedConcessions, setAssignedConcessions] = useState(initialAssignedConcessions);

    // Form State
    const [studentOpen, setStudentOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    const [concessionOpen, setConcessionOpen] = useState(false);
    const [selectedConcession, setSelectedConcession] = useState<string | null>(null);
    
    const filteredAssignments = assignedConcessions.filter(a => a.academicYear === selectedYear);

    const handleAssign = () => {
        // Logic to add the new assignment to the state
        console.log(`Assigning concession ${selectedConcession} to student ${selectedStudent} for year ${selectedYear}`);
    };
    
    const handleDelete = (id: string) => {
        setAssignedConcessions(assignedConcessions.filter(a => a.id !== id));
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Assign Concession to Student</CardTitle>
                    <CardDescription>Select a student and a concession scheme to apply for the academic year: {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                     <div className="space-y-2">
                        <Label>Select Student</Label>
                        <Popover open={studentOpen} onOpenChange={setStudentOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                    {selectedStudent ? studentsData.find(s => s.id === selectedStudent)?.name : "Select student..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search student..." />
                                    <CommandList>
                                        <CommandEmpty>No students found.</CommandEmpty>
                                        <CommandGroup>
                                            {studentsData.map((student) => (
                                                <CommandItem key={student.id} value={student.name} onSelect={() => { setSelectedStudent(student.id); setStudentOpen(false); }}>
                                                    <Check className={cn("mr-2 h-4 w-4", selectedStudent === student.id ? "opacity-100" : "opacity-0")} />
                                                    {student.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label>Select Concession</Label>
                         <Popover open={concessionOpen} onOpenChange={setConcessionOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                                    {selectedConcession ? concessionSchemes.find(s => s.id === selectedConcession)?.name : "Select concession..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search scheme..." />
                                    <CommandList>
                                        <CommandEmpty>No schemes found.</CommandEmpty>
                                        <CommandGroup>
                                            {concessionSchemes.map((scheme) => (
                                                <CommandItem key={scheme.id} value={scheme.name} onSelect={() => { setSelectedConcession(scheme.id); setConcessionOpen(false); }}>
                                                    <Check className={cn("mr-2 h-4 w-4", selectedConcession === scheme.id ? "opacity-100" : "opacity-0")} />
                                                    {scheme.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleAssign} disabled={!selectedStudent || !selectedConcession}>
                        <UserPlus className="mr-2 h-4 w-4" /> Assign Concession
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Current Assignments for {selectedYear}</CardTitle>
                    <CardDescription>A list of all students with concessions for the selected academic year.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Concession Name</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAssignments.length > 0 ? filteredAssignments.map(a => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.studentName}</TableCell>
                                        <TableCell>{a.concessionName}</TableCell>
                                        <TableCell>{a.academicYear}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                        This will revoke this concession from the student for this academic year. This cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(a.id)}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No concessions assigned for this academic year.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
