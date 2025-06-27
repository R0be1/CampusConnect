
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AcademicYear } from "@prisma/client";
import { addAcademicYearAction, setCurrentAcademicYearAction, deleteAcademicYearAction } from "./actions";
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


const yearSchema = z.object({
  name: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY."),
});
type YearFormValues = z.infer<typeof yearSchema>;

type ManageAcademicYearClientPageProps = {
    initialYears: AcademicYear[];
}

export default function ManageAcademicYearClientPage({ initialYears }: ManageAcademicYearClientPageProps) {
    const { toast } = useToast();
    const [academicYears, setAcademicYears] = useState(initialYears);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const form = useForm<YearFormValues>({
        resolver: zodResolver(yearSchema),
        defaultValues: { name: "" },
    });

    const handleSetCurrentYear = async (id: string) => {
        const result = await setCurrentAcademicYearAction(id);
        if (result.success) {
            setAcademicYears(years => years.map(y => ({...y, isCurrent: y.id === id})));
            toast({ title: "Academic Year Updated", description: "The current academic year has been set." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleDeleteYear = async (id: string, isCurrent: boolean) => {
        if(isCurrent) {
            toast({ title: "Cannot Delete", description: "You cannot delete the current academic year.", variant: "destructive"});
            return;
        }
        const result = await deleteAcademicYearAction(id);
        if (result.success) {
            setAcademicYears(prev => prev.filter(y => y.id !== id));
            toast({ title: "Success", description: "Academic year deleted."});
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive"});
        }
    }

    const handleAddYear = async (data: YearFormValues) => {
        if (academicYears.some(y => y.name === data.name)) {
            form.setError("name", { type: "manual", message: "This academic year already exists." });
            return;
        }

        const result = await addAcademicYearAction(data);
        if (result.success && result.newYear) {
            setAcademicYears(prev => [...prev, result.newYear!]);
            toast({ title: "Academic Year Added", description: `Year ${data.name} has been created.` });
            form.reset({ name: "" });
            setIsAddOpen(false);
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive"});
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Academic Years</CardTitle>
                    <CardDescription>Define school years and set the current one for the system.</CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/> Add Year</Button>
                    </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddYear)}>
                                <DialogHeader>
                                    <DialogTitle>Add Academic Year</DialogTitle>
                                    <DialogDescription>Enter the name of the new academic year.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 2025-2026" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Year
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {academicYears.map(year => (
                                <TableRow key={year.id}>
                                    <TableCell className="font-medium">{year.name}</TableCell>
                                    <TableCell>
                                        {year.isCurrent ? <Badge>Current</Badge> : <Badge variant="outline">Inactive</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" disabled={year.isCurrent} onClick={() => handleSetCurrentYear(year.id)}>Set as Current</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={year.isCurrent}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone and will permanently delete this academic year.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteYear(year.id, year.isCurrent)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
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
    );
}
