import { getFirstSchool, getFirstStudent, getAcademicYears, getCurrentAcademicYear, getGradesForStudent, getScoresForStudent } from "@/lib/data";
import AcademicsClientPage from "./academics-client";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function AcademicsPage({ searchParams }: { searchParams?: { year?: string } }) {
  const school = await getFirstSchool();
  if (!school) {
    redirect('/system-admin/schools'); // Or show an error
  }
  
  // For now, we'll fetch data for the first student to demonstrate.
  const student = await getFirstStudent(school.id);
  
  const availableYears = await getAcademicYears(school.id);
  if (availableYears.length === 0) {
    return <Alert><Info className="h-4 w-4" /><AlertTitle>No Academic Years Found</AlertTitle><AlertDescription>Please create an academic year in the settings to view this page.</AlertDescription></Alert>
  }
  
  if (!student) {
    return <Alert><Info className="h-4 w-4" /><AlertTitle>No Students Found</AlertTitle><AlertDescription>Please register a student to view academic data.</AlertDescription></Alert>
  }

  const currentYear = await getCurrentAcademicYear(school.id);
  const selectedYearName = searchParams?.year || currentYear?.name || availableYears[0]?.name;
  
  const selectedYear = availableYears.find(y => y.name === selectedYearName);

  const gradesData = selectedYear ? await getGradesForStudent(student.id, selectedYear.id) : [];
  // The second parameter to getScoresForStudent is for future use when the schema is updated.
  const scoresData = selectedYear ? await getScoresForStudent(student.id, selectedYear.id) : [];

  return (
    <AcademicsClientPage 
      gradesData={gradesData}
      scoresData={scoresData}
      availableYears={availableYears}
      selectedYear={selectedYearName}
    />
  );
}
