
"use client";

import { StudentForm, StudentRegistrationFormValues } from "../student-form";

function StudentRegistration() {
  function onSubmit(data: StudentRegistrationFormValues) {
    console.log(data);
    alert("Student registered successfully! (Check browser console for data)");
  }

  return <StudentForm onSubmit={onSubmit} submitButtonText="Register Student" />;
}

export default function RegisterStudentPage() {
    return (
        <StudentRegistration />
    );
}
