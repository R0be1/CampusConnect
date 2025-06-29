
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const nameSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(20, "Name is too long."),
});
type NameFormValues = z.infer<typeof nameSchema>;

const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required.").max(20, "Name is too long."),
  gradeId: z.string().min(1, "Please select a grade."),
});
type SectionFormValues = z.infer<typeof sectionSchema>;

type ManageGradesSectionsClientPageProps = {
    initialGrades: Grade[];
    initialSections: Section[];
}

export default function ManageGradesSectionsClientPage({ initialGrades, initialSections }: ManageGradesSectionsClientPageProps) {
    const { toast } = useToast();
    const [grades, setGrades] = useState(initialGrades);
    const [sections, setSections] = useState(initialSections);
    
    const gradeForm = useForm<NameFormValues>({ resolver: zodResolver(nameSchema), defaultValues: { name: "" } });
    const sectionForm = useForm<SectionFormValues>({ resolver: zodResolver(sectionSchema), defaultValues: { name: "", gradeId: "" } });

    const gradeMap = new Map(grades.map(g => [g.id, g.name]));

    const handleAddGrade = async (data: NameFormValues) => {
        const result = await addGradeAction(data);
        if (result.success && result.newGrade) {
            setGrades(prev => [...prev, result.newGrade!].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
            toast({ title: "Grade Added", description: `${data.name} has been created.` });
            gradeForm.reset({ name: "" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleDeleteGrade = async (id: string) => {
        const result = await deleteGradeAction(id);
        if (result.success) {
            setGrades(prev => prev.filter(g => g.id !== id));
            toast({ title: "Success", description: "Grade deleted." });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleAddSection = async (data: SectionFormValues) => {
       const result = await addSectionAction(data);
        if (result.success && result.newSection) {
            setSections(prev => [...prev, result.newSection!].sort((a,b) => a.name.localeCompare(b.name)));
            toast({ title: "Section Added", description: `Section ${data.name} has been created.` });
            sectionForm.reset({ name: "", gradeId: "" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

     const handleDeleteSection = async (sectionId: string) => {
        const result = await deleteSectionAction(sectionId);
        if (result.success) {
            setSections(prev => prev.filter(s => s.id !== sectionId));
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
                    <CardDescription>Add or remove grades available in the school.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...gradeForm}>
                        <form onSubmit={gradeForm.handleSubmit(handleAddGrade)} className="flex items-start gap-2">
                            <FormField control={gradeForm.control} name="name" render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="sr-only">Grade Name</FormLabel><FormControl><Input placeholder="e.g., Grade 12" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" disabled={gradeForm.formState.isSubmitting}>
                                {gradeForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} Add
                            </Button>
                        </form>
                    </Form>
                    <Separator />
                    <ul className="space-y-2">
                        {grades.map(grade => (
                             <li key={grade.id} className="flex items-center justify-between rounded-md bg-muted p-2 px-4">
                                <span className="font-medium">{grade.name}</span>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div role="button" className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-destructive/10 cursor-pointer">
                                            <Trash2 className="h-4 w-4 text-destructive/70" />
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will delete this grade. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteGrade(grade.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Manage Sections</CardTitle>
                    <CardDescription>Define sections and assign them to a grade.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Form {...sectionForm}>
                        <form onSubmit={sectionForm.handleSubmit(handleAddSection)} className="space-y-4">
                            <FormField control={sectionForm.control} name="gradeId" render={({ field }) => (
                                <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <div className="flex items-start gap-2">
                                <FormField control={sectionForm.control} name="name" render={({ field }) => (
                                    <FormItem className="flex-1"><FormLabel className="sr-only">Section Name</FormLabel><FormControl><Input placeholder="e.g., Section D" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <Button type="submit" disabled={sectionForm.formState.isSubmitting}>
                                    {sectionForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} Add
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <Separator />
                     <ul className="space-y-2">
                        {sections.map(section => (
                             <li key={section.id} className="flex items-center justify-between rounded-md bg-muted p-2 px-4">
                                <div>
                                    <span className="font-medium">{section.name}</span>
                                    <p className="text-sm text-muted-foreground">{gradeMap.get(section.gradeId)}</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div role="button" className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-destructive/10 cursor-pointer">
                                            <Trash2 className="h-4 w-4 text-destructive/70" />
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will delete this section. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSection(section.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
