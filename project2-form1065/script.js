// ==========================================
// Project 2: Form 1065 & Schedule K-1 Analyzer
// ==========================================

(function () {
    'use strict';

    let partners = [];
    let incomeChart = null;
    let allocationChart = null;

    // Default partners
    const defaultPartners = [
        { name: 'Partner A – Managing Partner', pct: 50 },
        { name: 'Partner B – General Partner', pct: 30 },
        { name: 'Partner C – Limited Partner', pct: 20 }
    ];

    function setupPartners() {
        const num = parseInt(document.getElementById('numPartners').value) || 3;
        const container = document.getElementById('partnerInputs');
        container.innerHTML = '';

        for (let i = 0; i < num; i++) {
            const def = defaultPartners[i] || { name: `Partner ${String.fromCharCode(65 + i)}`, pct: Math.floor(100 / num) };
            container.innerHTML += `
        <div class="partner-row">
          <div>
            <div class="partner-label">Partner ${i + 1}</div>
            <input type="text" class="form-control partner-name" value="${def.name}" placeholder="Partner name">
          </div>
          <div>
            <div class="partner-label">%</div>
            <input type="number" class="form-control partner-pct" value="${def.pct}" min="0" max="100" step="0.1">
          </div>
        </div>
      `;
        }
    }

    function collectPartners() {
        const names = document.querySelectorAll('.partner-name');
        const pcts = document.querySelectorAll('.partner-pct');
        partners = [];
        let totalPct = 0;

        names.forEach((el, i) => {
            const pct = parseFloat(pcts[i].value) || 0;
            partners.push({ name: el.value, pct: pct });
            totalPct += pct;
        });

        const hint = document.getElementById('ratioHint');
        if (Math.abs(totalPct - 100) > 0.1) {
            hint.style.color = 'var(--accent-rose)';
            hint.textContent = `⚠️ Total is ${totalPct.toFixed(1)}% — must equal 100%`;
            return false;
        }
        hint.style.color = 'var(--accent-emerald)';
        hint.textContent = '✅ Ownership percentages total 100%';
        return true;
    }

    function getVal(id) {
        return parseFloat(document.getElementById(id).value) || 0;
    }

    function fmt(n) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    }

    function generate() {
        if (!collectPartners()) {
            showToast('Please fix ownership percentages to total 100%', 'error');
            return;
        }

        // Gather financials
        const data = {
            grossReceipts: getVal('grossReceipts'),
            cogs: getVal('cogs'),
            rentalIncome: getVal('rentalIncome'),
            interestIncome: getVal('interestIncome'),
            dividendIncome: getVal('dividendIncome'),
            stcg: getVal('stcg'),
            ltcg: getVal('ltcg'),
            sec1231: getVal('sec1231'),
            otherIncome: getVal('otherIncome'),
            salaries: getVal('salaries'),
            guaranteedPayments: getVal('guaranteedPayments'),
            rentExpense: getVal('rentExpense'),
            depreciation: getVal('depreciation'),
            interestExpense: getVal('interestExpense'),
            taxesLicenses: getVal('taxesLicenses'),
            charitable: getVal('charitable'),
            otherDeductions: getVal('otherDeductions'),
            foreignTaxCredit: getVal('foreignTaxCredit')
        };

        // Calculations
        const grossProfit = data.grossReceipts - data.cogs;
        const totalOrdinaryDeductions = data.salaries + data.guaranteedPayments + data.rentExpense +
            data.depreciation + data.interestExpense + data.taxesLicenses + data.otherDeductions;
        const ordinaryIncome = grossProfit + data.otherIncome - totalOrdinaryDeductions;
        const totalIncome = ordinaryIncome + data.rentalIncome + data.interestIncome +
            data.dividendIncome + data.stcg + data.ltcg + data.sec1231;

        // Show results
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Summary stats
        document.getElementById('summaryStats').innerHTML = `
      <div class="summary-stat glass-card">
        <div class="ss-label">Gross Receipts</div>
        <div class="ss-value" style="color:var(--accent-blue);">${fmt(data.grossReceipts)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Ordinary Business Income</div>
        <div class="ss-value" style="color:${ordinaryIncome >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${fmt(ordinaryIncome)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Total Separately Stated Items</div>
        <div class="ss-value" style="color:var(--accent-cyan);">${fmt(totalIncome - ordinaryIncome)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Total Partnership Income</div>
        <div class="ss-value" style="color:var(--accent-purple);">${fmt(totalIncome)}</div>
      </div>
    `;

        // K-1 line items for each partner
        const k1Lines = [
            { label: 'Line 1 – Ordinary Business Income', key: 'ordinary', total: ordinaryIncome },
            { label: 'Line 2 – Net Rental Real Estate Income', key: 'rental', total: data.rentalIncome },
            { label: 'Line 5 – Interest Income', key: 'interest', total: data.interestIncome },
            { label: 'Line 6a – Ordinary Dividends', key: 'dividends', total: data.dividendIncome },
            { label: 'Line 8 – Net Short-Term Capital Gain', key: 'stcg', total: data.stcg },
            { label: 'Line 9a – Net Long-Term Capital Gain', key: 'ltcg', total: data.ltcg },
            { label: 'Line 10 – Net Section 1231 Gain', key: 'sec1231', total: data.sec1231 },
            { label: 'Line 4 – Guaranteed Payments', key: 'guaranteed', total: data.guaranteedPayments },
            { label: 'Line 13a – Charitable Contributions', key: 'charitable', total: data.charitable },
            { label: 'Line 15 – Foreign Tax Credit', key: 'ftc', total: data.foreignTaxCredit },
            { label: 'Line 20 – Section 199A (QBI)', key: 'qbi', total: ordinaryIncome > 0 ? ordinaryIncome : 0 },
        ];

        // K-1 Cards
        const cardColors = ['var(--accent-blue)', 'var(--accent-cyan)', 'var(--accent-purple)', 'var(--accent-emerald)', 'var(--accent-amber)'];
        const k1CardsContainer = document.getElementById('k1Cards');
        k1CardsContainer.innerHTML = partners.map((p, i) => {
            const ratio = p.pct / 100;
            const partnerTotal = totalIncome * ratio;
            const color = cardColors[i % cardColors.length];

            return `
        <div class="k1-card glass-card animate-fade-in-up delay-${i + 1}">
          <div class="k1-header">
            <div>
              <h3>Schedule K-1: ${p.name}</h3>
              <span style="font-size:0.85rem;color:var(--text-muted);">EIN: ${document.getElementById('ein').value} | TY ${document.getElementById('taxYear').value}</span>
            </div>
            <span class="ownership badge" style="background:${color}22;color:${color};">${p.pct}% Ownership</span>
          </div>
          <div class="k1-grid">
            ${k1Lines.map(line => {
                let val = line.total * ratio;
                // Guaranteed payments – only allocate to managing partner if applicable
                if (line.key === 'guaranteed' && partners.length > 1) {
                    // Distribute guaranteed payments equally as a simplification
                    val = line.total / partners.length;
                }
                const cls = val >= 0 ? 'positive' : 'negative';
                return `
                <div class="k1-item">
                  <div class="k1-label">${line.label}</div>
                  <div class="k1-value ${cls}">${fmt(val)}</div>
                </div>
              `;
            }).join('')}
            <div class="k1-item" style="background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.15);">
              <div class="k1-label" style="color:var(--accent-blue);">Total Allocable Share</div>
              <div class="k1-value positive" style="font-size:1.3rem;">${fmt(partnerTotal)}</div>
            </div>
          </div>
        </div>
      `;
        }).join('');

        // Detailed Table
        const thead = document.getElementById('k1TableHead');
        thead.innerHTML = `<th>K-1 Line Item</th><th>Partnership Total</th>${partners.map(p => `<th>${p.name} (${p.pct}%)</th>`).join('')}`;

        const tbody = document.getElementById('k1TableBody');
        tbody.innerHTML = k1Lines.map(line => {
            return `
        <tr>
          <td><strong>${line.label}</strong></td>
          <td>${fmt(line.total)}</td>
          ${partners.map(p => {
                let val = line.total * (p.pct / 100);
                if (line.key === 'guaranteed' && partners.length > 1) val = line.total / partners.length;
                return `<td>${fmt(val)}</td>`;
            }).join('')}
        </tr>
      `;
        }).join('') + `
      <tr style="background:rgba(59,130,246,0.06);font-weight:700;">
        <td><strong>Total</strong></td>
        <td><strong>${fmt(totalIncome)}</strong></td>
        ${partners.map(p => `<td><strong>${fmt(totalIncome * (p.pct / 100))}</strong></td>`).join('')}
      </tr>
    `;

        // Charts
        renderCharts(data, ordinaryIncome, totalIncome);

        showToast('K-1 allocations generated successfully!', 'success');
    }

    function renderCharts(data, ordinaryIncome, totalIncome) {
        const chartColors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#f97316', '#ec4899'];

        // Income Breakdown Doughnut
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');
        if (incomeChart) incomeChart.destroy();
        incomeChart = new Chart(incomeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ordinary Income', 'Rental Income', 'Interest', 'Dividends', 'Short-Term CG', 'Long-Term CG', 'Section 1231'],
                datasets: [{
                    data: [ordinaryIncome, data.rentalIncome, data.interestIncome, data.dividendIncome, data.stcg, data.ltcg, data.sec1231],
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 }
                    }
                },
                cutout: '65%'
            }
        });

        // Allocation Bar Chart
        const allocCtx = document.getElementById('allocationChart').getContext('2d');
        if (allocationChart) allocationChart.destroy();
        allocationChart = new Chart(allocCtx, {
            type: 'bar',
            data: {
                labels: partners.map(p => p.name.split(' – ')[0]),
                datasets: [{
                    label: 'Total Allocation',
                    data: partners.map(p => totalIncome * (p.pct / 100)),
                    backgroundColor: chartColors.slice(0, partners.length),
                    borderRadius: 8,
                    borderWidth: 0,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { family: 'Inter' } }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8', font: { family: 'Inter' }, callback: v => '$' + (v / 1000).toFixed(0) + 'k' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        setupPartners();

        document.getElementById('setupPartnersBtn').addEventListener('click', () => {
            setupPartners();
            showToast('Partners updated!', 'info');
        });

        document.getElementById('generateBtn').addEventListener('click', generate);

        // Auto-validate percentages on change
        document.getElementById('partnerInputs').addEventListener('input', collectPartners);
    });

})();
