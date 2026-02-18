// ==========================================
// Project 1: US LLP Tax Compliance Dashboard
// ==========================================

(function () {
    'use strict';

    // ---- DATA ----

    const obligations = [
        { form: 'Form 1065', desc: 'U.S. Return of Partnership Income', freq: 'Annual', due: 'March 15, 2026', status: 'pending' },
        { form: 'Schedule K-1 (1065)', desc: 'Partner\'s Share of Income, Deductions, Credits', freq: 'Annual', due: 'March 15, 2026', status: 'pending' },
        { form: 'Form 7004', desc: 'Application for Automatic Extension (6 months)', freq: 'As needed', due: 'March 15, 2026', status: 'na' },
        { form: 'Form 1040-ES', desc: 'Estimated Tax Payments (each partner individually)', freq: 'Quarterly', due: 'Apr 15 / Jun 15 / Sep 15 / Jan 15', status: 'filed' },
        { form: 'Form 8825', desc: 'Rental Real Estate Income and Expenses', freq: 'Annual (if applicable)', due: 'March 15, 2026', status: 'pending' },
        { form: 'Form 4562', desc: 'Depreciation and Amortization', freq: 'Annual (if applicable)', due: 'With Form 1065', status: 'pending' },
        { form: 'Form 8865', desc: 'Return of U.S. Persons with Respect to Certain Foreign Partnerships', freq: 'Annual (if applicable)', due: 'March 15, 2026', status: 'na' },
        { form: 'FBAR (FinCEN 114)', desc: 'Report of Foreign Bank & Financial Accounts', freq: 'Annual (if applicable)', due: 'April 15, 2026', status: 'na' },
        { form: 'State Returns', desc: 'Partnership returns for each nexus state', freq: 'Annual', due: 'Varies by state', status: 'pending' },
        { form: 'Form W-2 / 1099-NEC', desc: 'Wage/Contractor reporting (if employees/contractors)', freq: 'Annual', due: 'January 31, 2026', status: 'filed' },
    ];

    const deadlines = [
        { date: 'January 15, 2026', title: 'Q4 2025 Estimated Tax Payment', desc: 'Partners must pay 4th quarter estimated taxes to avoid underpayment penalty.', status: 'passed' },
        { date: 'January 31, 2026', title: 'W-2 & 1099-NEC Due', desc: 'Furnish W-2s to employees and 1099-NECs to contractors. File with SSA/IRS.', status: 'passed' },
        { date: 'March 15, 2026', title: 'Form 1065 Due (or Extension)', desc: 'File partnership return or submit Form 7004 for automatic 6-month extension.', status: 'upcoming' },
        { date: 'March 15, 2026', title: 'Schedule K-1s Due to Partners', desc: 'Furnish K-1s to all partners for them to file their individual returns.', status: 'upcoming' },
        { date: 'April 15, 2026', title: 'Individual Returns Due (Partners)', desc: 'Partners file their 1040 with K-1 income. Q1 2026 estimated tax also due.', status: 'upcoming' },
        { date: 'April 15, 2026', title: 'FBAR Due (if applicable)', desc: 'Report of Foreign Bank Accounts due. Automatic extension to October 15.', status: 'upcoming' },
        { date: 'June 15, 2026', title: 'Q2 2026 Estimated Tax Payment', desc: 'Second quarter estimated taxes due for each partner.', status: 'upcoming' },
        { date: 'September 15, 2026', title: 'Extended Form 1065 Due', desc: 'If extension was filed, partnership return must be filed by this date.', status: 'upcoming' },
        { date: 'September 15, 2026', title: 'Q3 2026 Estimated Tax Payment', desc: 'Third quarter estimated taxes due for each partner.', status: 'upcoming' },
        { date: 'October 15, 2026', title: 'Extended Individual Returns Due', desc: 'Partners who filed extensions must file their 1040 by this date.', status: 'upcoming' },
    ];

    const penalties = [
        {
            title: 'Late Filing – Form 1065',
            icon: '⏰',
            iconBg: 'rgba(244,63,94,0.15)',
            amount: '$220 × Partners × Months',
            desc: 'IRC §6698: Penalty of $220 per partner per month (or fraction) for up to 12 months. For a 5-partner LLP, that\'s $1,100/month or up to $13,200 maximum.'
        },
        {
            title: 'Late K-1 Furnishing',
            icon: '📄',
            iconBg: 'rgba(245,158,11,0.15)',
            amount: '$310 per K-1',
            desc: 'IRC §6722: Failure to furnish correct payee statements. Penalty of $310 per K-1 if filed more than 30 days late, up to $3,783,500/year.'
        },
        {
            title: 'Underpayment of Estimated Tax',
            icon: '💸',
            iconBg: 'rgba(139,92,246,0.15)',
            amount: 'IRS Interest Rate',
            desc: 'IRC §6654: Partners who underpay estimated taxes may owe an underpayment penalty. Current rate is ~8% annually, compounded daily.'
        },
        {
            title: 'Failure to Pay Tax',
            icon: '🚫',
            iconBg: 'rgba(249,115,22,0.15)',
            amount: '0.5% per Month',
            desc: 'IRC §6651(a)(2): Penalty of 0.5% of unpaid tax per month, up to 25%. Runs concurrently if both failure to file and failure to pay apply.'
        },
        {
            title: 'Accuracy-Related Penalty',
            icon: '🎯',
            iconBg: 'rgba(6,182,212,0.15)',
            amount: '20% of Underpayment',
            desc: 'IRC §6662: 20% penalty on underpayment due to negligence, substantial understatement, or substantial valuation misstatement.'
        },
        {
            title: 'Fraud Penalty',
            icon: '🔴',
            iconBg: 'rgba(244,63,94,0.15)',
            amount: '75% of Underpayment',
            desc: 'IRC §6663: Fraud penalty of 75% of the underpayment attributable to fraud. IRS bears burden of proof.'
        }
    ];

    const checklistData = [
        {
            category: '📋 Pre-Filing Preparation',
            items: [
                { text: 'Verify partnership EIN is active and correct', checked: true },
                { text: 'Confirm partnership agreement is current and signed', checked: true },
                { text: 'Collect all partner information (SSN, addresses, ownership %)', checked: true },
                { text: 'Reconcile all bank statements for the tax year', checked: true },
                { text: 'Gather all income documents (1099s, W-2s, invoices)', checked: false },
                { text: 'Compile all expense receipts and documentation', checked: false },
            ]
        },
        {
            category: '📊 Financial Data',
            items: [
                { text: 'Prepare trial balance and adjusting entries', checked: true },
                { text: 'Calculate book-to-tax adjustments (§704(b))', checked: false },
                { text: 'Compute depreciation schedules (Form 4562)', checked: false },
                { text: 'Identify Section 199A (QBI) eligible income', checked: false },
                { text: 'Review guaranteed payments to partners', checked: false },
                { text: 'Calculate partner capital accounts (tax basis vs. §704(b))', checked: false },
            ]
        },
        {
            category: '📑 Form 1065 & K-1 Preparation',
            items: [
                { text: 'Complete Form 1065 Page 1 (income, deductions)', checked: false },
                { text: 'Complete Schedule B (other information)', checked: false },
                { text: 'Complete Schedule K (partners\' share totals)', checked: false },
                { text: 'Prepare Schedule L (balance sheet per books)', checked: false },
                { text: 'Prepare Schedule M-1 or M-3 (book/tax reconciliation)', checked: false },
                { text: 'Generate individual Schedule K-1 for each partner', checked: false },
                { text: 'Review all K-1 allocations for accuracy', checked: false },
            ]
        },
        {
            category: '🏛️ State & Local Filings',
            items: [
                { text: 'Identify all states with nexus', checked: false },
                { text: 'Prepare state partnership returns for each nexus state', checked: false },
                { text: 'Calculate state apportionment factors', checked: false },
                { text: 'File composite returns where required', checked: false },
                { text: 'Calculate and pay state withholding for non-resident partners', checked: false },
            ]
        },
        {
            category: '✅ Final Review & Filing',
            items: [
                { text: 'Partner/manager review of complete return', checked: false },
                { text: 'Quality control review (second reviewer)', checked: false },
                { text: 'E-file Form 1065 and K-1s with IRS', checked: false },
                { text: 'Distribute K-1s to all partners', checked: false },
                { text: 'File state returns electronically', checked: false },
                { text: 'Archive complete tax file with engagement letter', checked: false },
            ]
        }
    ];

    // ---- RENDER FUNCTIONS ----

    function renderObligations() {
        const tbody = document.getElementById('obligationsTable');
        tbody.innerHTML = obligations.map(o => {
            const statusClass = `status-${o.status}`;
            const statusText = o.status === 'filed' ? '✅ Filed' : o.status === 'pending' ? '⏳ Pending' : o.status === 'overdue' ? '⚠️ Overdue' : '—  N/A';
            return `
        <tr>
          <td><strong>${o.form}</strong></td>
          <td>${o.desc}</td>
          <td>${o.freq}</td>
          <td>${o.due}</td>
          <td><span class="${statusClass}">${statusText}</span></td>
        </tr>
      `;
        }).join('');
    }

    function renderDeadlines() {
        const container = document.getElementById('deadlineTimeline');
        container.innerHTML = deadlines.map(d => `
      <div class="timeline-item ${d.status}">
        <div class="tl-date">${d.date}</div>
        <div class="tl-title">${d.title}</div>
        <div class="tl-desc">${d.desc}</div>
      </div>
    `).join('');
    }

    function renderPenalties() {
        const container = document.getElementById('penaltyGrid');
        container.innerHTML = '<div class="grid-2">' + penalties.map(p => `
      <div class="penalty-card glass-card">
        <div class="penalty-header">
          <div class="penalty-icon" style="background:${p.iconBg}">${p.icon}</div>
          <h4>${p.title}</h4>
        </div>
        <div class="penalty-amount">${p.amount}</div>
        <div class="penalty-desc">${p.desc}</div>
      </div>
    `).join('') + '</div>';
    }

    function renderChecklist() {
        const container = document.getElementById('checklistContainer');
        container.innerHTML = checklistData.map((cat, ci) => `
      <div class="checklist-category">
        <h4>${cat.category}</h4>
        ${cat.items.map((item, ii) => `
          <div class="checklist-item ${item.checked ? 'checked' : ''}" data-cat="${ci}" data-item="${ii}">
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span class="check-label">${item.text}</span>
          </div>
        `).join('')}
      </div>
    `).join('');

        // Attach event listeners
        container.querySelectorAll('.checklist-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT') return;
                const cb = el.querySelector('input[type="checkbox"]');
                cb.checked = !cb.checked;
                const ci = parseInt(el.dataset.cat);
                const ii = parseInt(el.dataset.item);
                checklistData[ci].items[ii].checked = cb.checked;
                el.classList.toggle('checked', cb.checked);
                updateStats();
            });

            el.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                const ci = parseInt(el.dataset.cat);
                const ii = parseInt(el.dataset.item);
                checklistData[ci].items[ii].checked = e.target.checked;
                el.classList.toggle('checked', e.target.checked);
                updateStats();
            });
        });
    }

    function updateStats() {
        let total = 0, completed = 0;
        checklistData.forEach(cat => {
            cat.items.forEach(item => {
                total++;
                if (item.checked) completed++;
            });
        });

        const pending = total - completed;
        const overdue = obligations.filter(o => o.status === 'overdue').length;
        const rate = Math.round((completed / total) * 100);

        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('overdueCount').textContent = overdue;
        document.getElementById('complianceRate').textContent = rate + '%';

        // Progress bar
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        progressFill.style.width = rate + '%';
        progressPercent.textContent = rate + '%';

        // Update milestone dots
        const milestones = document.querySelectorAll('.milestone-dot');
        const thresholds = [10, 30, 50, 75, 100];
        milestones.forEach((dot, i) => {
            if (rate >= thresholds[i]) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (rate >= thresholds[i] - 15) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
    }

    // ---- AI RISK ENGINE ----
    function calculateAIRisk() {
        let total = 0, completed = 0;
        checklistData.forEach(cat => {
            cat.items.forEach(item => { total++; if (item.checked) completed++; });
        });

        const completionRate = completed / total;
        const pendingObligations = obligations.filter(o => o.status === 'pending').length;
        const overdueObligations = obligations.filter(o => o.status === 'overdue').length;

        // Risk calculation
        let riskScore = 100;
        riskScore -= completionRate * 40; // Completion reduces risk
        riskScore += pendingObligations * 5;
        riskScore += overdueObligations * 15;
        if (completionRate < 0.3) riskScore += 15;
        riskScore = Math.max(5, Math.min(95, Math.round(riskScore)));

        let riskLabel, riskColor;
        if (riskScore < 35) { riskLabel = '🟢 Low Risk'; riskColor = 'var(--accent-emerald)'; }
        else if (riskScore < 65) { riskLabel = '🟡 Moderate Risk'; riskColor = 'var(--accent-amber)'; }
        else { riskLabel = '🔴 High Risk'; riskColor = 'var(--accent-rose)'; }

        const el = document.getElementById('aiRiskScore');
        if (el) {
            el.textContent = riskScore + '/100';
            el.style.color = riskColor;
            document.getElementById('aiRiskLabel').textContent = riskLabel;
            document.getElementById('aiRiskBar').style.width = (100 - riskScore) + '%';
        }

        // Penalty prediction
        const partnersCount = 5;
        const pendingMonths = 2;
        const penaltyExposure = pendingObligations * 220 * partnersCount * pendingMonths + overdueObligations * 310 * partnersCount;
        const penaltyEl = document.getElementById('aiPenaltyRisk');
        if (penaltyEl) {
            penaltyEl.textContent = '$' + penaltyExposure.toLocaleString();
        }

        // Next deadline calculation
        const now = new Date();
        const upcomingDeadlines = deadlines.filter(d => new Date(d.date) > now);
        if (upcomingDeadlines.length > 0) {
            const next = upcomingDeadlines[0];
            const daysUntil = Math.ceil((new Date(next.date) - now) / (1000 * 60 * 60 * 24));
            const deadlineEl = document.getElementById('aiNextDeadline');
            if (deadlineEl) {
                deadlineEl.textContent = daysUntil;
                document.getElementById('aiDeadlineName').textContent = next.title;
            }
        }

        // Smart alerts
        renderAIAlerts(riskScore, completionRate, pendingObligations, overdueObligations);
    }

    function renderAIAlerts(riskScore, completionRate, pending, overdue) {
        const container = document.getElementById('aiAlerts');
        if (!container) return;

        const alerts = [];
        if (overdue > 0) alerts.push({ icon: '🔴', severity: 'critical', text: `${overdue} filing(s) are overdue — immediate action required to avoid penalties under IRC §6698.` });
        if (completionRate < 0.5) alerts.push({ icon: '🟡', severity: 'warning', text: `Only ${Math.round(completionRate * 100)}% of compliance checklist complete. Accelerate preparation to meet the March 15 deadline.` });
        if (pending > 4) alerts.push({ icon: '🟡', severity: 'warning', text: `${pending} filings still pending. Consider filing Form 7004 for automatic 6-month extension.` });
        if (riskScore > 60) alerts.push({ icon: '🔴', severity: 'critical', text: `Risk score is ${riskScore}/100 (High). Review and prioritize incomplete items immediately.` });
        alerts.push({ icon: '🔵', severity: 'info', text: 'AI monitoring is active — risk score updates in real-time as you complete checklist items.' });
        if (completionRate > 0.6) alerts.push({ icon: '🟢', severity: 'success', text: `Great progress! ${Math.round(completionRate * 100)}% complete. You are on track for timely filing.` });

        const colors = { critical: 'var(--accent-rose)', warning: 'var(--accent-amber)', info: 'var(--accent-blue)', success: 'var(--accent-emerald)' };
        container.innerHTML = alerts.map(a => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:rgba(255,255,255,0.02);border-radius:8px;border-left:3px solid ${colors[a.severity]};font-size:0.85rem;line-height:1.5;">
                <span>${a.icon}</span>
                <span>${a.text}</span>
            </div>
        `).join('');
    }

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        renderObligations();
        renderDeadlines();
        renderPenalties();
        renderChecklist();
        updateStats();
        setTimeout(calculateAIRisk, 500);
    });

})();
