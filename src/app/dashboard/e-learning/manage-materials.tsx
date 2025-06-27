
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Video, FileText, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Define Material type
type Material = {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    type: 'Video' | 'Document';
    date: string;
};

// Mock Data
const materialsData: Material[] = [
    { id: 'mat001', title: 'Introduction to Algebra', description: 'A foundational video covering the basics of algebraic expressions and equations.', subject: 'Mathematics', grade: 'Grade 10', type: 'Video', date: '2024-08-10' },
    { id: 'mat002', title: 'The Fall of Rome - Reading Material', description: 'A detailed PDF document exploring the factors that led to the collapse of the Western Roman Empire.', subject: 'History', grade: 'Grade 9', type: 'Document', date: '2024-08-09' },
    { id: 'mat003', title: 'Photosynthesis Explained', description: 'This video breaks down the complex process of photosynthesis into easy-to-understand steps.', subject: 'Science', grade: 'Grade 11', type: 'Video', date: '2024-08-08' },
    { id: 'mat004', title: 'Periodic Table PDF', description: 'A high-resolution, printable PDF of the periodic table of elements.', subject: 'Science', grade: 'Grade 11', type: 'Document', date: '2024-08-07' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export function ManageMaterials() {
    const { toast } = useToast();
    const [materials, setMaterials] = useState(materialsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const filteredMaterials = materials.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || m.grade === gradeFilter;
        return titleMatch && gradeMatch;
    });

    const handleDelete = (id: string) => {
        setMaterials(current => current.filter(m => m.id !== id));
        toast({ title: "Material Deleted", description: "The learning material has been successfully removed." });
    };

    const handleSave = (updatedMaterial: Material) => {
        setMaterials(current => current.map(m => (m.id === updatedMaterial.id ? updatedMaterial : m)));
        setEditingMaterial(null);
        toast({ title: "Material Updated", description: "The material details have been saved." });
    };

    return (
        <>
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
                                            <Button variant="ghost" size="icon" onClick={() => setEditingMaterial(mat)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete "{mat.title}". This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(mat.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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

            <Dialog open={!!editingMaterial} onOpenChange={(isOpen) => !isOpen && setEditingMaterial(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Material</DialogTitle>
                        <DialogDescription>Make changes to the material details below. Note: The file itself cannot be changed.</DialogDescription>
                    </DialogHeader>
                    {editingMaterial && <MaterialEditForm material={editingMaterial} onSave={handleSave} onClose={() => setEditingMaterial(null)} />}
                </DialogContent>
            </Dialog>
        </>
    )
}

// Reusable form component for editing materials
type MaterialFormProps = {
    material: Material;
    onSave: (material: Material) => void;
    onClose: () => void;
};

function MaterialEditForm({ material, onSave, onClose }: MaterialFormProps) {
    const [formData, setFormData] = useState<Material>(material);

    const handleChange = (field: keyof Omit<Material, 'id' | 'date'>, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select value={formData.grade} onValueChange={(value) => handleChange('grade', value)}>
                            <SelectTrigger id="grade"><SelectValue /></SelectTrigger>
                            <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                            <SelectTrigger id="subject"><SelectValue /></SelectTrigger>
                            <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
        </>
    )
}
