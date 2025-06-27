import { getLiveSessions, getFirstSchool } from "@/lib/data";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import LiveSessionsList from "./sessions-list";

export default async function LiveSessionsPage() {
    const school = await getFirstSchool();
    if (!school) {
        redirect('/system-admin/schools');
    }

    const sessions = await getLiveSessions(school.id);

    const formattedSessions = sessions.map(session => ({
        id: session.id,
        topic: session.topic,
        subject: session.subject,
        grade: session.grade.name,
        dateTime: format(new Date(session.startTime), "PPp"),
        status: session.status,
        fee: session.fee,
        registrations: session._count.registrations,
    }));
    
    return <LiveSessionsList sessions={formattedSessions} />;
}
