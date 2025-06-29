
"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Hand, Mic, Video, Send, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { LiveSessionForPage } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

type Participant = {
  id: string;
  name: string;
  handRaised: boolean;
};

type Message = {
  id: string;
  participantName: string;
  text: string;
};

// Dummy participants for simulation
const allParticipants: Participant[] = [
  { id: 'student-1', name: 'Alice Doe', handRaised: false },
  { id: 'student-2', name: 'Bob Smith', handRaised: false },
  { id: 'student-3', name: 'Charlie Brown', handRaised: false },
  { id: 'student-4', name: 'Diana Prince', handRaised: false },
];

type TeacherSessionClientProps = {
    session: LiveSessionForPage;
};

export function TeacherSessionClient({ session }: TeacherSessionClientProps) {
    const { toast } = useToast();
    
    // UI State
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    
    const cameraVideoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);

    // Simulation Effect
    useEffect(() => {
        // Simulate participants joining one by one
        const joinInterval = setInterval(() => {
          setParticipants(current => {
            if (current.length < allParticipants.length) {
              return [...current, allParticipants[current.length]];
            }
            clearInterval(joinInterval);
            return current;
          });
        }, 1500);
    
        // Simulate a hand raise
        const handRaiseTimeout = setTimeout(() => {
          setParticipants(current => current.map(p => p.id === 'student-2' ? { ...p, handRaised: true } : p));
          toast({ title: "Hand Raised", description: "Bob Smith has raised their hand." });
        }, 6000);
    
        // Simulate a message
        const messageTimeout = setTimeout(() => {
          setMessages(current => [...current, { id: 'msg-1', participantName: 'Alice Doe', text: 'Can you please explain that last part again?' }]);
        }, 9000);
    
        return () => {
          clearInterval(joinInterval);
          clearTimeout(handRaiseTimeout);
          clearTimeout(messageTimeout);
        };
    }, [toast]);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            // Just to check for permission status on load
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            stream.getTracks().forEach(track => track.stop()); // Stop stream immediately
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
        getCameraPermission();
      }, []);

    const stopStream = (stream: MediaStream | null) => {
        stream?.getTracks().forEach(track => track.stop());
    }

    const handleToggleCamera = async () => {
        if (isCameraOn) {
            stopStream(cameraStreamRef.current);
            cameraStreamRef.current = null;
            if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
            setIsCameraOn(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                cameraStreamRef.current = stream;
                if (cameraVideoRef.current) {
                    cameraVideoRef.current.srcObject = stream;
                }
                setHasCameraPermission(true);
                setIsCameraOn(true);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Camera Access Denied', description: 'Please enable camera permissions in your browser.'});
                setHasCameraPermission(false);
            }
        }
    };

    const handleToggleScreenShare = async () => {
        if (isSharingScreen) {
            stopStream(screenStreamRef.current);
            screenStreamRef.current = null;
            if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
            setIsSharingScreen(false);
        } else {
             try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = stream;
                if (screenVideoRef.current) {
                    screenVideoRef.current.srcObject = stream;
                }
                setIsSharingScreen(true);
                // When screen sharing ends (e.g., user clicks browser's "Stop sharing" button)
                stream.getVideoTracks()[0].addEventListener('ended', () => {
                    setIsSharingScreen(false);
                    if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
                });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Screen Share Failed', description: 'Could not start screen sharing.'});
            }
        }
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
                           <video ref={cameraVideoRef} className="w-full h-full object-cover rounded-md bg-muted/50 border-2 border-background" autoPlay muted playsInline />
                           { hasCameraPermission === false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                                    <p className="text-xs text-center text-white p-2">Camera permission denied</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardHeader className="border-t">
                        <div className="flex justify-center items-center gap-4">
                            <Button size="lg" variant={isMuted ? "destructive" : "outline"} onClick={() => setIsMuted(!isMuted)}>
                                <Mic className="mr-2" /> {isMuted ? 'Unmute' : 'Mute'}
                            </Button>
                            
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
                        <CardTitle>Participants ({participants.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                         <ScrollArea className="h-[200px]">
                            <div className="space-y-1 px-6">
                                {participants.length > 0 ? participants.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                        <span className="font-medium text-sm">{p.name}</span>
                                        <Badge variant={p.handRaised ? 'default' : 'outline'}>{p.handRaised ? 'Hand Raised' : 'Present'}</Badge>
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
                
                 <Card className="flex-1 flex flex-col">
                    <CardHeader><CardTitle>Chat</CardTitle></CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-[200px] p-6">
                            <div className="space-y-4">
                               {messages.length > 0 ? messages.map(msg => (
                                 <div key={msg.id}>
                                   <p className="font-bold text-sm">{msg.participantName}</p>
                                   <p className="text-sm text-muted-foreground">{msg.text}</p>
                                 </div>
                               )) : (
                                <p className="text-sm text-center text-muted-foreground">No messages yet.</p>
                               )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
