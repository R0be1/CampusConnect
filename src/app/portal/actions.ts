
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAcademicYear, getFirstSchool, getPortalDashboardData, getAcademicDataForStudentPortal, getAttendanceForStudentPortal, getInvoicesForStudent, getPaymentHistory, getCommunicationsForParentPortal, markCommunicationAsRead as markAsReadDb, getTestsForStudentPortal, getTestDetailsForStudent, submitTestForStudent, getTestResultForStudent, getLearningMaterialsForPortal, getLiveSessionsForPortal, registerForLiveSession, getProfileDataForPortal, updateParentContactInfo, updateParentAddress, getParentsWithChildrenForPortal } from "@/lib/data";
import { format } from "date-fns";

export async function getParentsAndChildrenAction() {
    try {
        const parents = await getParentsWithChildrenForPortal();
        return { success: true, parents };
    } catch (error: any) {
        console.error("Failed to fetch parents and children:", error);
        return { success: false, error: "Failed to fetch parents and children." };
    }
}

export async function getDashboardDataAction(studentId: string) {
  try {
    if (!studentId) {
        return { success: false, error: "Student ID is required." };
    }
    const school = await getFirstSchool();
    if (!school) throw new Error("School not found");
    
    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) throw new Error("Current academic year not set");

    const data = await getPortalDashboardData(studentId, academicYear.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get dashboard data:", error);
    return { success: false, error: error.message || "Failed to fetch dashboard data." };
  }
}

export async function getAcademicsAction(studentId: string) {
  try {
    if (!studentId) {
        return { success: false, error: "Student ID is required." };
    }
    const school = await getFirstSchool();
    if (!school) throw new Error("School not found");
    
    const academicYear = await getCurrentAcademicYear(school.id);
    if (!academicYear) throw new Error("Current academic year not set");

    const data = await getAcademicDataForStudentPortal(studentId, academicYear.id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to get academics data:", error);
    return { success: false, error: error.message || "Failed to fetch academics data." };
  }
}
export type PortalAcademicsData = Awaited<ReturnType<typeof getAcademicDataForStudentPortal>>;

export async function getAttendanceAction(studentId: string, month: number, year: number) {
    try {
        if (!studentId) {
            return { success: false, error: "Student ID is required." };
        }
        const data = await getAttendanceForStudentPortal(studentId, month, year);
        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to get attendance data:", error);
        return { success: false, error: "Failed to fetch attendance data." };
    }
}
export type PortalAttendanceData = Awaited<ReturnType<typeof getAttendanceForStudentPortal>>;

export async function getFeesDataAction(studentId: string) {
    try {
        if (!studentId) {
            return { success: false, error: "Student ID is required." };
        }
        const invoices = await getInvoicesForStudent(studentId);
        const paymentHistory = await getPaymentHistory(studentId);
        return { success: true, data: { invoices, paymentHistory } };
    } catch (error: any) {
        console.error("Failed to get fees data:", error);
        return { success: false, error: "Failed to fetch fees data." };
    }
}
export type PortalFeesData = {
    invoices: Awaited<ReturnType<typeof getInvoicesForStudent>>;
    paymentHistory: Awaited<ReturnType<typeof getPaymentHistory>>;
};

export async function getCommunicationAction(studentId: string) {
    try {
        if (!studentId) {
            return { success: false, error: "Student ID is required." };
        }
        const communications = await getCommunicationsForParentPortal(studentId);
        return { success: true, data: communications };
    } catch (error: any) {
        console.error("Failed to get communications:", error);
        return { success: false, error: error.message || "Failed to fetch communications." };
    }
}
export type PortalCommunicationData = Awaited<ReturnType<typeof getCommunicationsForParentPortal>>;


export async function markCommunicationReadAction(communicationId: string) {
    try {
        await markAsReadDb(communicationId);
        // No need to revalidate path here as it's a client-side update
        return { success: true };
    } catch (error: any) {
        console.error("Failed to mark communication as read:", error);
        return { success: false, error: error.message || "Failed to mark as read." };
    }
}

export async function getTestsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestsForStudentPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch tests." };
    }
}
export type PortalTestsData = Awaited<ReturnType<typeof getTestsForStudentPortal>>;

export async function getTestDetailsAction(testId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestDetailsForStudent(testId, studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch test details." };
    }
}
export type PortalTestDetailsData = NonNullable<Awaited<ReturnType<typeof getTestDetailsForStudent>>>;


export async function submitTestAction(testId: string, studentId: string, answers: { questionId: string, answer: string }[]) {
     try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const submission = await submitTestForStudent(testId, studentId, answers);
        return { success: true, submissionId: submission.id };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to submit test." };
    }
}

export async function getTestResultAction(testId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getTestResultForStudent(testId, studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch test results." };
    }
}
export type PortalTestResultData = Awaited<ReturnType<typeof getTestResultForStudent>>;

export async function getELearningMaterialsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getLearningMaterialsForPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch e-learning materials." };
    }
}
export type PortalELearningData = Awaited<ReturnType<typeof getLearningMaterialsForPortal>>;

export async function getLiveSessionsAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getLiveSessionsForPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch live sessions." };
    }
}

export async function registerForSessionAction(sessionId: string, studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        await registerForLiveSession(sessionId, studentId);
        return { success: true, message: "Successfully registered for the session!" };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to register for the session." };
    }
}

export async function getProfileAction(studentId: string) {
    try {
        if (!studentId) return { success: false, error: "Student ID is required." };
        const data = await getProfileDataForPortal(studentId);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch profile data." };
    }
}
export type PortalProfileData = NonNullable<Awaited<ReturnType<typeof getProfileDataForPortal>>>;


export async function updateParentContactAction(userId: string, data: { phone: string }) {
    try {
        await updateParentContactInfo(userId, data);
        revalidatePath('/portal/profile');
        return { success: true, message: "Contact info updated successfully." };
    } catch (error: any) {
        return { success: false, error: "Failed to update contact info." };
    }
}

export async function updateParentAddressAction(userId: string, data: { line1: string; city: string; state: string; zipCode: string }) {
    try {
        await updateParentAddress(userId, data);
        revalidatePath('/portal/profile');
        return { success: true, message: "Address updated successfully." };
    } catch (error: any) {
        return { success: false, error: "Failed to update address." };
    }
}
