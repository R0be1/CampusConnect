
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

const communicationData = [
  { id: "msg-004", date: "2024-08-05", subject: "Parent-Teacher Meeting Schedule", sentBy: "Admin Office", unread: true, message: "Dear Mrs. Doe, This is a reminder about the upcoming parent-teacher meetings next week. Please book a slot at your earliest convenience through the school portal. We look forward to seeing you. Best regards, Admin Office." },
  { id: "msg-001", date: "2024-08-01", subject: "Update on Q2 Mathematics Performance", sentBy: "Mr. Smith", unread: false, message: "Dear Mrs. Doe, I wanted to share an update on John's excellent performance in Mathematics this quarter. He scored an A on the recent exam and has been an active participant in class. Keep up the great work encouraging him at home. Best, Mr. Smith" },
  { id: "msg-003", date: "2024-07-25", subject: "Concerns about recent behavior", sentBy: "Admin Office", unread: false, message: "Dear Mrs. Johnson, We'd like to schedule a meeting to discuss some recent behavioral concerns regarding Bob. Please let us know your availability for next week. Sincerely, Admin Office." },
  { id: "msg-002", date: "2024-07-28", subject: "History Project Submission Reminder", sentBy: "Ms. Jones", unread: false, message: "Dear Mr. Smith, this is a friendly reminder that the 'Ancient Civilizations' history project is due this Friday, August 2nd. Please ensure Alice submits it on time. Thank you, Ms. Jones." }
];

// Sort by date
communicationData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


export default function CommunicationPortalPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Communication Center</h1>
      </div>
      <p className="text-muted-foreground">Here is a log of all communications from the school.</p>
      
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {communicationData.map(msg => (
                <AccordionItem value={msg.id} key={msg.id} className="border-x-0 border-t-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                     <div className="flex items-center gap-4 text-left w-full">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                            <AvatarFallback>{msg.sentBy.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className={`font-semibold text-base ${msg.unread ? 'text-foreground' : ''}`}>{msg.subject}</p>
                            <p className="text-sm text-muted-foreground">
                                From {msg.sentBy} on {msg.date}
                            </p>
                        </div>
                         {msg.unread && <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert border-t pt-4 mt-2 text-foreground/80">
                        <p>{msg.message}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
