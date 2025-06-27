
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { useAcademicYear } from "@/context/academic-year-context";

// Mock data has been moved to the seed script.
// This component will need to be updated to fetch data from the database.
const gradesData: { course: string; grade: string; teacher: string }[] = [];
const scoresData: { exam: string; subject: string; score: string; rank: string }[] = [];

export default function AcademicsPage() {
  const { selectedYear, setSelectedYear, availableYears } = useAcademicYear();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Academics</h1>
        <div className="w-48 space-y-1">
          <Label>Academic Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
          </Select>
        </div>
      </div>
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
