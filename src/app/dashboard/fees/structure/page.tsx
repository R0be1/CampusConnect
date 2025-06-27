
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useAcademicYear } from "@/context/academic-year-context";

const initialFeeStructureData = [
    { id: 'fs1', name: 'Tuition Fee - Fall Semester', grade: 'Grade 10', section: 'A', amount: '$2,500', penalty: 'Standard Late Fee', academicYear: '2024-2025' },
    { id: 'fs2', name: 'Lab Fee - Chemistry', grade: 'Grade 10', section: 'All', amount: '$150', penalty: 'None', academicYear: '2024-2025' },
    { id: 'fs3', name: 'Tuition Fee - Fall Semester', grade: 'Grade 9', section: 'All', amount: '$2,300', penalty: 'Standard Late Fee', academicYear: '2024-2025' },
    { id: 'fs4', name: 'Tuition Fee - Fall Semester', grade: 'Grade 10', section: 'A', amount: '$2,400', penalty: 'Standard Late Fee', academicYear: '2023-2024' },
];

type PenaltyTier = {
    id: string;
    fromDay: number;
    toDay: number | null; // null for infinity
    type: 'Percentage' | 'Fixed';
    value: number;
    frequency: 'Daily' | 'One-Time';
};

type PenaltyRule = {
    id: string;
    name: string;
    gracePeriod: number;
    tiers: PenaltyTier[];
};

