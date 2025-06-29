
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, PlusCircle, Trash2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createFeeStructureAction, updateFeeStructureAction, deleteFeeStructureAction, createPenaltyRuleAction, updatePenaltyRuleAction, deletePenaltyRuleAction } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Schemas
const feeStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  interval: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']),
  dueDate: z.date({ required_error: "A due date is required." }),
  penaltyRuleId: z.string().optional(),
});
type FeeStructureFormValues = z.infer<typeof feeStructureSchema>;

const penaltyTierSchema = z.object({
  fromDay: z.coerce.number().min(1),
  toDay: z.coerce.number().optional().nullable(),
  type: z.enum(['FIXED', 'PERCENTAGE']),
  value: z.coerce.number().min(0),
  frequency: z.enum(['ONE_TIME', 'DAILY']),
});
const penaltyRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  gracePeriod: z.coerce.number().min(0),
  tiers: z.array(penaltyTierSchema).min(1, 'At least one tier is required.'),
});
type PenaltyRuleFormValues = z.infer<typeof penaltyRuleSchema>;

// Types
type FeeScheme = {
    id: string; name: string; amount: string; penalty: string; academicYear: string; dueDate: string; interval: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
};
type PenaltyTier = { id: string; fromDay: number; toDay: number | null; type: 'FIXED' | 'PERCENTAGE'; value: number; frequency: 'ONE_TIME' | 'DAILY'; };
type PenaltyRule = { id: string; name: string; gracePeriod: number; tiers: PenaltyTier[]; };

type StructureClientPageProps = {
    feeSchemes: FeeScheme[]; penaltyRules: PenaltyRule[]; academicYear: string;
};

