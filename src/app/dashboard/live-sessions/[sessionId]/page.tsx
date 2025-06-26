
"use client"

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Hand, Mic, Video } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';


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
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraVideoRef = useRef<HTMLVideoElement>(null);
    
    const { toast } = useToast();

    const isSharing = !!screenStream;
    const isCameraOn = !!cameraStream;
    const raisedHands = participants.filter(p => p.handRaised);

    // Effect for screen sharing
    useEffect(() => {
        if (videoRef.current && screenStream) {
            videoRef.current.srcObject = screenStream;
        } else if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, [screenStream]);

    // Effect for camera
    useEffect(() => {
        if (cameraVideoRef.current && cameraStream) {
            cameraVideoRef.current.srcObject = cameraStream;
        } else if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = null;
        }
    }, [cameraStream]);

    const handleStopSharing = useCallback(() => {
        screenStream?.getTracks().forEach(track => track.stop());
        setScreenStream(null);
    }, [screenStream]);

    const handleShareScreen = useCallback(async () => {
        if (isSharing) return;
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            stream.getVideoTracks()[0].addEventListener('ended', handleStopSharing);
            setScreenStream(stream);
        } catch (err) {
            console.error("Error sharing screen: ", err);
            toast({
                variant: "destructive",
                title: "Screen Share Failed",
                description: "Could not start screen sharing. Please ensure you have granted the necessary permissions.",
            });
        }
    }, [isSharing, toast, handleStopSharing]);

    const handleToggleCamera = useCallback(async () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraStream(stream);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                toast({
                    variant: "destructive",
                    title: "Camera Access Denied",
                    description: "Could not start camera. Please ensure you have granted the necessary permissions.",
                });
            }
        }
    }, [cameraStream, toast]);

    // Cleanup streams on component unmount
    useEffect(() => {
        return () => {
            screenStream?.getTracks().forEach(track => track.stop());
            cameraStream?.getTracks().forEach(track => track.stop());
        };
    }, [screenStream, cameraStream]);

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

                <Card className="flex-1 mt-6 flex flex-col relative">
                    <CardContent className="flex-1 flex items-center justify-center bg-black rounded-t-lg p-0">
                        {isSharing ? (
                            <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                <Monitor className="h-16 w-16 mx-auto" />
                                <p className="mt-4 font-semibold">Your screen share or camera will appear here.</p>
                                <p className="text-sm">Click a button below to begin.</p>
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 h-32 w-48 md:h-40 md:w-56 z-10">
                           <video ref={cameraVideoRef} className={cn("w-full h-full object-cover rounded-md bg-muted/50 border-2 border-background", !isCameraOn && "hidden")} autoPlay muted playsInline />
                        </div>
                    </CardContent>
                    <CardHeader className="border-t">
                        <div className="flex justify-center items-center gap-4">
                            <Button size="lg" variant="outline"><Mic className="mr-2" /> Mute</Button>
                            <Button size="lg" variant={isCameraOn ? "default" : "outline"} onClick={handleToggleCamera}>
                                <Video className="mr-2" /> {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                            </Button>
                             {isSharing ? (
                                <Button size="lg" variant="destructive" onClick={handleStopSharing}>
                                    <Monitor className="mr-2" /> Stop Sharing
                                </Button>
                            ) : (
                                <Button size="lg" onClick={handleShareScreen}>
                                    <Monitor className="mr-2" /> Share Screen
                                </Button>
                            )}
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
