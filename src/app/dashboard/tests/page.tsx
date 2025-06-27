import { getFirstSchool, getTests, getGrades, getSections } from "@/lib/data";
import { redirect } from "next/navigation";
import { TestsClient } from "./tests-client";

export default async function TestsPage() {
  const school = await getFirstSchool();
  if (!school) {
    redirect('/system-admin/schools');
  }

  const [tests, grades, sections] = await Promise.all([
      getTests(school.id),
      getGrades(school.id),
      getSections(school.id)
  ]);
  
  return <TestsClient initialTests={tests} grades={grades} sections={sections} />;
}
