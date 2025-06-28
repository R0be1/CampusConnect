
"use client";

import { useState, useEffect } from "react";
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
import type { Grade, Section } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { getClassRosterAction, saveAttendanceAction, AttendanceState, AttendanceStatus } from "./actions";

type MarkAttendanceProps = {
  grades: Grade[];
  sections: Section[];
}

export function MarkAttendance({ grades, sections }: MarkAttendanceProps) {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (selectedGrade) {
        setFilteredSections(sections.filter(s => s.gradeId === selectedGrade));
        setSelectedSection("");
    } else {
        setFilteredSections([]);
    }
  }, [selectedGrade, sections]);

  const handleFetchStudents = async () => {
    if (selectedGrade && selectedSection && date) {
      setIsLoading(true);
      setHasSearched(true);
      
      const result = await getClassRosterAction(selectedGrade, selectedSection, date);
      if (result.success && result.roster) {
        setStudents(result.roster);
        
        const initialAttendance: AttendanceState = {};
        result.roster.forEach(s => {
          initialAttendance[s.id] = (result.attendance && result.attendance[s.id])
            ? result.attendance[s.id]
            : { status: 'PRESENT', notes: '' };
        });
        setAttendance(initialAttendance);

      } else {
         toast({ title: "Error", description: result.error, variant: "destructive" });
      }

      setIsLoading(false);
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
      newAttendance[s.id] = { status: 'PRESENT', notes: '' };
    });
    setAttendance(newAttendance);
  };
  
  const handleSave = async () => {
      if (!date) return;
      setIsSaving(true);
      const result = await saveAttendanceAction(attendance, date);
      if(result.success) {
          toast({ title: "Success", description: result.message });
      } else {
          toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setIsSaving(false);
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
                <SelectContent>{grades.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-1">
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedGrade}>
                <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>{filteredSections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
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
                    Roster for {grades.find(g => g.id === selectedGrade)?.name}, Section {sections.find(s => s.id === selectedSection)?.name}
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
                                {attendance[student.id]?.status === 'ABSENT' && (
                                    <Input 
                                      placeholder="Reason for absence (optional)" 
                                      className="mt-2 h-8"
                                      value={attendance[student.id].notes}
                                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-self-start md:justify-self-end">
                                <Button size="sm" variant={attendance[student.id]?.status === 'PRESENT' ? 'default' : 'outline'} onClick={() => handleStatusChange(student.id, 'PRESENT')}>Present</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'ABSENT' ? 'destructive' : 'outline'} onClick={() => handleStatusChange(student.id, 'ABSENT')}>Absent</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'LATE' ? 'secondary' : 'outline'} onClick={() => handleStatusChange(student.id, 'LATE')}>Late</Button>
                                <Button size="sm" variant={attendance[student.id]?.status === 'EXCUSED' ? 'outline' : 'outline'} className={cn(attendance[student.id]?.status === 'EXCUSED' && 'bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500')} onClick={() => handleStatusChange(student.id, 'EXCUSED')}>Excused</Button>
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
                  No students were found for the selected grade and section. Please check the class roster or select a different class.
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
