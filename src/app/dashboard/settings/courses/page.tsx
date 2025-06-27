
import { getFirstSchool, getGrades, getSections, getTeachers, getCoursesWithDetails } from "@/lib/data";
import { redirect } from "next/navigation";
import ManageCoursesClientPage from "./courses-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function ManageCoursesPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const [courses, grades, sections, teachers] = await Promise.all([
        getCoursesWithDetails(school.id),
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
            Please create at least one grade, one section, and one teacher before managing courses.
          </AlertDescription>
        </Alert>
      )
    }

    return (
        <ManageCoursesClientPage
            initialCourses={courses}
            grades={grades}
            sections={sections}
            teachers={teachers}
        />
    );
}
