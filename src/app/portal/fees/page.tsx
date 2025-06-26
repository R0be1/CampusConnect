
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard } from "lucide-react";

const invoicesData = [
  { id: "INV-001", item: "Tuition Fee - Grade 10", amount: "$2,500.00", dueDate: "2024-08-01", status: "Overdue", lateFee: "$125.00", total: "$2,625.00" },
  { id: "INV-002", item: "Library Book Fine", amount: "$15.00", dueDate: "2024-07-25", status: "Overdue", lateFee: "$5.00", total: "$20.00" },
  { id: "INV-003", item: "Lab Fee - Chemistry", amount: "$150.00", dueDate: "2024-09-01", status: "Pending", lateFee: "$0.00", total: "$150.00" },
  { id: "INV-004", item: "Tuition Fee - Spring Semester", amount: "$2,500.00", dueDate: "2024-04-15", status: "Paid", lateFee: "$0.00", total: "$2,500.00" },

];

const paymentHistoryData = [
  { id: "TRN-123", date: "2024-04-15", description: "Tuition Fee - Spring Semester", amount: "$2,500", status: "Completed" },
  { id: "TRN-124", date: "2024-02-10", description: "Book Purchase", amount: "$250", status: "Completed" },
];

export default function FeesPortalPage() {
    const outstandingBalance = invoicesData.reduce((acc, inv) => {
        if (inv.status === 'Overdue' || inv.status === 'Pending') {
            return acc + parseFloat(inv.total.replace(/[$,]/g, ''));
        }
        return acc;
    }, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <DollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Fee & Payment Details</h1>
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
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
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
                                        <TableCell className="font-semibold">{invoice.total}</TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                invoice.status === "Overdue" ? "destructive" : 
                                                invoice.status === "Paid" ? "default" : "secondary"
                                            }>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(invoice.status === 'Overdue' || invoice.status === 'Pending') && (
                                                <Button size="sm">
                                                    <CreditCard className="mr-2 h-4 w-4" /> Pay
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A record of all your past transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistoryData.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">{payment.id}</TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>{payment.description}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                    </TableRow>
                                ))}
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
                    <CardTitle className="text-4xl text-destructive">${outstandingBalance.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" /> Pay All Outstanding
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
