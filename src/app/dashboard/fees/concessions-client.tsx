
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
import { useToast } from "@/hooks/use-toast";
import { createConcessionAction, deleteConcessionAction, updateConcessionAction } from "./actions";

type Concession = {
  id: string;
  name: string;
  category: 'Scholarship' | 'Discount';
  type: 'Percentage' | 'Fixed';
  value: number;
  description: string;
  applicableFeeStructureIds: string[];
};

type ConcessionsClientPageProps = {
    initialConcessions: Concession[];
    feeStructures: { id: string, name: string }[];
};

export default function ConcessionsClientPage({ initialConcessions, feeStructures }: ConcessionsClientPageProps) {
    const { toast } = useToast();
    const [concessions, setConcessions] = useState(initialConcessions);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingConcession, setEditingConcession] = useState<Concession | null>(null);

    const handleDeleteConcession = async (id: string) => {
        const result = await deleteConcessionAction(id);
        if (result.success) {
            setConcessions(concessions.filter(c => c.id !== id));
            toast({ title: "Concession Deleted", description: "The concession scheme has been removed." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleAddConcession = async (newConcession: Omit<Concession, 'id'>) => {
        // In a real app, schoolId would come from session or context.
        const schoolId = "cmcf3ofm90000kjlz1g767avh";
        const result = await createConcessionAction(newConcession, schoolId);

        if (result.success) {
            // Optimistically update or refetch
            window.location.reload();
            setIsAddDialogOpen(false);
            toast({ title: "Concession Added", description: `${newConcession.name} has been created.` });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleUpdateConcession = async (updatedConcession: Concession) => {
        const { id, ...data } = updatedConcession;
        const result = await updateConcessionAction(id, data);
        if (result.success) {
            setConcessions(prev => prev.map(c => c.id === updatedConcession.id ? updatedConcession : c));
            setEditingConcession(null);
            toast({ title: "Concession Updated", description: `${updatedConcession.name} has been saved.` });
        } else {
             toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Concession Schemes</CardTitle>
                    <CardDescription>Define all scholarship and discount programs available to students.</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Concession</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Concession</DialogTitle>
                            <DialogDescription>Define a new scholarship or discount rule.</DialogDescription>
                        </DialogHeader>
                        <ConcessionForm feeStructures={feeStructures} onSave={handleAddConcession} onClose={() => setIsAddDialogOpen(false)} />
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
                    {editingConcession && <ConcessionForm feeStructures={feeStructures} concession={editingConcession} onSave={handleUpdateConcession} onClose={() => setEditingConcession(null)}/>}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Reusable Form Component ---

type ConcessionFormProps = {
    feeStructures: { id: string; name: string }[];
    concession?: Concession;
    onSave: (data: any) => void;
    onClose: () => void;
}

function ConcessionForm({ feeStructures, concession, onSave, onClose }: ConcessionFormProps) {
    const [name, setName] = useState(concession?.name || '');
    const [category, setCategory] = useState<'Scholarship' | 'Discount'>(concession?.category || 'Discount');
    const [type, setType] = useState<'Percentage' | 'Fixed'>(concession?.type || 'Percentage');
    const [value, setValue] = useState(concession?.value || 0);
    const [description, setDescription] = useState(concession?.description || '');
    const [selectedFees, setSelectedFees] = useState<string[]>(concession?.applicableFeeStructureIds || []);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numValue = parseFloat(e.target.value);
        if (isNaN(numValue)) numValue = 0;
        
        if (type === 'Percentage') {
            if (numValue > 100) numValue = 100;
            if (numValue < 0) numValue = 0;
        } else {
             if (numValue < 0) numValue = 0;
        }
        setValue(numValue);
    }
    
    const handleSave = () => {
        const data = { name, category, type, value, description, applicableFeeStructureIds: selectedFees };
        if (concession?.id) {
            onSave({ ...data, id: concession.id });
        } else {
            onSave(data);
        }
    };

    return (
         <>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={(v: 'Scholarship' | 'Discount') => setCategory(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Scholarship">Scholarship</SelectItem><SelectItem value="Discount">Discount</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Type</Label><Select value={type} onValueChange={(v: 'Percentage' | 'Fixed') => setType(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Percentage">Percentage</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Value</Label><Input type="number" value={value} onChange={handleValueChange} max={type === 'Percentage' ? 100 : undefined} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div className="space-y-2">
                    <Label>Applicable Fee Structures</Label>
                    <MultiSelectFeeStructures
                        feeStructures={feeStructures}
                        selected={selectedFees}
                        onChange={setSelectedFees}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{concession ? 'Save Changes' : 'Save Concession'}</Button>
            </DialogFooter>
        </>
    );
}

// --- Multi-Select Component ---

function MultiSelectFeeStructures({ feeStructures, selected, onChange }: { feeStructures: {id: string, name: string}[], selected: string[], onChange: (selected: string[]) => void }) {
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
