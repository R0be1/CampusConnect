
"use client";

import { StudentForm, StudentRegistrationFormValues } from "../student-form";
import { registerStudentAction } from "../actions";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Grade, Section } from "@prisma/client";

type StudentRegistrationProps = {
    grades: Grade[];
    sections: Section[];
    schoolId: string;
}

export default function RegistrationForm({ grades, sections, schoolId }: StudentRegistrationProps) {
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
