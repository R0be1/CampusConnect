
import { getFirstSchool, getFirstStudent, getFeesDataForPortal } from "@/lib/data";
import FeesClientPage from "./fees-client";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function FeesPortalPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    // For the prototype, we use the first student. In a real app, this would be derived from the logged-in parent's context.
    const student = await getFirstStudent(school.id);
    if (!student) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Students Found</AlertTitle><AlertDescription>No student records exist to display fee information.</AlertDescription></Alert>
    }

    const feesData = await getFeesDataForPortal(student.id);
    
    return <FeesClientPage initialFeesData={feesData} studentName={student.firstName} />;
}
