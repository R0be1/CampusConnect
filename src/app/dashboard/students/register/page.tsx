
"use client";

import { useSchool } from "@/context/school-context";
import { StudentForm, StudentRegistrationFormValues } from "../student-form";
import { registerStudentAction } from "../actions";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Grade, Section } from "@prisma/client";
import { getFirstSchool, getGrades, getSections } from "@/lib/data";

type StudentRegistrationProps = {
    grades: Grade[];
    sections: Section[];
    schoolId: string;
}

function StudentRegistrationClient({ grades, sections, schoolId }: StudentRegistrationProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: StudentRegistrationFormValues, resetForm: () => void) {
    startTransition(async () => {
      const result = await registerStudentAction(data, schoolId);
      if (result.success) {
        toast({
          title: "Student Registered",
          description: result.message,
        });
        resetForm();
      } else {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <StudentForm 
        onSubmit={onSubmit} 
        submitButtonText={isPending ? "Registering..." : "Register Student"} 
        isSubmitting={isPending}
        grades={grades}
        sections={sections}
    />
    );
}


export default async function RegisterStudentPage() {
    const school = await getFirstSchool();
    if (!school) return <div>No school found. Please create a school first.</div>;
    
    const grades = await getGrades(school.id);
    const sections = await getSections(school.id);

    return (
        <StudentRegistrationClient grades={grades} sections={sections} schoolId={school.id} />
    );
}

