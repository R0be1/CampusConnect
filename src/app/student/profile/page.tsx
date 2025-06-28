
import { getFirstSchool, getFirstStudent, getStudentProfileForStudentPortal } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import ProfileClient from "./profile-client";

export default async function ProfileStudentPage() {
    const school = await getFirstSchool();
    if (!school) {
        return <Alert><AlertTitle>Error</AlertTitle><AlertDescription>No school configured.</AlertDescription></Alert>;
    }

    const student = await getFirstStudent(school.id);
    if (!student) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Student Found</AlertTitle><AlertDescription>No student account found in the system.</AlertDescription></Alert>
    }

    const profileData = await getStudentProfileForStudentPortal(student.id);

    if (!profileData) {
         return <Alert><Info className="h-4 w-4" /><AlertTitle>Profile Not Found</AlertTitle><AlertDescription>Could not load profile data.</AlertDescription></Alert>
    }

    return <ProfileClient profileData={profileData} />;
}
