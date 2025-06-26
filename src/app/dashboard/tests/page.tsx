
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const testsData = [
  { id: "test-001", name: "Algebra II - Mid-term", grade: "Grade 10", subject: "Mathematics", status: "Upcoming" },
  { id: "test-002", name: "Mechanics - Unit Test", grade: "Grade 11", subject: "Physics", status: "Active" },
  { id: "test-003", name: "American Revolution", grade: "Grade 9", subject: "History", status: "Completed" },
];

export default function TestsPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Upcoming": return "secondary";
      case "Completed": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Test Management</h1>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Created Tests</CardTitle>
            <CardDescription>Manage, edit, and view all created online tests.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/tests/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Test
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testsData.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{test.grade}</TableCell>
                    <TableCell>{test.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(test.status) as any}>{test.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Submissions</DropdownMenuItem>
                          <DropdownMenuItem>Edit Test</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Test</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
