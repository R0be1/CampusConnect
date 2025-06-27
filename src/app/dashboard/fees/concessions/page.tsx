
import { redirect } from "next/navigation";
import ConcessionsClientPage from "./concessions-client";
import { getConcessions, getFeeStructures, getFirstSchool } from "@/lib/data";

export default async function ConcessionsPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const feeStructures = await getFeeStructures(school.id);
    const concessions = await getConcessions(school.id);

    const formattedConcessions = concessions.map(c => ({
        id: c.id,
        name: c.name,
        category: 'Discount' as any, // This field needs to be added to schema
        type: c.type as any,
        value: c.value,
        description: c.description || "",
        applicableFeeStructureIds: c.feeStructures.map(fs => fs.id),
    }));

    return (
        <ConcessionsClientPage
            initialConcessions={formattedConcessions}
            feeStructures={feeStructures.map(f => ({ id: f.id, name: f.name }))}
        />
    );
}
