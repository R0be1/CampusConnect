import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, History } from "lucide-react";
import { MarkAttendance } from "./mark-attendance";
import { AttendanceRecords } from "./attendance-records";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <UserCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Attendance</h1>
      </div>
      <Tabs defaultValue="mark-attendance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mark-attendance">
            <UserCheck className="mr-2 h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="records">
            <History className="mr-2 h-4 w-4" />
            Attendance Records
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mark-attendance">
          <MarkAttendance />
        </TabsContent>
        <TabsContent value="records">
          <AttendanceRecords />
        </TabsContent>
      </Tabs>
    </div>
  );
}
