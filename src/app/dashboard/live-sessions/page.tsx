
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Radio, PlusCircle, Play, Users } from "lucide-react";
import Link from 'next/link';

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const liveSessionsData: {
  id: string;
  topic: string;
  subject: string;
  grade: string;
  dateTime: string;
  status: "Upcoming" | "Active" | "Completed";
  fee: number;
  registrations: number;
}[] = [];


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
