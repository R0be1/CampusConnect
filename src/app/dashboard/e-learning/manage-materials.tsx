
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
import { Pencil, Trash2, Video, FileText, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


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

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const materialsData: Material[] = [];

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
const editSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  grade: z.string().min(1, "Please select a grade."),
  subject: z.string().min(1, "Please select a subject."),
});

type EditFormValues = z.infer<typeof editSchema>;

type MaterialFormProps = {
    material: Material;
    onSave: (material: Material) => void;
    onClose: () => void;
};

function MaterialEditForm({ material, onSave, onClose }: MaterialFormProps) {
    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            title: material.title,
            description: material.description,
            grade: material.grade,
            subject: material.subject,
        },
    });

    const handleSubmit = (data: EditFormValues) => {
        onSave({
            ...material,
            ...data,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid gap-4 py-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="grade" render={({ field }) => (
                            <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
