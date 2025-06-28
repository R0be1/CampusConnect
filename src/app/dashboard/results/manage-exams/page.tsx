
import { getFirstSchool, getCurrentAcademicYear, getExamsForYear, getGrades, getSections } from "@/lib/data";
import { redirect } from "next/navigation";
import ManageExamsClient from "../manage-exams-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";


export default async function ManageExamsPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) {
         return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Academic Year Found</AlertTitle>
                <AlertDescription>Please set a current academic year in the settings to manage exams.</AlertDescription>
            </Alert>
        );
    }
    
    const [exams, grades, sections] = await Promise.all([
        getExamsForYear(school.id, academicYear.id),
        getGrades(school.id),
        getSections(school.id),
    ]);

    return (
        <ManageExamsClient
            initialExams={exams}
            grades={grades}
            sections={sections}
            schoolId={school.id}
            academicYearId={academicYear.id}
            academicYearName={academicYear.name}
        />
    );
}
