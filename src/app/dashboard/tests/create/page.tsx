import { getFirstSchool, getGrades, getSections, getTeachers } from "@/lib/data";
import { CreateTestForm } from "./create-test-form";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function CreateTestPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }
    const [grades, sections, teachers] = await Promise.all([
        getGrades(school.id),
        getSections(school.id),
        getTeachers(school.id)
    ]);
    
    if (grades.length === 0 || sections.length === 0 || teachers.length === 0) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Setup Required</AlertTitle>
          <AlertDescription>
            Please create at least one grade, section, and teacher in the settings before you can create a test.
          </AlertDescription>
        </Alert>
      )
    }

    return (
        <CreateTestForm 
            grades={grades} 
            sections={sections} 
            teachers={teachers} 
            schoolId={school.id}
        />
    );
}
