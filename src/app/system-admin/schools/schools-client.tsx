
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Pencil, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { createSchoolAction, deleteSchoolAction } from "./actions";
import type { School } from "@prisma/client";

export default function SchoolsClient({ initialSchools }: { initialSchools: School[] }) {
    const { toast } = useToast();
    const [schools, setSchools] = useState(initialSchools);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleDeleteSchool = async (id: string) => {
        const result = await deleteSchoolAction(id);
        if (result.success) {
            setSchools(schools.filter(s => s.id !== id));
            toast({ title: "School Deleted", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleAddSchool = async (newSchoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) => {
        const result = await createSchoolAction(newSchoolData);

        if (result.success) {
            // A page reload is a simple way to ensure the list is up-to-date
            window.location.reload(); 
            setIsAddDialogOpen(false);
            toast({ title: "School Added", description: result.message });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Manage Schools</CardTitle>
                    <CardDescription>Add, edit, or remove schools from the platform.</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add School</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New School</DialogTitle>
                            <DialogDescription>Define a new school instance.</DialogDescription>
                        </DialogHeader>
                        <SchoolForm onSave={handleAddSchool} onClose={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>School</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schools.map(school => (
                                <TableRow key={school.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Image src={school.logoUrl || 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png'} alt={school.name} width={24} height={24} className="rounded-sm" data-ai-hint="logo" />
                                        {school.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{school.accountName}</TableCell>
                                    <TableCell>{school.branch}</TableCell>
                                    <TableCell>{school.contactPerson}</TableCell>
                                    <TableCell>{school.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/system-admin/schools/${school.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the school and all its data.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSchool(school.id)}>Confirm</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {schools.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground mt-4">
                        No schools found. Add one to get started.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type SchoolFormProps = {
    school?: School;
    onSave: (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onClose: () => void;
}

function SchoolForm({ school, onSave, onClose }: SchoolFormProps) {
    const { toast } = useToast();
    const [name, setName] = useState(school?.name || '');
    const [accountName, setAccountName] = useState(school?.accountName || '');
    const [branch, setBranch] = useState(school?.branch || '');
    const [contactPerson, setContactPerson] = useState(school?.contactPerson || '');
    const [phone, setPhone] = useState(school?.phone || '');
    const [address, setAddress] = useState(school?.address || '');
    const [logoUrl, setLogoUrl] = useState(school?.logoUrl || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) { toast({ title: "Validation Error", description: "School Name is required.", variant: "destructive" }); return; }
        if (!accountName.trim()) { toast({ title: "Validation Error", description: "Account Name is required.", variant: "destructive" }); return; }
        if (!branch.trim()) { toast({ title: "Validation Error", description: "Branch is required.", variant: "destructive" }); return; }
        if (!contactPerson.trim()) { toast({ title: "Validation Error", description: "Contact Person is required.", variant: "destructive" }); return; }
        if (!phone.trim()) { toast({ title: "Validation Error", description: "Phone Number is required.", variant: "destructive" }); return; }
        
        setIsSaving(true);
        const data = { name, accountName, branch, contactPerson, phone, address, logoUrl: logoUrl || 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png' };
        await onSave(data);
        setIsSaving(false);
    };

    return (
         <>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
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
                    <Label htmlFor="logoUrl">School Logo URL</Label>
                     <div className="flex items-center gap-6">
                        <Image src={logoUrl || 'https://static.vecteezy.com/system/resources/previews/022/530/575/non_2x/school-building-exterior-vector-illustration-png.png'} alt="Logo Preview" width={64} height={64} className="rounded-md border bg-muted" data-ai-hint="logo" />
                        <Input 
                            id="logoUrl"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Note: File upload is not supported. Please provide a URL to the logo image.</p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {school ? 'Save Changes' : 'Save School'}
                </Button>
            </DialogFooter>
        </>
    );
}
