
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Pencil, Percent, DollarSign, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createConcessionAction, deleteConcessionAction, updateConcessionAction } from "./actions";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const concessionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().min(0, 'Value must be non-negative'),
  description: z.string().optional(),
  applicableFeeStructureIds: z.array(z.string()).min(1, 'At least one fee structure must be selected'),
}).refine(data => data.type === 'PERCENTAGE' ? data.value <= 100 : true, {
    message: 'Percentage value cannot exceed 100',
    path: ['value'],
});

type ConcessionFormValues = z.infer<typeof concessionSchema>;

type Concession = {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingConcession, setEditingConcession] = useState<Concession | null>(null);

    const openDialog = (concession: Concession | null) => {
        setEditingConcession(concession);
        setIsDialogOpen(true);
    };

    const handleDeleteConcession = async (id: string) => {
        const result = await deleteConcessionAction(id);
        if (result.success) {
            setConcessions(concessions.filter(c => c.id !== id));
            toast({ title: "Concession Deleted", description: "The concession scheme has been removed." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const handleSaveConcession = async (data: ConcessionFormValues) => {
        const schoolId = "cmcf3ofm90000kjlz1g767avh";
        const result = editingConcession
            ? await updateConcessionAction(editingConcession.id, data)
            : await createConcessionAction(data, schoolId);

        if (result.success) {
            window.location.reload();
            setIsDialogOpen(false);
            setEditingConcession(null);
            toast({ title: "Success", description: result.message });
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
                <Button size="sm" onClick={() => openDialog(null)}><PlusCircle className="mr-2 h-4 w-4"/> Add Concession</Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Applies To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {concessions.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell className="font-semibold flex items-center">
                                        {c.type === 'FIXED' && <DollarSign className="h-4 w-4 mr-1 text-muted-foreground"/>}
                                        {c.value}
                                        {c.type === 'PERCENTAGE' && <Percent className="h-4 w-4 ml-1 text-muted-foreground"/>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {c.applicableFeeStructureIds.map(id => (
                                                <Badge key={id} variant="secondary">{feeStructures.find(f => f.id === id)?.name || 'Unknown Fee'}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(c)}><Pencil className="h-4 w-4" /></Button>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingConcession ? 'Edit' : 'Add New'} Concession</DialogTitle>
                        <DialogDescription>Define a new scholarship or discount rule.</DialogDescription>
                    </DialogHeader>
                    <ConcessionForm 
                        feeStructures={feeStructures} 
                        concession={editingConcession} 
                        onSave={handleSaveConcession} 
                        onClose={() => setIsDialogOpen(false)} 
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Reusable Form Component ---

type ConcessionFormProps = {
    feeStructures: { id: string; name: string }[];
    concession?: Concession | null;
    onSave: (data: ConcessionFormValues) => Promise<void>;
    onClose: () => void;
}

function ConcessionForm({ feeStructures, concession, onSave, onClose }: ConcessionFormProps) {
    const form = useForm<ConcessionFormValues>({
        resolver: zodResolver(concessionSchema),
        defaultValues: {
            name: concession?.name || '',
            type: concession?.type || 'PERCENTAGE',
            value: concession?.value || 0,
            description: concession?.description || '',
            applicableFeeStructureIds: concession?.applicableFeeStructureIds || [],
        },
    });

    const watchType = form.watch('type');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)}>
                <div className="grid gap-4 py-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="PERCENTAGE">Percentage</SelectItem><SelectItem value="FIXED">Fixed</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="value" render={({ field }) => (
                            <FormItem><FormLabel>Value {watchType === 'PERCENTAGE' ? '(%)' : '($)'}</FormLabel><FormControl><Input type="number" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="applicableFeeStructureIds" render={({ field }) => (
                        <FormItem><FormLabel>Applicable Fee Structures</FormLabel><FormControl><MultiSelectFeeStructures feeStructures={feeStructures} selected={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {concession ? 'Save Changes' : 'Save Concession'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
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
