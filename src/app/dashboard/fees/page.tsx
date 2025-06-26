import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, FileText, History } from "lucide-react";

const invoicesData = [
  { id: 'INV-001', item: 'Tuition Fee - Grade 10', amount: '$2,500', dueDate: '2024-08-01', status: 'Pending' },
  { id: 'INV-002', item: 'Late Fee - Library Book', amount: '$15', dueDate: '2024-07-25', status: 'Overdue' },
  { id: 'INV-003', item: 'Lab Fee - Chemistry', amount: '$150', dueDate: '2024-08-01', status: 'Pending' },
];

const paymentHistoryData = [
    { id: 'TRN-123', date: '2024-04-15', description: 'Tuition Fee - Spring Semester', amount: '$2,500', status: 'Completed' },
    { id: 'TRN-124', date: '2024-02-10', description: 'Book Purchase', amount: '$250', status: 'Completed' },
    { id: 'TRN-125', date: '2024-01-20', description: 'Bus Fee - January', amount: '$100', status: 'Completed' },
];

const feeStructureData = [
    { category: 'Tuition', grade: 'Grade 9', amount: '$2,300 / semester' },
    { category: 'Tuition', grade: 'Grade 10', amount: '$2,500 / semester' },
    { category: 'Tuition', grade: 'Grade 11-12', amount: '$300 / credit hour' },
    { category: 'Lab Fee', grade: 'All Science Classes', amount: '$150 / semester' },
];

const penaltyData = [
    { type: 'Late Tuition Fee', rule: 'After due date', penalty: '5% of outstanding amount' },
    { type: 'Late Library Book', rule: 'Per day overdue', penalty: '$1 / day' },
];

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
              <CardDescription>Here are the current unpaid invoices for your account.</CardDescription>
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
                        <Badge variant={invoice.status === 'Overdue' ? 'destructive' : 'secondary'}>
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
              <CardDescription>A record of all your past transactions.</CardDescription>
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
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Schemes</CardTitle>
                        <CardDescription>Fee structure based on grade level and credit hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Basis</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {feeStructureData.map((fee) => (
                                <TableRow key={fee.category + fee.grade}>
                                <TableCell className="font-medium">{fee.category}</TableCell>
                                <TableCell>{fee.grade}</TableCell>
                                <TableCell>{fee.amount}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Penalty Rules</CardTitle>
                        <CardDescription>Dynamically defined penalties for late payments and other infractions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Rule</TableHead>
                                <TableHead>Penalty</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {penaltyData.map((penalty) => (
                                <TableRow key={penalty.type}>
                                <TableCell className="font-medium">{penalty.type}</TableCell>
                                <TableCell>{penalty.rule}</TableCell>
                                <TableCell>{penalty.penalty}</TableCell>
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
