
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentForm, StudentRegistrationFormValues } from "./student-form";
import { useAcademicYear } from "@/context/academic-year-context";
import { DetailedStudent, getGrades, getSections } from "@/lib/data";
import type { Grade, Section } from "@prisma/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type StudentListProps = {
    students: DetailedStudent[];
    grades: Grade[];
    sections: Section[];
}

export function StudentList({ students: initialStudents, grades, sections }: StudentListProps) {
    const { selectedYear } = useAcademicYear(); // This context can be used later to filter by enrollment year
    const [students, setStudents] = useState<DetailedStudent[]>(initialStudents);
    const [editingStudent, setEditingStudent] = useState<DetailedStudent | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const { toast } = useToast();

    const filteredStudents = students.filter(student => {
        const name = `${student.firstName} ${student.lastName}`;
        const nameMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || student.grade.id === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || student.section.id === sectionFilter;
        // Not filtering by academic year yet as enrollments are not fully wired up.
        return nameMatch && gradeMatch && sectionMatch;
    });

    const handleEditSubmit = (data: StudentRegistrationFormValues) => {
        if (!editingStudent) return;
        
        // This is where you would call a server action to update the student
        
        setEditingStudent(null); // Close the dialog
        toast({
          title: "Student Updated",
          description: "Student information has been saved.",
        });
    };

    const getInitialFormValues = (student: DetailedStudent | null): Partial<StudentRegistrationFormValues> | undefined => {
        if (!student) return undefined;
        
        const parent = student.parents[0]; // Assuming one parent for simplicity

        return {
            studentFirstName: student.firstName || "",
            studentMiddleName: student.user.middleName || "",
            studentLastName: student.lastName || "",
            studentDob: student.dob,
            studentGender: student.gender,
            grade: student.gradeId,
            section: student.sectionId,
            
            parentFirstName: parent?.firstName || "",
            parentMiddleName: parent?.user.middleName || "",
            parentLastName: parent?.lastName || "",
            parentPhone: parent?.user.phone || "",
            parentRelation: parent?.relationToStudent || "Parent",

            addressLine1: student.user.addressLine1 || "",
            city: student.user.city || "",
            state: student.user.state || "",
            zipCode: student.user.zipCode || "",
        };
    }
    
  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>View and manage students enrolled in the {selectedYear} academic year.</CardDescription>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:grid sm:grid-cols-3">
            <div className="relative col-span-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by student name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="space-y-1">
                <Select onValueChange={setGradeFilter} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by grade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map(grade => <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Select onValueChange={setSectionFilter} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {sections.map(section => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}
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
                <TableHead>Student Name</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const parent = student.parents[0]; // Assuming one parent for simplicity
                return (
                    <TableRow key={student.id}>
                    <TableCell className="font-medium">{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell>{format(student.dob, 'PPP')}</TableCell>
                    <TableCell>{student.grade.name}</TableCell>
                    <TableCell>{student.section.name}</TableCell>
                    <TableCell>{parent ? `${parent.firstName} ${parent.lastName}` : 'N/A'}</TableCell>
                    <TableCell>{parent?.user.phone ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingStudent(student)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Student</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete Student</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length === 0 && (
            <div className="text-center p-8 text-muted-foreground mt-4">
                No students match the current filters for the {selectedYear} academic year.
            </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={!!editingStudent} onOpenChange={(isOpen) => !isOpen && setEditingStudent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Edit Student Information</DialogTitle>
                <DialogDescription>
                Make changes to {editingStudent?.firstName}'s profile. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            {editingStudent && (
                <div className="py-4">
                    <StudentForm 
                        initialData={getInitialFormValues(editingStudent)} 
                        onSubmit={handleEditSubmit} 
                        submitButtonText="Save Changes" 
                        grades={grades}
                        sections={sections}
                    />
                </div>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
