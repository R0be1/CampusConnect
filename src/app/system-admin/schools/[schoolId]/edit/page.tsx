
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type School = {
  id: string;
  name: string;
  accountName: string;
  branch: string;
  contactPerson: string;
  phone: string;
  address: string;
  logoUrl: string;
};

// This mock data and state management would live in a central store in a real app.
const initialSchools: School[] = [
    { id: 'sch-01', name: 'Greenwood High', accountName: 'greenwood-high', branch: 'Main Campus', contactPerson: 'Mr. John Appleseed', phone: '555-0101', address: '123 Education Lane, Knowledge City, 12345', logoUrl: 'https://placehold.co/40x40/6366f1/ffffff.png' },
    { id: 'sch-02', name: 'Oakridge International', accountName: 'oakridge-intl', branch: 'North Campus', contactPerson: 'Ms. Carol Danvers', phone: '555-0102', address: '456 Wisdom Avenue, Learning Town, 67890', logoUrl: 'https://placehold.co/40x40/f97316/ffffff.png' },
];


export default function EditSchoolAdminPage() {
    const params = useParams();
    const schoolId = params.schoolId;
    
    // In a real app, you'd fetch this data. Here, we find it from the mock array.
    const schoolData = initialSchools.find(s => s.id === schoolId);

    if (!schoolData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>School Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The requested school could not be found.</p>
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

// --- Reusable Form Component ---

function SchoolForm({ school }: { school: School }) {
    const { toast } = useToast();
    const router = useRouter();

    const [name, setName] = useState(school.name);
    const [accountName, setAccountName] = useState(school.accountName);
    const [branch, setBranch] = useState(school.branch);
    const [contactPerson, setContactPerson] = useState(school.contactPerson);
    const [phone, setPhone] = useState(school.phone);
    const [address, setAddress] = useState(school.address);
    const [logoUrl, setLogoUrl] = useState(school.logoUrl);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const handleSave = () => {
        if (!name.trim()) { toast({ title: "Validation Error", description: "School Name is required.", variant: "destructive" }); return; }
        if (!accountName.trim()) { toast({ title: "Validation Error", description: "Account Name is required.", variant: "destructive" }); return; }
        if (!branch.trim()) { toast({ title: "Validation Error", description: "Branch is required.", variant: "destructive" }); return; }
        if (!contactPerson.trim()) { toast({ title: "Validation Error", description: "Contact Person is required.", variant: "destructive" }); return; }
        if (!phone.trim()) { toast({ title: "Validation Error", description: "Phone Number is required.", variant: "destructive" }); return; }

        const updatedSchool = { id: school.id, name, accountName, branch, contactPerson, phone, address, logoUrl };
        // In a real app, you'd send this to your backend.
        toast({ title: "School Updated", description: "The school's details have been saved." });
        router.push('/system-admin/schools');
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>School Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Greenwood High" /></div>
                        <div className="space-y-2"><Label>School Account Name</Label><Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g., greenwood-high" /></div>
                    </div>
                    <div className="space-y-2"><Label>Branch Name</Label><Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g., Main Campus"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Contact Person</Label><Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="e.g., Mr. John Appleseed" /></div>
                        <div className="space-y-2"><Label>Contact Phone</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 555-0101" /></div>
                    </div>
                    <div className="space-y-2"><Label>Contact Address</Label><Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address of the school" /></div>
                    <div className="space-y-2">
                        <Label htmlFor="logoFile">School Logo</Label>
                        <div className="flex items-center gap-6">
                            <Image src={logoUrl || 'https://placehold.co/64x64.png'} alt="Logo Preview" width={64} height={64} className="rounded-md border bg-muted" data-ai-hint="logo" />
                            <Input 
                                id="logoFile"
                                type="file" 
                                accept="image/*" 
                                className="max-w-xs"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setLogoFile(file);
                                        setLogoUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
