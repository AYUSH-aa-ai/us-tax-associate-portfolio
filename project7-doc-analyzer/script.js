// ==========================================
// Project 7: Intelligent Document Analyzer
// AI-Powered K-1/1065 Parser & Validator
// ==========================================

(function () {
    'use strict';

    // ---- SIMULATED DOCUMENT DATA ----
    const sampleDocuments = {
        'k1-alpha': {
            type: 'Schedule K-1',
            client: 'Alpha Ventures LLP',
            taxYear: '2025',
            partner: 'John A. Smith',
            ein: '12-3456789',
            partnerTIN: '***-**-4567',
            overallConfidence: 96.8,
            fields: [
                { label: 'Ordinary Business Income (Box 1)', value: '$245,600', confidence: 99, status: 'valid', note: 'Matches partnership total / partner %' },
                { label: 'Net Rental Income (Box 2)', value: '$18,200', confidence: 97, status: 'valid', note: 'Consistent with rental schedule' },
                { label: 'Guaranteed Payments (Box 4a)', value: '$120,000', confidence: 98, status: 'valid', note: 'Per partnership agreement rate' },
                { label: 'Interest Income (Box 5)', value: '$3,450', confidence: 95, status: 'valid', note: 'Bank statement verified' },
                { label: 'Ordinary Dividends (Box 6a)', value: '$8,900', confidence: 94, status: 'valid', note: 'Brokerage statement cross-referenced' },
                { label: 'Qualified Dividends (Box 6b)', value: '$12,100', confidence: 72, status: 'warning', note: '⚠ Qualified exceeds ordinary — possible data entry error' },
                { label: 'Net ST Capital Gain (Box 8)', value: '$5,200', confidence: 96, status: 'valid', note: 'Trade confirmations match' },
                { label: 'Net LT Capital Gain (Box 9a)', value: '$34,500', confidence: 98, status: 'valid', note: 'Consistent with Sch D analysis' },
                { label: '§179 Deduction (Box 11)', value: '$15,000', confidence: 93, status: 'valid', note: 'Within §179 limitation for 2025' },
                { label: 'Self-Employment Earnings (Box 14)', value: '$365,600', confidence: 88, status: 'warning', note: '⚠ Includes GP share — verify LP portions excluded' },
                { label: 'Partner Capital Account (Box L)', value: '$892,340', confidence: 91, status: 'valid', note: 'Tax basis method per Notice 2020-43' },
                { label: '§199A QBI (Box 20 Code Z)', value: '$245,600', confidence: 97, status: 'valid', note: 'Equals Box 1 — standard for non-SSTB' },
            ],
            anomalies: [
                { severity: 'critical', icon: '🔴', title: 'Qualified Dividends > Ordinary Dividends', desc: 'Box 6b ($12,100) exceeds Box 6a ($8,900). Qualified dividends cannot exceed ordinary dividends per IRS rules. Likely data entry error — review brokerage statements.' },
                { severity: 'warning', icon: '🟡', title: 'Self-Employment Earnings High', desc: 'Box 14 SE earnings ($365,600) include both ordinary income and guaranteed payments. Verify that limited partner shares are properly excluded per §1402(a)(13).' },
                { severity: 'info', icon: '🔵', title: 'Capital Account Basis Method', desc: 'Box L reports on tax basis method. Verify this is consistent with the partnership\'s reporting election. All partnerships must report on tax basis per IRS Notice 2020-43.' },
            ]
        },
        '1065-beta': {
            type: 'Form 1065',
            client: 'Beta Consulting Partners',
            taxYear: '2025',
            ein: '98-7654321',
            overallConfidence: 94.2,
            fields: [
                { label: 'Gross Receipts (Line 1a)', value: '$2,845,000', confidence: 99, status: 'valid', note: 'Reconciles with book revenue' },
                { label: 'Cost of Goods Sold (Line 2)', value: '$0', confidence: 100, status: 'valid', note: 'Service partnership — no COGS expected' },
                { label: 'Ordinary Business Income (Line 22)', value: '$1,280,400', confidence: 97, status: 'valid', note: 'Revenue - Total Deductions' },
                { label: 'Salaries & Wages (Line 9)', value: '$680,000', confidence: 96, status: 'valid', note: 'W-2/W-3 reconciled' },
                { label: 'Guaranteed Payments (Line 10)', value: '$480,000', confidence: 98, status: 'valid', note: '4 partners × avg $120K' },
                { label: 'Rent (Line 13)', value: '$156,000', confidence: 95, status: 'valid', note: 'Lease agreement verified' },
                { label: 'Depreciation (Line 16a)', value: '$42,800', confidence: 92, status: 'valid', note: 'Fixed asset schedule reconciled' },
                { label: 'Other Deductions (Line 20)', value: '$205,800', confidence: 85, status: 'warning', note: '⚠ Higher than industry avg — verify meal & entertainment limits' },
                { label: 'Total Assets (Sch L, Line 14d)', value: '$1,450,000', confidence: 93, status: 'valid', note: 'Balance sheet in balance' },
                { label: 'Partners Capital (Sch L, Line 21)', value: '$980,000', confidence: 90, status: 'valid', note: 'Current year capital account' },
                { label: 'Net Income per Books (M-1, Line 1)', value: '$1,350,200', confidence: 88, status: 'warning', note: '⚠ Book-tax difference of $69,800 — verify M-1 adjustments' },
                { label: 'Number of K-1s', value: '4', confidence: 100, status: 'valid', note: 'Matches Schedule B partner count' },
            ],
            anomalies: [
                { severity: 'warning', icon: '🟡', title: 'Other Deductions Above Average', desc: 'Line 20 Other Deductions ($205,800) represent 7.2% of gross receipts. Industry average for consulting is ~4-5%. Review for disallowed meal/entertainment deductions (50% limit) and proper categorization.' },
                { severity: 'warning', icon: '🟡', title: 'Book-Tax Income Difference', desc: 'Net income per books ($1,350,200) differs from taxable income ($1,280,400) by $69,800. Ensure all M-1 adjustments are documented: depreciation timing, meals, stock compensation, etc.' },
                { severity: 'info', icon: '🔵', title: 'Schedule K-2/K-3 Review', desc: 'Check if any partners are foreign persons or if the partnership has foreign activities. If so, Schedules K-2 and K-3 are required (even for domestic partnerships with foreign partners).' },
            ]
        },
        '1099-gamma': {
            type: '1099-NEC',
            client: 'Gamma Holdings',
            taxYear: '2025',
            ein: '55-1234567',
            overallConfidence: 98.5,
            fields: [
                { label: 'Payer Name', value: 'Gamma Holdings LLC', confidence: 99, status: 'valid', note: 'EIN verified against IRS database' },
                { label: 'Recipient Name', value: 'Delta Consulting Inc.', confidence: 99, status: 'valid', note: 'TIN verification passed' },
                { label: 'Nonemployee Compensation (Box 1)', value: '$85,000', confidence: 99, status: 'valid', note: 'Payment records reconciled' },
                { label: 'Federal Tax Withheld (Box 4)', value: '$0', confidence: 100, status: 'valid', note: 'No backup withholding applied' },
                { label: 'State Tax Withheld (Box 6)', value: '$2,550', confidence: 96, status: 'valid', note: '3% state rate applied' },
                { label: 'State ID Number (Box 7)', value: '12345678', confidence: 97, status: 'valid', note: 'State registration verified' },
                { label: 'Payer TIN', value: '55-1234567', confidence: 100, status: 'valid', note: 'EIN format validated' },
                { label: 'Recipient TIN', value: '***-**-8901', confidence: 100, status: 'valid', note: 'W-9 on file — current year' },
            ],
            anomalies: [
                { severity: 'info', icon: '🔵', title: 'No Backup Withholding', desc: 'Confirm that a valid W-9 is on file for the recipient. If TIN was not provided or is incorrect, 24% backup withholding should be applied per IRC §3406.' },
                { severity: 'info', icon: '🔵', title: 'Filing Deadline Reminder', desc: '1099-NEC must be filed with the IRS and furnished to the recipient by January 31, 2026. No automatic extension is available for this form.' },
            ]
        }
    };

    // ---- STATE ----
    let currentDoc = null;

    // ---- RENDER SAMPLE DOCUMENTS ----
    function renderSampleDocs() {
        const grid = document.getElementById('sampleDocsGrid');
        const docs = [
            { key: 'k1-alpha', icon: '📋', title: 'Schedule K-1', desc: 'Alpha Ventures LLP – Partner K-1 with 12 fields' },
            { key: '1065-beta', icon: '📑', title: 'Form 1065', desc: 'Beta Consulting Partners – Full return data' },
            { key: '1099-gamma', icon: '📄', title: '1099-NEC', desc: 'Gamma Holdings – Contractor payment form' },
        ];

        grid.innerHTML = docs.map(d => `
            <div class="doc-sample-card glass-card" onclick="analyzeDocument('${d.key}')">
                <span class="doc-icon">${d.icon}</span>
                <h4>${d.title}</h4>
                <p>${d.desc}</p>
            </div>
        `).join('');
    }

    // ---- ANALYZE DOCUMENT ----
    window.analyzeDocument = function (key) {
        currentDoc = sampleDocuments[key];

        // Show processing
        document.getElementById('uploadSection').style.display = 'none';
        const processing = document.getElementById('processingOverlay');
        processing.classList.add('active');

        const steps = processing.querySelectorAll('.proc-step');
        let stepIndex = 0;

        const stepInterval = setInterval(() => {
            if (stepIndex > 0) {
                steps[stepIndex - 1].classList.remove('active');
                steps[stepIndex - 1].classList.add('done');
                steps[stepIndex - 1].querySelector('.step-icon').textContent = '✓';
            }
            if (stepIndex < steps.length) {
                steps[stepIndex].classList.add('active');
                stepIndex++;
            } else {
                clearInterval(stepInterval);
                setTimeout(() => {
                    processing.classList.remove('active');
                    renderAnalysis();
                }, 500);
            }
        }, 600);
    };

    // ---- RENDER ANALYSIS ----
    function renderAnalysis() {
        const container = document.getElementById('analysisContainer');
        container.classList.add('active');

        // Header
        document.getElementById('analysisTitle').textContent = `${currentDoc.type} — ${currentDoc.client || ''}`;
        document.getElementById('analysisMeta').textContent = `Tax Year ${currentDoc.taxYear} | EIN: ${currentDoc.ein}`;

        // Confidence meter
        const meterFill = document.getElementById('confidenceFill');
        const meterValue = document.getElementById('confidenceValue');
        setTimeout(() => {
            meterFill.style.width = `${currentDoc.overallConfidence}%`;
            meterValue.textContent = `${currentDoc.overallConfidence}%`;
        }, 100);

        // Validation summary
        const valid = currentDoc.fields.filter(f => f.status === 'valid').length;
        const warnings = currentDoc.fields.filter(f => f.status === 'warning').length;
        const errors = currentDoc.fields.filter(f => f.status === 'error').length;
        const criticalAnomalies = currentDoc.anomalies.filter(a => a.severity === 'critical').length;

        document.getElementById('valTotal').textContent = currentDoc.fields.length;
        document.getElementById('valValid').textContent = valid;
        document.getElementById('valWarnings').textContent = warnings + criticalAnomalies;
        document.getElementById('valConfidence').textContent = `${currentDoc.overallConfidence}%`;

        // Fields
        const fieldsGrid = document.getElementById('fieldsGrid');
        fieldsGrid.innerHTML = currentDoc.fields.map(f => `
            <div class="field-card glass-card ${f.status}">
                <div class="field-header">
                    <span class="field-label">${f.label}</span>
                    <span class="field-confidence">${f.confidence}%</span>
                </div>
                <div class="field-value">${f.value}</div>
                <div class="field-note">${f.note}</div>
            </div>
        `).join('');

        // Anomalies
        const anomalyList = document.getElementById('anomalyList');
        if (currentDoc.anomalies.length === 0) {
            anomalyList.innerHTML = '<p style="color:var(--accent-emerald);font-size:0.9rem;">✓ No anomalies detected — document passes all validation checks.</p>';
        } else {
            anomalyList.innerHTML = currentDoc.anomalies.map(a => `
                <div class="anomaly-item ${a.severity}">
                    <span class="anomaly-icon">${a.icon}</span>
                    <div class="anomaly-text">
                        <h4>${a.title}</h4>
                        <p>${a.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        // Stats
        document.getElementById('statExtracted').textContent = currentDoc.fields.length;
        document.getElementById('statAnomalies').textContent = currentDoc.anomalies.length;
    }

    // ---- BACK BUTTON ----
    window.goBack = function () {
        document.getElementById('analysisContainer').classList.remove('active');
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('processingOverlay').classList.remove('active');

        // Reset processing steps
        document.querySelectorAll('.proc-step').forEach(s => {
            s.classList.remove('active', 'done');
            s.querySelector('.step-icon').textContent = '○';
        });

        // Reset confidence
        document.getElementById('confidenceFill').style.width = '0%';
        document.getElementById('confidenceValue').textContent = '0%';
    };

    // ---- DRAG AND DROP ----
    function initDragDrop() {
        const zone = document.getElementById('uploadZone');

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            // Simulate analysis with default K-1
            showToast('Document received! Running AI analysis...', 'success');
            analyzeDocument('k1-alpha');
        });

        zone.addEventListener('click', () => {
            showToast('Select a sample document below to see AI analysis in action!', 'info');
        });
    }

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        renderSampleDocs();
        initDragDrop();
    });

})();
