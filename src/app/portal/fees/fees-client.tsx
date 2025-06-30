
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Loader2, Info, Sparkles, FileUp } from "lucide-react";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createFeePaymentAction, PortalFeesData } from "../actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type FeesClientPageProps = {
    initialFeesData: PortalFeesData | null;
    studentName: string;
}

export default function FeesClientPage({ initialFeesData, studentName }: FeesClientPageProps) {
  const { toast } = useToast();
  const [feesData] = useState(initialFeesData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the payment dialog
  const [invoiceForPayment, setInvoiceForPayment] = useState<PortalFeesData['invoices'][0] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("BANK_TRANSFER");
  const [reference, setReference] = useState("");

  const handleOpenDialog = (invoice: PortalFeesData['invoices'][0]) => {
      setInvoiceForPayment(invoice);
      setSelectedMethod("BANK_TRANSFER");
      setReference("");
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const outstandingBalance = feesData?.invoices.reduce((acc, inv) => {
    if (inv.status === 'OVERDUE' || inv.status === 'PENDING') {
      const total = (inv.amount - (inv.concession?.amount ?? 0)) + inv.lateFee;
      return acc + total;
    }
    return acc;
  }, 0) ?? 0;
  
  const handlePaymentSubmit = async () => {
    if (!invoiceForPayment) return;
    
    setIsSubmitting(true);
    const totalAmount = (invoiceForPayment.amount - (invoiceForPayment.concession?.amount ?? 0)) + invoiceForPayment.lateFee;
    
    const result = await createFeePaymentAction({
        invoiceId: invoiceForPayment.id,
        amount: totalAmount,
        method: selectedMethod,
        reference: selectedMethod === 'CASH' ? `CASH_PAYMENT_${Date.now()}` : reference,
    });
    
    if (result.success) {
        toast({ title: "Payment Submitted", description: result.message });
        window.location.reload();
        setInvoiceForPayment(null);
    } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setIsSubmitting(false);
    }
  }

  if (!feesData) {
      return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Fee & Payment Details for {studentName}</h1>
            </div>
            <p className="text-muted-foreground">Review outstanding invoices and your payment history.</p>
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Data Available</AlertTitle>
                <AlertDescription>
                    Fee data is not available for {studentName}. Please check back later.
                </AlertDescription>
            </Alert>
        </div>
      )
  }
  
  const totalDueForDialog = invoiceForPayment ? (invoiceForPayment.amount - (invoiceForPayment.concession?.amount ?? 0)) + invoiceForPayment.lateFee : 0;

  return (
    <TooltipProvider>
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <DollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Fee & Payment Details for {studentName}</h1>
      </div>
      <p className="text-muted-foreground">Review outstanding invoices and your payment history.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>All current and past invoices are listed here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Concession</TableHead>
                                    <TableHead>Late Fee</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feesData.invoices.length > 0 ? feesData.invoices.map((invoice) => {
                                    const total = (invoice.amount - (invoice.concession?.amount ?? 0)) + invoice.lateFee;
                                    return (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.feeStructure.name}</TableCell>
                                        <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                invoice.status === "OVERDUE" ? "destructive" : 
                                                invoice.status === "PAID" ? "default" : 
                                                invoice.status === 'PENDING_VERIFICATION' ? 'outline' : "secondary"
                                            }>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {invoice.concession ? (
                                            <Tooltip>
                                              <TooltipTrigger asChild><span className="flex items-center gap-1 cursor-help text-emerald-600"><Sparkles className="h-3 w-3" />-{formatCurrency(invoice.concession.amount)}</span></TooltipTrigger>
                                              <TooltipContent><p>{invoice.concession.name} applied.</p></TooltipContent>
                                            </Tooltip>
                                          ) : (<span className="text-muted-foreground">-</span>)}
                                        </TableCell>
                                        <TableCell className={invoice.lateFee > 0 ? 'text-destructive font-medium' : ''}>
                                          {invoice.lateFee > 0 && invoice.lateFeeDetails ? (
                                              <Tooltip>
                                              <TooltipTrigger asChild><span className="flex items-center gap-1 cursor-help">{formatCurrency(invoice.lateFee)}<Info className="h-3 w-3" /></span></TooltipTrigger>
                                              <TooltipContent><p>{invoice.lateFeeDetails}</p></TooltipContent>
                                              </Tooltip>
                                          ) : (formatCurrency(invoice.lateFee))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleOpenDialog(invoice)} disabled={invoice.status === 'PAID' || invoice.status === 'PENDING_VERIFICATION'} className="font-semibold">
                                                <CreditCard className="mr-2 h-4 w-4" /> {formatCurrency(total)}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    )
                                }) : (
                                    <TableRow><TableCell colSpan={6} className="h-24 text-center">No invoices found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Payment History</CardTitle><CardDescription>A record of all your past transactions.</CardDescription></CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feesData.paymentHistory.length > 0 ? feesData.paymentHistory.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(new Date(payment.paymentDate), 'PPP')}</TableCell>
                                        <TableCell className="font-medium">{payment.invoice.feeStructure.name}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell><Badge variant={payment.status === 'COMPLETED' ? 'default' : 'outline'}>{payment.status}</Badge></TableCell>
                                        <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                                    </TableRow>
                                )) : (
                                     <TableRow><TableCell colSpan={5} className="h-24 text-center">No payment history found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-6">
                <CardHeader className="text-center">
                    <CardDescription>Total Outstanding Balance</CardDescription>
                    <CardTitle className="text-4xl text-destructive">{formatCurrency(outstandingBalance)}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" disabled={outstandingBalance <= 0}>
                        <CreditCard className="mr-2 h-4 w-4" /> Pay All Outstanding
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
        <Dialog open={!!invoiceForPayment} onOpenChange={(isOpen) => !isOpen && setInvoiceForPayment(null)}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Make Payment for {invoiceForPayment?.feeStructure.name}</DialogTitle>
                    <DialogDescription>You are paying a total of <span className="font-bold text-foreground">{formatCurrency(totalDueForDialog)}</span>.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <Label>Payment Method</Label>
                        <RadioGroup name="payment_method" value={selectedMethod} onValueChange={setSelectedMethod} className="flex flex-wrap gap-4">
                            <Label htmlFor="method-bank" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1"><RadioGroupItem value="BANK_TRANSFER" id="method-bank" />Bank</Label>
                            <Label htmlFor="method-card" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1"><RadioGroupItem value="CARD" id="method-card" />Card</Label>
                            <Label htmlFor="method-cash" className="flex cursor-pointer items-center gap-2 rounded-md border p-3 has-[:checked]:border-primary flex-1"><RadioGroupItem value="CASH" id="method-cash" />Cash</Label>
                        </RadioGroup>
                    </div>
                    {selectedMethod !== 'CASH' && (
                        <div className="space-y-2">
                            <Label htmlFor="reference">Transaction Reference</Label>
                            <Input id="reference" name="reference" placeholder="e.g., TRF12345ABC" required value={reference} onChange={(e) => setReference(e.target.value)} />
                        </div>
                    )}
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
                        <p className="text-xs text-muted-foreground">e.g., a photo of the receipt or a transaction screenshot.</p>
                    </div>
                </div>
                <DialogFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full" type="button" disabled={isSubmitting || (selectedMethod !== 'CASH' && !reference)}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Submit for Verification
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will mark the invoice as 'Pending Verification'. An administrator will review the payment evidence. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handlePaymentSubmit} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Confirm and Submit
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
    </TooltipProvider>
  );
}
