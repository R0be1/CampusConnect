
import { getSchools } from "@/lib/data";
import SchoolsClient from "./schools-client";

export default async function SchoolsPage() {
    const schools = await getSchools();
    return <SchoolsClient initialSchools={schools} />;
}
