import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitRealtimeEvent } from "@/lib/events";
import { z } from "zod";

const createCommentSchema = z.object({
  reportId: z.string(),
  body: z.string().min(1),
  isInternal: z.boolean().default(false),
  role: z.enum(["RESEARCHER", "TRIAGER", "ADMIN"]).default("TRIAGER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // Find user matching role
    let author = await prisma.user.findFirst({
      where: { role: validated.role },
    });

    if (!author) {
      author = await prisma.user.create({
        data: {
          name: validated.role === "TRIAGER" ? "Security Triager" : validated.role === "ADMIN" ? "SecOps Admin" : "Security Researcher",
          email: `${validated.role.toLowerCase()}@cyberscope.io`,
          role: validated.role,
          avatar: validated.role === "TRIAGER" ? "🛡️" : validated.role === "ADMIN" ? "⚡" : "👨‍💻",
        },
      });
    }

    // Resolve target report by id or referenceId
    const targetReport = await prisma.report.findFirst({
      where: { OR: [{ id: validated.reportId }, { referenceId: validated.reportId }] },
    });

    if (!targetReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        reportId: targetReport.id,
        authorId: author.id,
        body: validated.body,
        isInternal: validated.isInternal,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
      },
    });

    emitRealtimeEvent("comment_added", {
      comment,
      reportId: targetReport.id,
      referenceId: targetReport.referenceId,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
