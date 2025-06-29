
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFirstSchool } from "@/lib/data";

// --- Fee Structure Actions ---
export async function createFeeStructureAction(data: any, schoolId: string) {
    try {
        await prisma.feeStructure.create({
            data: {
                name: data.name,
                amount: parseFloat(data.amount),
                interval: data.interval,
                schoolId,
                penaltyRuleId: data.penaltyRuleId === 'None' ? null : data.penaltyRuleId,
            },
        });
        revalidatePath("/dashboard/fees/structure");
        return { success: true, message: "Fee structure created." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to create fee structure." };
    }
}
export async function updateFeeStructureAction(id: string, data: any) {
    try {
        await prisma.feeStructure.update({
            where: { id },
            data: {
                name: data.name,
                amount: parseFloat(data.amount),
                interval: data.interval,
                penaltyRuleId: data.penaltyRuleId === 'None' ? null : data.penaltyRuleId,
            },
        });
        revalidatePath("/dashboard/fees/structure");
        return { success: true, message: "Fee structure updated." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to update fee structure." };
    }
}

export async function deleteFeeStructureAction(id: string) {
    try {
        await prisma.feeStructure.delete({ where: { id } });
        revalidatePath("/dashboard/fees/structure");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete fee structure. It may be in use." };
    }
}

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
        console.error(e);
        return { success: false, error: e.message || "Failed to create penalty rule." };
    }
}

export async function updatePenaltyRuleAction(id: string, data: any) {
    try {
        const { tiers, ...ruleData } = data;
        await prisma.penaltyRule.update({
            where: { id },
            data: {
                ...ruleData,
                gracePeriod: parseInt(ruleData.gracePeriod),
                tiers: {
                    deleteMany: {}, // Delete existing tiers
                    create: tiers.map((t: any) => ({ // Re-create with new data
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
        return { success: true, message: "Penalty rule updated." };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || "Failed to update penalty rule." };
    }
}

export async function deletePenaltyRuleAction(id: string) {
    try {
        await prisma.penaltyRule.delete({ where: { id } });
        revalidatePath("/dashboard/fees/structure");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete penalty rule. It may be in use." };
    }
}

// --- Concession Actions ---
export async function createConcessionAction(data: any, schoolId: string) {
  try {
    const { name, type, value, description, applicableFeeStructureIds } = data;
    await prisma.concession.create({
      data: {
        name,
        type,
        value: parseFloat(value),
        description,
        schoolId,
        feeStructures: {
          connect: applicableFeeStructureIds.map((id: string) => ({ id })),
        },
      },
    });
    revalidatePath('/dashboard/fees/concessions');
    return { success: true, message: 'Concession created successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create concession.' };
  }
}

export async function updateConcessionAction(id: string, data: any) {
     try {
        const { name, type, value, description, applicableFeeStructureIds } = data;
        await prisma.concession.update({
            where: { id },
            data: {
                name,
                type,
                value: parseFloat(value),
                description,
                feeStructures: {
                    set: applicableFeeStructureIds.map((id: string) => ({ id })),
                },
            }
        });
        revalidatePath('/dashboard/fees/concessions');
        return { success: true, message: 'Concession updated successfully.' };
    } catch (error) {
        console.error(error);
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
        // Prevent duplicate assignments
        const existing = await prisma.concessionAssignment.findFirst({
            where: { studentId, concessionId, academicYearId }
        });
        if(existing) {
            return { success: false, error: "This concession is already assigned to this student for this year."}
        }
        await prisma.concessionAssignment.create({
            data: { studentId, concessionId, academicYearId }
        });
        revalidatePath('/dashboard/fees/assign');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: "Failed to assign concession."}
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

// --- Payment Actions ---
export async function submitPaymentForVerificationAction(data: {
    invoiceId: string;
    amount: number;
    method: string;
    reference: string;
}) {
    try {
        const school = await getFirstSchool();
        if (!school) throw new Error("School not found");
        
        await prisma.feePayment.create({
            data: {
                ...data,
                paymentDate: new Date(),
                schoolId: school.id,
                status: 'PENDING_VERIFICATION'
            }
        });

        revalidatePath("/dashboard/fees/invoices");
        return { success: true, message: "Payment submitted for verification." };
    } catch (e: any) {
        console.error("Failed to submit payment:", e);
        return { success: false, error: "Failed to submit payment." };
    }
}
