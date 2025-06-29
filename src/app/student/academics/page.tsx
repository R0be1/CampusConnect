
"use client";

import { useState, useEffect } from "react";
import { useStudent } from "@/context/student-context";
import { getAcademicDataForStudentPortal, getCurrentAcademicYear, getFirstSchool } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Info } from "lucide-react";
import AcademicsClient from "./academics-client";
import type { AcademicsDataForPortal } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


function AcademicsLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="space-y-4">
                <Card><CardHeader><Skeleton className="h-16 w-full" /></CardHeader></Card>
                <Card><CardHeader><Skeleton className="h-16 w-full" /></CardHeader></Card>
                <Card><CardHeader><Skeleton className="h-16 w-full" /></CardHeader></Card>
            </div>
        </div>
    )
}

export default function AcademicsStudentPage() {
    const { selectedStudent, isLoading: isStudentLoading } = useStudent();
    const [academicData, setAcademicData] = useState<AcademicsDataForPortal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedStudent?.id) {
            
            const fetchAcademics = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const school = await getFirstSchool();
                    const academicYear = await getCurrentAcademicYear(school!.id);
                    if (!academicYear) {
                        throw new Error("No active academic year found.");
                    }
                    const data = await getAcademicDataForStudentPortal(selectedStudent.id, academicYear.id);
                    setAcademicData(data);
                } catch (e: any) {
                    setError(e.message || "Failed to load academic data.");
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchAcademics();
        }
    }, [selectedStudent]);

    if (isStudentLoading || (isLoading && !academicData)) {
        return <AcademicsLoadingSkeleton />;
    }

    if (!selectedStudent) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>Please select a student to view their academics.</AlertDescription>
            </Alert>
        )
    }
    
    if (error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }

    return <AcademicsClient academicData={academicData} />;
}
