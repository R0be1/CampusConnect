
"use server";

import { revalidatePath } from "next/cache";
import { getFirstSchool, createCourse, updateCourse, deleteCourse } from "@/lib/data";

type CourseFormValues = {
  name: string;
  gradeId: string;
  sectionId: string;
  teacherId: string;
};

export async function createCourseAction(data: CourseFormValues) {
    const school = await getFirstSchool();
    if (!school) return { success: false, error: "No school found." };
    
    try {
        const newCourse = await createCourse({ ...data, schoolId: school.id });
        revalidatePath('/dashboard/settings/courses');
        return { success: true, newCourse };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "A course with this name for this class already exists." };
        }
        return { success: false, error: "Failed to create course." };
    }
}

export async function updateCourseAction(courseId: string, data: CourseFormValues) {
    try {
        const updatedCourse = await updateCourse(courseId, data);
        revalidatePath('/dashboard/settings/courses');
        return { success: true, updatedCourse };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { success: false, error: "A course with this name for this class already exists." };
        }
        return { success: false, error: "Failed to update course." };
    }
}

export async function deleteCourseAction(courseId: string) {
    try {
        await deleteCourse(courseId);
        revalidatePath('/dashboard/settings/courses');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: "Failed to delete course. It may be in use." };
    }
}
