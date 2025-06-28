
import { CommunicationComposer } from "../messages";
import { getFirstSchool, getGrades, getSections, getStudentsForCommunication } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function ComposeMessagePage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const [students, grades, sections] = await Promise.all([
        getStudentsForCommunication(school.id),
        getGrades(school.id),
        getSections(school.id)
    ]);
    
    if (students.length === 0) {
        return (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Students Found</AlertTitle>
                <AlertDescription>
                    Please register at least one student before sending communications.
                </AlertDescription>
            </Alert>
        );
    }
    
    const formattedStudents = students.map(s => ({
        id: s.id,
        name: `${s.user.firstName} ${s.user.lastName}`,
        grade: s.grade.name,
        section: s.section.name,
        parentId: s.parents[0]?.user.id,
        parentName: s.parents[0] ? `${s.parents[0].user.firstName} ${s.parents[0].user.lastName}` : 'N/A',
        parentPhone: s.parents[0]?.user.phone ?? 'N/A',
    }));

    const uniqueSectionNames = [...new Set(sections.map(s => s.name))].sort();

    return (
        <CommunicationComposer 
            allStudents={formattedStudents}
            grades={grades.map(g => g.name)}
            sections={uniqueSectionNames}
        />
    );
}
