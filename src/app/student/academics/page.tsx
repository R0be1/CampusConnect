import { getFirstSchool, getFirstStudent, getCurrentAcademicYear, getAcademicDataForStudentPortal } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import AcademicsClient from "./academics-client";

export default async function AcademicsStudentPage() {
    const school = await getFirstSchool();
    if (!school) {
        return <Alert><AlertTitle>Error</AlertTitle><AlertDescription>No school configured.</AlertDescription></Alert>;
    }

    const student = await getFirstStudent(school.id);
    if (!student) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Student Found</AlertTitle><AlertDescription>No student account found in the system.</AlertDescription></Alert>
    }

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Active Academic Year</AlertTitle><AlertDescription>An administrator needs to set the current academic year.</AlertDescription></Alert>
    }

    const academicData = await getAcademicDataForStudentPortal(student.id, academicYear.id);

    return <AcademicsClient academicData={academicData} />;
}
