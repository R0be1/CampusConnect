
"use client";

import { useState } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const initialTestsData = [
  { id: "test-001", name: "Algebra II - Mid-term", grade: "Grade 10", subject: "Mathematics", status: "Upcoming", type: "Standard" as const },
  { id: "test-002", name: "Mechanics - Unit Test", grade: "Grade 11", subject: "Physics", status: "Active", type: "Standard" as const },
  { id: "test-003", name: "American Revolution", grade: "Grade 9", subject: "History", status: "Completed", type: "Standard" as const },
  { id: "test-004", name: "Practice Test: Chemistry", grade: "Grade 10", subject: "Chemistry", status: "Active", type: "Mock" as const },
];

type Test = typeof initialTestsData[0];

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>(initialTestsData);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Upcoming": return "secondary";
      case "Completed": return "outline";
      default: return "secondary";
    }
  };
  
  const handleStatusChange = (testId: string, newStatus: Test['status']) => {
    setTests(currentTests => currentTests.map(test => 
      test.id === testId ? { ...test, status: newStatus } : test
    ));
  };
  
  const handleDelete = (testId: string) => {
      setTests(currentTests => currentTests.filter(test => test.id !== testId));
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{test.grade}</TableCell>
                    <TableCell>{test.subject}</TableCell>
                    <TableCell>
                      <Badge variant={test.type === 'Mock' ? 'secondary' : 'outline'}>{test.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(test.status) as any}>{test.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button asChild variant="outline" size="sm" disabled={test.status === 'Upcoming' || test.type === 'Mock'}>
                          <Link href={`/dashboard/tests/${test.id}/submissions`}>View Submissions</Link>
                       </Button>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Test</DropdownMenuItem>
                          <DropdownMenuSeparator />
                           {test.status === 'Upcoming' && test.type === 'Standard' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Activate Test</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Activate this test?</AlertDialogTitle>
                                  <AlertDialogDescription>Students will be able to begin taking this exam. This action can be reversed.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(test.id, 'Active')}>Activate</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {test.status === 'Active' && test.type === 'Standard' && (
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>End Test</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>End this test?</AlertDialogTitle>
                                  <AlertDialogDescription>Students will no longer be able to submit answers. This can be reversed.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(test.id, 'Completed')}>End Test</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {test.status === 'Completed' && test.type === 'Standard' && (
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Re-activate Test</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Re-activate this test?</AlertDialogTitle>
                                  <AlertDialogDescription>This will change the status to 'Active', allowing students to take the exam again.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleStatusChange(test.id, 'Active')}>Re-activate</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                           {test.type === 'Standard' && <DropdownMenuSeparator />}
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete Test</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone. This will permanently delete the test and all associated submissions.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(test.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

    