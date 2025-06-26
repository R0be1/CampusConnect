import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunicationMessages } from "./messages";
import { CommunicationRecommendations } from "./recommendations";

export default function CommunicationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Communication</h1>
      <Tabs defaultValue="messages">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages">Direct Messages</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <CommunicationMessages />
        </TabsContent>
        <TabsContent value="recommendations">
          <CommunicationRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
