
"use client";

import { useSchool } from "@/context/school-context";
import { StudentForm, StudentRegistrationFormValues } from "../student-form";

function StudentRegistration() {
  const { currentSchool } = useSchool();

  function onSubmit(data: StudentRegistrationFormValues) {
    const dataWithSchool = { ...data, schoolId: currentSchool.id };
    console.log(dataWithSchool);
    alert("Student registered successfully! (Check browser console for data)");
  }

  return <StudentForm onSubmit={onSubmit} submitButtonText="Register Student" />;
}

export default function RegisterStudentPage() {
    return (
        <StudentRegistration />
    );
}
