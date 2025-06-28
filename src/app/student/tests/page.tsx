
import { getFirstSchool, getFirstStudent, getTestsForStudentPortal } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import TestsClient from "./tests-client";

export default async function StudentTestsPage() {
  const school = await getFirstSchool();
  if (!school) {
    return <Alert><AlertTitle>Error</AlertTitle><AlertDescription>No school configured.</AlertDescription></Alert>;
  }

  const student = await getFirstStudent(school.id);
  if (!student) {
      return <Alert><Info className="h-4 w-4" /><AlertTitle>No Student Found</AlertTitle><AlertDescription>No student account found in the system.</AlertDescription></Alert>
  }
  
  const tests = await getTestsForStudentPortal(student.id);

  return (
    <TestsClient tests={tests} />
  );
}
