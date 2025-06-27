
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export default function ManageAcademicYearPage() {
    const [academicYears, setAcademicYears] = useState([
        { id: 'ay1', name: '2024-2025', isCurrent: true },
        { id: 'ay2', name: '2023-2024', isCurrent: false },
    ]);

    const handleSetCurrentYear = (id: string) => {
        setAcademicYears(years => years.map(y => ({...y, isCurrent: y.id === id})));
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Academic Years</CardTitle>
                    <CardDescription>Define school years and set the current one for the system.</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/> Add Year</Button>
                    </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Academic Year</DialogTitle>
                            <DialogDescription>Enter the name of the new academic year.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="yearName">Year Name</Label>
                                <Input id="yearName" placeholder="e.g., 2025-2026" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Year</Button>
                        </DialogFooter>
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
                                        <Button variant="ghost" size="icon" disabled={year.isCurrent}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
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
