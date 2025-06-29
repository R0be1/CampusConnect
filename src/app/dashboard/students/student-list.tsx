
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentForm, StudentRegistrationFormValues } from "./student-form";
import { useAcademicYear } from "@/context/academic-year-context";
import { DetailedStudent } from "@/lib/data";
import type { Grade, Section } from "@prisma/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { updateStudentAction, deleteStudentAction } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


type StudentListProps = {
    students: DetailedStudent[];
    grades: Grade[];
    sections: Section[];
}

export function StudentList({ students: initialStudents, grades, sections }: StudentListProps) {
    const { selectedYear } = useAcademicYear(); // This context can be used later to filter by enrollment year
    const [students, setStudents] = useState<DetailedStudent[]>(initialStudents);
    const [editingStudent, setEditingStudent] = useState<DetailedStudent | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [filteredSections, setFilteredSections] = useState<Section[]>(sections);
    const { toast } = useToast();

    useEffect(() => {
        if(gradeFilter === 'all') {
            setFilteredSections(sections);
        } else {
            setFilteredSections(sections.filter(s => s.gradeId === gradeFilter));
        }
        setSectionFilter("all");
    }, [gradeFilter, sections]);

    const filteredStudents = students.filter(student => {
        const name = `${student.firstName} ${student.lastName}`;
        const nameMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || student.grade.id === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || student.section.id === sectionFilter;
        // Not filtering by academic year yet as enrollments are not fully wired up.
        return nameMatch && gradeMatch && sectionMatch;
    });

    const handleEditSubmit = async (data: StudentRegistrationFormValues, resetForm: () => void) => {
        if (!editingStudent) return;
        setIsUpdating(true);
        
        const result = await updateStudentAction(editingStudent.id, data);
        
        if (result.success && result.updatedStudent) {
            setStudents(prev => prev.map(s => s.id === editingStudent.id ? result.updatedStudent as DetailedStudent : s));
            setEditingStudent(null);
            toast({
              title: "Student Updated",
              description: result.message,
            });
        } else {
            toast({
              title: "Update Failed",
              description: result.message || "An unknown error occurred.",
              variant: "destructive"
            });
        }
        setIsUpdating(false);
    };
    
    const handleDelete = async (studentId: string) => {
        setIsDeleting(true);
        const result = await deleteStudentAction(studentId);
        if (result.success) {
            setStudents(prev => prev.filter(s => s.id !== studentId));
            toast({
                title: "Student Deleted",
                description: result.message,
            });
        } else {
            toast({
                title: "Deletion Failed",
                description: result.message,
                variant: "destructive",
            });
        }
        setIsDeleting(false);
    };

    const getInitialFormValues = (student: DetailedStudent | null): Partial<StudentRegistrationFormValues> | undefined => {
        if (!student) return undefined;
        
        const parent = student.parents[0];
        const contactUser = parent?.user || student.user;

        return {
            studentFirstName: student.firstName || "",
            studentMiddleName: student.user.middleName || "",
            studentLastName: student.lastName || "",
            studentDob: student.dob,
            studentGender: student.gender as "MALE" | "FEMALE" | "OTHER",
            grade: student.gradeId,
            section: student.sectionId,
            
            parentFirstName: parent?.firstName || "",
            parentMiddleName: parent?.user.middleName || "",
            parentLastName: parent?.lastName || "",
            parentPhone: parent?.user.phone || "",
            parentRelation: parent?.relationToStudent || "Parent",

            addressLine1: contactUser.addressLine1 || "",
            city: contactUser.city || "",
            state: contactUser.state || "",
            zipCode: contactUser.zipCode || "",
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
                <Select onValueChange={setGradeFilter} value={gradeFilter}>
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
                <Select onValueChange={setSectionFilter} value={sectionFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {filteredSections.map(section => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete Student</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the student
                                        "{`${student.firstName} ${student.lastName}`}" and all their associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(student.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Delete Student
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                        submitButtonText={isUpdating ? "Saving..." : "Save Changes"}
                        isSubmitting={isUpdating}
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
