
"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Info, FileUp, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

type Invoice = {
    id: string;
    item: string;
    amount: number;
    dueDate: string;
    status: string;
    lateFee: number;
    concession: { name: string; amount: number } | null;
    lateFeeDetails: string | null;
}

type InvoicesClientPageProps = {
    invoicesData: Invoice[];
}

export default function InvoicesClientPage({ invoicesData }: InvoicesClientPageProps) {
    const [selectedMethod, setSelectedMethod] = useState("bank");

    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    return (
        <TooltipProvider>
            <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
              <CardDescription>
                Here are the current unpaid invoices for the selected student.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Base Amount</TableHead>
                    <TableHead>Concession</TableHead>
                    <TableHead>Late Fee</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesData.length > 0 ? invoicesData.map((invoice) => {
                    const total = (invoice.amount - (invoice.concession?.amount ?? 0)) + invoice.lateFee;

                    return (
                        <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.item}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          {invoice.concession ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help text-emerald-600">
                                  <Sparkles className="h-3 w-3" />
                                  -{formatCurrency(invoice.concession.amount)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{invoice.concession.name} applied.</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className={invoice.lateFee > 0 ? 'text-destructive font-medium' : ''}>
                            {invoice.lateFee > 0 && invoice.lateFeeDetails ? (
                                <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 cursor-help">
                                    {formatCurrency(invoice.lateFee)}
                                    <Info className="h-3 w-3" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{invoice.lateFeeDetails}</p>
                                </TooltipContent>
                                </Tooltip>
                            ) : (
                                formatCurrency(invoice.lateFee)
                            )}
                            </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(total)}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                            <Badge
                            variant={
                                invoice.status === "OVERDUE"
                                ? "destructive"
                                : "secondary"
                            }
                            >
                            {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" disabled={invoice.status === 'PAID'}>
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                <DialogTitle>Make Payment for {invoice.id}</DialogTitle>
                                <DialogDescription>
                                    You are paying a total of <span className="font-bold text-foreground">{formatCurrency(total)}</span> for: {invoice.item}.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                <div className="space-y-3">
                                    <Label>Payment Method</Label>
                                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="flex flex-wrap gap-4">
                                    <Label htmlFor={`method-bank-${invoice.id}`} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                        <RadioGroupItem value="bank" id={`method-bank-${invoice.id}`} />
                                        Bank
                                    </Label>
                                    <Label htmlFor={`method-wallet-${invoice.id}`} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                        <RadioGroupItem value="wallet" id={`method-wallet-${invoice.id}`} />
                                        Wallet
                                    </Label>
                                    <Label htmlFor={`method-cash-${invoice.id}`} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                        <RadioGroupItem value="cash" id={`method-cash-${invoice.id}`} />
                                        Cash
                                    </Label>
                                    </RadioGroup>
                                </div>

                                {selectedMethod !== 'cash' && (
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`bank-name-${invoice.id}`}>{selectedMethod === 'bank' ? 'Bank Name' : 'Wallet Provider'}</Label>
                                        <Input id={`bank-name-${invoice.id}`} placeholder={selectedMethod === 'bank' ? 'e.g., Central Bank' : 'e.g., PayTM'} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`ref-${invoice.id}`}>Transaction Reference</Label>
                                        <Input id={`ref-${invoice.id}`} placeholder="e.g., TRF12345ABC" />
                                    </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor={`evidence-${invoice.id}`}>Upload Evidence</Label>
                                    <div className="relative">
                                        <Button size="icon" variant="outline" className="absolute left-0 top-0 rounded-r-none" asChild>
                                            <Label htmlFor={`evidence-${invoice.id}`} className="cursor-pointer">
                                                <FileUp className="h-4 w-4" />
                                            </Label>
                                        </Button>
                                        <Input id={`evidence-${invoice.id}`} type="file" className="pl-12" />
                                    </div>
                                </div>
                                </div>
                                <DialogFooter>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="w-full">Submit for Verification</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This will mark the invoice as 'Pending Verification'. An administrator will review the payment evidence. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction>Confirm and Submit</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DialogFooter>
                            </DialogContent>
                            </Dialog>
                        </TableCell>
                        </TableRow>
                    )
                  }) : (
                     <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                            No invoices found for this student.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TooltipProvider>
    )
}
