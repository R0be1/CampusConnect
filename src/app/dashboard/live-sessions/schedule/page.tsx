import { redirect } from "next/navigation";
import { getFirstSchool, getGrades, getFirstTeacher } from "@/lib/data";
import { ScheduleForm } from "./schedule-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";


export default async function ScheduleLiveSessionPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const [grades, teacher] = await Promise.all([
        getGrades(school.id),
        getFirstTeacher(school.id),
    ]);
    
     if (grades.length === 0) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Setup Required</AlertTitle>
                <AlertDescription>
                    Please create at least one grade in the settings before scheduling a session.
                </AlertDescription>
            </Alert>
        );
    }
    
     if (!teacher) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Teacher Account</AlertTitle>
                <AlertDescription>
                   A teacher must exist to be assigned to a session. Please create a teacher account first.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <ScheduleForm grades={grades} schoolId={school.id} teacherId={teacher.userId} />
    );
}
