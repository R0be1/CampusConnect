
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Grade, Section } from "@prisma/client";
import { addGradeAction, deleteGradeAction, addSectionAction, deleteSectionAction } from "./actions";
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

const nameSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(20, "Name is too long."),
});
type NameFormValues = z.infer<typeof nameSchema>;

type ManageGradesSectionsClientPageProps = {
    initialGrades: Grade[];
    initialSections: Section[];
}

export default function ManageGradesSectionsClientPage({ initialGrades, initialSections }: ManageGradesSectionsClientPageProps) {
    const { toast } = useToast();
    const [gradesData, setGradesData] = useState(initialGrades);
    const [sectionsData, setSectionsData] = useState(initialSections);

    const gradeForm = useForm<NameFormValues>({ resolver: zodResolver(nameSchema) });
    const sectionForm = useForm<NameFormValues>({ resolver: zodResolver(nameSchema) });

    const handleAddGrade = async (data: NameFormValues) => {
        const result = await addGradeAction(data);
        if (result.success && result.newGrade) {
            setGradesData(prev => [...prev, result.newGrade!]);
            toast({ title: "Grade Added", description: `${data.name} has been created.` });
            gradeForm.reset({ name: "" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleDeleteGrade = async (id: string) => {
        const result = await deleteGradeAction(id);
        if (result.success) {
            setGradesData(prev => prev.filter(g => g.id !== id));
            toast({ title: "Success", description: "Grade deleted." });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleAddSection = async (data: NameFormValues) => {
       const result = await addSectionAction(data);
        if (result.success && result.newSection) {
            setSectionsData(prev => [...prev, result.newSection!]);
            toast({ title: "Section Added", description: `Section ${data.name} has been created.` });
            sectionForm.reset({ name: "" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

     const handleDeleteSection = async (id: string) => {
        const result = await deleteSectionAction(id);
        if (result.success) {
            setSectionsData(prev => prev.filter(s => s.id !== id));
            toast({ title: "Success", description: "Section deleted." });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Grades</CardTitle>
                    <CardDescription>Add or remove grade levels available in the school.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...gradeForm}>
                        <form onSubmit={gradeForm.handleSubmit(handleAddGrade)} className="flex items-start gap-2">
                            <FormField control={gradeForm.control} name="name" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="sr-only">Grade Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Grade 12" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={gradeForm.formState.isSubmitting}>
                                {gradeForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} 
                                Add
                            </Button>
                        </form>
                    </Form>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader><TableRow><TableHead>Grade Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {gradesData.map(grade => (
                                    <TableRow key={grade.id}>
                                        <TableCell className="font-medium">{grade.name}</TableCell>
                                        <TableCell className="text-right">
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteGrade(grade.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                     <Form {...sectionForm}>
                        <form onSubmit={sectionForm.handleSubmit(handleAddSection)} className="flex items-start gap-2">
                            <FormField control={sectionForm.control} name="name" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="sr-only">Section Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Section D" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={sectionForm.formState.isSubmitting}>
                                {sectionForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} 
                                Add
                            </Button>
                        </form>
                    </Form>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader><TableRow><TableHead>Section Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {sectionsData.map(section => (
                                    <TableRow key={section.id}>
                                        <TableCell className="font-medium">{section.name}</TableCell>
                                        <TableCell className="text-right">
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSection(section.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
