import { getLiveSessionById } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { TeacherSessionClient } from "./teacher-session-client";

export default async function TeacherSessionPage({ params }: { params: { sessionId: string } }) {
    const session = await getLiveSessionById(params.sessionId);

    if (!session) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Session Not Found</CardTitle>
                    <CardDescription>The session you are looking for could not be found.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/live-sessions">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return <TeacherSessionClient session={session} />;
}
