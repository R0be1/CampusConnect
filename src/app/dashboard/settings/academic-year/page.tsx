
import { getFirstSchool, getAcademicYears } from "@/lib/data";
import { redirect } from "next/navigation";
import ManageAcademicYearClientPage from "./academic-year-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function ManageAcademicYearPage() {
    const school = await getFirstSchool();
    if (!school) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No School Found</AlertTitle>
                <AlertDescription>
                    Cannot manage academic years because no school exists.
                </AlertDescription>
            </Alert>
        )
    }

    const academicYears = await getAcademicYears(school.id);

    return (
        <ManageAcademicYearClientPage initialYears={academicYears} />
    );
}
