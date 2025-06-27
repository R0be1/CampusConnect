"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";

type GradeData = {
  course: string;
  grade: string;
  teacher: string;
};

type ScoreData = {
  exam: string;
  subject: string;
  score: string;
  rank: string;
};

type AcademicsClientPageProps = {
  gradesData: GradeData[];
  scoresData: ScoreData[];
  availableYears: { id: string, name: string }[];
  selectedYear: string;
}

export default function AcademicsClientPage({ gradesData, scoresData, availableYears, selectedYear }: AcademicsClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleYearChange = (yearName: string) => {
    const params = new URLSearchParams();
    params.set('year', yearName);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Academics</h1>
        <div className="w-48 space-y-1">
          <Label>Academic Year</Label>
          <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => <SelectItem key={year.id} value={year.name}>{year.name}</SelectItem>)}
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
                  {gradesData.length > 0 ? gradesData.map((item) => (
                    <TableRow key={item.course}>
                      <TableCell className="font-medium">{item.course}</TableCell>
                      <TableCell>{item.grade}</TableCell>
                      <TableCell>{item.teacher}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">No grades found for this academic year.</TableCell>
                    </TableRow>
                  )}
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
                  {scoresData.length > 0 ? scoresData.map((item) => (
                    <TableRow key={item.exam}>
                      <TableCell className="font-medium">{item.exam}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell>{item.rank}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">No exam scores found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
