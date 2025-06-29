
import { redirect } from "next/navigation";
import { getCurrentAcademicYear, getFirstSchool, getFeeStructures, getPenaltyRules } from "@/lib/data";
import StructureClientPage from "../structure-client";

export default async function FeeStructurePage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) redirect('/dashboard/settings/academic-year');

    const feeStructures = await getFeeStructures(school.id);
    const penaltyRules = await getPenaltyRules(school.id);
    
    const formattedFeeSchemes = feeStructures.map(fs => ({
        id: fs.id,
        name: fs.name,
        grade: 'All', // This needs to be improved in the schema/data model
        section: 'All',
        amount: `$${fs.amount.toFixed(2)}`,
        penalty: fs.penaltyRule?.name || 'None',
        academicYear: academicYear.name, // Assuming it applies to current, needs refinement
        interval: fs.interval as any,
    }));

    return (
        <StructureClientPage
            feeSchemes={formattedFeeSchemes}
            penaltyRules={penaltyRules}
            academicYear={academicYear.name}
            schoolId={school.id}
        />
    );
}
