
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Pencil, Percent, DollarSign, Check, ChevronsUpDown } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// MOCK DATA
// In a real app, this would be fetched or come from a centralized store.
const feeStructures = [
    { id: 'fs1', name: 'Tuition Fee - Fall (Grade 10)' },
    { id: 'fs2', name: 'Lab Fee - Chemistry' },
    { id: 'fs3', name: 'Tuition Fee - Fall (Grade 9)' },
    { id: 'fs4', name: 'Tuition Fee - Fall (Grade 11)' },
    { id: 'fs5', name: 'Monthly Bus Fee' },
];

type Concession = {
  id: string;
  name: string;
  category: 'Scholarship' | 'Discount';
  type: 'Percentage' | 'Fixed';
  value: number;
  description: string;
  applicableFeeStructureIds: string[];
};

const initialConcessions: Concession[] = [
    { id: 'con01', name: 'Merit-Based Scholarship', category: 'Scholarship', type: 'Fixed', value: 500, description: 'Awarded to students with outstanding academic performance.', applicableFeeStructureIds: ['fs1', 'fs3', 'fs4'] },
    { id: 'con02', name: 'Sibling Discount', category: 'Discount', type: 'Percentage', value: 10, description: 'For families with multiple children enrolled.', applicableFeeStructureIds: ['fs1', 'fs3', 'fs4', 'fs5'] },
    { id: 'con03', name: 'Early Bird Discount', category: 'Discount', type: 'Fixed', value: 50, description: 'For paying fees before the deadline.', applicableFeeStructureIds: ['fs1', 'fs3'] },
];

export default function ConcessionsPage() {
    const [concessions, setConcessions] = useState(initialConcessions);
    const [editingConcession, setEditingConcession] = useState<Concession | null>(null);

    const handleDeleteConcession = (id: string) => {
        setConcessions(concessions.filter(c => c.id !== id));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Concession Schemes</CardTitle>
                    <CardDescription>Define all scholarship and discount programs available to students.</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Concession</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Concession</DialogTitle>
                            <DialogDescription>Define a new scholarship or discount rule.</DialogDescription>
                        </DialogHeader>
                        {/* Form would go here, for simplicity we are just showing the edit dialog */}
                         <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Name</Label><Input placeholder="e.g., Alumni Discount" /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2"><Label>Category</Label><Select><SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger><SelectContent><SelectItem value="Scholarship">Scholarship</SelectItem><SelectItem value="Discount">Discount</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger><SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="e.g., 15 or 100"/></div>
                            </div>
                             <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the concession." /></div>
                            <div className="space-y-2"><Label>Applicable Fee Structures</Label><div>Multi-select component here</div></div>
                        </div>
                        <DialogFooter><Button>Save Concession</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Applies To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {concessions.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                                    <TableCell className="font-semibold flex items-center">
                                        {c.type === 'Fixed' && <DollarSign className="h-4 w-4 mr-1 text-muted-foreground"/>}
                                        {c.value}
                                        {c.type === 'Percentage' && <Percent className="h-4 w-4 ml-1 text-muted-foreground"/>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {c.applicableFeeStructureIds.map(id => (
                                                <Badge key={id} variant="secondary">{feeStructures.find(f => f.id === id)?.name || 'Unknown Fee'}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingConcession(c)}><Pencil className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteConcession(c.id)}>Confirm</AlertDialogAction>
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

            <Dialog open={!!editingConcession} onOpenChange={(isOpen) => !isOpen && setEditingConcession(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Concession</DialogTitle>
                        <DialogDescription>Make changes to the concession scheme.</DialogDescription>
                    </DialogHeader>
                    {editingConcession && <EditConcessionForm concession={editingConcession} onClose={() => setEditingConcession(null)}/>}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Edit Form Component ---

function EditConcessionForm({ concession, onClose }: { concession: Concession, onClose: () => void }) {
    const [name, setName] = useState(concession.name);
    const [category, setCategory] = useState(concession.category);
    const [type, setType] = useState(concession.type);
    const [value, setValue] = useState(concession.value);
    const [description, setDescription] = useState(concession.description);
    const [selectedFees, setSelectedFees] = useState<string[]>(concession.applicableFeeStructureIds);

    const handleSave = () => {
        console.log("Saving changes:", { ...concession, name, category, type, value, description, applicableFeeStructureIds: selectedFees });
        onClose();
    };

    return (
         <>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={(v: 'Scholarship' | 'Discount') => setCategory(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Scholarship">Scholarship</SelectItem><SelectItem value="Discount">Discount</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Type</Label><Select value={type} onValueChange={(v: 'Percentage' | 'Fixed') => setType(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Value</Label><Input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))}/></div>
                </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div className="space-y-2">
                    <Label>Applicable Fee Structures</Label>
                    <MultiSelectFeeStructures
                        selected={selectedFees}
                        onChange={setSelectedFees}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
        </>
    );
}

// --- Multi-Select Component ---

function MultiSelectFeeStructures({ selected, onChange }: { selected: string[], onChange: (selected: string[]) => void }) {
    const [open, setOpen] = useState(false);

    const handleSelect = (feeId: string) => {
        if (selected.includes(feeId)) {
            onChange(selected.filter(id => id !== feeId));
        } else {
            onChange([...selected, feeId]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal h-auto">
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? selected.map(id => (
                            <Badge variant="secondary" key={id}>{feeStructures.find(f => f.id === id)?.name || id}</Badge>
                        )) : "Select fee structures..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search fees..." />
                    <CommandList>
                        <CommandEmpty>No fee structures found.</CommandEmpty>
                        <CommandGroup>
                            {feeStructures.map(fee => (
                                <CommandItem
                                    key={fee.id}
                                    value={fee.name}
                                    onSelect={() => handleSelect(fee.id)}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", selected.includes(fee.id) ? "opacity-100" : "opacity-0")} />
                                    {fee.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
