
import { getFirstSchool } from "@/lib/data";
import SchoolProfileForm from "./school-profile-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";


export default async function EditSchoolProfilePage() {
    const schoolData = await getFirstSchool();

    if (!schoolData) {
        return (
            <Alert>
               <Info className="h-4 w-4" />
               <AlertTitle>No School Found</AlertTitle>
               <AlertDescription>
                   Cannot edit a profile because no school exists. Please create one in the system administration panel.
               </AlertDescription>
           </Alert>
       )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit School Profile</h1>
                    <p className="text-muted-foreground">Make changes to your school's details.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/settings/school-profile">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Link>
                </Button>
            </div>
            <SchoolProfileForm school={schoolData} />
        </div>
    );
}
