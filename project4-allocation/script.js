// ==========================================
// Project 4: Partnership Income Allocation Calculator
// ==========================================

(function () {
    'use strict';

    const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
    let pieChart = null, barChart = null;

    const defaultPartners = [
        { name: 'Partner A – Managing', profit: 50, loss: 50, guaranteed: 120000, capital: 300000 },
        { name: 'Partner B – General', profit: 30, loss: 30, guaranteed: 60000, capital: 200000 },
        { name: 'Partner C – Limited', profit: 20, loss: 20, guaranteed: 0, capital: 150000 }
    ];

    function setupPartners() {
        const num = parseInt(document.getElementById('numPartners').value);
        const container = document.getElementById('partnerConfig');
        container.innerHTML = '';

        for (let i = 0; i < num; i++) {
            const d = defaultPartners[i] || { name: `Partner ${String.fromCharCode(65 + i)}`, profit: Math.floor(100 / num), loss: Math.floor(100 / num), guaranteed: 0, capital: 100000 };
            container.innerHTML += `
        <div class="partner-config-row">
          <div class="pc-header">
            <div class="pc-dot" style="background:${colors[i]}"></div>
            <span>Partner ${i + 1}</span>
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem;color:var(--text-muted);">Name</label>
            <input type="text" class="form-control p-name" value="${d.name}">
          </div>
          <div class="pc-fields">
            <div>
              <label>Profit %</label>
              <input type="number" class="form-control p-profit" value="${d.profit}" min="0" max="100" step="0.1">
            </div>
            <div>
              <label>Loss %</label>
              <input type="number" class="form-control p-loss" value="${d.loss}" min="0" max="100" step="0.1">
            </div>
            <div>
              <label>Guaranteed ($)</label>
              <input type="number" class="form-control p-guaranteed" value="${d.guaranteed}">
            </div>
            <div>
              <label>Opening Capital ($)</label>
              <input type="number" class="form-control p-capital" value="${d.capital}">
            </div>
          </div>
        </div>
      `;
        }
    }

    function getVal(id) { return parseFloat(document.getElementById(id).value) || 0; }
    function fmt(n) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n); }

    function calculate() {
        // Collect partner data
        const names = document.querySelectorAll('.p-name');
        const profits = document.querySelectorAll('.p-profit');
        const losses = document.querySelectorAll('.p-loss');
        const guaranteeds = document.querySelectorAll('.p-guaranteed');
        const capitals = document.querySelectorAll('.p-capital');

        const partners = [];
        let totalProfit = 0, totalLoss = 0, totalGuaranteed = 0;

        names.forEach((el, i) => {
            const p = {
                name: el.value,
                profitPct: parseFloat(profits[i].value) || 0,
                lossPct: parseFloat(losses[i].value) || 0,
                guaranteed: parseFloat(guaranteeds[i].value) || 0,
                openingCapital: parseFloat(capitals[i].value) || 0
            };
            partners.push(p);
            totalProfit += p.profitPct;
            totalLoss += p.lossPct;
            totalGuaranteed += p.guaranteed;
        });

        // Validate ratios
        const hint = document.getElementById('ratioHint');
        if (Math.abs(totalProfit - 100) > 0.1 || Math.abs(totalLoss - 100) > 0.1) {
            hint.style.color = 'var(--accent-rose)';
            hint.textContent = `⚠️ Profit total: ${totalProfit.toFixed(1)}%, Loss total: ${totalLoss.toFixed(1)}% — both must equal 100%`;
            showToast('Fix ratios before calculating', 'error');
            return;
        }
        hint.style.color = 'var(--accent-emerald)';
        hint.textContent = '✅ Ratios validated';

        // Financials
        const ordinaryIncome = getVal('ordinaryIncome');
        const rentalIncome = getVal('rentalIncome');
        const interestIncome = getVal('interestIncome');
        const dividendIncome = getVal('dividendIncome');
        const capitalGains = getVal('capitalGains');
        const sec1231 = getVal('sec1231');
        const charitable = getVal('charitable');
        const sec179 = getVal('sec179');
        const foreignTax = getVal('foreignTax');
        const distributions = getVal('distributions');

        // Ordinary income after guaranteed payments
        const ordinaryAfterGP = ordinaryIncome - totalGuaranteed;
        const totalIncome = ordinaryIncome + rentalIncome + interestIncome + dividendIncome + capitalGains + sec1231;
        const totalDeductions = charitable + sec179;

        // Allocate to each partner
        partners.forEach((p, i) => {
            const r = p.profitPct / 100;
            p.allocOrdinary = ordinaryAfterGP * r;
            p.allocGuaranteed = p.guaranteed;
            p.allocRental = rentalIncome * r;
            p.allocInterest = interestIncome * r;
            p.allocDividend = dividendIncome * r;
            p.allocCapGains = capitalGains * r;
            p.allocSec1231 = sec1231 * r;
            p.allocCharitable = charitable * r;
            p.allocSec179 = sec179 * r;
            p.allocFTC = foreignTax * r;
            p.allocDistribution = distributions * r;
            p.totalAllocated = p.allocOrdinary + p.allocGuaranteed + p.allocRental +
                p.allocInterest + p.allocDividend + p.allocCapGains + p.allocSec1231;
            p.totalDeductions = p.allocCharitable + p.allocSec179;

            // Capital account movement
            p.capitalContributions = 0;
            p.capitalAllocations = p.totalAllocated - p.totalDeductions;
            p.capitalDistributions = p.allocDistribution;
            p.closingCapital = p.openingCapital + p.capitalAllocations - p.capitalDistributions;

            // Tax basis
            p.beginningBasis = p.openingCapital;
            p.basisIncrease = p.totalAllocated;
            p.basisDecrease = p.totalDeductions + p.allocDistribution;
            p.endingBasis = p.beginningBasis + p.basisIncrease - p.basisDecrease;
        });

        // Show results
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Summary Cards
        document.getElementById('summaryCards').innerHTML = `
      <div class="summary-stat glass-card">
        <div class="ss-label">Total Partnership Income</div>
        <div class="ss-value" style="color:var(--accent-emerald);">${fmt(totalIncome)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Total Guaranteed Payments</div>
        <div class="ss-value" style="color:var(--accent-amber);">${fmt(totalGuaranteed)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Total Distributions</div>
        <div class="ss-value" style="color:var(--accent-cyan);">${fmt(distributions)}</div>
      </div>
      <div class="summary-stat glass-card">
        <div class="ss-label">Net After Deductions</div>
        <div class="ss-value" style="color:var(--accent-purple);">${fmt(totalIncome - totalDeductions)}</div>
      </div>
    `;

        // Partner Detail Cards
        document.getElementById('partnerCards').innerHTML = partners.map((p, i) => `
      <div class="partner-result-card glass-card animate-fade-in-up delay-${i + 1}">
        <div class="prc-header">
          <h3>${p.name}</h3>
          <span class="badge" style="background:${colors[i]}22;color:${colors[i]};">${p.profitPct}% Profit / ${p.lossPct}% Loss</span>
        </div>
        <div class="prc-grid">
          <div class="prc-item">
            <div class="prc-label">Ordinary Income (Line 1)</div>
            <div class="prc-value positive">${fmt(p.allocOrdinary)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Guaranteed Payments (Line 4)</div>
            <div class="prc-value positive">${fmt(p.allocGuaranteed)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Rental Income (Line 2)</div>
            <div class="prc-value positive">${fmt(p.allocRental)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Interest Income (Line 5)</div>
            <div class="prc-value positive">${fmt(p.allocInterest)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Dividends (Line 6a)</div>
            <div class="prc-value positive">${fmt(p.allocDividend)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Capital Gains (Line 9a)</div>
            <div class="prc-value positive">${fmt(p.allocCapGains)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Section 1231 (Line 10)</div>
            <div class="prc-value positive">${fmt(p.allocSec1231)}</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Charitable (Line 13a)</div>
            <div class="prc-value negative">(${fmt(p.allocCharitable)})</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Section 179 (Line 12)</div>
            <div class="prc-value negative">(${fmt(p.allocSec179)})</div>
          </div>
          <div class="prc-item">
            <div class="prc-label">Foreign Tax Credit (Line 15)</div>
            <div class="prc-value" style="color:var(--accent-cyan);">${fmt(p.allocFTC)}</div>
          </div>
          <div class="prc-item" style="background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.2);">
            <div class="prc-label" style="color:var(--accent-blue);">Total Allocated Income</div>
            <div class="prc-value positive" style="font-size:1.25rem;">${fmt(p.totalAllocated)}</div>
          </div>
          <div class="prc-item" style="background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.2);">
            <div class="prc-label" style="color:var(--accent-amber);">Distribution Received</div>
            <div class="prc-value" style="color:var(--accent-amber);font-size:1.25rem;">${fmt(p.allocDistribution)}</div>
          </div>
        </div>
      </div>
    `).join('');

        // Capital Account Table
        const capitalHead = document.getElementById('capitalHead');
        capitalHead.innerHTML = `<th>Item</th>${partners.map(p => `<th>${p.name.split(' – ')[0]}</th>`).join('')}<th>Total</th>`;

        const capitalRows = [
            { label: 'Opening Capital', key: 'openingCapital' },
            { label: '+ Income Allocations', key: 'capitalAllocations' },
            { label: '− Distributions', key: 'capitalDistributions' },
            { label: 'Closing Capital', key: 'closingCapital' }
        ];

        document.getElementById('capitalBody').innerHTML = capitalRows.map(r => {
            const total = partners.reduce((s, p) => s + p[r.key], 0);
            const bold = r.key === 'closingCapital' ? 'font-weight:700;' : '';
            return `<tr style="${bold}"><td>${r.label}</td>${partners.map(p => `<td>${fmt(p[r.key])}</td>`).join('')}<td><strong>${fmt(total)}</strong></td></tr>`;
        }).join('');

        // Tax Basis Table
        const basisHead = document.getElementById('basisHead');
        basisHead.innerHTML = `<th>Item</th>${partners.map(p => `<th>${p.name.split(' – ')[0]}</th>`).join('')}<th>Total</th>`;

        const basisRows = [
            { label: 'Beginning Basis', key: 'beginningBasis' },
            { label: '+ Income Allocations', key: 'basisIncrease' },
            { label: '− Deductions + Distributions', key: 'basisDecrease' },
            { label: 'Ending Outside Basis', key: 'endingBasis' }
        ];

        document.getElementById('basisBody').innerHTML = basisRows.map(r => {
            const total = partners.reduce((s, p) => s + p[r.key], 0);
            const bold = r.key === 'endingBasis' ? 'font-weight:700;' : '';
            return `<tr style="${bold}"><td>${r.label}</td>${partners.map(p => `<td>${fmt(p[r.key])}</td>`).join('')}<td><strong>${fmt(total)}</strong></td></tr>`;
        }).join('');

        // Charts
        renderCharts(partners);
        showToast('Allocations calculated successfully!', 'success');
    }

    function renderCharts(partners) {
        const pieCtx = document.getElementById('allocationPie').getContext('2d');
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: partners.map(p => p.name.split(' – ')[0]),
                datasets: [{
                    data: partners.map(p => p.totalAllocated),
                    backgroundColor: colors.slice(0, partners.length),
                    borderWidth: 0, hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 12, usePointStyle: true } }
                }
            }
        });

        const barCtx = document.getElementById('breakdownBar').getContext('2d');
        if (barChart) barChart.destroy();

        const items = ['Ordinary', 'Guaranteed', 'Rental', 'Interest', 'Dividends', 'Cap Gains', 'Sec 1231'];
        const datasets = partners.map((p, i) => ({
            label: p.name.split(' – ')[0],
            data: [p.allocOrdinary, p.allocGuaranteed, p.allocRental, p.allocInterest, p.allocDividend, p.allocCapGains, p.allocSec1231],
            backgroundColor: colors[i],
            borderRadius: 4, borderWidth: 0
        }));

        barChart = new Chart(barCtx, {
            type: 'bar',
            data: { labels: items, datasets },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 12, usePointStyle: true } }
                },
                scales: {
                    x: { stacked: true, ticks: { color: '#94a3b8', font: { family: 'Inter' } }, grid: { display: false } },
                    y: { stacked: true, ticks: { color: '#94a3b8', font: { family: 'Inter' }, callback: v => '$' + (v / 1000).toFixed(0) + 'k' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupPartners();
        document.getElementById('numPartners').addEventListener('change', setupPartners);
        document.getElementById('calculateBtn').addEventListener('click', calculate);
    });

})();
