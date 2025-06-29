
"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Hand, Mic, Video, Send, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getLiveSessionAction } from '../../actions';
import type { LiveSession } from '@prisma/client';
import { useParams } from 'next/navigation';

export default function StudentSessionPage() {
    const params = useParams<{ sessionId: string }>();
    const [sessionDetails, setSessionDetails] = useState<LiveSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [handRaised, setHandRaised] = useState(false);

    useEffect(() => {
        if (params.sessionId) {
            getLiveSessionAction(params.sessionId as string)
                .then(result => {
                    if (result.success && result.data) {
                        setSessionDetails(result.data as LiveSession);
                    } else {
                        setError(result.error || "Session not found.");
                    }
                })
                .catch(() => setError("Failed to load session details."))
                .finally(() => setIsLoading(false));
        }
    }, [params.sessionId]);

    if (isLoading) {
        return (
             <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !sessionDetails) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>{error || 'The session could not be loaded.'}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild variant="outline">
                        <Link href="/student/live-sessions">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start h-[calc(100vh-100px)]">
            <div className="flex flex-col h-full">
                <Alert className="mb-4">
                    <Monitor className="h-4 w-4" />
                    <AlertTitle>You are now in the session!</AlertTitle>
                    <AlertDescription>
                        Your attendance has been marked. Please remain respectful and follow the teacher's instructions.
                    </AlertDescription>
                </Alert>

                <Card className="flex-1 flex flex-col">
                     <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>{sessionDetails.topic}</CardTitle>
                            <CardDescription>Live Learning Session</CardDescription>
                        </div>
                         <Button asChild variant="destructive">
                            <Link href="/student/live-sessions">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Leave Session
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center bg-muted/30 rounded-b-lg">
                        <div className="text-center text-muted-foreground">
                            <Monitor className="h-16 w-16 mx-auto" />
                            <p className="mt-4 font-semibold">Waiting for teacher to share screen...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex flex-col gap-6 h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Session Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                       <Button variant={handRaised ? "default" : "outline"} onClick={() => setHandRaised(!handRaised)}>
                            <Hand className="mr-2"/>
                            {handRaised ? 'Lower Hand' : 'Raise Hand'}
                       </Button>
                       <div className="flex gap-2">
                           <Button variant="outline" className="flex-1"><Mic className="mr-2"/> Unmute</Button>
                           <Button variant="outline" className="flex-1"><Video className="mr-2"/> Start Video</Button>
                       </div>

                       <div className="flex-1 border-t pt-4 flex flex-col">
                            <h3 className="font-semibold mb-2">Ask a Question</h3>
                            <Textarea placeholder="Type your question here..." className="flex-1"/>
                            <Button className="mt-2">
                                <Send className="mr-2"/> Send
                            </Button>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
