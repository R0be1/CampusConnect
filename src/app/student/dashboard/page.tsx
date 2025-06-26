

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, BookOpen, CalendarDays, ClipboardList, MessageCircle, User } from "lucide-react";
import Link from "next/link";

// Mock Data for a student
const student = {
  name: 'John Doe',
  grade: 'Grade 10',
  section: 'A',
  avatar: 'https://placehold.co/80x80.png',
};

const upcomingTests = [
  { id: "test-001", name: "Algebra II - Mid-term", subject: "Mathematics", date: "2024-09-10" },
  { id: "test-002", name: "Mechanics - Unit Test", subject: "Physics", date: "2024-09-12" },
];

const recentGrades = [
  { course: 'Science', exam: 'Unit Test 2', grade: 'A-' },
  { course: 'History', exam: 'Final Exam', grade: 'B+' },
];

const attendanceSummary = {
  present: 18,
  absent: 1,
  late: 1,
  total: 20,
};
const attendancePercentage = (attendanceSummary.present / attendanceSummary.total) * 100;

export default function StudentDashboardPage() {
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
                                {upcomingTests.map((item) => (
                                    <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.subject}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    </TableRow>
                                ))}
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
                                {recentGrades.map((item) => (
                                    <TableRow key={item.exam}>
                                    <TableCell className="font-medium">{item.course}</TableCell>
                                    <TableCell>{item.exam}</TableCell>
                                    <TableCell className="text-right font-semibold">{item.grade}</TableCell>
                                    </TableRow>
                                ))}
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
                            <AvatarImage src={student.avatar} data-ai-hint="person portrait" />
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
