import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const studentAttendance = [
  { date: '2024-05-20', status: 'Present' },
  { date: '2024-05-19', status: 'Present' },
  { date: '2024-05-18', status: 'Absent', reason: 'Sick leave' },
  { date: '2024-05-17', status: 'Present' },
];

const teacherAttendance = [
  { name: 'Mr. Smith', date: '2024-05-20', status: 'Present' },
  { name: 'Ms. Jones', date: '2024-05-19', status: 'Present' },
  { name: 'Dr. Brown', date: '2024-05-18', status: 'Present' },
  { name: 'Mrs. Davis', date: '2024-05-17', status: 'On Leave' },
];

const staffAttendance = [
    { name: 'Mr. Filch', role: 'Caretaker', date: '2024-05-20', status: 'Present' },
    { name: 'Mrs. Pince', role: 'Librarian', date: '2024-05-20', status: 'Present' },
    { name: 'Mr. Harrison', role: 'Admin Clerk', date: '2024-05-20', status: 'Absent' },
];

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Attendance</h1>
      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>Viewing attendance for John Doe</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Present' ? 'default' : 'destructive'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Attendance</CardTitle>
              <CardDescription>Daily attendance records for all teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherAttendance.map((item) => (
                    <TableRow key={item.name + item.date}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Present' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff">
            <Card>
            <CardHeader>
                <CardTitle>Administrative Staff Attendance</CardTitle>
                <CardDescription>Daily attendance records for all non-teaching staff.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staffAttendance.map((item) => (
                    <TableRow key={item.name + item.date}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                        <Badge variant={item.status === 'Present' ? 'default' : 'destructive'}>
                            {item.status}
                        </Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
