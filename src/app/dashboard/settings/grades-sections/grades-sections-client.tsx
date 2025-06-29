
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const nameSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(20, "Name is too long."),
});
type NameFormValues = z.infer<typeof nameSchema>;

type GradeWithSections = Grade & { sections: Section[] };

type ManageGradesSectionsClientPageProps = {
    initialGrades: GradeWithSections[];
}

export default function ManageGradesSectionsClientPage({ initialGrades }: ManageGradesSectionsClientPageProps) {
    const { toast } = useToast();
    const [gradesData, setGradesData] = useState(initialGrades);
    const [newSectionNames, setNewSectionNames] = useState<Record<string, string>>({});
    
    const gradeForm = useForm<NameFormValues>({ resolver: zodResolver(nameSchema) });

    const handleAddGrade = async (data: NameFormValues) => {
        const result = await addGradeAction(data);
        if (result.success && result.newGrade) {
            setGradesData(prev => [...prev, { ...result.newGrade!, sections: [] }]);
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

    const handleAddSection = async (gradeId: string) => {
       const name = newSectionNames[gradeId];
       if (!name || name.trim() === '') {
           toast({ title: "Error", description: "Section name cannot be empty.", variant: "destructive" });
           return;
       }
       const result = await addSectionAction({ name, gradeId });
        if (result.success && result.newSection) {
            setGradesData(prev => prev.map(g => {
                if (g.id === gradeId) {
                    return { ...g, sections: [...g.sections, result.newSection!].sort((a,b) => a.name.localeCompare(b.name)) };
                }
                return g;
            }));
            toast({ title: "Section Added", description: `Section ${name} has been created.` });
            setNewSectionNames(prev => ({ ...prev, [gradeId]: '' }));
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

     const handleDeleteSection = async (sectionId: string, gradeId: string) => {
        const result = await deleteSectionAction(sectionId);
        if (result.success) {
            setGradesData(prev => prev.map(g => {
                if (g.id === gradeId) {
                    return { ...g, sections: g.sections.filter(s => s.id !== sectionId) };
                }
                return g;
            }));
            toast({ title: "Success", description: "Section deleted." });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Grades & Sections</CardTitle>
                <CardDescription>Add grades, then expand each grade to add or remove its sections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...gradeForm}>
                    <form onSubmit={gradeForm.handleSubmit(handleAddGrade)} className="flex items-start gap-2">
                        <FormField control={gradeForm.control} name="name" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel className="sr-only">Grade Name</FormLabel><FormControl><Input placeholder="e.g., Grade 12" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" disabled={gradeForm.formState.isSubmitting}>
                            {gradeForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} Add Grade
                        </Button>
                    </form>
                </Form>
                <Separator />
                {gradesData.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {gradesData.map(grade => (
                            <AccordionItem value={grade.id} key={grade.id}>
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <span className="font-semibold text-lg">{grade.name}</span>
                                        <AlertDialog onOpenChange={(open) => { if (open) event?.stopPropagation() }}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action will delete the grade and all its sections. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteGrade(grade.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <Input placeholder="e.g., Section D" value={newSectionNames[grade.id] || ''} onChange={(e) => setNewSectionNames(prev => ({...prev, [grade.id]: e.target.value}))} />
                                        <Button type="button" size="sm" onClick={() => handleAddSection(grade.id)}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                                        </Button>
                                    </div>
                                    {grade.sections.length > 0 ? (
                                        <ul className="space-y-2">
                                            {grade.sections.map(section => (
                                                <li key={section.id} className="flex items-center justify-between rounded-md bg-muted p-2 px-4">
                                                    <span className="font-medium">{section.name}</span>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4 text-destructive/70" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will delete this section. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSection(section.id, grade.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-center text-muted-foreground p-4">No sections defined for this grade yet.</p>}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        No grades found. Add one to get started.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
