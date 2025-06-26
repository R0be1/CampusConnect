"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";

const contacts = [
  { name: "Mr. Smith", role: "Math Teacher", avatar: "person" },
  { name: "Ms. Jones", role: "History Teacher", avatar: "person" },
  { name: "Admin Office", role: "Administration", avatar: "building" },
];

const messages: Record<string, { from: 'teacher' | 'parent'; text: string }[]> = {
  "Mr. Smith": [
    { from: "teacher", text: "Hello, I'd like to discuss John's progress in Math." },
    { from: "parent", text: "Of course, I'm available to chat now." },
  ],
  "Ms. Jones": [
    { from: "teacher", text: "Reminder: The history project is due this Friday." },
  ],
  "Admin Office": [
    { from: "parent", text: "I have a question about the recent fee circular." },
  ],
};

export function CommunicationMessages() {
  const [selectedContact, setSelectedContact] = useState(contacts[0].name);
  const currentMessages = messages[selectedContact] || [];

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[600px]">
        <div className="border-r">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>Select a contact to start messaging.</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[480px]">
            <div className="flex flex-col gap-1 p-2">
              {contacts.map((contact) => (
                <Button
                  key={contact.name}
                  variant={selectedContact === contact.name ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 p-2 h-auto"
                  onClick={() => setSelectedContact(contact.name)}
                >
                  <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={`${contact.avatar} portrait`} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <div className="font-semibold">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.role}</div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>{selectedContact}</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${msg.from === 'parent' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.from === 'teacher' && <Avatar className="h-8 w-8"><AvatarFallback>{selectedContact.charAt(0)}</AvatarFallback></Avatar>}
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      msg.from === 'parent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.from === 'parent' && <Avatar className="h-8 w-8"><AvatarFallback>You</AvatarFallback></Avatar>}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
