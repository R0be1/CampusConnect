
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

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const gradesData: { id: string, name: string }[] = [];
const sectionsData: { id: string, name: string }[] = [];
const initialCoursesData: { id: string, name: string, grade: string, section: string, teacher: string }[] = [];

type Course = typeof initialCoursesData[0];

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required."),
  grade: z.string().min(1, "Grade is required."),
  section: z.string().min(1, "Section is required."),
  teacher: z.string().min(1, "Teacher name is required."),
});
type CourseFormValues = z.infer<typeof courseSchema>;

export default function ManageCoursesPage() {
  const [coursesData, setCoursesData] = useState(initialCoursesData);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = coursesData.filter(course => {
    const gradeMatch = gradeFilter === 'all' || course.grade === gradeFilter;
    const sectionMatch = sectionFilter === 'all' || course.section === sectionFilter;
    return gradeMatch && sectionMatch;
  });

  const handleOpenDialog = (course: Course | null) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingCourse(null);
    setIsFormOpen(false);
  }

  const handleSaveCourse = (data: CourseFormValues) => {
    const { toast } = useToast();
    if (editingCourse) {
        // Edit
        setCoursesData(prev => prev.map(c => c.id === editingCourse.id ? { ...editingCourse, ...data } : c));
        toast({ title: "Course Updated", description: `${data.name} has been saved.`});
    } else {
        // Add
        const newCourse = { id: `c-${Date.now()}`, ...data };
        setCoursesData(prev => [...prev, newCourse]);
        toast({ title: "Course Added", description: `${data.name} has been created.`});
    }
    handleCloseDialog();
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
                            {gradesData.map(grade => <SelectItem key={grade.id} value={grade.name}>{grade.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 space-y-1">
                    <Label htmlFor="sectionFilter">Section</Label>
                    <Select onValueChange={setSectionFilter} defaultValue="all">
                        <SelectTrigger id="sectionFilter"><SelectValue placeholder="Filter by section" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {sectionsData.map(section => <SelectItem key={section.id} value={section.name}>{section.name}</SelectItem>)}
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
                                <TableCell>{course.grade}</TableCell>
                                <TableCell>{course.section}</TableCell>
                                <TableCell>{course.teacher}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course)}><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                <CourseForm key={editingCourse?.id} course={editingCourse} onSave={handleSave} onClose={handleCloseDialog} />
            </DialogContent>
        </Dialog>
    </Card>
  );
}

// Reusable Form Component
function CourseForm({ course, onSave, onClose }: { course: Course | null, onSave: (data: CourseFormValues) => void, onClose: () => void }) {
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: course || { name: "", grade: "", section: "", teacher: "" }
    });
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)}>
                <div className="grid gap-4 py-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Course Name</FormLabel><FormControl><Input placeholder="e.g., Advanced Physics" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="grade" render={({ field }) => (
                        <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{gradesData.map(grade => <SelectItem key={grade.id} value={grade.name}>{grade.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="section" render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a section" /></SelectTrigger></FormControl><SelectContent>{sectionsData.map(section => <SelectItem key={section.id} value={section.name}>{section.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="teacher" render={({ field }) => (
                        <FormItem><FormLabel>Teacher</FormLabel><FormControl><Input placeholder="e.g., Dr. Evelyn Reed" {...field} /></FormControl><FormMessage /></FormItem>
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
