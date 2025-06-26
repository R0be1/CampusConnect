
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCopy, PlusCircle, Upload, Pencil, Trash2, Video, FileText, Search } from "lucide-react";

// Mock Data
const materialsData = [
    { id: 'mat001', title: 'Introduction to Algebra', subject: 'Mathematics', grade: 'Grade 10', type: 'Video', date: '2024-08-10' },
    { id: 'mat002', title: 'The Fall of Rome - Reading Material', subject: 'History', grade: 'Grade 9', type: 'Document', date: '2024-08-09' },
    { id: 'mat003', title: 'Photosynthesis Explained', subject: 'Science', grade: 'Grade 11', type: 'Video', date: '2024-08-08' },
    { id: 'mat004', title: 'Periodic Table PDF', subject: 'Science', grade: 'Grade 11', type: 'Document', date: '2024-08-07' },
];

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];
const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);


function ManageMaterials() {
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

function UploadMaterialForm() {
    const [materialType, setMaterialType] = useState("");
    return (
         <Card>
            <CardHeader>
                <CardTitle>Upload New Material</CardTitle>
                <CardDescription>Fill in the form below to add a new resource.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g., Introduction to Calculus" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="A brief summary of the material." />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select>
                            <SelectTrigger id="grade"><SelectValue placeholder="Select a grade" /></SelectTrigger>
                            <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                            <SelectTrigger id="subject"><SelectValue placeholder="Select a subject" /></SelectTrigger>
                            <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Material Type</Label>
                        <Select onValueChange={setMaterialType}>
                            <SelectTrigger id="type"><SelectValue placeholder="Select a type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Document">Document</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {materialType === "Video" && (
                     <div className="space-y-2">
                        <Label htmlFor="videoFile">Upload Video</Label>
                        <Input id="videoFile" type="file" accept="video/*" />
                        <p className="text-sm text-muted-foreground">Supported formats: MP4, WEBM, OGG.</p>
                    </div>
                )}
                 {materialType === "Document" && (
                    <div className="space-y-2">
                        <Label htmlFor="documentFile">Upload Document</Label>
                         <Input id="documentFile" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                         <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, PPTX.</p>
                    </div>
                )}

                 <div className="flex justify-end">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Upload and Publish
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}


export default function ELearningAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BookCopy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">E-Learning Management</h1>
      </div>
       <Tabs defaultValue="manage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">
            Manage Materials
          </TabsTrigger>
          <TabsTrigger value="upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload New Material
            </TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <ManageMaterials />
        </TabsContent>
        <TabsContent value="upload">
          <UploadMaterialForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
