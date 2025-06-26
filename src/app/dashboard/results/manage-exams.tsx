"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

// Placeholder data
const examsData = [
  { id: 'exam1', name: 'Mid-term Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 40 },
  { id: 'exam2', name: 'Final Exam', grade: 'Grade 10', section: 'A', subject: 'Mathematics', weightage: 60 },
  { id: 'exam3', name: 'Unit Test 1', grade: 'Grade 9', section: 'B', subject: 'Science', weightage: 20 },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];
// Assuming subjects are tied to grade/section, we'll use a static list for now.
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export function ManageExams() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Exam Definitions</CardTitle>
                        <CardDescription>Define exams and their weightage for different grades, sections, and subjects.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Define New Exam</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Define New Exam</DialogTitle>
                                <DialogDescription>Fill in the details to create a new exam entry.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="examName">Exam Name</Label>
                                    <Input id="examName" placeholder="e.g., Mid-term Exam" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weightage">Weightage (%)</Label>
                                    <Input id="weightage" type="number" placeholder="e.g., 40" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="examGrade">Grade</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                                            <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="examSection">Section</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                            <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examSubject">Subject</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Exam</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam Name</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Weightage (%)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {examsData.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell className="font-medium">{exam.name}</TableCell>
                                <TableCell>{exam.grade}</TableCell>
                                <TableCell>{exam.section}</TableCell>
                                <TableCell>{exam.subject}</TableCell>
                                <TableCell>{exam.weightage}%</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
