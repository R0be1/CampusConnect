
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Radio, PlusCircle, Play, Users } from "lucide-react";
import Link from 'next/link';

const liveSessionsData = [
  { id: 'session-01', topic: 'Advanced Algebra Concepts', subject: 'Mathematics', grade: 'Grade 10', dateTime: '2024-09-15 14:00', status: 'Upcoming' as const, fee: 25.00, registrations: 12 },
  { id: 'session-02', topic: 'Introduction to Newtonian Physics', subject: 'Physics', grade: 'Grade 11', dateTime: '2024-09-16 10:00', status: 'Upcoming' as const, fee: 30.00, registrations: 8 },
  { id: 'session-03', topic: 'Live Q&A for Final Exams', subject: 'History', grade: 'Grade 9', dateTime: '2024-08-20 16:00', status: 'Completed' as const, fee: 0, registrations: 45 },
];

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState(liveSessionsData);

   const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Upcoming": return "secondary";
      case "Completed": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Radio className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Live Learning Sessions</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scheduled Sessions</CardTitle>
            <CardDescription>Manage all upcoming, active, and completed live sessions.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/live-sessions/schedule">
              <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Session
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Registrations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.topic}</TableCell>
                    <TableCell>{session.subject}</TableCell>
                    <TableCell>{session.dateTime}</TableCell>
                    <TableCell>
                       <Badge variant={getStatusVariant(session.status) as any}>{session.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{session.registrations}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/live-sessions/${session.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            {session.status === 'Upcoming' ? 'Start Session' : 'View Dashboard'}
                        </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
