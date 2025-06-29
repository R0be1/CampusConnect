
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Trash2, UserPlus, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { assignConcessionAction, revokeConcessionAction } from "./actions";

type Student = { id: string; name: string; grade: string; section: string };
type Concession = { id: string; name: string };
type Assignment = { id: string, studentId: string, studentName: string, concessionId: string, concessionName: string, academicYear: string };

type AssignClientPageProps = {
    studentsData: Student[];
    concessionSchemes: Concession[];
    initialAssignedConcessions: Assignment[];
    academicYearId: string;
    academicYearName: string;
};

export default function AssignClientPage({ studentsData, concessionSchemes, initialAssignedConcessions, academicYearId, academicYearName }: AssignClientPageProps) {
    const { toast } = useToast();
    const [assignedConcessions, setAssignedConcessions] = useState(initialAssignedConcessions);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [studentOpen, setStudentOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    const [concessionOpen, setConcessionOpen] = useState(false);
    const [selectedConcession, setSelectedConcession] = useState<string | null>(null);

    const handleAssign = async () => {
        if (!selectedStudent || !selectedConcession || !academicYearId) return;

        setIsLoading(true);
        const result = await assignConcessionAction(selectedStudent, selectedConcession, academicYearId);
        setIsLoading(false);

        if (result.success) {
            window.location.reload(); 
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleDelete = async (id: string) => {
        const result = await revokeConcessionAction(id);
        if (result.success) {
             setAssignedConcessions(assignedConcessions.filter(a => a.id !== id));
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Assign Concession to Student</CardTitle>
                    <CardDescription>Select a student and a concession scheme to apply for the academic year: {academicYearName}</CardDescription>
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
                    <Button onClick={handleAssign} disabled={!selectedStudent || !selectedConcession || isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserPlus className="mr-2 h-4 w-4" />}
                        Assign Concession
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Current Assignments for {academicYearName}</CardTitle>
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
                                {assignedConcessions.length > 0 ? assignedConcessions.map(a => (
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
