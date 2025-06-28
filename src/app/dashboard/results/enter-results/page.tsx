import { getFirstSchool, getCurrentAcademicYear, getExamsForYear } from "@/lib/data";
import { redirect } from "next/navigation";
import EnterResultsClient from "../enter-results-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function EnterResultsPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Academic Year Found</AlertTitle>
                <AlertDescription>Please set a current academic year in the settings to enter results.</AlertDescription>
            </Alert>
        );
    }
    
    const exams = await getExamsForYear(school.id, academicYear.id);
    
    return (
       <EnterResultsClient examsForSelection={exams} />
    );
}
