
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";

type HistoryData = {
  id: string;
  date: string;
  student: string;
  subject: string;
  sentBy: string;
};

type CommunicationHistoryProps = {
    communicationHistoryData: HistoryData[];
};

export function CommunicationHistory({ communicationHistoryData }: CommunicationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Sent Messages</CardTitle>
                <CardDescription>A log of all communications sent to parents.</CardDescription>
            </div>
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sent By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communicationHistoryData.length > 0 ? (
                communicationHistoryData.map((msg) => (
                    <TableRow key={msg.id}>
                    <TableCell>{msg.date}</TableCell>
                    <TableCell className="font-medium">{msg.student}</TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>{msg.sentBy}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No sent messages found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
