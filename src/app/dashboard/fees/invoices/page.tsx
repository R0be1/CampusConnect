
import { getFirstSchool, getFirstStudent, getInvoicesForStudent } from "@/lib/data";
import InvoicesClientPage from "./invoices-client";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";

export default async function InvoicesPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const student = await getFirstStudent(school.id);
    if (!student) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Students Found</AlertTitle><AlertDescription>Please register a student to view invoices.</AlertDescription></Alert>
    }

    const rawInvoices = await getInvoicesForStudent(student.id);

    const invoicesData = rawInvoices.map(invoice => ({
        id: invoice.id,
        item: invoice.feeStructure.name,
        amount: invoice.amount,
        dueDate: format(invoice.dueDate, 'PPP'),
        status: invoice.status,
        lateFee: invoice.lateFee,
        concession: invoice.concession,
        lateFeeDetails: invoice.lateFeeDetails,
    }));
    
    return <InvoicesClientPage invoicesData={invoicesData} />;
}
