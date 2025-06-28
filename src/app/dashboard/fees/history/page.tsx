
import { getFirstSchool, getFirstStudent, getPaymentHistory } from "@/lib/data";
import HistoryClientPage from "../history-client";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { format } from "date-fns";

export default async function PaymentHistoryPage() {
    const school = await getFirstSchool();
    if (!school) redirect('/system-admin/schools');

    const student = await getFirstStudent(school.id);
    if (!student) {
        return <Alert><Info className="h-4 w-4" /><AlertTitle>No Students Found</AlertTitle><AlertDescription>Please register a student to view payment history.</AlertDescription></Alert>
    }

    const rawPayments = await getPaymentHistory(student.id);

    const paymentHistoryData = rawPayments.map(payment => ({
        id: payment.id,
        date: format(payment.paymentDate, 'PPP'),
        description: payment.invoice.feeStructure.name,
        amount: `$${payment.amount.toFixed(2)}`,
        status: payment.status,
    }));

    return <HistoryClientPage paymentHistoryData={paymentHistoryData} />
}
