
"use client";

import { useState, useEffect } from "react";
import FeesClientPage from "./fees-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, DollarSign } from "lucide-react";
import { useStudent } from "@/context/student-context";
import { getFeesDataAction, PortalFeesData } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

function FeesLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-72 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-6"><CardHeader><Skeleton className="h-20 w-full" /></CardHeader><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
                </div>
            </div>
        </div>
    )
}

export default function FeesPortalPage() {
    const { selectedStudent, isLoading: isStudentLoading } = useStudent();
    const [feesData, setFeesData] = useState<PortalFeesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedStudent?.id) {
            setIsLoading(true);
            setError(null);
            getFeesDataAction(selectedStudent.id)
                .then(result => {
                    if (result.success) {
                        setFeesData(result.data);
                    } else {
                        setError(result.error || "Failed to load fee data.");
                    }
                })
                .catch(() => setError("An unexpected error occurred."))
                .finally(() => setIsLoading(false));
        } else if (!isStudentLoading) {
            // Handle case where there's no selected student after loading
            setIsLoading(false);
        }
    }, [selectedStudent, isStudentLoading]);
    
    if (isStudentLoading || (isLoading && !error)) {
        return <FeesLoadingSkeleton />;
    }

    if (!selectedStudent) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>Please select a student from the top menu to view their fee details.</AlertDescription>
            </Alert>
        )
    }

    if (error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }
    
    return <FeesClientPage initialFeesData={feesData} studentName={selectedStudent.name} />;
}
