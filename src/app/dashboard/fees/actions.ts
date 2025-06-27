
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// --- Fee Structure Actions ---
export async function createFeeStructureAction(data: any, schoolId: string) {
    try {
        await prisma.feeStructure.create({
            data: {
                ...data,
                schoolId,
                amount: parseFloat(data.amount),
            },
        });
        revalidatePath("/dashboard/fees/structure");
        return { success: true, message: "Fee structure created." };
    } catch (e) {
        return { success: false, error: "Failed to create fee structure." };
    }
}
// Add update/delete later

// --- Penalty Rule Actions ---
export async function createPenaltyRuleAction(data: any, schoolId: string) {
    try {
        const { tiers, ...ruleData } = data;
        await prisma.penaltyRule.create({
            data: {
                ...ruleData,
                schoolId,
                gracePeriod: parseInt(ruleData.gracePeriod),
                tiers: {
                    create: tiers.map((t: any) => ({
                        fromDay: parseInt(t.fromDay),
                        toDay: t.toDay ? parseInt(t.toDay) : null,
                        value: parseFloat(t.value),
                        type: t.type,
                        frequency: t.frequency,
                    })),
                },
            },
        });
        revalidatePath("/dashboard/fees/structure");
        return { success: true, message: "Penalty rule created." };
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to create penalty rule." };
    }
}
// Add update/delete later

// --- Concession Actions ---
export async function createConcessionAction(data: any, schoolId: string) {
  try {
    const { applicableFeeStructureIds, ...concessionData } = data;
    await prisma.concession.create({
      data: {
        ...concessionData,
        schoolId,
        value: parseFloat(concessionData.value),
        feeStructures: {
          connect: applicableFeeStructureIds.map((id: string) => ({ id })),
        },
      },
    });
    revalidatePath('/dashboard/fees/concessions');
    return { success: true, message: 'Concession created successfully.' };
  } catch (error) {
    return { success: false, error: 'Failed to create concession.' };
  }
}

export async function updateConcessionAction(id: string, data: any) {
     try {
        const { applicableFeeStructureIds, ...concessionData } = data;
        await prisma.concession.update({
            where: { id },
            data: {
                ...concessionData,
                value: parseFloat(concessionData.value),
                feeStructures: {
                    set: applicableFeeStructureIds.map((id: string) => ({ id })),
                },
            }
        });
        revalidatePath('/dashboard/fees/concessions');
        return { success: true, message: 'Concession updated successfully.' };
    } catch (error) {
        return { success: false, error: 'Failed to update concession.' };
    }
}

export async function deleteConcessionAction(id: string) {
    try {
        await prisma.concession.delete({ where: { id } });
        revalidatePath('/dashboard/fees/concessions');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete concession.' };
    }
}


// --- Concession Assignment Actions ---
export async function assignConcessionAction(studentId: string, concessionId: string, academicYearId: string) {
    try {
        await prisma.concessionAssignment.create({
            data: { studentId, concessionId, academicYearId }
        });
        revalidatePath('/dashboard/fees/assign');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to assign concession. It may already be assigned."}
    }
}

export async function revokeConcessionAction(assignmentId: string) {
     try {
        await prisma.concessionAssignment.delete({ where: { id: assignmentId } });
        revalidatePath('/dashboard/fees/assign');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to revoke concession."}
    }
}
