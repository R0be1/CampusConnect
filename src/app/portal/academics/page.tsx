
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BookOpen } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const academicData = {
  mathematics: {
    exams: [
      { name: 'Unit Test 1', score: 85, rank: 5, classAverage: 78 },
      { name: 'Mid-term', score: 92, rank: 3, classAverage: 82 },
      { name: 'Unit Test 2', score: 88, rank: 4, classAverage: 80 },
      { name: 'Final Exam', score: 95, rank: 1, classAverage: 85 },
    ],
    overallGrade: 'A',
  },
  history: {
    exams: [
      { name: 'Essay 1', score: 88, rank: 5, classAverage: 85 },
      { name: 'Mid-term', score: 82, rank: 9, classAverage: 80 },
      { name: 'Project', score: 90, rank: 3, classAverage: 88 },
      { name: 'Final Exam', score: 85, rank: 7, classAverage: 82 },
    ],
    overallGrade: 'B+',
  },
  science: {
    exams: [
        { name: 'Lab Report 1', score: 95, rank: 2, classAverage: 88 },
        { name: 'Mid-term', score: 91, rank: 4, classAverage: 85 },
        { name: 'Lab Report 2', score: 96, rank: 1, classAverage: 90 },
        { name: 'Final Exam', score: 93, rank: 3, classAverage: 87 },
    ],
    overallGrade: 'A-',
  },
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
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Academic Performance</h1>
      </div>
      <p className="text-muted-foreground">
        A detailed overview of exam results, ranks, and performance trends for each subject.
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {Object.entries(academicData).map(([subject, data]) => (
          <Card key={subject}>
            <AccordionItem value={subject} className="border-b-0">
              <AccordionTrigger className="p-6 text-lg font-semibold capitalize hover:no-underline">
                {subject}
                <div className="text-sm font-medium text-muted-foreground mr-4">
                    Overall Grade: <span className="font-bold text-foreground">{data.overallGrade}</span>
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
                            {data.exams.map((exam) => (
                              <TableRow key={exam.name}>
                                <TableCell className="font-medium">{exam.name}</TableCell>
                                <TableCell className="text-center font-bold">{exam.score}</TableCell>
                                <TableCell className="text-center">{exam.classAverage}</TableCell>
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
                        <LineChart accessibilityLayer data={data.exams} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
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
                            />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Legend />
                            <Line
                                dataKey="score"
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
        ))}
      </Accordion>
    </div>
  );
}
