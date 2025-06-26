import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
import { ManageExams } from "./manage-exams";
import { EnterResults } from "./enter-results";
import { ApproveResults } from "./approve-results";

export default function ResultsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Exam Results</h1>
      </div>
      <Tabs defaultValue="manage-exams">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage-exams">Manage Exams</TabsTrigger>
          <TabsTrigger value="enter-results">Enter Results</TabsTrigger>
          <TabsTrigger value="approve-results">Approve Results</TabsTrigger>
        </TabsList>
        <TabsContent value="manage-exams">
          <ManageExams />
        </TabsContent>
        <TabsContent value="enter-results">
          <EnterResults />
        </TabsContent>
        <TabsContent value="approve-results">
          <ApproveResults />
        </TabsContent>
      </Tabs>
    </div>
  );
}
