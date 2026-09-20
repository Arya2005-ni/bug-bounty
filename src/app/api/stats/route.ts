import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      select: {
        severity: true,
        status: true,
        cvssScore: true,
        bountyAmount: true,
      },
    });

    const totalReports = reports.length;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let cvssSum = 0;
    let resolvedCount = 0;
    let inProgressCount = 0;
    let triagedCount = 0;
    let openCount = 0;
    let totalBountiesPaid = 0;

    reports.forEach((r) => {
      cvssSum += r.cvssScore;
      if (r.severity === "CRITICAL") criticalCount++;
      else if (r.severity === "HIGH") highCount++;
      else if (r.severity === "MEDIUM") mediumCount++;
      else if (r.severity === "LOW") lowCount++;

      if (r.status === "RESOLVED") resolvedCount++;
      else if (r.status === "IN_PROGRESS") inProgressCount++;
      else if (r.status === "TRIAGED") triagedCount++;
      else if (r.status === "SUBMITTED" || r.status === "ACCEPTED") openCount++;

      if (r.bountyAmount) totalBountiesPaid += r.bountyAmount;
    });

    const avgCvss = totalReports > 0 ? Number((cvssSum / totalReports).toFixed(2)) : 0;

    return NextResponse.json({
      totalReports,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgCvss,
      resolvedCount,
      inProgressCount,
      triagedCount,
      openCount,
      totalBountiesPaid,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to calculate stats" }, { status: 500 });
  }
}