// Main Component
export default function StructureClientPage({ feeSchemes: initialFeeSchemes, penaltyRules: initialPenaltyRules, academicYear }: StructureClientPageProps) {
  const { toast } = useToast();
  const [feeSchemes, setFeeSchemes] = useState(initialFeeSchemes);
  const [penalties, setPenalties] = useState<PenaltyRule[]>(initialPenaltyRules);
  const [isSchemeDialogOpen, setIsSchemeDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<FeeScheme | null>(null);
  const [editingPenalty, setEditingPenalty] = useState<PenaltyRule | null>(null);
  const schoolId = "cmcf3ofm90000kjlz1g767avh"; // Placeholder

  const openSchemeDialog = (scheme: FeeScheme | null) => {
    setEditingScheme(scheme);
    setIsSchemeDialogOpen(true);
  };
  const openRuleDialog = (rule: PenaltyRule | null) => {
    setEditingPenalty(rule);
    setIsRuleDialogOpen(true);
  };
  
  const handleSaveScheme = async (data: FeeStructureFormValues) => {
    const result = editingScheme 
        ? await updateFeeStructureAction(editingScheme.id, data)
        : await createFeeStructureAction(data, schoolId);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      window.location.reload();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteScheme = async (id: string) => {
    const result = await deleteFeeStructureAction(id);
    if(result.success) {
        setFeeSchemes(prev => prev.filter(s => s.id !== id));
        toast({ title: "Success", description: "Fee scheme deleted."});
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleSaveRule = async (data: PenaltyRuleFormValues) => {
    const result = editingPenalty
        ? await updatePenaltyRuleAction(editingPenalty.id, data)
        : await createPenaltyRuleAction(data, schoolId);

    if (result.success) {
        toast({ title: "Success", description: result.message });
        window.location.reload();
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDeletePenalty = async (id: string) => {
    const result = await deletePenaltyRuleAction(id);
    if(result.success) {
        setPenalties(prev => prev.filter(p => p.id !== id));
        toast({ title: "Success", description: "Penalty rule deleted."});
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const renderTierDetails = (tier: PenaltyTier) => {
    const valuePrefix = tier.type === 'FIXED' ? '$' : '';
    const valueSuffix = tier.type === 'PERCENTAGE' ? '%' : '';
    const frequency = tier.frequency === 'DAILY' ? ' / day' : ' (one-time)';
    const period = `Days ${tier.fromDay} - ${tier.toDay ?? 'onwards'}`;
    return `${period}: ${valuePrefix}${tier.value}${valueSuffix}${frequency}`;
  };

    return (
        <TooltipProvider>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Fee Schemes</CardTitle>
                    <CardDescription>Define fee structures for the {academicYear} academic year.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => openSchemeDialog(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add Scheme</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeSchemes.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.name}</TableCell>
                        <TableCell>{fee.amount}</TableCell>
                        <TableCell>{fee.interval}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openSchemeDialog(fee)}><Pencil className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteScheme(fee.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {feeSchemes.length === 0 && (<div className="text-center p-8 text-muted-foreground">No fee schemes defined for {academicYear}.</div>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Penalty Rules</CardTitle><CardDescription>Define sequential penalties for late payments.</CardDescription></div>
                  <Button size="sm" onClick={() => openRuleDialog(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add Rule</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Grace Period</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penalties.map((penalty) => (
                      <TableRow key={penalty.id}>
                        <TableCell className="font-medium">{penalty.name}</TableCell>
                        <TableCell>{penalty.gracePeriod} days</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            <Tooltip>
                                <TooltipTrigger><span className="cursor-help border-b border-dashed">{penalty.tiers.length} Tier(s)</span></TooltipTrigger>
                                <TooltipContent><div className="space-y-1">{penalty.tiers.map(tier => <p key={tier.id}>{renderTierDetails(tier)}</p>)}</div></TooltipContent>
                            </Tooltip>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openRuleDialog(penalty)}><Pencil className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePenalty(penalty.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        <Dialog open={isSchemeDialogOpen} onOpenChange={setIsSchemeDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingScheme ? 'Edit' : 'Add'} Fee Scheme</DialogTitle>
                    <DialogDescription>It will be associated with the academic year: {academicYear}.</DialogDescription>
                </DialogHeader>
                <FeeSchemeForm key={editingScheme?.id} onSave={handleSaveScheme} initialData={editingScheme} penaltyRules={penalties} onClose={() => setIsSchemeDialogOpen(false)} />
            </DialogContent>
        </Dialog>
        
         <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{editingPenalty ? 'Edit' : 'Add'} Penalty Rule</DialogTitle>
                    <DialogDescription>Define the conditions and charges for late fees.</DialogDescription>
                </DialogHeader>
                <PenaltyRuleForm key={editingPenalty?.id} onSave={handleSaveRule} initialData={editingPenalty} onClose={() => setIsRuleDialogOpen(false)} />
            </DialogContent>
        </Dialog>
        </TooltipProvider>
    )
}

// Fee Scheme Form
function FeeSchemeForm({ onSave, initialData, penaltyRules, onClose }: { onSave: (data: FeeStructureFormValues) => Promise<void>, initialData: FeeScheme | null, penaltyRules: PenaltyRule[], onClose: () => void }) {
    const form = useForm<FeeStructureFormValues>({
        resolver: zodResolver(feeStructureSchema),
        defaultValues: {
            name: initialData?.name || '',
            amount: parseFloat(initialData?.amount.replace(/[$,]/g, '')) || 0,
            interval: initialData?.interval || 'ONE_TIME',
            dueDate: initialData?.dueDate && initialData.dueDate !== 'N/A' ? new Date(initialData.dueDate) : new Date(),
            penaltyRuleId: penaltyRules.find(p => p.name === initialData?.penalty)?.id || 'None',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Fee Name</FormLabel><FormControl><Input placeholder="e.g., Term One Payment" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 2500" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="dueDate" render={({ field }) => (
                        <FormItem><FormLabel>First Due Date</FormLabel>
                            <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus captionLayout="dropdown-buttons" fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 5} /></PopoverContent>
                            </Popover><FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="interval" render={({ field }) => (
                        <FormItem><FormLabel>Payment Interval</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'] as const).map(i => <SelectItem key={i} value={i}>{i.replace('_', '-')}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="penaltyRuleId" render={({ field }) => (
                    <FormItem><FormLabel>Penalty Rule</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a rule" /></SelectTrigger></FormControl><SelectContent><SelectItem value="None">None</SelectItem>{penaltyRules.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Save Scheme</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

// Penalty Rule Form
function PenaltyRuleForm({ onSave, initialData, onClose }: { onSave: (data: PenaltyRuleFormValues) => Promise<void>, initialData: PenaltyRule | null, onClose: () => void }) {
    const form = useForm<PenaltyRuleFormValues>({
        resolver: zodResolver(penaltyRuleSchema),
        defaultValues: {
            name: initialData?.name || '',
            gracePeriod: initialData?.gracePeriod || 0,
            tiers: initialData?.tiers || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "tiers",
    });
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Rule Name</FormLabel><FormControl><Input placeholder="e.g., Standard Tuition Late Fee" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="gracePeriod" render={({ field }) => ( <FormItem><FormLabel>Grace Period (days)</FormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem> )} />
                 </div>
                 <Separator />
                 <div>
                    <Label className="text-base font-medium">Penalty Tiers</Label>
                    <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                           <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_1fr_auto_auto] gap-2 items-end rounded-lg border p-2">
                                <FormField control={form.control} name={`tiers.${index}.fromDay`} render={({ field }) => (<FormItem><Label className="text-xs">From Day</Label><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name={`tiers.${index}.toDay`} render={({ field }) => (<FormItem><Label className="text-xs">To Day</Label><FormControl><Input type="number" placeholder="Ongoing" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name={`tiers.${index}.type`} render={({ field }) => (<FormItem><Label className="text-xs">Type</Label><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="FIXED">Fixed</SelectItem><SelectItem value="PERCENTAGE">Percent</SelectItem></SelectContent></Select></FormItem>)} />
                                <FormField control={form.control} name={`tiers.${index}.value`} render={({ field }) => (<FormItem><Label className="text-xs">Value</Label><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name={`tiers.${index}.frequency`} render={({ field }) => (<FormItem><Label className="text-xs">Frequency</Label><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="ONE_TIME">One-Time</SelectItem><SelectItem value="DAILY">Daily</SelectItem></SelectContent></Select></FormItem>)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                           </div>
                        ))}
                    </div>
                     {form.formState.errors.tiers && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.tiers.message || form.formState.errors.tiers.root?.message}</p>}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({fromDay: (fields[fields.length-1]?.toDay || 0) + 1, toDay: null, type: 'FIXED', value: 0, frequency: 'ONE_TIME'})}><PlusCircle className="mr-2 h-4 w-4"/> Add Tier</Button>
                 </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Save Rule</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