const initialPenaltyData: PenaltyRule[] = [
    {
        id: 'p1',
        name: 'Standard Late Fee',
        gracePeriod: 3,
        tiers: [
            { id: 't1_1', fromDay: 1, toDay: 5, type: 'Percentage', value: 5, frequency: 'One-Time' },
            { id: 't1_2', fromDay: 6, toDay: null, type: 'Percentage', value: 10, frequency: 'One-Time' },
        ]
    },
    {
        id: 'p2',
        name: 'Library Book Overdue',
        gracePeriod: 0,
        tiers: [
            { id: 't2_1', fromDay: 1, toDay: null, type: 'Fixed', value: 1, frequency: 'Daily' },
        ]
    },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ["A", "B", "C", "D", "All"];


export default function FeeStructurePage() {
  const { selectedYear } = useAcademicYear();
  const [feeSchemes, setFeeSchemes] = useState(initialFeeStructureData);
  const [penalties, setPenalties] = useState<PenaltyRule[]>(initialPenaltyData);
  const [editingPenalty, setEditingPenalty] = useState<PenaltyRule | null>(null);

  const filteredFeeSchemes = feeSchemes.filter(scheme => scheme.academicYear === selectedYear);

  const handleDeleteScheme = (id: string) => {
    setFeeSchemes(feeSchemes.filter(scheme => scheme.id !== id));
  };

  const handleDeletePenalty = (id: string) => {
    setPenalties(penalties.filter(penalty => penalty.id !== id));
  };
  
  const handleEditPenaltyChange = <K extends keyof PenaltyRule>(field: K, value: PenaltyRule[K]) => {
      if (!editingPenalty) return;
      setEditingPenalty(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleEditTierChange = (index: number, field: keyof PenaltyTier, value: any) => {
      if (!editingPenalty) return;
      const updatedTiers = [...editingPenalty.tiers];
      updatedTiers[index] = { ...updatedTiers[index], [field]: value };
      handleEditPenaltyChange('tiers', updatedTiers);
  }

  const addTierToEditForm = () => {
    if (!editingPenalty) return;
    const newTier: PenaltyTier = {
        id: `new-${Date.now()}`,
        fromDay: (editingPenalty.tiers[editingPenalty.tiers.length - 1]?.toDay || 0) + 1,
        toDay: null,
        type: 'Fixed',
        value: 0,
        frequency: 'One-Time'
    };
    handleEditPenaltyChange('tiers', [...editingPenalty.tiers, newTier]);
  }

  const removeTierFromEditForm = (index: number) => {
    if (!editingPenalty) return;
    const updatedTiers = [...editingPenalty.tiers];
    updatedTiers.splice(index, 1);
    handleEditPenaltyChange('tiers', updatedTiers);
  }

  const renderTierDetails = (tier: PenaltyTier) => {
    const valuePrefix = tier.type === 'Fixed' ? '$' : '';
    const valueSuffix = tier.type === 'Percentage' ? '%' : '';
    const frequency = tier.frequency === 'Daily' ? ' / day' : ' (one-time)';
    const period = `Days ${tier.fromDay} - ${tier.toDay ?? 'onwards'}`;
    return `${period}: ${valuePrefix}${tier.value}${valueSuffix}${frequency}`;
  };

    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Fee Schemes</CardTitle>
                    <CardDescription>
                      Define fee structures for the selected academic year.
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Scheme
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Fee Scheme</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the new fee structure. It will be associated with the academic year: {selectedYear}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="feeName">Fee Name</Label>
                          <Input
                            id="feeName"
                            placeholder="e.g., Term One Payment"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feeAmount">Amount</Label>
                          <Input
                            id="feeAmount"
                            type="number"
                            placeholder="e.g., 2500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="feeGrade">Grade</Label>
                            <Select>
                              <SelectTrigger id="feeGrade">
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                {grades.map((g) => (
                                  <SelectItem key={g} value={g}>
                                    {g}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="feeSection">Section</Label>
                            <Select>
                              <SelectTrigger id="feeSection">
                                <SelectValue placeholder="Select Section" />
                              </SelectTrigger>
                              <SelectContent>
                                {sections.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feePenalty">Penalty Rule</Label>
                            <Select>
                              <SelectTrigger id="feePenalty">
                                <SelectValue placeholder="Select a rule" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                {penalties.map((p) => (
                                  <SelectItem key={p.id} value={p.name}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Scheme</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Penalty Rule</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeeSchemes.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.name}</TableCell>
                        <TableCell>{fee.grade}</TableCell>
                        <TableCell>{fee.section}</TableCell>
                        <TableCell>{fee.amount}</TableCell>
                        <TableCell>{fee.penalty}</TableCell>
                        <TableCell className="text-right">
                           <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Fee Scheme</DialogTitle>
                                <DialogDescription>
                                  Make changes to the fee structure.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label>Academic Year</Label>
                                  <Input readOnly disabled value={fee.academicYear} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-feeName-${fee.id}`}>Fee Name</Label>
                                  <Input
                                    id={`edit-feeName-${fee.id}`}
                                    defaultValue={fee.name}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-feeAmount-${fee.id}`}>Amount</Label>
                                  <Input
                                    id={`edit-feeAmount-${fee.id}`}
                                    type="number"
                                    defaultValue={fee.amount.replace(/[$,]/g, '')}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-feeGrade-${fee.id}`}>Grade</Label>
                                    <Select defaultValue={fee.grade}>
                                      <SelectTrigger id={`edit-feeGrade-${fee.id}`}>
                                        <SelectValue placeholder="Select Grade" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {grades.map((g) => (
                                          <SelectItem key={g} value={g}>
                                            {g}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-feeSection-${fee.id}`}>Section</Label>
                                    <Select defaultValue={fee.section}>
                                      <SelectTrigger id={`edit-feeSection-${fee.id}`}>
                                        <SelectValue placeholder="Select Section" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {sections.map((s) => (
                                          <SelectItem key={s} value={s}>
                                            {s}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-feePenalty-${fee.id}`}>Penalty Rule</Label>
                                  <Select defaultValue={fee.penalty}>
                                    <SelectTrigger id={`edit-feePenalty-${fee.id}`}>
                                      <SelectValue placeholder="Select a rule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="None">None</SelectItem>
                                      {penalties.map((p) => (
                                        <SelectItem key={p.id} value={p.name}>
                                          {p.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this fee scheme.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteScheme(fee.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {filteredFeeSchemes.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No fee schemes defined for the academic year {selectedYear}.
                    </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Penalty Rules</CardTitle>
                    <CardDescription>
                      Define sequential penalties for late payments.
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                      </Button>
                    </DialogTrigger>
                     <DialogContent className="sm:max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Add New Penalty Rule</DialogTitle>
                        <DialogDescription>
                          Define the conditions and charges for late fees, with sequential tiers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ruleName">Rule Name</Label>
                                <Input id="ruleName" placeholder="e.g., Standard Tuition Late Fee" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                                <Input id="gracePeriod" type="number" placeholder="e.g., 3" />
                            </div>
                        </div>
                         <Separator />
                         <div>
                            <Label className="text-base font-medium">Penalty Tiers</Label>
                            <div className="space-y-2 mt-2">
                                {/* This would be a dynamic list in a real implementation */}
                                <div className="grid grid-cols-[1fr_1fr_auto_1fr_auto_auto] gap-2 items-end rounded-lg border p-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">From Day</Label>
                                        <Input type="number" defaultValue="1" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">To Day</Label>
                                        <Input type="number" placeholder="Ongoing" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Type</Label>
                                        <Select defaultValue="Fixed">
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent><SelectItem value="Fixed">Fixed</SelectItem><SelectItem value="Percentage">Percent</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-1">
                                        <Label className="text-xs">Value</Label>
                                        <Input type="number" placeholder="e.g., 10 or 5" />
                                    </div>
                                     <div className="space-y-1">
                                        <Label className="text-xs">Frequency</Label>
                                        <Select defaultValue="One-Time">
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent><SelectItem value="One-Time">One-Time</SelectItem><SelectItem value="Daily">Daily</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/> Add Tier</Button>
                         </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Rule</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                        <TableCell className="font-medium">
                          {penalty.name}
                        </TableCell>
                        <TableCell>{penalty.gracePeriod} days</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            <TooltipProvider>
                            {penalty.tiers.length > 0 ? (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="cursor-help border-b border-dashed">
                                            {penalty.tiers.length} Tier(s)
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            {penalty.tiers.map(tier => <p key={tier.id}>{renderTierDetails(tier)}</p>)}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ) : "No tiers defined"}
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={editingPenalty?.id === penalty.id} onOpenChange={(isOpen) => !isOpen && setEditingPenalty(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingPenalty(JSON.parse(JSON.stringify(penalty)))}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Edit Penalty Rule</DialogTitle>
                                <DialogDescription>
                                  Make changes to this penalty rule and its tiers.
                                </DialogDescription>
                              </DialogHeader>
                              {editingPenalty && (
                                <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="editRuleName">Rule Name</Label>
                                            <Input id="editRuleName" value={editingPenalty.name} onChange={(e) => handleEditPenaltyChange('name', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editGracePeriod">Grace Period (days)</Label>
                                            <Input id="editGracePeriod" type="number" value={editingPenalty.gracePeriod} onChange={(e) => handleEditPenaltyChange('gracePeriod', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-base font-medium">Penalty Tiers</Label>
                                        <div className="space-y-2 mt-2">
                                            {editingPenalty.tiers.map((tier, index) => (
                                                <div key={index} className="grid grid-cols-[1fr_1fr_auto_1fr_auto_auto] gap-2 items-end rounded-lg border p-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">From Day</Label>
                                                        <Input type="number" value={tier.fromDay} onChange={(e) => handleEditTierChange(index, 'fromDay', parseInt(e.target.value))} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">To Day</Label>
                                                        <Input type="number" placeholder="Ongoing" value={tier.toDay ?? ''} onChange={(e) => handleEditTierChange(index, 'toDay', e.target.value ? parseInt(e.target.value) : null)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Type</Label>
                                                        <Select value={tier.type} onValueChange={(val) => handleEditTierChange(index, 'type', val)}>
                                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                                            <SelectContent><SelectItem value="Fixed">Fixed</SelectItem><SelectItem value="Percentage">Percent</SelectItem></SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Value</Label>
                                                        <Input type="number" value={tier.value} onChange={(e) => handleEditTierChange(index, 'value', parseFloat(e.target.value))}/>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Frequency</Label>
                                                        <Select value={tier.frequency} onValueChange={(val) => handleEditTierChange(index, 'frequency', val)}>
                                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                                            <SelectContent><SelectItem value="One-Time">One-Time</SelectItem><SelectItem value="Daily">Daily</SelectItem></SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeTierFromEditForm(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="outline" size="sm" className="mt-2" onClick={addTierToEditForm}><PlusCircle className="mr-2 h-4 w-4"/> Add Tier</Button>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={() => {
                                        if (!editingPenalty) return;
                                        setPenalties(penalties.map(p => p.id === editingPenalty.id ? editingPenalty : p));
                                        setEditingPenalty(null);
                                    }}>Save Changes</Button>
                                </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this penalty rule.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePenalty(penalty.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
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
    )
}
