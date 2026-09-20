/**
 * CyberScope Bug Bounty Vulnerability Assessment Dashboard
 * Vanilla JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Initial Dataset (BB-001 through BB-008)
  // =========================================================================
  const DEFAULT_FINDINGS = [
    {
      id: 'BB-001',
      title: 'SQL Injection in Login API',
      asset: 'api.example.com/auth/login',
      type: 'SQL Injection',
      cvss: 9.8,
      severity: 'Critical',
      status: 'Resolved',
      date: '2026-10-14',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      description: 'Unsanitized user credentials concatenated into SQL statement allowed full authentication bypass and arbitrary database queries.',
      impact: 'Complete confidentiality and integrity loss. Direct database administrative access and exfiltration of user tables.',
      remediation: 'Use parameterized queries / prepared statements. Enforce strict input validation using schema validators.'
    },
    {
      id: 'BB-002',
      title: 'Broken Access Control on Admin Panel',
      asset: 'admin.example.com',
      type: 'Broken Access Control',
      cvss: 9.1,
      severity: 'Critical',
      status: 'In Progress',
      date: '2026-10-16',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
      description: 'Administrative portal accessible without proper role verification when requests omit the role authorization header.',
      impact: 'Adversary can access tenant management console, manipulate organization roles, and disable safety logging.',
      remediation: 'Implement server-side role-based access control (RBAC) middleware verifying session tokens before rendering admin routes.'
    },
    {
      id: 'BB-003',
      title: 'Stored XSS in Comment Field',
      asset: 'app.example.com/comments',
      type: 'Cross-Site Scripting',
      cvss: 8.3,
      severity: 'High',
      status: 'Open',
      date: '2026-10-18',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:L/A:N',
      description: 'Persistent script payload stored within article comment section renders unescaped in all visitor and moderator sessions.',
      impact: 'Session hijacking, administrative token exfiltration, and unauthorized client-side state changes.',
      remediation: 'Apply context-aware HTML entity encoding on output and configure Content-Security-Policy (CSP) headers.'
    },
    {
      id: 'BB-004',
      title: 'IDOR in User Profile API',
      asset: 'api.example.com/users/{id}',
      type: 'IDOR',
      cvss: 8.1,
      severity: 'High',
      status: 'Triaged',
      date: '2026-10-21',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
      description: 'Sequential user ID parameter enumeration allows any authenticated user to view and modify another tenant’s profile and PII.',
      impact: 'Mass exposure of user PII including phone numbers, physical addresses, and tax identifiers.',
      remediation: 'Validate object authorization on every request. Migrate sequential integer IDs to non-enumerable UUIDv4.'
    },
    {
      id: 'BB-005',
      title: 'Sensitive Data Exposure via Backup File',
      asset: 'files.example.com/backup.zip',
      type: 'Sensitive Data Exposure',
      cvss: 7.5,
      severity: 'High',
      status: 'Resolved',
      date: '2026-10-23',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      description: 'Publicly readable system backup archive containing database dump, environment configuration variables, and private API keys.',
      impact: 'Exposure of production database schema, password hashes, and third-party API master secrets.',
      remediation: 'Relocate backup storage outside public document root. Restrict bucket permissions to authenticated automated CI/CD runners.'
    },
    {
      id: 'BB-006',
      title: 'Missing CSRF Protection on Password Change',
      asset: 'app.example.com/settings',
      type: 'CSRF',
      cvss: 5.4,
      severity: 'Medium',
      status: 'Open',
      date: '2026-10-26',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N',
      description: 'Password modification endpoint executes state changes via POST request without validating an anti-CSRF token.',
      impact: 'An attacker can host a malicious webpage that triggers password resets if an authenticated victim visits the link.',
      remediation: 'Implement cryptographically random anti-CSRF synchronizer tokens and enforce SameSite=Strict on session cookies.'
    },
    {
      id: 'BB-007',
      title: 'Open Redirect in Redirect Parameter',
      asset: 'auth.example.com/redirect',
      type: 'Open Redirect',
      cvss: 4.7,
      severity: 'Medium',
      status: 'Triaged',
      date: '2026-10-29',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:N/A:N',
      description: 'Login completion endpoint accepts unvalidated external URL in ?next= parameter, redirecting users without domain checking.',
      impact: 'Facilitates convincing phishing campaigns that leverage the company’s trusted brand domain.',
      remediation: 'Validate redirect target against a strict allow-list of internal relative paths. Disallow protocol-relative URLs.'
    },
    {
      id: 'BB-008',
      title: 'Outdated TLS Configuration',
      asset: '*.example.com',
      type: 'Security Misconfiguration',
      cvss: 5.9,
      severity: 'Medium',
      status: 'In Progress',
      date: '2026-11-02',
      vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N',
      description: 'Endpoints support deprecated TLS 1.0 and 1.1 protocols with weak cipher suites susceptible to downgrade cryptanalysis.',
      impact: 'Man-in-the-middle eavesdroppers on untrusted networks could decrypt sensitive encrypted data streams.',
      remediation: 'Disable TLS 1.0/1.1 and deprecated CBC ciphers on load balancers. Enforce TLS 1.3 and modern ECDHE ciphers.'
    }
  ];

  const STORAGE_KEY = 'cyberscope_custom_findings';

  // State
  let findings = [];
  let currentSort = { column: 'cvss', direction: 'desc' };

  // =========================================================================
  // 2. Storage & State Initialization
  // =========================================================================
  function loadFindings() {
    const customData = localStorage.getItem(STORAGE_KEY);
    let customFindings = [];
    if (customData) {
      try {
        customFindings = JSON.parse(customData);
      } catch (e) {
        console.error('Error parsing stored findings', e);
      }
    }
    findings = [...DEFAULT_FINDINGS, ...customFindings];
    updateUserSubmissionsBox(customFindings.length);
  }

  function saveCustomFinding(newFinding) {
    const customData = localStorage.getItem(STORAGE_KEY);
    let customList = [];
    if (customData) {
      try {
        customList = JSON.parse(customData);
      } catch (e) {
        customList = [];
      }
    }
    customList.unshift(newFinding);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customList));
    loadFindings();
  }

  function clearCustomFindings() {
    localStorage.removeItem(STORAGE_KEY);
    loadFindings();
    renderAll();
    showToast('Storage Cleared', 'Custom findings have been removed.');
  }

  function updateUserSubmissionsBox(count) {
    const box = document.getElementById('userSubmissionsBox');
    const countEl = document.getElementById('userSubCount');
    if (!box || !countEl) return;

    if (count > 0) {
      box.style.display = 'block';
      countEl.textContent = count;
    } else {
      box.style.display = 'none';
    }
  }

  // =========================================================================
  // 3. Metrics Calculation & UI Updates
  // =========================================================================
  function updateMetrics() {
    const total = findings.length;
    let critCount = 0;
    let highCount = 0;
    let medCount = 0;
    let lowCount = 0;
    let cvssSum = 0;

    let resolvedCount = 0;
    let inProgressCount = 0;
    let triagedCount = 0;
    let openCount = 0;

    findings.forEach(f => {
      const score = parseFloat(f.cvss) || 0;
      cvssSum += score;

      const sev = (f.severity || '').toLowerCase();
      if (sev === 'critical') critCount++;
      else if (sev === 'high') highCount++;
      else if (sev === 'medium') medCount++;
      else if (sev === 'low') lowCount++;

      const st = (f.status || '').toLowerCase();
      if (st === 'resolved') resolvedCount++;
      else if (st === 'in progress') inProgressCount++;
      else if (st === 'triaged') triagedCount++;
      else if (st === 'open') openCount++;
    });

    const avgCvss = total > 0 ? (cvssSum / total).toFixed(2) : '0.00';
    const critAndHigh = critCount + highCount;

    // Metric elements
    safeSetText('metricTotal', total);
    safeSetText('heroFindingCount', total);
    safeSetText('metricCritHigh', critAndHigh);
    safeSetText('metricCritCount', `${critCount} Critical`);
    safeSetText('metricHighCount', `${highCount} High`);
    safeSetText('metricAvgCvss', avgCvss);
    safeSetText('heroAvgCvss', avgCvss);
    safeSetText('metricResolvedRatio', `${resolvedCount} / ${total}`);
    safeSetText('metricResolvedCount', `${resolvedCount} Resolved`);
    safeSetText('metricInProgressCount', `${inProgressCount} In Progress`);
    safeSetText('metricOpenCount', `${openCount} Open`);

    // CVSS Fill Bar
    const fillEl = document.getElementById('metricCvssFill');
    if (fillEl) {
      const percentage = Math.min(100, Math.max(0, (parseFloat(avgCvss) / 10) * 100));
      fillEl.style.width = `${percentage}%`;
    }
  }

  function safeSetText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
  }

  // =========================================================================
  // 4. Vulnerability Findings Table (Render, Filter, Sort)
  // =========================================================================
  function getFilteredAndSortedFindings() {
    const searchVal = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const sevVal = document.getElementById('severityFilter')?.value || 'ALL';
    const statusVal = document.getElementById('statusFilter')?.value || 'ALL';

    // Filter
    let list = findings.filter(item => {
      // Severity
      if (sevVal !== 'ALL' && item.severity.toLowerCase() !== sevVal.toLowerCase()) {
        return false;
      }
      // Status
      if (statusVal !== 'ALL' && item.status.toLowerCase() !== statusVal.toLowerCase()) {
        return false;
      }
      // Search
      if (searchVal) {
        const matchesId = (item.id || '').toLowerCase().includes(searchVal);
        const matchesTitle = (item.title || '').toLowerCase().includes(searchVal);
        const matchesAsset = (item.asset || '').toLowerCase().includes(searchVal);
        const matchesType = (item.type || '').toLowerCase().includes(searchVal);
        return matchesId || matchesTitle || matchesAsset || matchesType;
      }
      return true;
    });

    // Sort
    const col = currentSort.column;
    const dir = currentSort.direction === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      if (col === 'cvss') {
        return (parseFloat(valA) - parseFloat(valB)) * dir;
      }
      if (col === 'date') {
        return (new Date(valA) - new Date(valB)) * dir;
      }
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * dir;
      }
      return 0;
    });

    return list;
  }

  function renderTable() {
    const tbody = document.getElementById('findingsTableBody');
    const noResults = document.getElementById('noResultsState');
    const filteredCountEl = document.getElementById('filteredCount');
    const totalCountEl = document.getElementById('totalFindingsCount');
    if (!tbody) return;

    const list = getFilteredAndSortedFindings();

    if (filteredCountEl) filteredCountEl.textContent = list.length;
    if (totalCountEl) totalCountEl.textContent = findings.length;

    if (list.length === 0) {
      tbody.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    tbody.innerHTML = list.map(item => {
      const sevClass = getSeverityBadgeClass(item.severity);
      const statusClass = getStatusBadgeClass(item.status);
      const cvssColorClass = getCvssColorClass(item.cvss);

      return `
        <tr data-id="${item.id}" class="finding-row">
          <td>
            <span class="table-vuln-id font-mono">${escapeHtml(item.id)}</span>
          </td>
          <td>
            <span class="table-vuln-title">${escapeHtml(item.title)}</span>
          </td>
          <td>
            <span class="table-asset-tag font-mono">${escapeHtml(item.asset)}</span>
          </td>
          <td>
            <span>${escapeHtml(item.type)}</span>
          </td>
          <td class="text-center">
            <span class="table-cvss-cell font-mono ${cvssColorClass}">${parseFloat(item.cvss).toFixed(1)}</span>
          </td>
          <td class="text-center">
            <span class="badge ${sevClass}">${escapeHtml(item.severity)}</span>
          </td>
          <td class="text-center">
            <span class="badge ${statusClass}">${escapeHtml(item.status)}</span>
          </td>
          <td class="text-center table-date-cell font-mono">
            ${escapeHtml(item.date || 'N/A')}
          </td>
          <td class="text-right print-hide">
            <button class="btn btn-secondary btn-xs inspect-btn" data-id="${item.id}" title="Inspect vulnerability details">
              Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click events
    tbody.querySelectorAll('.finding-row').forEach(row => {
      row.addEventListener('click', (e) => {
        // If clicking inside inspect button or anything
        const id = row.getAttribute('data-id');
        openFindingModal(id);
      });
    });

    tbody.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openFindingModal(id);
      });
    });

    updateSortIndicators();
  }

  function getSeverityBadgeClass(sev) {
    const s = (sev || '').toLowerCase();
    if (s === 'critical') return 'badge-critical';
    if (s === 'high') return 'badge-high';
    if (s === 'medium') return 'badge-medium';
    if (s === 'low') return 'badge-low';
    return 'badge-info';
  }

  function getStatusBadgeClass(status) {
    const st = (status || '').toLowerCase();
    if (st === 'resolved') return 'badge-resolved';
    if (st === 'in progress') return 'badge-progress';
    if (st === 'triaged') return 'badge-triaged';
    return 'badge-open';
  }

  function getCvssColorClass(score) {
    const num = parseFloat(score) || 0;
    if (num >= 9.0) return 'text-critical';
    if (num >= 7.0) return 'text-high';
    if (num >= 4.0) return 'text-medium';
    if (num > 0) return 'text-low';
    return 'text-info';
  }

  function updateSortIndicators() {
    document.querySelectorAll('.findings-table th.sortable').forEach(th => {
      const col = th.getAttribute('data-sort');
      const indicator = th.querySelector('.sort-indicator');
      if (indicator) {
        if (currentSort.column === col) {
          indicator.textContent = currentSort.direction === 'asc' ? '▲' : '▼';
          th.style.color = 'var(--neon-green)';
        } else {
          indicator.textContent = '';
          th.style.color = '';
        }
      }
    });
  }

  // =========================================================================
  // 5. Accessible Modal Dialog
  // =========================================================================
  const modal = document.getElementById('vulnerabilityModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');
  const modalCopySummaryBtn = document.getElementById('modalCopySummaryBtn');
  let activeModalFinding = null;

  function openFindingModal(id) {
    const finding = findings.find(f => f.id === id);
    if (!finding || !modal) return;

    activeModalFinding = finding;
    const modalId = document.getElementById('modalId');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalId) modalId.textContent = finding.id;
    if (modalTitle) modalTitle.textContent = finding.title;

    const sevClass = getSeverityBadgeClass(finding.severity);
    const statusClass = getStatusBadgeClass(finding.status);

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-row-meta">
          <div class="modal-meta-block">
            <span class="lbl">Affected Target Asset</span>
            <span class="val font-mono" style="color: var(--neon-green);">${escapeHtml(finding.asset)}</span>
          </div>
          <div class="modal-meta-block">
            <span class="lbl">Vulnerability Category</span>
            <span class="val">${escapeHtml(finding.type)}</span>
          </div>
          <div class="modal-meta-block">
            <span class="lbl">Status &amp; Severity</span>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <span class="badge ${sevClass}">${escapeHtml(finding.severity)} ${parseFloat(finding.cvss).toFixed(1)}</span>
              <span class="badge ${statusClass}">${escapeHtml(finding.status)}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="modal-section-title">CVSS v3.1 Vector String</div>
          <div class="code-block-wrapper" style="margin-bottom: 0;">
            <code class="font-mono" style="color: var(--cyber-cyan);">${escapeHtml(finding.vector || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H')}</code>
          </div>
        </div>

        <div>
          <div class="modal-section-title">Technical Description &amp; Root Cause</div>
          <div class="modal-box">
            ${escapeHtml(finding.description || 'No detailed description available.')}
          </div>
        </div>

        <div>
          <div class="modal-section-title">Security &amp; Business Impact</div>
          <div class="modal-box" style="border-left: 3px solid var(--sev-critical);">
            ${escapeHtml(finding.impact || 'Direct exploitation could compromise confidential records or allow privilege escalation.')}
          </div>
        </div>

        <div>
          <div class="modal-section-title">Recommended Remediation &amp; Mitigation</div>
          <div class="modal-box" style="border-left: 3px solid var(--neon-green);">
            ${escapeHtml(finding.remediation || 'Enforce server-side authorization controls and input sanitization.')}
          </div>
        </div>
      `;
    }

    modal.showModal();
  }

  function closeModal() {
    if (modal) modal.close();
    activeModalFinding = null;
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeModal();
      }
    });
  }

  if (modalCopySummaryBtn) {
    modalCopySummaryBtn.addEventListener('click', () => {
      if (!activeModalFinding) return;
      const text = `[${activeModalFinding.id}] ${activeModalFinding.title}
Asset: ${activeModalFinding.asset}
Type: ${activeModalFinding.type}
CVSS: ${activeModalFinding.cvss} (${activeModalFinding.severity})
Status: ${activeModalFinding.status}
Vector: ${activeModalFinding.vector}
Description: ${activeModalFinding.description}
Impact: ${activeModalFinding.impact}
Remediation: ${activeModalFinding.remediation}`;
      
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to Clipboard', 'Finding summary copied.');
      }).catch(() => {
        showToast('Copy Failed', 'Please select and copy manually.');
      });
    });
  }

  // =========================================================================
  // 6. Interactive CVSS v3.1 Calculator
  // =========================================================================
  const calcAV = document.getElementById('cvssAV');
  const calcAC = document.getElementById('cvssAC');
  const calcPR = document.getElementById('cvssPR');
  const calcUI = document.getElementById('cvssUI');
  const calcScope = document.getElementById('cvssScope');
  const calcConf = document.getElementById('cvssConf');
  const calcInteg = document.getElementById('cvssInteg');
  const calcAvail = document.getElementById('cvssAvail');

  const calcScoreVal = document.getElementById('calcScoreVal');
  const calcBadgeVal = document.getElementById('calcBadgeVal');
  const calcVectorString = document.getElementById('calcVectorString');
  const copyVectorBtn = document.getElementById('copyVectorBtn');

  function calculateCvss() {
    if (!calcAV) return;

    const av = calcAV.value;
    const ac = calcAC.value;
    const pr = calcPR.value;
    const ui = calcUI.value;
    const scope = calcScope.value;
    const c = calcConf.value;
    const i = calcInteg.value;
    const a = calcAvail.value;

    // Multipliers for Base Metrics
    const avWeights = { N: 0.85, A: 0.62, L: 0.55, P: 0.20 };
    const acWeights = { L: 0.77, H: 0.44 };
    const uiWeights = { N: 0.85, R: 0.62 };

    // PR depends on Scope
    let prWeight = 0.85;
    if (scope === 'U') {
      if (pr === 'N') prWeight = 0.85;
      else if (pr === 'L') prWeight = 0.62;
      else if (pr === 'H') prWeight = 0.27;
    } else {
      if (pr === 'N') prWeight = 0.85;
      else if (pr === 'L') prWeight = 0.68;
      else if (pr === 'H') prWeight = 0.50;
    }

    const cWeights = { H: 0.56, L: 0.22, N: 0.00 };
    const iWeights = { H: 0.56, L: 0.22, N: 0.00 };
    const aWeights = { H: 0.56, L: 0.22, N: 0.00 };

    const iss = 1 - ((1 - cWeights[c]) * (1 - iWeights[i]) * (1 - aWeights[a]));
    let impact = 0;
    if (scope === 'U') {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow((iss - 0.02), 15);
    }

    const exploitability = 8.22 * avWeights[av] * acWeights[ac] * prWeight * uiWeights[ui];

    let baseScore = 0;
    if (impact <= 0) {
      baseScore = 0.0;
    } else {
      if (scope === 'U') {
        baseScore = Math.min(impact + exploitability, 10);
      } else {
        baseScore = Math.min(1.08 * (impact + exploitability), 10);
      }
      // Official CVSS round up (ceil to 1 decimal)
      baseScore = Math.ceil(baseScore * 10) / 10;
    }

    // Format output
    const formattedScore = baseScore.toFixed(1);
    let severity = 'None';
    let badgeClass = 'badge-info';

    if (baseScore >= 9.0) {
      severity = 'Critical';
      badgeClass = 'badge-critical';
    } else if (baseScore >= 7.0) {
      severity = 'High';
      badgeClass = 'badge-high';
    } else if (baseScore >= 4.0) {
      severity = 'Medium';
      badgeClass = 'badge-medium';
    } else if (baseScore >= 0.1) {
      severity = 'Low';
      badgeClass = 'badge-low';
    }

    const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${scope}/C:${c}/I:${i}/A:${a}`;

    if (calcScoreVal) {
      calcScoreVal.textContent = formattedScore;
      calcScoreVal.className = `calc-score-number font-mono ${getCvssColorClass(baseScore)}`;
    }

    if (calcBadgeVal) {
      calcBadgeVal.textContent = severity;
      calcBadgeVal.className = `badge ${badgeClass}`;
    }

    if (calcVectorString) {
      calcVectorString.textContent = vector;
    }
  }

  [calcAV, calcAC, calcPR, calcUI, calcScope, calcConf, calcInteg, calcAvail].forEach(select => {
    if (select) select.addEventListener('change', calculateCvss);
  });

  if (copyVectorBtn) {
    copyVectorBtn.addEventListener('click', () => {
      const vector = calcVectorString?.textContent || '';
      navigator.clipboard.writeText(vector).then(() => {
        copyVectorBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyVectorBtn.textContent = 'Copy Vector';
        }, 1800);
      });
    });
  }

  // =========================================================================
  // 7. Proof-of-Concept Copy Buttons
  // =========================================================================
  document.querySelectorAll('.copy-poc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied Payload!';
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        }, 1800);
      }).catch(err => {
        console.error('Copy failed', err);
      });
    });
  });

  // =========================================================================
  // 8. Submit Vulnerability Form & Validation
  // =========================================================================
  const form = document.getElementById('vulnerabilityForm');
  const vulnCvssInput = document.getElementById('vulnCvss');
  const vulnSeverityInput = document.getElementById('vulnSeverity');
  const clearStorageBtn = document.getElementById('clearStorageBtn');

  if (vulnCvssInput && vulnSeverityInput) {
    vulnCvssInput.addEventListener('input', () => {
      const val = parseFloat(vulnCvssInput.value);
      if (isNaN(val)) {
        vulnSeverityInput.value = '—';
        return;
      }
      if (val >= 9.0) vulnSeverityInput.value = 'Critical';
      else if (val >= 7.0) vulnSeverityInput.value = 'High';
      else if (val >= 4.0) vulnSeverityInput.value = 'Medium';
      else if (val > 0.0) vulnSeverityInput.value = 'Low';
      else vulnSeverityInput.value = 'None';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      let hasError = false;

      const title = document.getElementById('vulnTitle');
      const type = document.getElementById('vulnType');
      const asset = document.getElementById('vulnAsset');
      const cvss = document.getElementById('vulnCvss');
      const desc = document.getElementById('vulnDescription');
      const steps = document.getElementById('vulnSteps');
      const poc = document.getElementById('vulnPoc')?.value || '';

      const validateField = (input, errorId, condition) => {
        const group = input?.closest('.form-group');
        if (!condition) {
          if (group) group.classList.add('has-error');
          hasError = true;
        } else {
          if (group) group.classList.remove('has-error');
        }
      };

      validateField(title, 'titleError', title?.value.trim().length > 0);
      validateField(type, 'typeError', type?.value.length > 0);
      validateField(asset, 'assetError', asset?.value.trim().length > 0);

      const cvssVal = parseFloat(cvss?.value);
      validateField(cvss, 'cvssError', !isNaN(cvssVal) && cvssVal >= 0 && cvssVal <= 10.0);
      validateField(desc, 'descError', desc?.value.trim().length > 0);
      validateField(steps, 'stepsError', steps?.value.trim().length > 0);

      if (hasError) return;

      // Auto-generate next ID
      const nextNum = findings.length + 1;
      const nextId = `BB-${String(nextNum).padStart(3, '0')}`;
      const derivedSeverity = vulnSeverityInput?.value || 'Medium';

      const newFinding = {
        id: nextId,
        title: title.value.trim(),
        asset: asset.value.trim(),
        type: type.value,
        cvss: cvssVal,
        severity: derivedSeverity,
        status: 'Open',
        date: new Date().toISOString().split('T')[0],
        vector: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`,
        description: desc.value.trim(),
        impact: 'Identified during custom security assessment session.',
        remediation: 'Review endpoint access control logic and implement defenses according to the Remediation Matrix.'
      };

      saveCustomFinding(newFinding);
      form.reset();
      if (vulnSeverityInput) vulnSeverityInput.value = 'Medium';

      // Re-render
      renderAll();

      showToast('Finding Submitted!', `${newFinding.id} recorded into local session.`);

      // Smooth scroll to table
      const findingsSection = document.getElementById('findings');
      if (findingsSection) {
        findingsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (clearStorageBtn) {
    clearStorageBtn.addEventListener('click', clearCustomFindings);
  }

  // =========================================================================
  // 9. Toast Notification Handler
  // =========================================================================
  let toastTimer = null;
  function showToast(title, message) {
    const toast = document.getElementById('toastNotification');
    const tTitle = document.getElementById('toastTitle');
    const tMsg = document.getElementById('toastMessage');

    if (!toast) return;
    if (tTitle) tTitle.textContent = title;
    if (tMsg) tMsg.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // =========================================================================
  // 10. Filter & Search Event Listeners
  // =========================================================================
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const severityFilter = document.getElementById('severityFilter');
  const statusFilter = document.getElementById('statusFilter');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const emptyResetBtn = document.getElementById('emptyResetBtn');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
      }
      renderTable();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderTable();
      }
    });
  }

  if (severityFilter) severityFilter.addEventListener('change', renderTable);
  if (statusFilter) statusFilter.addEventListener('change', renderTable);

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (severityFilter) severityFilter.value = 'ALL';
    if (statusFilter) statusFilter.value = 'ALL';
    renderTable();
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Sorting
  document.querySelectorAll('.findings-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (currentSort.column === col) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.column = col;
        currentSort.direction = col === 'cvss' || col === 'date' ? 'desc' : 'asc';
      }
      renderTable();
    });
  });

  // =========================================================================
  // 11. Header, Navigation, Export/Print Triggers
  // =========================================================================
  const printBtn = document.getElementById('printBtn');
  const heroExportBtn = document.getElementById('heroExportBtn');

  const triggerPrint = () => {
    window.print();
  };

  if (printBtn) printBtn.addEventListener('click', triggerPrint);
  if (heroExportBtn) heroExportBtn.addEventListener('click', triggerPrint);

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 12. Helpers
  // =========================================================================
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderAll() {
    updateMetrics();
    renderTable();
  }

  // Initial Boot
  loadFindings();
  calculateCvss();
  renderAll();
});
