import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitRealtimeEvent } from "@/lib/events";
import { z } from "zod";

const updateReportSchema = z.object({
  status: z.enum(["SUBMITTED", "TRIAGED", "ACCEPTED", "IN_PROGRESS", "RESOLVED", "DUPLICATE", "REJECTED"]).optional(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"]).optional(),
  cvssScore: z.number().min(0).max(10).optional(),
  bountyAmount: z.number().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await prisma.report.findFirst({
      where: {
        OR: [{ id }, { referenceId: id }],
      },
      include: {
        researcher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        program: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateReportSchema.parse(body);

    const report = await prisma.report.findFirst({
      where: {
        OR: [{ id }, { referenceId: id }],
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updated = await prisma.report.update({
      where: { id: report.id },
      data: validated,
      include: {
        researcher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        program: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
        },
      },
    });

    // If bounty was awarded, update researcher total
    if (validated.bountyAmount && validated.bountyAmount > (report.bountyAmount || 0)) {
      const diff = validated.bountyAmount - (report.bountyAmount || 0);
      await prisma.user.update({
        where: { id: report.researcherId },
        data: {
          bountyEarned: { increment: diff },
          reputation: { increment: 50 },
        },
      });
    }

    emitRealtimeEvent("report_updated", { report: updated });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating report:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await prisma.report.findFirst({
      where: {
        OR: [{ id }, { referenceId: id }],
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await prisma.report.delete({
      where: { id: report.id },
    });

    emitRealtimeEvent("report_deleted", { reportId: report.id, referenceId: report.referenceId });

    return NextResponse.json({ success: true, message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
