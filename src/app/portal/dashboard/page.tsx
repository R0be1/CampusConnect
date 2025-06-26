
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, BookOpen, CalendarDays, DollarSign, MessageCircle, User } from "lucide-react";

// Mock Data for a parent viewing their child "John Doe"
const student = {
  name: 'John Doe',
  grade: 'Grade 10',
  section: 'A',
  avatar: 'https://placehold.co/80x80.png',
  parentName: 'Jane Doe',
};

const attendanceSummary = {
  present: 18,
  absent: 1,
  late: 1,
  total: 20,
};
const attendancePercentage = (attendanceSummary.present / attendanceSummary.total) * 100;

const gradesData = [
  { course: 'Mathematics', grade: 'A', teacher: 'Mr. Smith' },
  { course: 'History', grade: 'B+', teacher: 'Ms. Jones' },
  { course: 'Science', grade: 'A-', teacher: 'Dr. Brown' },
  { course: 'English Literature', grade: 'B', teacher: 'Mrs. Davis' },
];

const feeSummary = {
  outstanding: 2645.00,
  invoices: [
    { id: "INV-001", item: "Tuition Fee - Grade 10", total: "$2,625.00", dueDate: "2024-08-01", status: "Overdue" },
    { id: "INV-002", item: "Library Book Fine", total: "$20.00", dueDate: "2024-07-25", status: "Overdue" },
  ],
};

const recentCommunications = [
    { id: "msg-001", date: "2024-08-01", subject: "Update on Q2 Mathematics Performance", sentBy: "Mr. Smith", unread: false },
    { id: "msg-004", date: "2024-08-05", subject: "Parent-Teacher Meeting Schedule", sentBy: "Admin Office", unread: true },
];


export default function ParentDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold font-headline">Welcome, {student.parentName}!</h1>
            <p className="text-muted-foreground">Here's a summary of {student.name}'s progress and school activities.</p>
        </div>
      
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Academic Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead className="text-right">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gradesData.map((item) => (
                                    <TableRow key={item.course}>
                                    <TableCell className="font-medium">{item.course}</TableCell>
                                    <TableCell>{item.teacher}</TableCell>
                                    <TableCell className="text-right font-semibold">{item.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full">
                            View Detailed Report Card <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Recent Communications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentCommunications.map(msg => (
                            <div key={msg.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                                 <div className={`mt-1.5 h-2 w-2 rounded-full ${msg.unread ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                                 <div className="flex-1">
                                    <p className={`font-medium ${msg.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.subject}</p>
                                    <p className="text-sm text-muted-foreground">From: {msg.sentBy} on {msg.date}</p>
                                 </div>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full">
                            View All Messages <ArrowRight className="ml-2 h-4 w-4" />
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
                        <Button className="w-full">
                           <User className="mr-2 h-4 w-4" /> View Full Profile
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
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Fee Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-4 p-4 bg-destructive/10 rounded-lg">
                            <p className="text-sm text-destructive font-medium">Outstanding Balance</p>
                            <p className="text-3xl font-bold text-destructive">${feeSummary.outstanding.toFixed(2)}</p>
                        </div>
                         <div className="space-y-2 text-sm">
                            <h4 className="font-medium mb-2">Overdue Invoices:</h4>
                            {feeSummary.invoices.map(invoice => (
                                <div key={invoice.id} className="flex justify-between">
                                    <span className="text-muted-foreground">{invoice.item}</span>
                                    <span className="font-medium">{invoice.total}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                     <CardFooter>
                         <Button className="w-full">
                            Pay Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    </div>
  );
}
