
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  FileText,
  History,
  Info,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const invoicesData = [
  {
    id: "INV-001",
    item: "Tuition Fee - Grade 10",
    amount: "$2,500.00",
    dueDate: "2024-08-01",
    status: "Overdue",
    lateFee: "$125.00",
    total: "$2,625.00",
    lateFeeDetails: "5% one-time penalty on base amount of $2,500.00."
  },
  {
    id: "INV-002",
    item: "Library Book Fine",
    amount: "$15.00",
    dueDate: "2024-07-25",
    status: "Overdue",
    lateFee: "$5.00",
    total: "$20.00",
    lateFeeDetails: "$1 per day for 5 overdue days."
  },
  {
    id: "INV-003",
    item: "Lab Fee - Chemistry",
    amount: "$150.00",
    dueDate: "2024-09-01",
    status: "Pending",
    lateFee: "$0.00",
    total: "$150.00",
    lateFeeDetails: null,
  },
];

const paymentHistoryData = [
  {
    id: "TRN-123",
    date: "2024-04-15",
    description: "Tuition Fee - Spring Semester",
    amount: "$2,500",
    status: "Completed",
  },
  {
    id: "TRN-124",
    date: "2024-02-10",
    description: "Book Purchase",
    amount: "$250",
    status: "Completed",
  },
  {
    id: "TRN-125",
    date: "2024-01-20",
    description: "Bus Fee - January",
    amount: "$100",
    status: "Completed",
  },
];

const initialFeeStructureData = [
    { id: 'fs1', name: 'Tuition Fee - Fall Semester', grade: 'Grade 10', section: 'A', amount: '$2,500', penalty: 'Standard Late Fee' },
    { id: 'fs2', name: 'Lab Fee - Chemistry', grade: 'Grade 10', section: 'All', amount: '$150', penalty: 'None' },
    { id: 'fs3', name: 'Tuition Fee - Fall Semester', grade: 'Grade 9', section: 'All', amount: '$2,300', penalty: 'Standard Late Fee' },
];

const initialPenaltyData = [
    { id: 'p1', name: 'Standard Late Fee', gracePeriod: 3, penaltyType: 'Percentage', value: '5%', frequency: 'One-Time' },
    { id: 'p2', name: 'Library Book Overdue', gracePeriod: 0, penaltyType: 'Fixed', value: '$1', frequency: 'Per Day' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ["A", "B", "C", "D", "All"];

export default function FeesPage() {
  const [feeSchemes, setFeeSchemes] = useState(initialFeeStructureData);
  const [penalties, setPenalties] = useState(initialPenaltyData);

  const handleDeleteScheme = (id: string) => {
    setFeeSchemes(feeSchemes.filter(scheme => scheme.id !== id));
  };

  const handleDeletePenalty = (id: string) => {
    setPenalties(penalties.filter(penalty => penalty.id !== id));
  };

  return (
    <TooltipProvider>
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Fee Management</h1>
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="structure">
            <DollarSign className="mr-2 h-4 w-4" />
            Fee Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
              <CardDescription>
                Here are the current unpaid invoices for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Base Amount</TableHead>
                    <TableHead>Late Fee</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.item}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell className={invoice.lateFee !== '$0.00' ? 'text-destructive font-medium' : ''}>
                          {invoice.lateFee !== '$0.00' && invoice.lateFeeDetails ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help">
                                  {invoice.lateFee}
                                  <Info className="h-3 w-3" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{invoice.lateFeeDetails}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            invoice.lateFee
                          )}
                        </TableCell>
                      <TableCell className="font-semibold">{invoice.total}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">
                          <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                A record of all your past transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistoryData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Badge>{payment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fee Schemes</CardTitle>
                    <CardDescription>
                      Define fee structures for different grades and sections.
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
                          Fill in the details for the new fee structure.
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
                    {feeSchemes.map((fee) => (
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Penalty Rules</CardTitle>
                    <CardDescription>
                      Define penalties for late payments.
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Penalty Rule</DialogTitle>
                        <DialogDescription>
                          Define the conditions and charges for late fees.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="ruleName">Rule Name</Label>
                          <Input
                            id="ruleName"
                            placeholder="e.g., Standard Tuition Late Fee"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gracePeriod">
                            Grace Period (days)
                          </Label>
                          <Input
                            id="gracePeriod"
                            type="number"
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Penalty Type</Label>
                          <RadioGroup
                            defaultValue="percentage"
                            className="flex gap-4 pt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="percentage"
                                id="r_percentage"
                              />
                              <Label htmlFor="r_percentage">Percentage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fixed" id="r_fixed" />
                              <Label htmlFor="r_fixed">Fixed Amount</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="penaltyValue">Penalty Value</Label>
                          <Input
                            id="penaltyValue"
                            type="number"
                            placeholder="5 (for 5%) or 10 (for $10)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="penaltyFrequency">
                            Penalty Frequency
                          </Label>
                          <Select>
                            <SelectTrigger id="penaltyFrequency">
                              <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Per Day</SelectItem>
                              <SelectItem value="one-time">
                                One-Time Flat Fee
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                      <TableHead>Penalty</TableHead>
                      <TableHead>Frequency</TableHead>
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
                        <TableCell>
                          {penalty.penaltyType === "Fixed"
                            ? penalty.value
                            : `${penalty.value} of amount`}
                        </TableCell>
                        <TableCell>{penalty.frequency}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Penalty Rule</DialogTitle>
                                <DialogDescription>
                                  Make changes to this penalty rule.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-ruleName-${penalty.id}`}>Rule Name</Label>
                                  <Input
                                    id={`edit-ruleName-${penalty.id}`}
                                    defaultValue={penalty.name}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-gracePeriod-${penalty.id}`}>
                                    Grace Period (days)
                                  </Label>
                                  <Input
                                    id={`edit-gracePeriod-${penalty.id}`}
                                    type="number"
                                    defaultValue={penalty.gracePeriod}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Penalty Type</Label>
                                  <RadioGroup
                                    defaultValue={penalty.penaltyType.toLowerCase()}
                                    className="flex gap-4 pt-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="percentage"
                                        id={`r_edit_percentage-${penalty.id}`}
                                      />
                                      <Label htmlFor={`r_edit_percentage-${penalty.id}`}>Percentage</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="fixed" id={`r_edit_fixed-${penalty.id}`} />
                                      <Label htmlFor={`r_edit_fixed-${penalty.id}`}>Fixed Amount</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-penaltyValue-${penalty.id}`}>Penalty Value</Label>
                                  <Input
                                    id={`edit-penaltyValue-${penalty.id}`}
                                    type="number"
                                    defaultValue={penalty.value.replace(/[$,%]/g, '')}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-penaltyFrequency-${penalty.id}`}>
                                    Penalty Frequency
                                  </Label>
                                  <Select defaultValue={penalty.frequency === 'Per Day' ? 'daily' : 'one-time'}>
                                    <SelectTrigger id={`edit-penaltyFrequency-${penalty.id}`}>
                                      <SelectValue placeholder="Select Frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="daily">Per Day</SelectItem>
                                      <SelectItem value="one-time">
                                        One-Time Flat Fee
                                      </SelectItem>
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
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}
