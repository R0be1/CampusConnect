
"use server";

import { revalidatePath } from "next/cache";
import { createTestWithQuestions, deleteTest, approveTestSubmission, approveAllTestSubmissions, updateTestStatus } from "@/lib/data";

// Action for creating a test
export async function createTestAction(data: any, schoolId: string, teacherId: string) {
    try {
        await createTestWithQuestions(data, schoolId, teacherId);
        revalidatePath('/dashboard/tests');
        return { success: true, message: `Test "${data.name}" created successfully.` };
    } catch (error) {
        console.error("Failed to create test:", error);
        return { success: false, error: "Failed to create the test." };
    }
}

// Action for updating test status
export async function updateTestStatusAction(testId: string, status: string) {
    try {
        await updateTestStatus(testId, status);
        revalidatePath('/dashboard/tests');
        return { success: true, message: `Test status updated to ${status}.` };
    } catch (error) {
        console.error("Failed to update test status:", error);
        return { success: false, error: "Failed to update test status." };
    }
}

// Action for deleting a test
export async function deleteTestAction(testId: string) {
    try {
        await deleteTest(testId);
        revalidatePath('/dashboard/tests');
        return { success: true, message: "Test deleted successfully." };
    } catch (error) {
        console.error("Failed to delete test:", error);
        return { success: false, error: "Failed to delete test." };
    }
}

// Action for approving a single submission
export async function approveSubmissionAction(submissionId: string, testId: string) {
    try {
        await approveTestSubmission(submissionId);
        revalidatePath(`/dashboard/tests/${testId}/submissions`);
        return { success: true, message: "Submission approved." };
    } catch (error) {
        console.error("Failed to approve submission:", error);
        return { success: false, error: "Failed to approve submission." };
    }
}

// Action for approving all submissions for a test
export async function approveAllSubmissionsAction(testId: string) {
    try {
        await approveAllTestSubmissions(testId);
        revalidatePath(`/dashboard/tests/${testId}/submissions`);
        return { success: true, message: "All pending submissions approved." };
    } catch (error) {
        console.error("Failed to approve all submissions:", error);
        return { success: false, error: "Failed to approve all submissions." };
    }
}
