
import { ManageMaterials } from "../manage-materials";
import { getFirstSchool, getLearningMaterials, getGrades } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";

export default async function ManageMaterialsPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const [materials, grades] = await Promise.all([
        getLearningMaterials(school.id),
        getGrades(school.id),
    ]);

    const formattedMaterials = materials.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || "",
        subject: m.subject,
        gradeId: m.gradeId,
        gradeName: m.grade.name,
        type: m.type,
        date: format(m.createdAt, "PPP"),
        uploaderName: `${m.uploader.firstName} ${m.uploader.lastName}`,
    }));

    return (
        <ManageMaterials
            initialMaterials={formattedMaterials}
            grades={grades}
        />
    );
}
