
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, ArrowRight, DollarSign } from "lucide-react";
import Link from 'next/link';

const liveSessionsData = [
  { id: 'session-01', topic: 'Advanced Algebra Concepts', subject: 'Mathematics', teacher: 'Mr. Smith', dateTime: '2024-09-15 at 2:00 PM', fee: 25.00, isRegistered: true, status: 'Upcoming' as const },
  { id: 'session-02', topic: 'Introduction to Newtonian Physics', subject: 'Physics', teacher: 'Dr. Brown', dateTime: '2024-09-16 at 10:00 AM', fee: 30.00, isRegistered: false, status: 'Upcoming' as const },
  { id: 'session-03', topic: 'Live Q&A for Final Exams', subject: 'History', teacher: 'Ms. Jones', dateTime: '2024-08-20 at 4:00 PM', fee: 0, isRegistered: true, status: 'Completed' as const },
];

export default function StudentLiveSessionsPage() {
  const [sessions, setSessions] = useState(liveSessionsData);

  const mySessions = sessions.filter(s => s.isRegistered);
  const availableSessions = sessions.filter(s => !s.isRegistered);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Radio className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Live Learning Sessions</h1>
      </div>
      <p className="text-muted-foreground">Join live sessions with your teachers or register for upcoming ones.</p>

      {mySessions.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">My Registered Sessions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mySessions.map(session => (
                    <Card key={session.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{session.topic}</CardTitle>
                            <CardDescription>{session.subject} with {session.teacher}</CardDescription>
                        </CardHeader>
                         <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">Scheduled for: {session.dateTime}</p>
                            <Badge variant={session.status === 'Upcoming' ? 'secondary' : 'outline'} className="mt-2">{session.status}</Badge>
                         </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={session.status !== 'Upcoming'} asChild>
                                <Link href={`/student/live-sessions/${session.id}`}>Join Session <ArrowRight className="ml-2"/></Link>
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
                            <CardDescription>{session.subject} with {session.teacher}</CardDescription>
                        </CardHeader>
                         <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">Scheduled for: {session.dateTime}</p>
                            <div className="flex items-center font-semibold text-lg mt-4">
                                <DollarSign className="h-5 w-5 mr-1" />
                                {session.fee > 0 ? session.fee.toFixed(2) : 'Free'}
                            </div>
                         </CardContent>
                        <CardFooter>
                            <Button className="w-full">Register & Pay</Button>
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
