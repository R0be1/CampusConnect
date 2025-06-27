
import { getFirstSchool, getGrades, getSections } from "@/lib/data";
import { AttendanceRecords } from "../attendance-records";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function AttendanceRecordsPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }
    const grades = await getGrades(school.id);
    const sections = await getSections(school.id);
    
    if (grades.length === 0 || sections.length === 0) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Setup Required</AlertTitle>
          <AlertDescription>
            Please create at least one grade and one section in the settings before you can view attendance records.
          </AlertDescription>
        </Alert>
      )
    }

    return (
        <AttendanceRecords grades={grades} sections={sections} />
    );
}
