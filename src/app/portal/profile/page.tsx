
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Home, Edit } from "lucide-react";

// Mock Data
const studentProfile = {
  id: "s001",
  firstName: "John",
  middleName: "Michael",
  lastName: "Doe",
  dob: "2008-05-12",
  gender: "Male",
  grade: "Grade 10",
  section: "A"
};

const parentProfile = {
  firstName: "Jane",
  middleName: "Anne",
  lastName: "Doe",
  relation: "Mother",
  email: "jane.doe@example.com",
  phone: "(123) 456-7890",
  alternatePhone: ""
};

const address = {
  line1: "123 Main St",
  city: "Anytown",
  state: "CA",
  zipCode: "12345"
};

export default function ProfilePortalPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Profile Management</h1>
      </div>
      <p className="text-muted-foreground">View and manage student and parent information.</p>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Student Information</CardTitle>
                <CardDescription>This information is managed by the school. Contact administration to make changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input readOnly value={studentProfile.firstName} /></div>
                    <div><Label>Last Name</Label><Input readOnly value={studentProfile.lastName} /></div>
                </div>
                 <div><Label>Date of Birth</Label><Input readOnly value={studentProfile.dob} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><Label>Grade</Label><Input readOnly value={studentProfile.grade} /></div>
                    <div><Label>Section</Label><Input readOnly value={studentProfile.section} /></div>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Parent/Guardian Information</CardTitle>
                <CardDescription>You can update your contact details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input defaultValue={parentProfile.firstName} /></div>
                    <div><Label>Last Name</Label><Input defaultValue={parentProfile.lastName} /></div>
                </div>
                 <div><Label>Email</Label><Input type="email" defaultValue={parentProfile.email} /></div>
                 <div><Label>Phone Number</Label><Input type="tel" defaultValue={parentProfile.phone} /></div>
                <div className="flex justify-end">
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Contact Info
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" /> Contact Address</CardTitle>
                <CardDescription>Update your residential address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div><Label>Address Line 1</Label><Input defaultValue={address.line1} /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div><Label>City</Label><Input defaultValue={address.city} /></div>
                    <div><Label>State / Province</Label><Input defaultValue={address.state} /></div>
                    <div><Label>Zip / Postal Code</Label><Input defaultValue={address.zipCode} /></div>
                </div>
                 <div className="flex justify-end">
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Address
                    </Button>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
