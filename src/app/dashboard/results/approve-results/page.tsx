
import { getFirstSchool, getCurrentAcademicYear, getExamsWithPendingApprovals } from "@/lib/data";
import { redirect } from "next/navigation";
import ApproveResultsClient from "./approve-results-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";


export default async function ApproveResultsPage() {
     const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Academic Year Found</AlertTitle>
                <AlertDescription>Please set a current academic year in the settings to approve results.</AlertDescription>
            </Alert>
        );
    }
    
    const exams = await getExamsWithPendingApprovals(school.id, academicYear.id);

    return (
       <ApproveResultsClient examsWithPendingApprovals={exams} />
    );
}
