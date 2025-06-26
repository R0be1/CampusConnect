import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunicationComposer } from "./messages";
import { CommunicationHistory } from "./recommendations";
import { MessageSquare, History } from "lucide-react";

export default function CommunicationPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Communication Center</h1>
      </div>
      <Tabs defaultValue="compose">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">
            <MessageSquare className="mr-2 h-4 w-4" />
            Compose Message
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Communication History
            </TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <CommunicationComposer />
        </TabsContent>
        <TabsContent value="history">
          <CommunicationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
