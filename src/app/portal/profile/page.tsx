
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Home, Edit, Loader2 } from "lucide-react";
import { useStudent } from "@/context/student-context";
import { useState, useEffect } from "react";
import { getProfileAction, PortalProfileData, updateParentContactAction, updateParentAddressAction } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


function ProfileLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function ProfilePortalPage() {
  const { selectedStudent } = useStudent();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<PortalProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [parentPhone, setParentPhone] = useState("");
  const [parentAlternatePhone, setParentAlternatePhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (selectedStudent?.id) {
        setIsLoading(true);
        setError(null);
        getProfileAction(selectedStudent.id)
            .then(result => {
                if (result.success && result.data) {
                    setProfileData(result.data);
                    setParentPhone(result.data.parent.phone || "");
                    setParentAlternatePhone(result.data.parent.alternatePhone || "");
                    setAddressLine1(result.data.address.line1 || "");
                    setCity(result.data.address.city || "");
                    setState(result.data.address.state || "");
                    setZipCode(result.data.address.zipCode || "");
                } else {
                    setError(result.error || "Failed to load profile data.");
                }
            })
            .catch(() => setError("An unexpected error occurred."))
            .finally(() => setIsLoading(false));
    }
  }, [selectedStudent]);

  const handleContactUpdate = async () => {
    if (!profileData) return;
    setIsUpdatingContact(true);
    const result = await updateParentContactAction(profileData.parent.userId, { phone: parentPhone, alternatePhone: parentAlternatePhone });
    if(result.success) {
        toast({ title: "Success", description: result.message });
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsUpdatingContact(false);
  };
  
  const handleAddressUpdate = async () => {
      if (!profileData) return;
      setIsUpdatingAddress(true);
      const result = await updateParentAddressAction(profileData.parent.userId, { line1: addressLine1, city, state, zipCode });
      if(result.success) {
        toast({ title: "Success", description: result.message });
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
      setIsUpdatingAddress(false);
  };

  if (isLoading || !selectedStudent) {
    return <ProfileLoadingSkeleton />;
  }

  if (error || !profileData) {
      return (
          <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error || 'Could not load profile data for this student.'}</AlertDescription></Alert>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Profile Management</h1>
      </div>
      <p className="text-muted-foreground">View and manage student and parent information for {profileData.student.firstName}.</p>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Student Information</CardTitle>
                <CardDescription>This information is managed by the school. Contact administration to make changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input readOnly value={profileData.student.firstName} /></div>
                    <div><Label>Last Name</Label><Input readOnly value={profileData.student.lastName} /></div>
                </div>
                 <div><Label>Date of Birth</Label><Input readOnly value={profileData.student.dob} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><Label>Grade</Label><Input readOnly value={profileData.student.grade} /></div>
                    <div><Label>Section</Label><Input readOnly value={profileData.student.section} /></div>
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
                    <div><Label>First Name</Label><Input readOnly value={profileData.parent.firstName} /></div>
                    <div><Label>Last Name</Label><Input readOnly value={profileData.parent.lastName} /></div>
                </div>
                 <div><Label>Phone Number</Label><Input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} /></div>
                 <div><Label>Alternate Phone Number</Label><Input type="tel" value={parentAlternatePhone} onChange={(e) => setParentAlternatePhone(e.target.value)} /></div>
                <div className="flex justify-end">
                    <Button onClick={handleContactUpdate} disabled={isUpdatingContact}>
                        {isUpdatingContact && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
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
                 <div><Label>Address Line 1</Label><Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
                    <div><Label>State / Province</Label><Input value={state} onChange={(e) => setState(e.target.value)} /></div>
                    <div><Label>Zip / Postal Code</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} /></div>
                </div>
                 <div className="flex justify-end">
                    <Button onClick={handleAddressUpdate} disabled={isUpdatingAddress}>
                        {isUpdatingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        <Edit className="mr-2 h-4 w-4" />
                        Update Address
                    </Button>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
