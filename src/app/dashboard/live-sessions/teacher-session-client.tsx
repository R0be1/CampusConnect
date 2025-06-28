
"use client"

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Hand, Mic, Video } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { LiveSessionForPage } from '@/lib/data';

const initialParticipants: { id: string; name: string; status: string; handRaised: boolean }[] = [];

type TeacherSessionClientProps = {
    session: LiveSessionForPage;
};

export function TeacherSessionClient({ session }: TeacherSessionClientProps) {
    const { toast } = useToast();
    
    // UI State
    const [participants, setParticipants] = useState(initialParticipants);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    
    const cameraVideoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);

    const handleToggleCamera = () => {
        setIsCameraOn(prev => !prev);
        toast({ title: "Camera Button Clicked!", description: "Functionality will be added next." });
    };

    const handleToggleScreenShare = () => {
        setIsSharingScreen(prev => !prev);
        toast({ title: "Share Screen Button Clicked!", description: "Functionality will be added next." });
    };

    const raisedHands = participants.filter(p => p.handRaised);

    return (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start h-[calc(100vh-100px)]">
            <div className="flex flex-col h-full">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>{session.topic}</CardTitle>
                            <CardDescription>Live Session Dashboard</CardDescription>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/live-sessions">
                                <ArrowLeft className="mr-2 h-4 w-4" /> End Session
                            </Link>
                        </Button>
                    </CardHeader>
                </Card>

                <Card className="flex-1 mt-6 flex flex-col relative">
                    <CardContent className="flex-1 flex items-center justify-center bg-black rounded-t-lg p-0">
                        <video ref={screenVideoRef} className={!isSharingScreen ? "hidden" : "w-full h-full object-contain"} autoPlay playsInline muted />
                        
                        {!isSharingScreen && (
                            <div className="text-center text-muted-foreground p-4">
                                <Monitor className="h-16 w-16 mx-auto" />
                                <p className="mt-4 font-semibold">Your screen share will appear here.</p>
                                <p className="text-sm">Click a button below to begin.</p>
                            </div>
                        )}

                        <div className="absolute bottom-4 right-4 h-32 w-48 md:h-40 md:w-56 z-10">
                           <video ref={cameraVideoRef} className={!isCameraOn ? "hidden" : "w-full h-full object-cover rounded-md bg-muted/50 border-2 border-background"} autoPlay muted playsInline />
                        </div>
                    </CardContent>
                    <CardHeader className="border-t">
                        <div className="flex justify-center items-center gap-4">
                            <Button size="lg" variant="outline"><Mic className="mr-2" /> Mute</Button>
                            
                            <Button size="lg" variant={isCameraOn ? "default" : "outline"} onClick={handleToggleCamera}>
                                <Video className="mr-2" /> {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                            </Button>
                             
                            <Button size="lg" variant={isSharingScreen ? "destructive" : "default"} onClick={handleToggleScreenShare}>
                                <Monitor className="mr-2" /> {isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
                            </Button>
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
                        <CardTitle>Participants ({session._count.registrations})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                         <ScrollArea className="h-[400px]">
                            <div className="space-y-1 px-6">
                                {participants.length > 0 ? participants.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                        <span className="font-medium text-sm">{p.name}</span>
                                        <Badge variant={p.status === 'present' ? 'default' : 'destructive'}>{p.status}</Badge>
                                    </div>
                                )) : (
                                    <div className="text-center text-muted-foreground p-4">
                                        <p>No participants have joined yet.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
