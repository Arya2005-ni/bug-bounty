/**
 * FIRST CVSS v3.1 Base Score Calculator
 */

export interface CvssMetrics {
  av: "N" | "A" | "L" | "P"; // Attack Vector
  ac: "L" | "H";             // Attack Complexity
  pr: "N" | "L" | "H";       // Privileges Required
  ui: "N" | "R";             // User Interaction
  s: "U" | "C";              // Scope
  c: "H" | "L" | "N";        // Confidentiality
  i: "H" | "L" | "N";        // Integrity
  a: "H" | "L" | "N";        // Availability
}

export interface CvssResult {
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  vector: string;
}

export function calculateCvss(metrics: CvssMetrics): CvssResult {
  const avWeights = { N: 0.85, A: 0.62, L: 0.55, P: 0.20 };
  const acWeights = { L: 0.77, H: 0.44 };
  const uiWeights = { N: 0.85, R: 0.62 };

  let prWeight = 0.85;
  if (metrics.s === "U") {
    if (metrics.pr === "N") prWeight = 0.85;
    else if (metrics.pr === "L") prWeight = 0.62;
    else if (metrics.pr === "H") prWeight = 0.27;
  } else {
    if (metrics.pr === "N") prWeight = 0.85;
    else if (metrics.pr === "L") prWeight = 0.68;
    else if (metrics.pr === "H") prWeight = 0.50;
  }

  const cWeights = { H: 0.56, L: 0.22, N: 0.00 };
  const iWeights = { H: 0.56, L: 0.22, N: 0.00 };
  const aWeights = { H: 0.56, L: 0.22, N: 0.00 };

  const iss = 1 - ((1 - cWeights[metrics.c]) * (1 - iWeights[metrics.i]) * (1 - aWeights[metrics.a]));
  
  let impact = 0;
  if (metrics.s === "U") {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow((iss - 0.02), 15);
  }

  const exploitability = 8.22 * avWeights[metrics.av] * acWeights[metrics.ac] * prWeight * uiWeights[metrics.ui];

  let baseScore = 0;
  if (impact <= 0) {
    baseScore = 0.0;
  } else {
    if (metrics.s === "U") {
      baseScore = Math.min(impact + exploitability, 10);
    } else {
      baseScore = Math.min(1.08 * (impact + exploitability), 10);
    }
    // Round up to 1 decimal place (FIRST specification)
    baseScore = Math.ceil(baseScore * 10) / 10;
  }

  let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE" = "NONE";
  if (baseScore >= 9.0) severity = "CRITICAL";
  else if (baseScore >= 7.0) severity = "HIGH";
  else if (baseScore >= 4.0) severity = "MEDIUM";
  else if (baseScore >= 0.1) severity = "LOW";

  const vector = `CVSS:3.1/AV:${metrics.av}/AC:${metrics.ac}/PR:${metrics.pr}/UI:${metrics.ui}/S:${metrics.s}/C:${metrics.c}/I:${metrics.i}/A:${metrics.a}`;

  return {
    score: baseScore,
    severity,
    vector,
  };
}
