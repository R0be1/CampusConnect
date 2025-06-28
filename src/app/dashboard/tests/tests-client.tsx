"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, PlusCircle, Search, Trash2, Pencil, Eye, Play, StopCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
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
import type { Test, Grade, Section } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { deleteTestAction, updateTestStatusAction } from "./actions";

type TestsClientProps = {
  initialTests: Test[];
  grades: Grade[];
  sections: Section[];
};

export function TestsClient({ initialTests, grades, sections }: TestsClientProps) {
    const { toast } = useToast();
    const [tests, setTests] = useState(initialTests);
    const [searchTerm, setSearchTerm] = useState("");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");

    const filteredTests = tests.filter(test => {
        const nameMatch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
        const gradeMatch = gradeFilter === 'all' || test.gradeId === gradeFilter;
        const sectionMatch = sectionFilter === 'all' || test.sectionId === sectionFilter;
        return nameMatch && gradeMatch && sectionMatch;
    });

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'default';
            case 'UPCOMING': return 'secondary';
            case 'COMPLETED': return 'outline';
            default: return 'secondary';
        }
    };

    const handleDelete = async (testId: string) => {
        const result = await deleteTestAction(testId);
        if(result.success) {
            setTests(prev => prev.filter(t => t.id !== testId));
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    }

    const handleUpdateStatus = async (testId: string, status: 'ACTIVE' | 'COMPLETED') => {
        const result = await updateTestStatusAction(testId, status);
         if(result.success) {
            setTests(prev => prev.map(t => t.id === testId ? { ...t, status } : t));
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <ClipboardList className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Manage Tests</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Test Schedule</CardTitle>
                            <CardDescription>View, manage, and track all created tests.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/tests/create">
                                <PlusCircle className="mr-2" /> Create New Test
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="search">Search by Name</Label>
                             <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="search" placeholder="Search..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="gradeFilter">Filter by Grade</Label>
                            <Select onValueChange={setGradeFilter} defaultValue="all">
                                <SelectTrigger id="gradeFilter"><SelectValue placeholder="All Grades" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="sectionFilter">Filter by Section</Label>
                            <Select onValueChange={setSectionFilter} defaultValue="all">
                                <SelectTrigger id="sectionFilter"><SelectValue placeholder="All Sections" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Starts</TableHead>
                                    <TableHead>Ends</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTests.length > 0 ? filteredTests.map((test) => {
                                    const grade = grades.find(g => g.id === test.gradeId);
                                    const section = sections.find(s => s.id === test.sectionId);
                                    return (
                                    <TableRow key={test.id}>
                                        <TableCell className="font-medium">{test.name}</TableCell>
                                        <TableCell>{grade?.name}, Section {section?.name}</TableCell>
                                        <TableCell>{format(new Date(test.startTime), 'PPp')}</TableCell>
                                        <TableCell>{format(new Date(test.endTime), 'PPp')}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(test.status)}>{test.status}</Badge></TableCell>
                                        <TableCell className="text-right space-x-1">
                                            {test.status === 'UPCOMING' && <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(test.id, 'ACTIVE')}><Play className="mr-2 h-4 w-4"/>Start Now</Button>}
                                            {test.status === 'ACTIVE' && <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(test.id, 'COMPLETED')}><StopCircle className="mr-2 h-4 w-4"/>End Now</Button>}
                                            <Button asChild size="sm" variant="outline"><Link href={`/dashboard/tests/${test.id}/submissions`}><Eye className="mr-2 h-4 w-4" />View</Link></Button>
                                            <Button disabled size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button disabled={test.status === 'ACTIVE'} size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will permanently delete "{test.name}" and all its submissions. This action cannot be undone.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(test.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                    )
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No tests found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
