
import { CommunicationHistory } from "../recommendations";
import { getCommunicationHistory, getFirstSchool, getFirstTeacher } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";

export default async function CommunicationHistoryPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    // In a real app, the teacher ID would come from the user's session
    const teacher = await getFirstTeacher(school.id);
    if (!teacher) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Teacher Found</AlertTitle>
                <AlertDescription>
                    Cannot load communication history because no teacher account was found.
                </AlertDescription>
            </Alert>
        )
    }

    const historyData = await getCommunicationHistory(teacher.userId);

    const formattedHistory = historyData.map(msg => ({
        id: msg.id,
        sentAt: msg.sentAt, // Pass raw date for filtering
        date: format(msg.sentAt, 'PPP'),
        student: msg.student ? `${msg.student.user.firstName} ${msg.student.user.lastName}` : 'N/A',
        subject: msg.subject,
        sentBy: `${msg.sender.firstName} ${msg.sender.lastName}`,
    }));
    
    return (
        <CommunicationHistory communicationHistoryData={formattedHistory} />
    );
}
