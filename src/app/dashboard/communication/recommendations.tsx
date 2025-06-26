
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";

const communicationHistoryData = [
  {
    id: "msg-001",
    date: "2024-08-01",
    student: "John Doe",
    subject: "Update on Q2 Mathematics Performance",
    sentBy: "Mr. Smith",
    message: "Dear Mrs. Doe, I wanted to share an update on John's excellent performance in Mathematics this quarter. He scored an A on the recent exam and has been an active participant in class. Keep up the great work encouraging him at home. Best, Mr. Smith"
  },
  {
    id: "msg-002",
    date: "2024-07-28",
    student: "Alice Smith",
    subject: "History Project Submission Reminder",
    sentBy: "Ms. Jones",
    message: "Dear Mr. Smith, this is a friendly reminder that the 'Ancient Civilizations' history project is due this Friday, August 2nd. Please ensure Alice submits it on time. Thank you, Ms. Jones."
  },
  {
    id: "msg-003",
    date: "2024-07-25",
    student: "Bob Johnson",
    subject: "Concerns about recent behavior",
    sentBy: "Admin Office",
    message: "Dear Mrs. Johnson, We'd like to schedule a meeting to discuss some recent behavioral concerns regarding Bob. Please let us know your availability for next week. Sincerely, Admin Office."
  },
];

export function CommunicationHistory() {
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
              {communicationHistoryData.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.date}</TableCell>
                  <TableCell className="font-medium">{msg.student}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell>{msg.sentBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
