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
import { CreditCard, Info, FileUp, Sparkles, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { submitPaymentForVerificationAction } from "./actions";

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
    const { toast } = useToast();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Form state for the dialog
    const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
    const [reference, setReference] = useState("");
    const [bankName, setBankName] = useState("");
    
    const handleOpenDialog = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setPaymentMethod("BANK_TRANSFER");
        setReference("");
        setBankName("");
    }

    const handleSubmit = async () => {
        if (!selectedInvoice) return;
        setIsSubmitting(true);
        
        const total = (selectedInvoice.amount - (selectedInvoice.concession?.amount ?? 0)) + selectedInvoice.lateFee;

        const result = await submitPaymentForVerificationAction({
            invoiceId: selectedInvoice.id,
            amount: total,
            method: paymentMethod,
            reference: reference,
        });

        if (result.success) {
            toast({ title: "Success", description: result.message });
            setSelectedInvoice(null);
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    }
    
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    const totalDue = selectedInvoice ? (selectedInvoice.amount - (selectedInvoice.concession?.amount ?? 0)) + selectedInvoice.lateFee : 0;

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
                                invoice.status === "OVERDUE" ? "destructive" : 
                                invoice.status === 'PAID' ? 'default' : 
                                invoice.status === 'PENDING_VERIFICATION' ? 'outline' : "secondary"
                            }
                            >
                            {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button size="sm" onClick={() => handleOpenDialog(invoice)} disabled={invoice.status === 'PAID' || invoice.status === 'PENDING_VERIFICATION'}>
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                            </Button>
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

            <Dialog open={!!selectedInvoice} onOpenChange={(isOpen) => !isOpen && setSelectedInvoice(null)}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                    <DialogTitle>Make Payment for {selectedInvoice?.id}</DialogTitle>
                    <DialogDescription>
                        You are paying a total of <span className="font-bold text-foreground">{formatCurrency(totalDue)}</span> for: {selectedInvoice?.item}.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <Label>Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-wrap gap-4">
                            <Label htmlFor="method-bank" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                <RadioGroupItem value="BANK_TRANSFER" id="method-bank" />
                                Bank
                            </Label>
                            <Label htmlFor="method-card" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                <RadioGroupItem value="CARD" id="method-card" />
                                Card
                            </Label>
                             <Label htmlFor="method-wallet" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1">
                                <RadioGroupItem value="WALLET" id="method-wallet" />
                                Wallet
                            </Label>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name / Wallet Provider</Label>
                            <Input id="bank-name" placeholder={paymentMethod === 'BANK_TRANSFER' ? 'e.g., Central Bank' : 'e.g., PayTM'} value={bankName} onChange={(e) => setBankName(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ref">Transaction Reference</Label>
                            <Input id="ref" placeholder="e.g., TRF12345ABC" value={reference} onChange={(e) => setReference(e.target.value)} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="evidence">Upload Evidence</Label>
                        <div className="relative">
                            <Button size="icon" variant="outline" className="absolute left-0 top-0 rounded-r-none" asChild>
                                <Label htmlFor="evidence" className="cursor-pointer">
                                    <FileUp className="h-4 w-4" />
                                </Label>
                            </Button>
                            <Input id="evidence" type="file" className="pl-12" />
                        </div>
                    </div>
                    </div>
                    <DialogFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full" disabled={isSubmitting || !reference}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Submit for Verification
                                </Button>
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
                                    <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Confirm and Submit
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}
