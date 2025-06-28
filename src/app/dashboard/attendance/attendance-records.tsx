
"use client";

import { useState, useEffect } from 'react';
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
import type { Grade, Section } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { getAttendanceSummaryAction } from './actions';

type DisplayRecord = {
    id: string;
    name: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
};

type AttendanceRecordsProps = {
    grades: Grade[];
    sections: Section[];
}

export function AttendanceRecords({ grades, sections }: AttendanceRecordsProps) {
    const { toast } = useToast();
    const [selectedGrade, setSelectedGrade] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [filteredSections, setFilteredSections] = useState<Section[]>([]);
    const [month, setMonth] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState<DisplayRecord[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (selectedGrade) {
            setFilteredSections(sections.filter(s => s.gradeId === selectedGrade));
            setSelectedSection("");
        } else {
            setFilteredSections([]);
        }
    }, [selectedGrade, sections]);

    const handleFetchSummary = async () => {
        if (selectedGrade && selectedSection && month) {
            setIsLoading(true);
            setHasSearched(true);
            setRecords([]);

            const result = await getAttendanceSummaryAction(selectedGrade, selectedSection, month.getMonth(), month.getFullYear());

            if(result.success && result.summary) {
                setRecords(result.summary);
            } else {
                 toast({ title: "Error", description: result.error, variant: "destructive" });
            }

            setIsLoading(false);
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
                            <SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Section</Label>
                        <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedGrade}>
                            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                            <SelectContent>{filteredSections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
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
                            No attendance summary data found for the selected class and month.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
