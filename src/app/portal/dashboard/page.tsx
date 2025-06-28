
"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, BookOpen, CalendarDays, DollarSign, MessageCircle, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useStudent } from "@/context/student-context";
import { getDashboardDataAction } from "../actions";
import { PortalDashboardData } from "@/lib/data";
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

export default function ParentDashboardPage() {
  const { selectedStudent } = useStudent();
  const [data, setData] = useState<PortalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.id) {
        setIsLoading(true);
        setError(null);
        getDashboardDataAction(selectedStudent.id)
            .then(result => {
                if (result.success) {
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
  
  const attendancePercentage = data.attendanceSummary.total > 0 ? (data.attendanceSummary.present / data.attendanceSummary.total) * 100 : 0;
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold font-headline">Welcome, {data.student.parentName}!</h1>
            <p className="text-muted-foreground">Here's a summary of {data.student.name}'s progress and school activities.</p>
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
                                {data.gradesData.length > 0 ? data.gradesData.map((item) => (
                                    <TableRow key={item.course}>
                                    <TableCell className="font-medium">{item.course}</TableCell>
                                    <TableCell>{item.teacher}</TableCell>
                                    <TableCell className="text-right font-semibold">{item.grade}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={3} className="text-center h-24">No grades recorded yet.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="outline" className="w-full">
                            <Link href="/portal/academics">
                                View Detailed Performance <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Recent Communications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.recentCommunications.length > 0 ? data.recentCommunications.map(msg => (
                            <div key={msg.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                                 <div className={`mt-1.5 h-2 w-2 rounded-full ${msg.unread ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                                 <div className="flex-1">
                                    <p className={`font-medium ${msg.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.subject}</p>
                                    <p className="text-sm text-muted-foreground">From: {msg.sentBy} on {format(new Date(msg.date), 'PPP')}</p>
                                 </div>
                                <Button variant="ghost" size="sm" asChild><Link href="/portal/communication">View</Link></Button>
                            </div>
                        )) : (
                            <p className="text-sm text-center text-muted-foreground py-4">No recent communications.</p>
                        )}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full" asChild>
                            <Link href="/portal/communication">
                                View All Messages <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

            </div>
            
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                         <Avatar className="h-16 w-16 border">
                            <AvatarImage src={data.student.avatar} data-ai-hint="person portrait" />
                            <AvatarFallback>{data.student.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <CardTitle className="text-xl">{data.student.name}</CardTitle>
                            <CardDescription>{data.student.grade}, Section {data.student.section}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                           <Link href="/portal/profile">
                            <User className="mr-2 h-4 w-4" /> View Full Profile
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
                                <p className="font-bold text-lg">{data.attendanceSummary.present}</p>
                                <p className="text-muted-foreground">Present</p>
                            </div>
                             <div>
                                <p className="font-bold text-lg text-destructive">{data.attendanceSummary.absent}</p>
                                <p className="text-muted-foreground">Absent</p>
                            </div>
                             <div>
                                <p className="font-bold text-lg">{data.attendanceSummary.late}</p>
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
                        {data.feeSummary.outstanding > 0 ? (
                             <div className="text-center mb-4 p-4 bg-destructive/10 rounded-lg">
                                <p className="text-sm text-destructive font-medium">Outstanding Balance</p>
                                <p className="text-3xl font-bold text-destructive">{formatCurrency(data.feeSummary.outstanding)}</p>
                            </div>
                        ) : (
                             <div className="text-center mb-4 p-4 bg-green-500/10 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">No Outstanding Balance</p>
                                <p className="text-3xl font-bold text-green-700">$0.00</p>
                            </div>
                        )}
                         <div className="space-y-2 text-sm">
                            <h4 className="font-medium mb-2">Overdue Invoices:</h4>
                             {data.feeSummary.invoices.length > 0 ? data.feeSummary.invoices.map(invoice => (
                                <div key={invoice.id} className="flex justify-between">
                                    <span className="text-muted-foreground">{invoice.item}</span>
                                    <span className="font-medium">{formatCurrency(invoice.total)}</span>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center">No overdue invoices.</p>
                            )}
                        </div>
                    </CardContent>
                     <CardFooter>
                         <Button className="w-full" asChild>
                            <Link href="/portal/fees">
                                Pay Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    </div>
  );
}
