
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
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

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const initialSchools: School[] = [];

export default function SchoolsPage() {
    const { toast } = useToast();
    const [schools, setSchools] = useState(initialSchools);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleDeleteSchool = (id: string) => {
        setSchools(schools.filter(s => s.id !== id));
        toast({ title: "School Deleted", description: "The school has been removed from the system." });
    };
    
    const handleAddSchool = (newSchool: Omit<School, 'id'>) => {
        const schoolToAdd = {
            id: `sch-${Date.now()}`,
            ...newSchool,
        };
        setSchools(prev => [schoolToAdd, ...prev]);
        setIsAddDialogOpen(false);
        toast({ title: "School Added", description: `${newSchool.name} has been created.` });
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
                                        <Image src={school.logoUrl} alt={school.name} width={24} height={24} className="rounded-sm" data-ai-hint="logo" />
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
            </CardContent>
        </Card>
    );
}

// --- Reusable Form Component for the "Add" Dialog ---

type SchoolFormProps = {
    school?: School;
    onSave: (data: School | Omit<School, 'id'>) => void;
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
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const handleSave = () => {
        if (!name.trim()) { toast({ title: "Validation Error", description: "School Name is required.", variant: "destructive" }); return; }
        if (!accountName.trim()) { toast({ title: "Validation Error", description: "Account Name is required.", variant: "destructive" }); return; }
        if (!branch.trim()) { toast({ title: "Validation Error", description: "Branch is required.", variant: "destructive" }); return; }
        if (!contactPerson.trim()) { toast({ title: "Validation Error", description: "Contact Person is required.", variant: "destructive" }); return; }
        if (!phone.trim()) { toast({ title: "Validation Error", description: "Phone Number is required.", variant: "destructive" }); return; }

        const data = { name, accountName, branch, contactPerson, phone, address, logoUrl };
        if (school?.id) {
            onSave({ ...data, id: school.id });
        } else {
            onSave(data);
        }
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
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{school ? 'Save Changes' : 'Save School'}</Button>
            </DialogFooter>
        </>
    );
}
