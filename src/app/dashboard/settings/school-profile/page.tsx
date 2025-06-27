
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSchool } from "@/context/school-context";

// This mock data would live in a central store in a real app.
const initialSchools = [
    { id: 'sch-01', name: 'Greenwood High', accountName: 'greenwood-high', branch: 'Main Campus', contactPerson: 'Mr. John Appleseed', phone: '555-0101', address: '123 Education Lane, Knowledge City, 12345', logoUrl: 'https://placehold.co/40x40/6366f1/ffffff.png' },
    { id: 'sch-02', name: 'Oakridge International', accountName: 'oakridge-intl', branch: 'North Campus', contactPerson: 'Ms. Carol Danvers', phone: '555-0102', address: '456 Wisdom Avenue, Learning Town, 67890', logoUrl: 'https://placehold.co/40x40/f97316/ffffff.png' },
];

export default function SchoolProfilePage() {
    const { currentSchool } = useSchool();
    
    // This state simulates a database of all schools
    const [schools, setSchools] = useState(initialSchools);
    
    const schoolData = schools.find(s => s.id === currentSchool.id);

    if (!schoolData) {
        return <Card><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>Could not load school data.</CardContent></Card>
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
                    <Image src={schoolData.logoUrl} alt={schoolData.name} width={64} height={64} className="rounded-md" data-ai-hint="logo" />
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
