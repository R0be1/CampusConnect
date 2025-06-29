
"use client";

import { useState, useEffect } from 'react';
import { useStudent } from '@/context/student-context';
import { getStudentProfileForStudentPortal } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Info } from "lucide-react";
import ProfileClient from "./profile-client";
import type { StudentProfileData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function ProfileLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function ProfileStudentPage() {
    const { selectedStudent, isLoading: isStudentLoading } = useStudent();
    const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if(selectedStudent?.id) {
            setIsLoading(true);
            setError(null);
            getStudentProfileForStudentPortal(selectedStudent.id)
                .then(data => {
                    if (data) {
                        setProfileData(data);
                    } else {
                        setError("Could not load profile data.");
                    }
                })
                .catch(e => setError("An error occurred while fetching profile data."))
                .finally(() => setIsLoading(false));
        }
    }, [selectedStudent]);

    if(isStudentLoading || isLoading) {
        return <ProfileLoadingSkeleton />;
    }

    if (!selectedStudent) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>Please select a student to view their profile.</AlertDescription>
            </Alert>
        )
    }

    if (error || !profileData) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error || "Profile could not be loaded."}</AlertDescription></Alert>;
    }

    return <ProfileClient profileData={profileData} />;
}
