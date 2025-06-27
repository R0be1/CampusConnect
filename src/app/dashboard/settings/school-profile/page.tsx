
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useSchool } from "@/context/school-context";

// This mock data and state management would live in a central store in a real app.
// For now, it's self-contained here to demonstrate functionality.
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

const initialSchools: School[] = [
    { id: 'sch-01', name: 'Greenwood High', accountName: 'greenwood-high', branch: 'Main Campus', contactPerson: 'Mr. John Appleseed', phone: '555-0101', address: '123 Education Lane, Knowledge City, 12345', logoUrl: 'https://placehold.co/40x40/6366f1/ffffff.png' },
    { id: 'sch-02', name: 'Oakridge International', accountName: 'oakridge-intl', branch: 'North Campus', contactPerson: 'Ms. Carol Danvers', phone: '555-0102', address: '456 Wisdom Avenue, Learning Town, 67890', logoUrl: 'https://placehold.co/40x40/f97316/ffffff.png' },
];
// End of mock data section

export default function SchoolProfilePage() {
    const { toast } = useToast();
    const { currentSchool } = useSchool();
    
    // This state simulates a database of all schools
    const [schools, setSchools] = useState(initialSchools);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Find the currently "logged-in" school's data
    const schoolData = schools.find(s => s.id === currentSchool.id);

    const handleUpdateSchool = (updatedSchool: School) => {
        // In a real app, this would be an API call.
        // Here, we just update the local state.
        setSchools(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
        setIsEditDialogOpen(false);
        toast({ title: "School Profile Updated", description: "Your school's details have been saved." });
        // Note: The context won't update automatically in this mock setup. A page refresh would be needed to see changes in the header.
    };
    
    if (!schoolData) {
        return <Card><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>Could not load school data.</CardContent></Card>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>School Profile</CardTitle>
                    <CardDescription>Manage the profile and contact details for your school.</CardDescription>
                </div>
                 <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Edit className="mr-2 h-4 w-4"/> Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit School Profile</DialogTitle>
                            <DialogDescription>Make changes to your school's details.</DialogDescription>
                        </DialogHeader>
                        <SchoolForm school={schoolData} onSave={handleUpdateSchool} onClose={() => setIsEditDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
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


// --- Reusable Form Component (copied from system admin page) ---

type SchoolFormProps = {
    school: School;
    onSave: (data: School) => void;
    onClose: () => void;
}

function SchoolForm({ school, onSave, onClose }: SchoolFormProps) {
    const [name, setName] = useState(school.name);
    const [accountName, setAccountName] = useState(school.accountName);
    const [branch, setBranch] = useState(school.branch);
    const [contactPerson, setContactPerson] = useState(school.contactPerson);
    const [phone, setPhone] = useState(school.phone);
    const [address, setAddress] = useState(school.address);
    const [logoUrl, setLogoUrl] = useState(school.logoUrl);

    const handleSave = () => {
        onSave({ id: school.id, name, accountName, branch, contactPerson, phone, address, logoUrl });
    };

    return (
         <>
            <div className="grid gap-4 py-4">
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
                                    setLogoUrl(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
        </>
    );
}
