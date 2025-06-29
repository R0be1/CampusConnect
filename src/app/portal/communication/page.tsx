
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Info, Loader2 } from "lucide-react";
import { useStudent } from "@/context/student-context";
import { useState, useEffect } from "react";
import { getCommunicationAction, PortalCommunicationData, markCommunicationReadAction } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

function CommunicationLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2 p-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function CommunicationPortalPage() {
  const { selectedStudent } = useStudent();
  const [communications, setCommunications] = useState<PortalCommunicationData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudent?.id) {
        setIsLoading(true);
        setError(null);
        setCommunications([]);
        getCommunicationAction(selectedStudent.id)
            .then(result => {
                if (result.success && result.data) {
                    setCommunications(result.data);
                } else {
                    setError(result.error || "Failed to load communications.");
                }
            })
            .catch(() => setError("An unexpected error occurred."))
            .finally(() => setIsLoading(false));
    }
  }, [selectedStudent]);
  
  const handleAccordionChange = (value: string) => {
    // When an accordion item is opened, mark it as read
    const openedMessage = communications.find(msg => msg.id === value && !msg.isRead);
    if (openedMessage) {
        markCommunicationReadAction(openedMessage.id).then(result => {
            if (result.success) {
                // Optimistically update the UI
                setCommunications(prev => 
                    prev.map(msg => msg.id === value ? { ...msg, isRead: true } : msg)
                );
            }
        });
    }
  };

  if (isLoading || !selectedStudent) {
    return <CommunicationLoadingSkeleton />;
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Communication Center</h1>
      </div>
      <p className="text-muted-foreground">Here is a log of all communications from the school for {selectedStudent.name}.</p>
      
      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      <Card>
        <CardContent className="p-0">
          {communications.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
                {communications.map(msg => (
                    <AccordionItem value={msg.id} key={msg.id} className="border-x-0 border-t-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4 text-left w-full">
                            <Avatar>
                                <AvatarImage src={msg.sender.photoUrl || `https://cdn-icons-png.flaticon.com/512/149/149071.png`} data-ai-hint="person portrait" />
                                <AvatarFallback>{`${msg.sender.firstName?.[0] || ''}${msg.sender.lastName?.[0] || ''}`}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className={`font-semibold text-base ${!msg.isRead ? 'text-foreground' : ''}`}>{msg.subject}</p>
                                <p className="text-sm text-muted-foreground">
                                    From {msg.sender.firstName} {msg.sender.lastName} on {format(new Date(msg.sentAt), 'PPP')}
                                </p>
                            </div>
                            {!msg.isRead && <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />}
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
          ) : (
            <div className="text-center p-16 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Communications Found</h3>
                <p className="mt-2 text-sm">There are no messages to display for this student.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
