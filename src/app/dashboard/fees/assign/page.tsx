
import { redirect } from "next/navigation";
import AssignClientPage from "../assign-client";
import { getCurrentAcademicYear, getFirstSchool, getStudentsWithDetails, getConcessions, getConcessionAssignments } from "@/lib/data";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";


export default async function AssignConcessionPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Academic Year</AlertTitle><AlertDescription>Please set a current academic year in settings.</AlertDescription></Alert>
    }

    const students = await getStudentsWithDetails(school.id);
    const concessions = await getConcessions(school.id);
    const assignments = await getConcessionAssignments(school.id, academicYear.id);
    
    const formattedStudents = students.map(s => ({
        id: s.id,
        name: `${s.user.firstName} ${s.user.lastName}`,
        grade: s.grade.name,
        section: s.section.name,
    }));

    const formattedConcessions = concessions.map(c => ({
        id: c.id,
        name: c.name,
    }));

    const formattedAssignments = assignments.map(a => ({
        id: a.id,
        studentId: a.studentId,
        studentName: `${a.student.user.firstName} ${a.student.user.lastName}`,
        concessionId: a.concessionId,
        concessionName: a.concession.name,
        academicYear: academicYear.name,
    }));

    return (
       <AssignClientPage
            studentsData={formattedStudents}
            concessionSchemes={formattedConcessions}
            initialAssignedConcessions={formattedAssignments}
            academicYearId={academicYear.id}
            academicYearName={academicYear.name}
       />
    );
}
