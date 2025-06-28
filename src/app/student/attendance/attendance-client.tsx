"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, Info, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getStudentAttendanceAction, StudentPortalAttendanceData } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AttendanceLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <UserCheck className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <Card>
                <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                    <Skeleton className="h-[300px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

type AttendanceClientProps = {
    studentId: string;
    studentName: string;
};

export default function AttendanceClient({ studentId, studentName }: AttendanceClientProps) {
  const [month, setMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<StudentPortalAttendanceData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
        setIsLoading(true);
        setError(null);
        getStudentAttendanceAction(studentId, month.getMonth(), month.getFullYear())
            .then(result => {
                if (result.success && result.data) {
                    setAttendanceData(result.data);
                } else {
                    setError(result.error || "Failed to load attendance data.");
                    setAttendanceData([]);
                }
            })
            .catch(() => setError("An unexpected error occurred."))
            .finally(() => setIsLoading(false));
    }
  }, [studentId, month]);
  
  const attendanceMap = useMemo(() => {
    const map = new Map<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>();
    attendanceData.forEach(record => {
        map.set(record.date, record.status);
    });
    return map;
  }, [attendanceData]);

  const summary = useMemo(() => {
    return {
        present: attendanceData.filter(d => d.status === 'PRESENT').length,
        absent: attendanceData.filter(d => d.status === 'ABSENT').length,
        late: attendanceData.filter(d => d.status === 'LATE').length,
        excused: attendanceData.filter(d => d.status === 'EXCUSED').length,
        total: attendanceData.length
    };
  }, [attendanceData]);
  
  const modifiers = {
    present: (date: Date) => attendanceMap.get(date.toISOString().split('T')[0]) === 'PRESENT',
    absent: (date: Date) => attendanceMap.get(date.toISOString().split('T')[0]) === 'ABSENT',
    late: (date: Date) => attendanceMap.get(date.toISOString().split('T')[0]) === 'LATE',
    excused: (date: Date) => attendanceMap.get(date.toISOString().split('T')[0]) === 'EXCUSED',
  };

  const modifiersStyles = {
    present: { backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' },
    absent: { backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' },
    late: { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' },
    excused: { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
  };

  if (isLoading) {
    return <AttendanceLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <UserCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
      </div>
      <p className="text-muted-foreground">View your attendance record by month. Use the arrows on the calendar to navigate.</p>
      
      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      
      <Card>
        <CardHeader>
            <CardTitle>{month.toLocaleString('default', { month: 'long', year: 'numeric' })} Attendance</CardTitle>
            <CardDescription>The calendar highlights days based on your attendance status.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="flex justify-center">
                 <Calendar
                    mode="single"
                    month={month}
                    onMonthChange={setMonth}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className="rounded-md border"
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear() - 5}
                    toYear={new Date().getFullYear() + 1}
                />
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Monthly Summary</h3>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Days</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Present</TableCell><TableCell className="text-right">{summary.present}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Absent</TableCell><TableCell className="text-right">{summary.absent}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Late</TableCell><TableCell className="text-right">{summary.late}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Excused</TableCell><TableCell className="text-right">{summary.excused}</TableCell></TableRow>
                            <TableRow className="bg-muted/50"><TableCell className="font-bold">Total Recorded Days</TableCell><TableCell className="text-right font-bold">{summary.total}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                 {summary.total === 0 && !error && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No Records Found</AlertTitle>
                        <AlertDescription>
                            There are no attendance records for you for {month.toLocaleString('default', { month: 'long', year: 'numeric' })}.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
