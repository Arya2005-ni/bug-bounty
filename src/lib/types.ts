export type UserRole = "RESEARCHER" | "TRIAGER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  bountyEarned: number;
  reputation: number;
}

export interface Program {
  id: string;
  name: string;
  handle: string;
  scope: string;
  rules: string;
  minBounty: number;
  maxBounty: number;
}

export interface Comment {
  id: string;
  reportId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string | null;
  };
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  referenceId: string;
  title: string;
  description: string;
  asset: string;
  vulnerabilityType: string;
  cvssVector: string;
  cvssScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  status: "SUBMITTED" | "TRIAGED" | "ACCEPTED" | "IN_PROGRESS" | "RESOLVED" | "DUPLICATE" | "REJECTED";
  poc?: string | null;
  stepsToReproduce: string;
  bountyAmount?: number | null;
  researcherId: string;
  researcher: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  programId: string;
  program: {
    id: string;
    name: string;
    handle: string;
  };
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStats {
  totalReports: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  avgCvss: number;
  resolvedCount: number;
  inProgressCount: number;
  triagedCount: number;
  openCount: number;
  totalBountiesPaid: number;
}

export type RealtimeEventType =
  | "connected"
  | "heartbeat"
  | "report_created"
  | "report_updated"
  | "report_deleted"
  | "comment_added"
  | "stats_updated";

export interface RealtimeMessage {
  type: RealtimeEventType;
  data: any;
  timestamp: string;
}

export interface RealtimeToast {
  id: string;
  type: RealtimeEventType;
  title: string;
  message: string;
  badge?: string;
  timestamp: Date;
}
