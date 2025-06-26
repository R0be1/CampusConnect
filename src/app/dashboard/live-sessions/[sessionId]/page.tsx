
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Hand, Mic, MicOff, Video, VideoOff } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock Data
const sessionDetails = {
    id: 'session-01',
    topic: 'Advanced Algebra Concepts',
};

const initialParticipants = [
    { id: 's001', name: 'John Doe', status: 'present', handRaised: false },
    { id: 's003', name: 'Bob Johnson', status: 'present', handRaised: true },
    { id: 's006', name: 'Peter Parker', status: 'absent', handRaised: false },
    { id: 's007', name: 'Bruce Wayne', status: 'present', handRaised: false },
    { id: 's009', name: 'Tony Stark', status: 'present', handRaised: true },
];

export default function TeacherSessionPage({ params }: { params: { sessionId: string } }) {
    const [participants, setParticipants] = useState(initialParticipants);

    const raisedHands = participants.filter(p => p.handRaised);

    return (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start h-[calc(100vh-100px)]">
            <div className="flex flex-col h-full">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>{sessionDetails.topic}</CardTitle>
                            <CardDescription>Live Session Dashboard</CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/live-sessions">
                                <ArrowLeft className="mr-2 h-4 w-4" /> End Session
                            </Link>
                        </Button>
                    </CardHeader>
                </Card>

                <Card className="flex-1 mt-6 flex flex-col">
                    <CardContent className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg">
                        <div className="text-center text-muted-foreground">
                            <Monitor className="h-16 w-16 mx-auto" />
                            <p className="mt-4 font-semibold">Your screen share will appear here.</p>
                            <p className="text-sm">Click the "Share Screen" button below to begin.</p>
                        </div>
                    </CardContent>
                    <CardHeader className="border-t">
                        <div className="flex justify-center items-center gap-4">
                            <Button size="lg" variant="outline"><Mic className="mr-2" /> Mute</Button>
                            <Button size="lg" variant="outline"><Video className="mr-2" /> Start Camera</Button>
                            <Button size="lg"><Monitor className="mr-2" /> Share Screen</Button>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            
            <div className="flex flex-col gap-6 h-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Hand className="text-primary"/> Raised Hands</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {raisedHands.length > 0 ? (
                            <ul className="space-y-2">
                                {raisedHands.map(p => <li key={p.id} className="text-sm font-medium">{p.name}</li>)}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No students have raised their hand.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Participants ({participants.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                         <ScrollArea className="h-[400px]">
                            <div className="space-y-1 px-6">
                                {participants.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                        <span className="font-medium text-sm">{p.name}</span>
                                        <Badge variant={p.status === 'present' ? 'default' : 'destructive'}>{p.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
