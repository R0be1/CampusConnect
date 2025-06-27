
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BookOpen, Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useStudent } from "@/context/student-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const allAcademicData = {
  "John Doe": {
    mathematics: {
      exams: [
        { name: 'Unit Test 1', score: 21, totalMarks: 25, rank: 5, classAverage: 78 },
        { name: 'Mid-term', score: 46, totalMarks: 50, rank: 3, classAverage: 82 },
        { name: 'Unit Test 2', score: 22, totalMarks: 25, rank: 4, classAverage: 80 },
        { name: 'Final Exam', score: 95, totalMarks: 100, rank: 1, classAverage: 85 },
      ],
      overallScore: 92.0,
    },
    history: {
      exams: [
        { name: 'Essay 1', score: 17.6, totalMarks: 20, rank: 5, classAverage: 85 },
        { name: 'Mid-term', score: 41, totalMarks: 50, rank: 9, classAverage: 80 },
        { name: 'Project', score: 27, totalMarks: 30, rank: 3, classAverage: 88 },
        { name: 'Final Exam', score: 85, totalMarks: 100, rank: 7, classAverage: 82 },
      ],
      overallScore: 85.3,
    },
    science: {
      exams: [
          { name: 'Lab Report 1', score: 23.75, totalMarks: 25, rank: 2, classAverage: 88 },
          { name: 'Mid-term', score: 45.5, totalMarks: 50, rank: 4, classAverage: 85 },
          { name: 'Lab Report 2', score: 24, totalMarks: 25, rank: 1, classAverage: 90 },
          { name: 'Final Exam', score: 93, totalMarks: 100, rank: 3, classAverage: 87 },
      ],
      overallScore: 93.1,
    },
  },
  "Alice Smith": {
    mathematics: {
      exams: [
        { name: 'Unit Test 1', score: 24, totalMarks: 25, rank: 1, classAverage: 78 },
        { name: 'Mid-term', score: 49, totalMarks: 50, rank: 1, classAverage: 82 },
        { name: 'Unit Test 2', score: 25, totalMarks: 25, rank: 1, classAverage: 80 },
        { name: 'Final Exam', score: 99, totalMarks: 100, rank: 1, classAverage: 85 },
      ],
      overallScore: 98.0,
    },
    history: {
      exams: [
        { name: 'Essay 1', score: 19, totalMarks: 20, rank: 2, classAverage: 85 },
        { name: 'Mid-term', score: 45, totalMarks: 50, rank: 3, classAverage: 80 },
        { name: 'Project', score: 29, totalMarks: 30, rank: 1, classAverage: 88 },
        { name: 'Final Exam', score: 94, totalMarks: 100, rank: 2, classAverage: 82 },
      ],
      overallScore: 93.3,
    },
  }
};


const chartConfig = {
  yourScore: {
    label: "Your Score",
    color: "hsl(var(--chart-1))",
  },
  classAverage: {
    label: "Class Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AcademicsPortalPage() {
  const { selectedStudent } = useStudent();
  const academicData = allAcademicData[selectedStudent.name as keyof typeof allAcademicData];

  if (!academicData) {
     return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Academic Performance for {selectedStudent.name}</h1>
            </div>
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Data Available</AlertTitle>
                <AlertDescription>
                    Academic performance data is not available for {selectedStudent.name}. Please select another student or check back later.
                </AlertDescription>
            </Alert>
        </div>
     )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Academic Performance for {selectedStudent.name}</h1>
      </div>
      <p className="text-muted-foreground">
        A detailed overview of exam results, ranks, and performance trends for each subject.
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {Object.entries(academicData).map(([subject, data]) => {
            const chartData = data.exams.map(exam => ({
                ...exam,
                yourScore: parseFloat(((exam.score / exam.totalMarks) * 100).toFixed(1)),
            }));
            
            return (
              <Card key={subject}>
                <AccordionItem value={subject} className="border-b-0">
                  <AccordionTrigger className="p-6 text-lg font-semibold capitalize hover:no-underline">
                    {subject}
                    <div className="text-sm font-medium text-muted-foreground mr-4">
                        Overall Score: <span className="font-bold text-foreground">{data.overallScore.toFixed(1)}%</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-4">Exam Results</h3>
                         <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Exam</TableHead>
                                  <TableHead className="text-center">Score</TableHead>
                                  <TableHead className="text-center">Class Average</TableHead>
                                  <TableHead className="text-right">Rank</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {[...data.exams].reverse().map((exam) => (
                                  <TableRow key={exam.name}>
                                    <TableCell className="font-medium">{exam.name}</TableCell>
                                    <TableCell className="text-center font-bold">{exam.score} / {exam.totalMarks}</TableCell>
                                    <TableCell className="text-center">{exam.classAverage}%</TableCell>
                                    <TableCell className="text-right font-semibold">{exam.rank}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                        </div>
                      </div>
                      <div>
                         <h3 className="font-semibold mb-4">Performance Trend</h3>
                         <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <LineChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 6)}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Legend />
                                <Line
                                    dataKey="yourScore"
                                    type="monotone"
                                    stroke="var(--color-yourScore)"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-yourScore)",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                    name="Your Score"
                                />
                                <Line
                                    dataKey="classAverage"
                                    type="monotone"
                                    stroke="var(--color-classAverage)"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    dot={false}
                                    name="Class Average"
                                />
                            </LineChart>
                        </ChartContainer>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            )
        })}
      </Accordion>
    </div>
  );
}
