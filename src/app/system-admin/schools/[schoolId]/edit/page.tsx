
import { getSchoolById } from "@/lib/data";
import SchoolForm from "./school-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default async function EditSchoolAdminPage({ params }: { params: { schoolId: string }}) {
    const schoolData = await getSchoolById(params.schoolId);

    if (!schoolData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>School Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>The requested school could not be found.</AlertDescription>
                    </Alert>
                    <Button variant="outline" asChild className="mt-4">
                        <Link href="/system-admin/schools">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Schools List
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit School</h1>
                    <p className="text-muted-foreground">Make changes to {schoolData.name}'s details.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/system-admin/schools">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Schools List
                    </Link>
                </Button>
            </div>
            <SchoolForm school={schoolData} />
        </div>
    );
}
