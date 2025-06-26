
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, UserCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const sections = ['A', 'B', 'C', 'D'];

const studentsByClass: Record<string, { id: string; name: string }[]> = {
  "Grade 10-A": [
    { id: 's001', name: 'John Doe' },
    { id: 's003', name: 'Bob Johnson' },
    { id: 's006', name: 'Peter Parker' },
    { id: 's007', name: 'Bruce Wayne' },
    { id: 's009', name: 'Tony Stark' },
  ],
  "Grade 9-B": [
    { id: 's002', name: 'Alice Smith' },
    { id: 's005', name: 'Diana Prince' },
    { id: 's008', name: 'Clark Kent' },
    { id: 's011', name: 'Steve Rogers' },
  ],
};

type AttendanceStatus = "present" | "absent" | "late" | "excused";
type AttendanceRecord = {
  status: AttendanceStatus;
  notes: string;
};

type AttendanceState = {
  [studentId: string]: AttendanceRecord;
};

const attendanceSeedData: Record<string, AttendanceState> = {
  "Grade 10-A": {
    's001': { status: 'present', notes: '' },
    's003': { status: 'absent', notes: 'Doctor appointment' },
    's006': { status: 'late', notes: '' },
    's007': { status: 'present', notes: '' },
    's009': { status: 'excused', notes: 'Family event' },
  },
  "Grade 9-B": {
    's002': { status: 'present', notes: '' },
    's005': { status: 'present', notes: '' },
    's008': { status: 'late', notes: 'Traffic' },
    's011': { status: 'present', notes: '' },
  },
};


export function MarkAttendance() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchStudents = () => {
    if (selectedGrade && selectedSection) {
      setIsLoading(true);
      setHasSearched(true);
      setTimeout(() => {
        const classKey = `${selectedGrade}-${selectedSection}`;
        const fetchedStudents = studentsByClass[classKey] || [];
        setStudents(fetchedStudents);

        const seededAttendance = attendanceSeedData[classKey];
        const initialAttendance: AttendanceState = {};

        fetchedStudents.forEach(s => {
          initialAttendance[s.id] = (seededAttendance && seededAttendance[s.id])
            ? seededAttendance[s.id]
            : { status: 'present', notes: '' };
        });
        setAttendance(initialAttendance);
        
        setIsLoading(false);
      }, 500);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ 
        ...prev, 
        [studentId]: { ...prev[studentId], status } 
    }));
  };
  
  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance(prev => ({ 
        ...prev, 
        [studentId]: { ...prev[studentId], notes } 
    }));
  };

  const markAllAsPresent = () => {
    const newAttendance: AttendanceState = {};
    students.forEach(s => {
      newAttendance[s.id] = { status: 'present', notes: '' };
    });
    setAttendance(newAttendance);
  };
  
  const handleSave = () => {
      setIsSaving(true);
      console.log("Saving attendance:", attendance);
      setTimeout(() => {
          setIsSaving(false);
      }, 1000);
  };
  
  return (
      <Card>
        <CardHeader>
          <CardTitle>Mark Daily Attendance</CardTitle>
          <CardDescription>Select a class and date to mark attendance. Students are marked as 'Present' by default.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <Label>Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-1">
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-1">
               <Label>Date</Label>
               <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                      <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                        mode="single" 
                        selected={date} 
                        onSelect={(newDate) => {
                            setDate(newDate);
                            setIsDatePickerOpen(false);
                        }} 
                        initialFocus 
                    />
                    </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleFetchStudents} disabled={!selectedGrade || !selectedSection || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Loading...' : 'Load Class Roster'}
            </Button>
          </div>

          {students.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Roster for {selectedGrade}, Section {selectedSection}
                  </h3>
                  <Button variant="secondary" onClick={markAllAsPresent}>Mark All as Present</Button>
              </div>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-1 divide-y">
                      {students.map(student => (
                        <div key={student.id} className="p-4 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4">
                            <Avatar>
                                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                                <AvatarFallback>{student.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-medium">{student.name}</p>
                                {attendance[student.id]?.status === 'absent' && (
                                    <Input 
                                      placeholder="Reason for absence (optional)" 
                                      className="mt-2 h-8"
                                      value={attendance[student.id].notes}
                                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-self-start md:justify-self-end">
                                <Button size="sm" variant={attendance[student.id]?.status === 'present' ? 'default' : 'outline'} onClick={() => handleStatusChange(student.id, 'present')}>Present</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'absent' ? 'destructive' : 'outline'} onClick={() => handleStatusChange(student.id, 'absent')}>Absent</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'late' ? 'secondary' : 'outline'} onClick={() => handleStatusChange(student.id, 'late')}>Late</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'excused' ? 'outline' : 'outline'} className={cn(attendance[student.id]?.status === 'excused' && 'bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500')} onClick={() => handleStatusChange(student.id, 'excused')}>Excused</Button>
                            </div>
                        </div>
                      ))}
                  </div>
                </div>
            </div>
          )}

          {!isLoading && hasSearched && students.length === 0 && (
             <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertTitle>No Students Found</AlertTitle>
                <AlertDescription>
                  No students were found for {selectedGrade}, Section {selectedSection}. Please check the class roster or select a different class.
                </AlertDescription>
             </Alert>
          )}

        </CardContent>
         {students.length > 0 && (
            <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSave} disabled={isSaving}>
                     {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
            </CardFooter>
        )}
      </Card>
  );
}
