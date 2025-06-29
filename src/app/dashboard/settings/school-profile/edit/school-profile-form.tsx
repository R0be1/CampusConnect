
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateSchoolProfileAction } from "../actions";
import { School } from "@prisma/client";

export default function SchoolProfileForm({ school }: { school: School }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    // Using a FormData object to handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await updateSchoolProfileAction(school.id, formData);

        if (result.success) {
            toast({ title: "School Profile Updated", description: "Your school's details have been saved." });
            router.push('/dashboard/settings/school-profile');
            router.refresh(); // Refresh to show new data
        } else {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>School Name</Label><Input name="name" defaultValue={school.name} placeholder="e.g., Greenwood High" /></div>
                            <div className="space-y-2"><Label>School Account Name</Label><Input name="accountName" defaultValue={school.accountName} placeholder="e.g., greenwood-high" /></div>
                        </div>
                        <div className="space-y-2"><Label>Branch Name</Label><Input name="branch" defaultValue={school.branch} placeholder="e.g., Main Campus"/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Contact Person</Label><Input name="contactPerson" defaultValue={school.contactPerson} placeholder="e.g., Mr. John Appleseed" /></div>
                            <div className="space-y-2"><Label>Contact Phone</Label><Input name="phone" type="tel" defaultValue={school.phone} placeholder="e.g., 555-0101" /></div>
                        </div>
                        <div className="space-y-2"><Label>Contact Address</Label><Textarea name="address" defaultValue={school.address} placeholder="Full address of the school" /></div>
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">School Logo URL</Label>
                             <div className="flex items-center gap-6">
                                <Image src={school.logoUrl || 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png'} alt="Logo Preview" width={64} height={64} className="rounded-md border bg-muted" data-ai-hint="logo" />
                                <Input 
                                    id="logoUrl"
                                    name="logoUrl"
                                    defaultValue={school.logoUrl}
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Note: File upload is not supported. Please provide a URL to the logo image.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        <Save className="mr-2 h-4 w-4"/>
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
