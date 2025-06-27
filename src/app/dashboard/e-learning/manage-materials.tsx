
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Video, FileText, Search } from "lucide-react";

// Mock Data
const materialsData = [
    { id: 'mat001', title: 'Introduction to Algebra', subject: 'Mathematics', grade: 'Grade 10', type: 'Video', date: '2024-08-10' },
    { id: 'mat002', title: 'The Fall of Rome - Reading Material', subject: 'History', grade: 'Grade 9', type: 'Document', date: '2024-08-09' },
    { id: 'mat003', title: 'Photosynthesis Explained', subject: 'Science', grade: 'Grade 11', type: 'Video', date: '2024-08-08' },
    { id: 'mat004', title: 'Periodic Table PDF', subject: 'Science', grade: 'Grade 11', type: 'Document', date: '2024-08-07' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

export function ManageMaterials() {
    const [materials, setMaterials] = useState(materialsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");

    const filteredMaterials = materials.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || m.grade === gradeFilter;
        return titleMatch && gradeMatch;
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Learning Materials</CardTitle>
                <CardDescription>View, edit, or delete existing e-learning resources.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                     <div className="flex-1 space-y-1">
                        <Label htmlFor="search-title">Search by Title</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-title" 
                                placeholder="Search..." 
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                     <div className="flex-1 space-y-1">
                        <Label htmlFor="grade-filter">Filter by Grade</Label>
                        <Select onValueChange={setGradeFilter} defaultValue="all">
                            <SelectTrigger id="grade-filter">
                                <SelectValue placeholder="All Grades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {grades.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
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
                                <TableHead>Title</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterials.map(mat => (
                                <TableRow key={mat.id}>
                                    <TableCell className="font-medium">{mat.title}</TableCell>
                                    <TableCell>{mat.grade}</TableCell>
                                    <TableCell>{mat.subject}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {mat.type === 'Video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                        {mat.type}
                                    </TableCell>
                                    <TableCell>{mat.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {filteredMaterials.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground mt-4">
                        No materials match the current filters.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
