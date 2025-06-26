
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Settings, Trash2, Pencil } from "lucide-react";

// Placeholder data
const gradesData = [
  { id: 'g1', name: 'Grade 1' },
  { id: 'g2', name: 'Grade 2' },
  { id: 'g10', name: 'Grade 10' },
];

const sectionsData = [
  { id: 's1', name: 'A' },
  { id: 's2', name: 'B' },
  { id: 's3', name: 'C' },
];

const coursesData = [
  { id: 'c1', name: 'Mathematics', grade: 'Grade 10', section: 'A', teacher: 'Mr. Smith' },
  { id: 'c2', name: 'History', grade: 'Grade 10', section: 'A', teacher: 'Ms. Jones' },
  { id: 'c3', name: 'Science', grade: 'Grade 10', section: 'B', teacher: 'Dr. Brown' },
  { id: 'c4', name: 'English', grade: 'Grade 1', section: 'C', teacher: 'Mrs. Davis' },
  { id: 'c5', name: 'Art', grade: 'Grade 2', section: 'A', teacher: 'Mr. Picasso' },
];

export default function SettingsPage() {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  const filteredCourses = coursesData.filter(course => {
    const gradeMatch = gradeFilter === 'all' || course.grade === gradeFilter;
    const sectionMatch = sectionFilter === 'all' || course.section === sectionFilter;
    return gradeMatch && sectionMatch;
  });

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">School Settings</h1>
      </div>
      <Tabs defaultValue="courses">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          <TabsTrigger value="grades_sections">Manage Grades & Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Course Management</CardTitle>
                            <CardDescription>Add, edit, or remove courses and assign them to grades and sections.</CardDescription>
                        </div>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2" /> Add New Course
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Course</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to create a new course.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="courseName">Course Name</Label>
                                        <Input id="courseName" placeholder="e.g., Advanced Physics" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="courseGrade">Grade</Label>
                                        <Select>
                                            <SelectTrigger id="courseGrade">
                                                <SelectValue placeholder="Select a grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {gradesData.map(grade => <SelectItem key={grade.id} value={grade.name}>{grade.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="courseSection">Section</Label>
                                        <Select>
                                            <SelectTrigger id="courseSection">
                                                <SelectValue placeholder="Select a section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sectionsData.map(section => <SelectItem key={section.id} value={section.name}>{section.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teacherName">Teacher</Label>
                                        <Input id="teacherName" placeholder="e.g., Dr. Evelyn Reed" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Course</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="gradeFilter">Grade</Label>
                            <Select onValueChange={setGradeFilter} defaultValue="all">
                                <SelectTrigger id="gradeFilter">
                                    <SelectValue placeholder="Filter by grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {gradesData.map(grade => <SelectItem key={grade.id} value={grade.name}>{grade.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="sectionFilter">Section</Label>
                            <Select onValueChange={setSectionFilter} defaultValue="all">
                                <SelectTrigger id="sectionFilter">
                                    <SelectValue placeholder="Filter by section" />
                                </SelectTrigger>
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
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Course</DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to the course below. Click save when you're done.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editCourseName">Course Name</Label>
                                                            <Input id="editCourseName" defaultValue={course.name} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editCourseGrade">Grade</Label>
                                                            <Select defaultValue={course.grade}>
                                                                <SelectTrigger id="editCourseGrade">
                                                                    <SelectValue placeholder="Select a grade" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {gradesData.map(grade => <SelectItem key={grade.id} value={grade.name}>{grade.name}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editCourseSection">Section</Label>
                                                            <Select defaultValue={course.section}>
                                                                <SelectTrigger id="editCourseSection">
                                                                    <SelectValue placeholder="Select a section" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {sectionsData.map(section => <SelectItem key={section.id} value={section.name}>{section.name}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editTeacherName">Teacher</Label>
                                                            <Input id="editTeacherName" defaultValue={course.teacher} />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit">Save Changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
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
            </Card>
        </TabsContent>
        
        <TabsContent value="grades_sections">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Manage Grades</CardTitle>
                <CardDescription>Add or remove grade levels available in the school.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newGrade">Grade Name</Label>
                    <div className="flex gap-2">
                        <Input id="newGrade" placeholder="e.g., Grade 12" />
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                    </div>
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Grade Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gradesData.map(grade => (
                                <TableRow key={grade.id}>
                                    <TableCell className="font-medium">{grade.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Sections</CardTitle>
                <CardDescription>Add or remove sections for each grade level.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="newSection">Section Name</Label>
                    <div className="flex gap-2">
                        <Input id="newSection" placeholder="e.g., Section D" />
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                    </div>
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sectionsData.map(section => (
                                <TableRow key={section.id}>
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
