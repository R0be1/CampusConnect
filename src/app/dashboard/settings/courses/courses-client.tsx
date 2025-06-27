
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Pencil, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Grade, Section, Staff, Course, User } from "@prisma/client";
import { createCourseAction, updateCourseAction, deleteCourseAction } from "./actions";
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

type CourseWithDetails = Course & {
    grade: Grade;
    section: Section;
    teacher: Staff & { user: User };
};

type ManageCoursesClientPageProps = {
    initialCourses: CourseWithDetails[];
    grades: Grade[];
    sections: Section[];
    teachers: (Staff & { user: User })[];
}

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required."),
  gradeId: z.string().min(1, "Grade is required."),
  sectionId: z.string().min(1, "Section is required."),
  teacherId: z.string().min(1, "Teacher is required."),
});
type CourseFormValues = z.infer<typeof courseSchema>;

export default function ManageCoursesClientPage({ initialCourses, grades, sections, teachers }: ManageCoursesClientPageProps) {
  const [coursesData, setCoursesData] = useState(initialCourses);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithDetails | null>(null);

  const filteredCourses = coursesData.filter(course => {
    const gradeMatch = gradeFilter === 'all' || course.gradeId === gradeFilter;
    const sectionMatch = sectionFilter === 'all' || course.sectionId === sectionFilter;
    return gradeMatch && sectionMatch;
  });

  const handleOpenDialog = (course: CourseWithDetails | null) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingCourse(null);
    setIsFormOpen(false);
  }

  const handleDelete = async (courseId: string) => {
    const result = await deleteCourseAction(courseId);
    if(result.success) {
        setCoursesData(prev => prev.filter(c => c.id !== courseId));
        toast({ title: "Success", description: "Course deleted successfully."});
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  }

  const handleSaveCourse = async (data: CourseFormValues) => {
    const { toast } = useToast();
    const result = editingCourse 
        ? await updateCourseAction(editingCourse.id, data)
        : await createCourseAction(data);

    if (result.success) {
        // Optimistic UI update
        const getFullData = (course: Course | any) => {
            return {
                ...course,
                grade: grades.find(g => g.id === course.gradeId)!,
                section: sections.find(s => s.id === course.sectionId)!,
                teacher: teachers.find(t => t.id === course.teacherId)!
            }
        }
        
        if (editingCourse) {
            setCoursesData(prev => prev.map(c => c.id === editingCourse.id ? getFullData(result.updatedCourse) : c));
        } else {
            setCoursesData(prev => [...prev, getFullData(result.newCourse)]);
        }
        toast({ title: `Course ${editingCourse ? 'Updated' : 'Added'}`, description: `${data.name} has been saved.`});
        handleCloseDialog();
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Add, edit, or remove courses and assign them to grades and sections.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog(null)}>
                    <PlusCircle className="mr-2" /> Add New Course
                </Button>
            </div>
            <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="gradeFilter">Grade</Label>
                    <Select onValueChange={setGradeFilter} defaultValue="all">
                        <SelectTrigger id="gradeFilter"><SelectValue placeholder="Filter by grade" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Grades</SelectItem>
                            {grades.map(grade => <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 space-y-1">
                    <Label htmlFor="sectionFilter">Section</Label>
                    <Select onValueChange={setSectionFilter} defaultValue="all">
                        <SelectTrigger id="sectionFilter"><SelectValue placeholder="Filter by section" /></SelectTrigger>
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
                            <TableHead>Course</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCourses.map(course => (
                            <TableRow key={course.id}>
                                <TableCell className="font-medium">{course.name}</TableCell>
                                <TableCell>{course.grade.name}</TableCell>
                                <TableCell>{course.section.name}</TableCell>
                                <TableCell>{course.teacher.firstName} {course.teacher.lastName}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course)}><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete this course. This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {filteredCourses.length === 0 && (
                <div className="text-center p-8 text-muted-foreground mt-4">
                    No courses match the current filters.
                </div>
            )}
        </CardContent>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog}>
                 <DialogHeader>
                    <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                    <DialogDescription>
                        {editingCourse ? "Make changes to the course below." : "Fill in the details below to create a new course."}
                    </DialogDescription>
                </DialogHeader>
                <CourseForm key={editingCourse?.id} course={editingCourse} onSave={handleSaveCourse} onClose={handleCloseDialog} grades={grades} sections={sections} teachers={teachers} />
            </DialogContent>
        </Dialog>
    </Card>
  );
}

// Reusable Form Component
type CourseFormProps = {
    course: CourseWithDetails | null;
    onSave: (data: CourseFormValues) => void;
    onClose: () => void;
    grades: Grade[];
    sections: Section[];
    teachers: (Staff & { user: User })[];
}

function CourseForm({ course, onSave, onClose, grades, sections, teachers }: CourseFormProps) {
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: course?.name || "",
            gradeId: course?.gradeId || "",
            sectionId: course?.sectionId || "",
            teacherId: course?.teacherId || ""
        }
    });
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)}>
                <div className="grid gap-4 py-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Course Name</FormLabel><FormControl><Input placeholder="e.g., Advanced Physics" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="gradeId" render={({ field }) => (
                        <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(grade => <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="sectionId" render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a section" /></SelectTrigger></FormControl><SelectContent>{sections.map(section => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="teacherId" render={({ field }) => (
                        <FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
