
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createExamAction, deleteExamAction, updateExamAction } from "./actions";
import { Exam, Grade, Section } from "@prisma/client";

const examSchema = z.object({
    name: z.string().min(1, "Exam name is required."),
    weightage: z.string().min(1, "Weightage is required."),
    gradingType: z.enum(['DECIMAL', 'LETTER']),
    gradeId: z.string().min(1, "Please select a grade."),
    sectionId: z.string().min(1, "Please select a section."),
    subject: z.string().min(1, "Subject is required."),
});

type ExamFormValues = z.infer<typeof examSchema>;

type ManageExamsClientProps = {
    initialExams: Exam[];
    grades: Grade[];
    sections: Section[];
    schoolId: string;
    academicYearId: string;
    academicYearName: string;
}

const subjects = ['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

export default function ManageExamsClient({ initialExams, grades, sections, schoolId, academicYearId, academicYearName }: ManageExamsClientProps) {
    const { toast } = useToast();
    const [exams, setExams] = useState<Exam[]>(initialExams);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    const filteredExams = exams.filter(exam => {
        const nameMatch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || exam.gradeId === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || exam.sectionId === sectionFilter;
        return nameMatch && gradeMatch && sectionMatch;
    });

    const handleDelete = async (id: string) => {
        const result = await deleteExamAction(id);
        if (result.success) {
            setExams(currentExams => currentExams.filter(exam => exam.id !== id));
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleSave = async (data: ExamFormValues) => {
        const result = editingExam
            ? await updateExamAction(editingExam.id, data)
            : await createExamAction(data, schoolId, academicYearId);

        if (result.success) {
            toast({ title: "Success", description: result.message });
            setIsDialogOpen(false);
            setEditingExam(null);
            // This is a simple way to refresh data. For a more complex app, you might use revalidateTag.
            window.location.reload(); 
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const openDialog = (exam: Exam | null) => {
        setEditingExam(exam);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Edit className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Manage Exams</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Exam Definitions</CardTitle>
                            <CardDescription>Define exams for the academic year: {academicYearName}</CardDescription>
                        </div>
                        <Button onClick={() => openDialog(null)}><PlusCircle className="mr-2 h-4 w-4" /> Define New Exam</Button>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:grid sm:grid-cols-3 sm:gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="examSearch">Search by Name</Label>
                            <Input id="examSearch" placeholder="e.g., Mid-term..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="gradeFilter">Filter by Grade</Label>
                            <Select onValueChange={setGradeFilter} defaultValue="all">
                                <SelectTrigger id="gradeFilter"><SelectValue placeholder="Filter by grade" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {grades.map(grade => <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="sectionFilter">Filter by Section</Label>
                            <Select onValueChange={setSectionFilter} defaultValue="all">
                                <SelectTrigger id="sectionFilter"><SelectValue placeholder="Filter by section" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {sections.map(section => <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>)}
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
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Weightage (%)</TableHead>
                                    <TableHead>Grading Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExams.length > 0 ? (
                                    filteredExams.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell className="font-medium">{exam.name}</TableCell>
                                            <TableCell>{grades.find(g => g.id === exam.gradeId)?.name}</TableCell>
                                            <TableCell>{sections.find(s => s.id === exam.sectionId)?.name}</TableCell>
                                            <TableCell>{exam.subject}</TableCell>
                                            <TableCell>{exam.weightage}%</TableCell>
                                            <TableCell>{exam.gradingType}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => openDialog(exam)}>
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
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete this exam definition and all associated results.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(exam.id)}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No exams found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingExam ? 'Edit Exam' : 'Define New Exam'}</DialogTitle>
                        <DialogDescription>
                            {editingExam ? 'Make changes to the exam details below.' : `Fill in the details to create a new exam for ${academicYearName}.`}
                        </DialogDescription>
                    </DialogHeader>
                    <ExamForm 
                        onSave={handleSave} 
                        initialData={editingExam}
                        grades={grades}
                        sections={sections}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}


function ExamForm({ onSave, initialData, grades, sections }: { onSave: (data: ExamFormValues) => void; initialData: Exam | null; grades: Grade[]; sections: Section[]; }) {
    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            name: initialData?.name || '',
            weightage: String(initialData?.weightage || ''),
            gradingType: initialData?.gradingType || 'DECIMAL',
            gradeId: initialData?.gradeId || '',
            sectionId: initialData?.sectionId || '',
            subject: initialData?.subject || '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="grid gap-4 py-4">
                 <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Exam Name</FormLabel><FormControl><Input placeholder="e.g., Mid-term Exam" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(subject => (<SelectItem key={subject} value={subject}>{subject}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="weightage" render={({ field }) => (
                        <FormItem><FormLabel>Weightage (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="gradingType" render={({ field }) => (
                        <FormItem><FormLabel>Grading Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grading Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="DECIMAL">Decimal</SelectItem><SelectItem value="LETTER">Letter Grade</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="gradeId" render={({ field }) => (
                        <FormItem><FormLabel>Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger></FormControl><SelectContent>{grades.map(grade => (<SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="sectionId" render={({ field }) => (
                        <FormItem><FormLabel>Section</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger></FormControl><SelectContent>{sections.map(section => (<SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save Exam</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

