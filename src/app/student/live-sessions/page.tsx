
"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, ArrowRight, DollarSign, Loader2, Info } from "lucide-react";
import Link from 'next/link';
import { useStudent } from '@/context/student-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getLiveSessionsAction, registerForSessionAction, StudentPortalLiveSessionsData } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


function LiveSessionsLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Radio className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent><Skeleton className="h-12 w-full" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function StudentLiveSessionsPage() {
  const { toast } = useToast();
  const { selectedStudent, isLoading: isStudentLoading } = useStudent();
  const [sessions, setSessions] = useState<StudentPortalLiveSessionsData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.id) {
      setIsLoading(true);
      setError(null);
      getLiveSessionsAction(selectedStudent.id)
        .then(result => {
          if (result.success && result.data) {
            setSessions(result.data);
          } else {
            setError(result.error || "Failed to load live sessions.");
          }
        })
        .catch(() => setError("An unexpected error occurred."))
        .finally(() => setIsLoading(false));
    }
  }, [selectedStudent]);

  const handleRegister = async (sessionId: string) => {
    if (!selectedStudent?.id) return;
    setIsRegistering(sessionId);
    const result = await registerForSessionAction(sessionId, selectedStudent.id);
    if (result.success) {
        toast({ title: "Registration Successful", description: result.message });
        // Optimistically update the UI
        setSessions(prev => prev.map(s => s.id === sessionId ? {...s, isRegistered: true} : s));
    } else {
        toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
    }
    setIsRegistering(null);
  }

  const mySessions = sessions.filter(s => s.isRegistered);
  const availableSessions = sessions.filter(s => !s.isRegistered);

  if (isStudentLoading || isLoading) {
    return <LiveSessionsLoadingSkeleton />;
  }

  if (!selectedStudent) {
      return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Student Selected</AlertTitle>
                <AlertDescription>Please select a student to view live sessions.</AlertDescription>
            </Alert>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Radio className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Live Learning Sessions</h1>
      </div>
      <p className="text-muted-foreground">Join live sessions with your teachers or register for upcoming ones.</p>

      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {mySessions.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">My Registered Sessions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mySessions.map(session => (
                    <Card key={session.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{session.topic}</CardTitle>
                            <CardDescription>{session.subject} with {session.teacher.firstName} {session.teacher.lastName}</CardDescription>
                        </CardHeader>
                         <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">Scheduled for: {format(new Date(session.startTime), 'PPP p')}</p>
                            <Badge variant={session.status === 'UPCOMING' ? 'secondary' : 'default'} className="mt-2">{session.status}</Badge>
                         </CardContent>
                          <CardFooter>
                            <Button className="w-full" disabled={session.status !== 'UPCOMING'} asChild>
                                <Link href={`/student/live-sessions/${session.id}`}>Join Session <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      )}

      <div className="space-y-4 pt-6 border-t">
        <h2 className="text-2xl font-semibold">Available Sessions</h2>
         {availableSessions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableSessions.map(session => (
                    <Card key={session.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{session.topic}</CardTitle>
                            <CardDescription>{session.subject} with {session.teacher.firstName} {session.teacher.lastName}</CardDescription>
                        </CardHeader>
                         <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">Scheduled for: {format(new Date(session.startTime), 'PPP p')}</p>
                            <div className="flex items-center font-semibold text-lg mt-4">
                                <DollarSign className="h-5 w-5 mr-1" />
                                {session.fee > 0 ? session.fee.toFixed(2) : 'Free'}
                            </div>
                         </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleRegister(session.id)} disabled={isRegistering === session.id}>
                                {isRegistering === session.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
         ) : (
            <p className="text-muted-foreground">There are no new sessions available for registration right now.</p>
         )}
      </div>

    </div>
  );
}
