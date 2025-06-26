import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const gradesData = [
  { course: 'Mathematics', grade: 'A', teacher: 'Mr. Smith' },
  { course: 'History', grade: 'B+', teacher: 'Ms. Jones' },
  { course: 'Science', grade: 'A-', teacher: 'Dr. Brown' },
  { course: 'English Literature', grade: 'B', teacher: 'Mrs. Davis' },
];

const scoresData = [
  { exam: 'Mid-term Exam', subject: 'Mathematics', score: '92/100', rank: '3rd' },
  { exam: 'Final Exam', subject: 'History', score: '88/100', rank: '5th' },
  { exam: 'Unit Test', subject: 'Science', score: '95/100', rank: '1st' },
  { exam: 'Essay', subject: 'English', score: '85/100', rank: '7th' },
];

export default function AcademicsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Academics</h1>
      <Tabs defaultValue="grades">
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Course Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Teacher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData.map((item) => (
                    <TableRow key={item.course}>
                      <TableCell className="font-medium">{item.course}</TableCell>
                      <TableCell>{item.grade}</TableCell>
                      <TableCell>{item.teacher}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle>Exam Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoresData.map((item) => (
                    <TableRow key={item.exam}>
                      <TableCell className="font-medium">{item.exam}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell>{item.rank}</TableCell>
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
