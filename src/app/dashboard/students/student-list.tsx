
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

type Student = {
    id: string;
    name: string;
    grade: string;
    section: string;
    parentName: string;
    email: string;
    enrollmentYear: string;
};

const studentsData: Student[] = [
  { id: 's001', name: 'John Doe', grade: 'Grade 10', section: 'A', parentName: 'Jane Doe', email: 'jane.doe@example.com', enrollmentYear: '2024-2025' },
  { id: 's002', name: 'Alice Smith', grade: 'Grade 9', section: 'B', parentName: 'Robert Smith', email: 'robert.smith@example.com', enrollmentYear: '2024-2025' },
  { id: 's003', name: 'Bob Johnson', grade: 'Grade 10', section: 'A', parentName: 'Mary Johnson', email: 'mary.johnson@example.com', enrollmentYear: '2024-2025' },
  { id: 's004', name: 'Charlie Brown', grade: 'Grade 11', section: 'C', parentName: 'Lucy Brown', email: 'lucy.brown@example.com', enrollmentYear: '2023-2024' },
  { id: 's005', name: 'Diana Prince', grade: 'Grade 9', section: 'A', parentName: 'Hippolyta Prince', email: 'hippolyta.prince@example.com', enrollmentYear: '2023-2024' },
];

const academicYears = ["2024-2025", "2023-2024"];
const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];

export function StudentList() {
    const [students, setStudents] = useState<Student[]>(studentsData);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");

    const filteredStudents = students.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || student.grade === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || student.section === sectionFilter;
        const yearMatch = yearFilter === 'all' || student.enrollmentYear === yearFilter;
        return nameMatch && gradeMatch && sectionMatch && yearMatch;
    });

    const handleEditSubmit = (data: StudentRegistrationFormValues) => {
        if (!editingStudent) return;
        
        const updatedStudent: Student = {
            id: editingStudent.id,
            name: `${data.studentFirstName} ${data.studentLastName}`,
            grade: data.grade,
            section: data.section,
            parentName: `${data.parentFirstName} ${data.parentLastName}`,
            email: data.parentEmail,
            enrollmentYear: editingStudent.enrollmentYear, // This field is not on the form, so we keep the original
        };

        setStudents(currentStudents => 
            currentStudents.map(s => (s.id === editingStudent.id ? updatedStudent : s))
        );
        
        setEditingStudent(null); // Close the dialog
        alert("Student information updated!");
    };

    const getInitialFormValues = (student: Student | null): Partial<StudentRegistrationFormValues> | undefined => {
        if (!student) return undefined;
        
        const studentNameParts = student.name.split(' ');
        const parentNameParts = student.parentName.split(' ');

        return {
            studentFirstName: studentNameParts[0] || "",
            studentLastName: studentNameParts.slice(1).join(' ') || "",
            grade: student.grade,
            section: student.section,
            parentFirstName: parentNameParts[0] || "",
            parentLastName: parentNameParts.slice(1).join(' ') || "",
            parentEmail: student.email,
            // Mocking other required fields for the form
            studentDob: new Date('2008-01-01'),
            studentGender: 'Male',
            parentRelation: 'Father',
            parentPhone: '1234567890',
            addressLine1: '123 Mock Street',
            city: 'Mockville',
            state: 'MC',
            zipCode: '12345',
        };
    }
    
  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>View, search, and manage student records.</CardDescription>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:grid sm:grid-cols-4">
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
                <Select onValueChange={setYearFilter} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {academicYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Select onValueChange={setGradeFilter} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by grade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
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
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Enrollment Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">{student.id.toUpperCase()}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.enrollmentYear}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length === 0 && (
            <div className="text-center p-8 text-muted-foreground mt-4">
                No students match the current filters.
            </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={!!editingStudent} onOpenChange={(isOpen) => !isOpen && setEditingStudent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Edit Student Information</DialogTitle>
                <DialogDescription>
                Make changes to {editingStudent?.name}'s profile. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            {editingStudent && (
                <div className="py-4">
                    <StudentForm 
                        initialData={getInitialFormValues(editingStudent)} 
                        onSubmit={handleEditSubmit} 
                        submitButtonText="Save Changes" 
                    />
                </div>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
