
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Grade, Section } from "@prisma/client";
import { addGradeAction, deleteGradeAction, addSectionAction, deleteSectionAction } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const gradeSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(20, "Name is too long."),
});
type GradeFormValues = z.infer<typeof gradeSchema>;

const sectionSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(1, "Section should be a single letter.").regex(/^[A-Z]$/, "Section must be a single uppercase letter."),
});
type SectionFormValues = z.infer<typeof sectionSchema>;

type GradeWithSections = Grade & { sections: Section[] };

type ManageGradesSectionsClientPageProps = {
    initialGradesWithSections: GradeWithSections[];
}

const sortGrades = (grades: GradeWithSections[]) => {
    return [...grades].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export default function ManageGradesSectionsClientPage({ initialGradesWithSections }: ManageGradesSectionsClientPageProps) {
    const { toast } = useToast();
    const [grades, setGrades] = useState(() => sortGrades(initialGradesWithSections));
    const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
    
    const gradeForm = useForm<GradeFormValues>({ resolver: zodResolver(gradeSchema), defaultValues: { name: "" } });
    const sectionForm = useForm<SectionFormValues>({ resolver: zodResolver(sectionSchema), defaultValues: { name: "" }});

    const handleAddGrade = async (data: GradeFormValues) => {
        const result = await addGradeAction(data);
        if (result.success && result.newGrade) {
            const newGradeWithSections: GradeWithSections = { ...result.newGrade, sections: [] };
            setGrades(prev => sortGrades([...prev, newGradeWithSections]));
            toast({ title: "Grade Added", description: `${data.name} has been created.` });
            gradeForm.reset({ name: "" });
            setIsAddGradeOpen(false);
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

    const handleAddSection = async (data: SectionFormValues, gradeId: string) => {
       const result = await addSectionAction({name: data.name, gradeId});
        if (result.success && result.newSection) {
            setGrades(prevGrades => {
                return prevGrades.map(g => {
                    if (g.id === gradeId) {
                        const updatedSections = [...g.sections, result.newSection!].sort((a,b) => a.name.localeCompare(b.name));
                        return { ...g, sections: updatedSections };
                    }
                    return g;
                });
            });
            toast({ title: "Section Added", description: `Section ${data.name} has been created.` });
            sectionForm.reset({ name: "" });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

     const handleDeleteSection = async (sectionId: string, gradeId: string) => {
        const result = await deleteSectionAction(sectionId);
        if (result.success) {
            setGrades(prevGrades => {
                return prevGrades.map(g => {
                    if (g.id === gradeId) {
                        return { ...g, sections: g.sections.filter(s => s.id !== sectionId) };
                    }
                    return g;
                });
            });
            toast({ title: "Success", description: "Section deleted." });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Grades & Sections</CardTitle>
                    <CardDescription>Add or remove grades, and manage sections within each grade.</CardDescription>
                </div>
                <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2"/> Add Grade</Button></DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <Form {...gradeForm}>
                            <form onSubmit={gradeForm.handleSubmit(handleAddGrade)}>
                                <DialogHeader>
                                    <DialogTitle>Add New Grade</DialogTitle>
                                    <DialogDescription>Enter the name of the new grade (e.g., Grade 1, Grade 12).</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <FormField control={gradeForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input placeholder="e.g., Grade 10" {...field} value={field.value || ''} /></FormControl><FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={gradeForm.formState.isSubmitting}>
                                        {gradeForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Grade
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
                {grades.map((grade) => (
                    <div key={grade.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">{grade.name}</h3>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will delete {grade.name} and all its sections. This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteGrade(grade.id)}>Delete Grade</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        
                        <div className="space-y-2">
                            {grade.sections.length > 0 ? (
                                grade.sections.map(section => (
                                    <div key={section.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2 px-3">
                                        <span className="font-medium">Section {section.name}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Section {section.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will delete Section {section.name} from {grade.name}. This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSection(section.id, grade.id)}>Delete Section</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-2">No sections defined for this grade.</p>
                            )}
                        </div>

                        <Separator className="my-4"/>

                        <Form {...sectionForm}>
                            <form onSubmit={sectionForm.handleSubmit((data) => handleAddSection(data, grade.id))} className="flex items-start gap-2">
                                <FormField control={sectionForm.control} name="name" render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl><Input placeholder="Add new section (e.g., C)" {...field} value={field.value || ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" variant="secondary" disabled={sectionForm.formState.isSubmitting}>
                                    {sectionForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Add Section'}
                                </Button>
                            </form>
                        </Form>
                    </div>
                ))}
                 {grades.length === 0 && (
                     <div className="text-center p-8 text-muted-foreground">
                        No grades defined. Please add a grade to begin.
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
