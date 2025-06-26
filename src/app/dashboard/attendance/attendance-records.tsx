"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];

const studentsByClass: Record<string, { id: string; name: string }[]> = {
  "Grade 10-A": [
    { id: 's001', name: 'John Doe' },
    { id: 's003', name: 'Bob Johnson' },
    { id: 's006', name: 'Peter Parker' },
    { id: 's007', name: 'Bruce Wayne' },
    { id: 's009', name: 'Tony Stark' },
  ],
  "Grade 9-B": [
    { id: 's002', name: 'Alice Smith' },
    { id: 's005', name: 'Diana Prince' },
    { id: 's008', name: 'Clark Kent' },
    { id: 's011', name: 'Steve Rogers' },
  ],
};

type AttendanceSummaryRecord = {
    present: number;
    absent: number;
    late: number;
    excused: number;
};
type MonthlySummary = Record<string, AttendanceSummaryRecord>; 

const summaryData: Record<string, MonthlySummary> = {
    "Grade 10-A": {
        's001': { present: 18, absent: 1, late: 1, excused: 0 },
        's003': { present: 15, absent: 3, late: 1, excused: 1 },
        's006': { present: 20, absent: 0, late: 0, excused: 0 },
        's007': { present: 19, absent: 0, late: 1, excused: 0 },
        's009': { present: 17, absent: 2, late: 0, excused: 1 },
    },
    "Grade 9-B": {
        's002': { present: 20, absent: 0, late: 0, excused: 0 },
        's005': { present: 19, absent: 1, late: 0, excused: 0 },
        's008': { present: 18, absent: 0, late: 2, excused: 0 },
        's011': { present: 19, absent: 1, late: 0, excused: 0 },
    }
};

type DisplayRecord = { id: string; name: string } & AttendanceSummaryRecord;

export function AttendanceRecords() {
    const [selectedGrade, setSelectedGrade] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [month, setMonth] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState<DisplayRecord[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleFetchSummary = () => {
        if (selectedGrade && selectedSection && month) {
            setIsLoading(true);
            setHasSearched(true);
            setRecords([]);
            setTimeout(() => {
                const classKey = `${selectedGrade}-${selectedSection}`;
                const students = studentsByClass[classKey] || [];
                const monthlySummary = summaryData[classKey] || {};
                
                const displayRecords = students.map(student => {
                    const summary = monthlySummary[student.id] || { present: 0, absent: 0, late: 0, excused: 0 };
                    return {
                        id: student.id,
                        name: student.name,
                        ...summary,
                    };
                });

                setRecords(displayRecords);
                setIsLoading(false);
            }, 700);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Select a class and month to view attendance summaries for each student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                        <Label>Grade</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                            <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Section</Label>
                        <Select value={selectedSection} onValueChange={setSelectedSection}>
                            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                            <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Month</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {month ? format(month, "MMMM yyyy") : <span>Pick a month</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={month}
                                    onSelect={setMonth}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleFetchSummary} disabled={!selectedGrade || !selectedSection || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        View Summary
                    </Button>
                </div>
                
                {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {!isLoading && hasSearched && records.length > 0 && (
                    <div className="border rounded-lg mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-center">Present</TableHead>
                                    <TableHead className="text-center">Absent</TableHead>
                                    <TableHead className="text-center">Late</TableHead>
                                    <TableHead className="text-center">Excused</TableHead>
                                    <TableHead className="text-right">Total Days</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map(rec => {
                                    const total = rec.present + rec.absent + rec.late + rec.excused;
                                    return (
                                        <TableRow key={rec.id}>
                                            <TableCell className="font-medium">{rec.name}</TableCell>
                                            <TableCell className="text-center font-medium">{rec.present}</TableCell>
                                            <TableCell className="text-center font-medium">{rec.absent}</TableCell>
                                            <TableCell className="text-center font-medium">{rec.late}</TableCell>
                                            <TableCell className="text-center font-medium">{rec.excused}</TableCell>
                                            <TableCell className="text-right font-semibold">{total}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {!isLoading && hasSearched && records.length === 0 && (
                    <Alert className="mt-6">
                        <Eye className="h-4 w-4" />
                        <AlertTitle>No Records Found</AlertTitle>
                        <AlertDescription>
                            No attendance summary data found for {selectedGrade}, Section {selectedSection} for the selected month.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}