
import { getFirstSchool, getGrades, getSections } from "@/lib/data";
import RegistrationForm from "./registration-form";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function RegisterStudentPage() {
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
                <AlertDescription>Please create at least one grade and one section before registering students.</AlertDescription>
            </Alert>
        );
    }

    return (
        <RegistrationForm grades={grades} sections={sections} schoolId={school.id} />
    );
}
