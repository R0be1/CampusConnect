
"use client";

import { Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentList } from "./student-list";
import { StudentForm, StudentRegistrationFormValues } from "./student-form";

function StudentRegistration() {
  function onSubmit(data: StudentRegistrationFormValues) {
    console.log(data);
    alert("Student registered successfully! (Check browser console for data)");
  }

  return <StudentForm onSubmit={onSubmit} submitButtonText="Register Student" />;
}


export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Student Management</h1>
      </div>
      <Tabs defaultValue="view-students">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view-students">View Students</TabsTrigger>
            <TabsTrigger value="register-student">Register New Student</TabsTrigger>
        </TabsList>
        <TabsContent value="view-students">
            <StudentList />
        </TabsContent>
        <TabsContent value="register-student">
          <StudentRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
