import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitRealtimeEvent } from "@/lib/events";
import { z } from "zod";

const createReportSchema = z.object({
  title: z.string().min(3),
  asset: z.string().min(3),
  vulnerabilityType: z.string().min(2),
  cvssVector: z.string(),
  cvssScore: z.number().min(0).max(10),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"]),
  description: z.string().min(5),
  stepsToReproduce: z.string().min(5),
  poc: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const severity = searchParams.get("severity") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const researcherId = searchParams.get("researcherId");

    const where: any = {};

    if (severity !== "ALL") {
      where.severity = severity.toUpperCase();
    }

    if (status !== "ALL") {
      where.status = status.toUpperCase();
    }

    if (researcherId) {
      where.researcherId = researcherId;
    }

    if (search) {
      where.OR = [
        { referenceId: { contains: search } },
        { title: { contains: search } },
        { asset: { contains: search } },
        { vulnerabilityType: { contains: search } },
      ];
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        researcher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        program: {
          select: { id: true, name: true, handle: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createReportSchema.parse(body);

    // Get default researcher and program
    let researcher = await prisma.user.findFirst({
      where: { role: "RESEARCHER" },
    });

    if (!researcher) {
      researcher = await prisma.user.create({
        data: {
          name: "Security Researcher",
          email: "researcher@example.com",
          role: "RESEARCHER",
          avatar: "👨‍💻",
        },
      });
    }

    let program = await prisma.program.findFirst();
    if (!program) {
      program = await prisma.program.create({
        data: {
          name: "Acme Cloud Infrastructure",
          handle: "acme-cloud",
          scope: "*.example.com",
          rules: "Standard disclosure",
        },
      });
    }

    // Generate unique reference ID (e.g. BB-011)
    const count = await prisma.report.count();
    const referenceId = `BB-${String(count + 1).padStart(3, "0")}`;

    const newReport = await prisma.report.create({
      data: {
        referenceId,
        title: validated.title,
        asset: validated.asset,
        vulnerabilityType: validated.vulnerabilityType,
        cvssVector: validated.cvssVector,
        cvssScore: validated.cvssScore,
        severity: validated.severity,
        status: "SUBMITTED",
        description: validated.description,
        stepsToReproduce: validated.stepsToReproduce,
        poc: validated.poc || null,
        researcherId: researcher.id,
        programId: program.id,
      },
      include: {
        researcher: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        program: {
          select: { id: true, name: true, handle: true },
        },
      },
    });

    emitRealtimeEvent("report_created", { report: newReport });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    console.error("Error creating report:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
