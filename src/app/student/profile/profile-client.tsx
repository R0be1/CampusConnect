
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Home } from "lucide-react";
import { getStudentProfileForStudentPortal } from "@/lib/data";

type ProfileClientProps = {
    profileData: NonNullable<Awaited<ReturnType<typeof getStudentProfileForStudentPortal>>>;
};

export default function ProfileClient({ profileData }: ProfileClientProps) {

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
      </div>
      <p className="text-muted-foreground">View your student and parent information. Contact the school administration to make any changes.</p>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> My Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input readOnly value={profileData.student.firstName || ''} /></div>
                    <div><Label>Last Name</Label><Input readOnly value={profileData.student.lastName || ''} /></div>
                </div>
                 <div><Label>Date of Birth</Label><Input readOnly value={profileData.student.dob || ''} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><Label>Grade</Label><Input readOnly value={profileData.student.grade || ''} /></div>
                    <div><Label>Section</Label><Input readOnly value={profileData.student.section || ''} /></div>
                 </div>
            </CardContent>
        </Card>

        {profileData.parent && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Parent/Guardian Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>First Name</Label><Input readOnly value={profileData.parent.firstName || ''} /></div>
                        <div><Label>Last Name</Label><Input readOnly value={profileData.parent.lastName || ''} /></div>
                    </div>
                    <div><Label>Relation</Label><Input readOnly value={profileData.parent.relation || ''} /></div>
                    <div><Label>Phone Number</Label><Input type="tel" readOnly value={profileData.parent.phone || ''} /></div>
                </CardContent>
            </Card>
        )}
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" /> Contact Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div><Label>Address Line 1</Label><Input readOnly value={profileData.address.line1 || ''} /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div><Label>City</Label><Input readOnly value={profileData.address.city || ''} /></div>
                    <div><Label>State / Province</Label><Input readOnly value={profileData.address.state || ''} /></div>
                    <div><Label>Zip / Postal Code</Label><Input readOnly value={profileData.address.zipCode || ''} /></div>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
