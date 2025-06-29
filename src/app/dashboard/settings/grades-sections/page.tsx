
import { getFirstSchool, getGradesWithSections } from "@/lib/data";
import { redirect } from "next/navigation";
import ManageGradesSectionsClientPage from "./grades-sections-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function ManageGradesSectionsPage() {
    const school = await getFirstSchool();
    if (!school) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No School Found</AlertTitle>
                <AlertDescription>
                    Cannot manage grades and sections because no school exists.
                </AlertDescription>
            </Alert>
        )
    }

    const gradesWithSections = await getGradesWithSections(school.id);
    
    return (
        <ManageGradesSectionsClientPage
            initialGradesWithSections={gradesWithSections}
        />
    );
}
