
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
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";

const invoicesData = [
  {
    id: "INV-001",
    item: "Tuition Fee - Grade 10",
    amount: "$2,500",
    dueDate: "2024-08-01",
    status: "Pending",
  },
  {
    id: "INV-002",
    item: "Late Fee - Library Book",
    amount: "$15",
    dueDate: "2024-07-25",
    status: "Overdue",
  },
  {
    id: "INV-003",
    item: "Lab Fee - Chemistry",
    amount: "$150",
    dueDate: "2024-08-01",
    status: "Pending",
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

const feeStructureData = [
    { id: 'fs1', name: 'Tuition Fee - Fall Semester', grade: 'Grade 10', section: 'A', amount: '$2,500', penalty: 'Standard Late Fee' },
    { id: 'fs2', name: 'Lab Fee - Chemistry', grade: 'Grade 10', section: 'All', amount: '$150', penalty: 'None' },
    { id: 'fs3', name: 'Tuition Fee - Fall Semester', grade: 'Grade 9', section: 'All', amount: '$2,300', penalty: 'Standard Late Fee' },
];

const penaltyData = [
    { id: 'p1', name: 'Standard Late Fee', gracePeriod: 3, penaltyType: 'Percentage', value: '5%', frequency: 'One-Time' },
    { id: 'p2', name: 'Library Book Overdue', gracePeriod: 0, penaltyType: 'Fixed', value: '$1', frequency: 'Per Day' },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ["A", "B", "C", "D", "All"];

export default function FeesPage() {
  return (
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.item}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
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
                      <TableCell>
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
                                {penaltyData.map((p) => (
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
                    {feeStructureData.map((fee) => (
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
                                      {penaltyData.map((p) => (
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
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
                    {penaltyData.map((penalty) => (
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
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
  );
}
