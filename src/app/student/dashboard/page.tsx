
"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, BookOpen, CalendarDays, ClipboardList, User, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useStudent } from "@/context/student-context";
import { getDashboardDataAction } from "../actions";
import type { StudentDashboardData } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

function DashboardLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-9 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 grid gap-6">
                    <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card><CardHeader><Skeleton className="h-16 w-full" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    )
}

export default function StudentDashboardPage() {
    const { selectedStudent } = useStudent();
    const [data, setData] = useState<StudentDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedStudent?.id) {
            setIsLoading(true);
            setError(null);
            getDashboardDataAction(selectedStudent.id)
                .then(result => {
                    if (result.success && result.data) {
                        setData(result.data);
                    } else {
                        setError(result.error || "Failed to load dashboard data.");
                    }
                })
                .catch(() => setError("An unexpected error occurred."))
                .finally(() => setIsLoading(false));
        }
    }, [selectedStudent]);

    if (isLoading || !selectedStudent) {
        return <DashboardLoadingSkeleton />;
    }

    if (error || !data) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error || 'Could not load data for this student.'}</AlertDescription></Alert>
    }

    const { student, upcomingTests, recentGrades, attendanceSummary } = data;
    const attendancePercentage = attendanceSummary.total > 0 ? (attendanceSummary.present / attendanceSummary.total) * 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold font-headline">Welcome, {student.name}!</h1>
                <p className="text-muted-foreground">Here's a summary of your upcoming tasks and recent progress.</p>
            </div>
        
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Upcoming Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingTests.length > 0 ? (
                                        upcomingTests.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.subject}</TableCell>
                                                <TableCell>{format(new Date(item.startTime), 'PPP')}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No upcoming tests scheduled.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/student/tests">
                                    Go to My Tests <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Recent Grades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Exam</TableHead>
                                        <TableHead className="text-right">Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentGrades.length > 0 ? (
                                        recentGrades.map((item) => (
                                            <TableRow key={item.exam}>
                                                <TableCell className="font-medium">{item.course}</TableCell>
                                                <TableCell>{item.exam}</TableCell>
                                                <TableCell className="text-right font-semibold">{item.grade}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                         <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No recent grades to show.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/student/academics">
                                    View All Academics <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage src={student.avatar || `https://placehold.co/80x80.png`} data-ai-hint="person portrait" />
                                <AvatarFallback>{student.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-xl">{student.name}</CardTitle>
                                <CardDescription>{student.grade}, Section {student.section}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" asChild>
                            <Link href="/student/profile">
                                <User className="mr-2 h-4 w-4" /> View My Profile
                            </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Attendance</CardTitle>
                            <CardDescription>Summary for the current month.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Overall Attendance</span>
                                    <span className="text-sm font-medium">{attendancePercentage.toFixed(1)}%</span>
                                </div>
                                <Progress value={attendancePercentage} />
                            </div>
                            <div className="flex justify-around text-center text-sm pt-2">
                                <div>
                                    <p className="font-bold text-lg">{attendanceSummary.present}</p>
                                    <p className="text-muted-foreground">Present</p>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-destructive">{attendanceSummary.absent}</p>
                                    <p className="text-muted-foreground">Absent</p>
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{attendanceSummary.late}</p>
                                    <p className="text-muted-foreground">Late</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
