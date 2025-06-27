
import { getFirstSchool, getGrades, getSections, getStudentsWithDetails } from "@/lib/data";
import { StudentList } from "../student-list";
import { redirect } from "next/navigation";

export default async function ViewStudentsPage() {
    const school = await getFirstSchool();
    if (!school) {
        // Or render a message asking to create a school first
        redirect('/system-admin/schools');
    }

    const students = await getStudentsWithDetails(school.id);
    const grades = await getGrades(school.id);
    const sections = await getSections(school.id);

    return (
        <StudentList students={students} grades={grades} sections={sections} />
    );
}
