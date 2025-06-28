import { getFirstSchool, getFirstStudent } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import AttendanceClient from "./attendance-client";

export default async function AttendanceStudentPage() {
  const school = await getFirstSchool();
  if (!school) {
    return <Alert><AlertTitle>Error</AlertTitle><AlertDescription>No school configured.</AlertDescription></Alert>;
  }

  const student = await getFirstStudent(school.id);
  if (!student) {
      return <Alert><Info className="h-4 w-4" /><AlertTitle>No Student Found</AlertTitle><AlertDescription>No student account found in the system.</AlertDescription></Alert>
  }
  
  return (
    <AttendanceClient 
      studentId={student.id} 
      studentName={`${student.firstName} ${student.lastName}`} 
    />
  );
}
