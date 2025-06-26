
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const studentsData = [
  { id: 's001', name: 'John Doe', grade: 'Grade 10', section: 'A', parentName: 'Jane Doe', email: 'john.doe@example.com' },
  { id: 's002', name: 'Alice Smith', grade: 'Grade 9', section: 'B', parentName: 'Robert Smith', email: 'alice.smith@example.com' },
  { id: 's003', name: 'Bob Johnson', grade: 'Grade 10', section: 'A', parentName: 'Mary Johnson', email: 'bob.johnson@example.com' },
  { id: 's004', name: 'Charlie Brown', grade: 'Grade 11', section: 'C', parentName: 'Lucy Brown', email: 'charlie.brown@example.com' },
  { id: 's005', name: 'Diana Prince', grade: 'Grade 9', section: 'A', parentName: 'Hippolyta Prince', email: 'diana.prince@example.com' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];

export function StudentList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");

    const filteredStudents = studentsData.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || student.grade === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || student.section === sectionFilter;
        return nameMatch && gradeMatch && sectionMatch;
    });
    
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>View, search, and manage student records.</CardDescription>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by student name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-1 space-y-1">
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
            <div className="flex-1 space-y-1">
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
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Student</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student Information</DialogTitle>
                          <DialogDescription>
                            Make changes to {student.name}'s profile. Click save when you're done.
                            <br/><br/>
                            (This is a placeholder. The full edit form can be implemented next.)
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
  );
}
