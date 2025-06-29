
"use client";

import { useStudent } from "@/context/student-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, UserCheck } from "lucide-react";
import AttendanceClient from "./attendance-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AttendanceStudentPage() {
    const { selectedStudent, isLoading } = useStudent();
    
    if (isLoading) {
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

    if (!selectedStudent) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>Please select a student to view attendance.</AlertDescription>
            </Alert>
        )
    }
  
    return (
        <AttendanceClient 
            studentId={selectedStudent.id} 
            studentName={selectedStudent.name} 
        />
    );
}
