
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFirstSchool } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function SchoolProfilePage() {
    const schoolData = await getFirstSchool();

    if (!schoolData) {
        return (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No School Found</AlertTitle>
                <AlertDescription>
                    Please create a school in the system administration panel.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>School Profile</CardTitle>
                    <CardDescription>View the profile and contact details for your school.</CardDescription>
                </div>
                 <Button asChild>
                    <Link href="/dashboard/settings/school-profile/edit">
                        <Edit className="mr-2 h-4 w-4"/> Edit Profile
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Image src={schoolData.logoUrl || 'https://placehold.co/64x64.png'} alt={schoolData.name} width={64} height={64} className="rounded-md" data-ai-hint="logo" />
                    <div>
                        <h2 className="text-2xl font-bold font-headline">{schoolData.name}</h2>
                        <p className="text-muted-foreground">{schoolData.branch}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label>Account Name</Label>
                        <Input readOnly value={schoolData.accountName} />
                    </div>
                    <div className="space-y-1">
                        <Label>Contact Person</Label>
                        <Input readOnly value={schoolData.contactPerson} />
                    </div>
                    <div className="space-y-1">
                        <Label>Contact Phone</Label>
                        <Input readOnly value={schoolData.phone} />
                    </div>
                </div>
                 <div className="space-y-1">
                    <Label>Address</Label>
                    <Textarea readOnly value={schoolData.address} className="min-h-[60px]" />
                </div>
            </CardContent>
        </Card>
    );
}
