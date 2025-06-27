
import { UploadMaterialForm } from "../upload-material-form";
import { getFirstSchool, getGrades, getFirstTeacher } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function UploadMaterialPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const [grades, teacher] = await Promise.all([
        getGrades(school.id),
        getFirstTeacher(school.id)
    ]);

    if (grades.length === 0) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Setup Required</AlertTitle>
                <AlertDescription>
                    Please create at least one grade in the settings before uploading materials.
                </AlertDescription>
            </Alert>
        );
    }

    if (!teacher) {
         return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Teacher Found</AlertTitle>
                <AlertDescription>
                    At least one teacher must exist to upload materials.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <UploadMaterialForm
            grades={grades}
            schoolId={school.id}
            uploaderId={teacher.userId}
        />
    );
}
