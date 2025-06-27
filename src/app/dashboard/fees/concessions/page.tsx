
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Pencil, Percent, DollarSign } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// MOCK DATA
const initialScholarships = [
    { id: 'sch01', name: 'Merit-Based Scholarship', description: 'Awarded to students with outstanding academic performance.' },
    { id: 'sch02', name: 'Sports Scholarship', description: 'For students who excel in sports and represent the school.' },
    { id: 'sch03', name: 'Arts Grant', description: 'A grant for students with exceptional talent in the arts.' },
];

const initialDiscounts = [
    { id: 'dsc01', name: 'Sibling Discount', type: 'Percentage', value: 10 },
    { id: 'dsc02', name: 'Early Bird Discount', type: 'Fixed', value: 50 },
    { id: 'dsc03', name: 'Staff Child Discount', type: 'Percentage', value: 50 },
];

type Discount = typeof initialDiscounts[0];

export default function ConcessionsPage() {
    const [scholarships, setScholarships] = useState(initialScholarships);
    const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

    const handleDeleteScholarship = (id: string) => {
        setScholarships(scholarships.filter(s => s.id !== id));
    };
    
    const handleDeleteDiscount = (id: string) => {
        setDiscounts(discounts.filter(d => d.id !== id));
    };
    
    return (
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>Scholarship Schemes</CardTitle>
                        <CardDescription>Define scholarship programs available to students.</CardDescription>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Scholarship</Button></DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Add New Scholarship</DialogTitle>
                                <DialogDescription>Define a new scholarship program.</DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-4 py-4">
                                <div className="space-y-2"><Label htmlFor="schName">Scholarship Name</Label><Input id="schName" placeholder="e.g., Founders Scholarship" /></div>
                                <div className="space-y-2"><Label htmlFor="schDesc">Description</Label><Textarea id="schDesc" placeholder="Describe the scholarship criteria." /></div>
                            </div>
                            <DialogFooter><Button>Save Scholarship</Button></DialogFooter>
                        </DialogContent>
                     </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scholarships.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">{s.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{s.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will permanently delete this scholarship. This action cannot be undone.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteScholarship(s.id)}>Confirm</AlertDialogAction>
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

            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>Discount Rules</CardTitle>
                        <CardDescription>Define fixed or percentage-based discounts.</CardDescription>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Discount</Button></DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Discount</DialogTitle>
                                <DialogDescription>Define a new discount rule.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2"><Label htmlFor="discName">Discount Name</Label><Input id="discName" placeholder="e.g., Alumni Discount" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="discType">Discount Type</Label>
                                        <Select><SelectTrigger id="discType"><SelectValue placeholder="Select type"/></SelectTrigger>
                                        <SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="discValue">Value</Label><Input id="discValue" type="number" placeholder="e.g., 15 or 100"/></div>
                                </div>
                            </div>
                            <DialogFooter><Button>Save Discount</Button></DialogFooter>
                        </DialogContent>
                     </Dialog>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {discounts.map(d => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.name}</TableCell>
                                        <TableCell>{d.type}</TableCell>
                                        <TableCell className="font-semibold flex items-center">
                                            {d.type === 'Fixed' && <DollarSign className="h-4 w-4 mr-1 text-muted-foreground"/>}
                                            {d.value}
                                            {d.type === 'Percentage' && <Percent className="h-4 w-4 ml-1 text-muted-foreground"/>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingDiscount(d)}><Pencil className="h-4 w-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                 <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will permanently delete this discount. This action cannot be undone.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteDiscount(d.id)}>Confirm</AlertDialogAction>
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

            <Dialog open={!!editingDiscount} onOpenChange={(isOpen) => !isOpen && setEditingDiscount(null)}>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Discount</DialogTitle>
                        <DialogDescription>Make changes to the discount rule.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2"><Label htmlFor="editDiscName">Discount Name</Label><Input id="editDiscName" defaultValue={editingDiscount?.name} /></div>
                        <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label htmlFor="editDiscType">Discount Type</Label>
                                <Select defaultValue={editingDiscount?.type}><SelectTrigger id="editDiscType"><SelectValue placeholder="Select type"/></SelectTrigger>
                                <SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label htmlFor="editDiscValue">Value</Label><Input id="editDiscValue" type="number" defaultValue={editingDiscount?.value}/></div>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={() => setEditingDiscount(null)}>Save Changes</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
