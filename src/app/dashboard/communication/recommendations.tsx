
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

type HistoryData = {
  id: string;
  sentAt: Date;
  date: string;
  student: string;
  subject: string;
  sentBy: string;
};

type CommunicationHistoryProps = {
    communicationHistoryData: HistoryData[];
};

export function CommunicationHistory({ communicationHistoryData }: CommunicationHistoryProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filteredData, setFilteredData] = useState(communicationHistoryData);

  useEffect(() => {
    let data = communicationHistoryData;

    if (studentSearch) {
      data = data.filter(item => item.student.toLowerCase().includes(studentSearch.toLowerCase()));
    }

    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from.setHours(0, 0, 0, 0));
      const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : new Date(dateRange.from.setHours(23, 59, 59, 999));
      
      data = data.filter(item => {
        const itemDate = new Date(item.sentAt);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    setFilteredData(data);
  }, [studentSearch, dateRange, communicationHistoryData]);
  
  const resetFilters = () => {
    setStudentSearch("");
    setDateRange(undefined);
  }

  const isFiltered = studentSearch !== "" || dateRange !== undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Sent Messages</CardTitle>
                <CardDescription>A log of all communications sent to parents.</CardDescription>
            </div>
             <div className="flex items-center gap-2">
                {isFiltered && (
                    <Button variant="ghost" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-search">Search by Student Name</Label>
                            <Input
                                id="student-search"
                                placeholder="John Doe..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Filter by Date Range</Label>
                             <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                className="rounded-md border"
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear() - 5}
                                toYear={new Date().getFullYear()}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sent By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((msg) => (
                    <TableRow key={msg.id}>
                    <TableCell>{msg.date}</TableCell>
                    <TableCell className="font-medium">{msg.student}</TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>{msg.sentBy}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No sent messages found for the selected filters.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
