
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck } from "lucide-react";
import { useState } from "react";

// Mock data for attendance
const attendanceByMonth: Record<string, Record<string, 'present' | 'absent' | 'late'>> = {
    "2024-07": {
      '2024-07-01': 'present', '2024-07-02': 'present', '2024-07-03': 'present', '2024-07-04': 'present', '2024-07-05': 'present',
      '2024-07-08': 'present', '2024-07-09': 'absent', '2024-07-10': 'present', '2024-07-11': 'present', '2024-07-12': 'late',
      '2024-07-15': 'present', '2024-07-16': 'present', '2024-07-17': 'present', '2024-07-18': 'present', '2024-07-19': 'present',
      '2024-07-22': 'present', '2024-07-23': 'present', '2024-07-24': 'present', '2024-07-25': 'present', '2024-07-26': 'present',
    },
    "2024-06": {
        '2024-06-03': 'present', '2024-06-04': 'present', '2024-06-05': 'late', '2024-06-06': 'present', '2024-06-07': 'present',
        '2024-06-10': 'present', '2024-06-11': 'present', '2024-06-12': 'present', '2024-06-13': 'absent', '2024-06-14': 'absent',
    }
};

const getSummary = (data: Record<string, string>) => {
    return {
        present: Object.values(data).filter(d => d === 'present').length,
        absent: Object.values(data).filter(d => d === 'absent').length,
        late: Object.values(data).filter(d => d === 'late').length,
        excused: 0,
        total: Object.values(data).length
    };
};

export default function AttendanceStudentPage() {
  const [month, setMonth] = useState(new Date(2024, 6)); // Default to July 2024

  const monthKey = month.toISOString().slice(0, 7);
  const currentMonthData = attendanceByMonth[monthKey] || {};
  const summary = getSummary(currentMonthData);
  
  const modifiers = {
    present: (date: Date) => currentMonthData[date.toISOString().split('T')[0]] === 'present',
    absent: (date: Date) => currentMonthData[date.toISOString().split('T')[0]] === 'absent',
    late: (date: Date) => currentMonthData[date.toISOString().split('T')[0]] === 'late',
  };

  const modifiersStyles = {
    present: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      color: 'hsl(var(--primary))',
    },
    absent: {
      backgroundColor: 'hsl(var(--destructive) / 0.1)',
      color: 'hsl(var(--destructive))',
    },
    late: {
      backgroundColor: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <UserCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
      </div>
      <p className="text-muted-foreground">View your attendance record by month. Use the arrows on the calendar to navigate.</p>
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
                    disableNavigation={false}
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
                            <TableRow>
                                <TableCell className="font-medium">Present</TableCell>
                                <TableCell className="text-right">{summary.present}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">Absent</TableCell>
                                <TableCell className="text-right">{summary.absent}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">Late</TableCell>
                                <TableCell className="text-right">{summary.late}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">Excused</TableCell>
                                <TableCell className="text-right">{summary.excused}</TableCell>
                            </TableRow>
                             <TableRow className="bg-muted/50">
                                <TableCell className="font-bold">Total School Days</TableCell>
                                <TableCell className="text-right font-bold">{summary.total}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
