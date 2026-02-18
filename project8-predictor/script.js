// ==========================================
// Project 8: Predictive Tax Liability Engine
// ML-Simulated Forecasting & Optimization
// ==========================================

(function () {
    'use strict';

    // ---- OPTIMIZATION STRATEGIES ----
    const optimizations = [
        { icon: '📊', title: 'Maximize §199A QBI Deduction', desc: 'Restructure guaranteed payments to optimize the 20% QBI deduction. Ensure SSTB threshold compliance.', savings: '$24,800', impact: 'high' },
        { icon: '🏗️', title: 'Accelerate §179 Depreciation', desc: 'Elect §179 for qualifying equipment purchases to front-load deductions in the current tax year.', savings: '$18,500', impact: 'high' },
        { icon: '🏠', title: 'Cost Segregation Study', desc: 'Reclassify building components to shorter MACRS lives. Particularly effective for rental real estate holdings.', savings: '$32,000', impact: 'high' },
        { icon: '🎯', title: 'Charitable Contribution Strategy', desc: 'Consider donating appreciated long-term capital gain property to maximize deduction and avoid capital gains tax.', savings: '$8,200', impact: 'medium' },
        { icon: '⏰', title: 'Income Timing Optimization', desc: 'Defer income recognition to next tax year where possible. Accelerate deductible expenses into current year.', savings: '$15,600', impact: 'medium' },
        { icon: '🏥', title: 'Health Insurance Deduction', desc: 'Partners can deduct health insurance premiums as an above-the-line deduction. Ensure proper reporting on K-1.', savings: '$6,800', impact: 'medium' },
        { icon: '🏦', title: 'Retirement Plan Contributions', desc: 'Maximize SEP-IRA or Solo 401(k) contributions. Partners can contribute up to $69,000 (2025) to reduce taxable income.', savings: '$22,400', impact: 'high' },
        { icon: '📍', title: 'State Tax PTE Election', desc: 'Evaluate pass-through entity tax elections in states that offer SALT cap workarounds (e.g., CA, NY, CT, NJ).', savings: '$12,000', impact: 'medium' },
        { icon: '🔄', title: 'Loss Harvesting', desc: 'Realize capital losses to offset gains. Ensure §704(d) basis is sufficient to absorb partnership losses.', savings: '$9,400', impact: 'medium' },
        { icon: '🌍', title: 'International Tax Credits', desc: 'If partnership has foreign-source income, maximize foreign tax credits under §901/§904 before §199A computation.', savings: '$5,200', impact: 'low' },
        { icon: '📋', title: 'Guaranteed Payment Restructuring', desc: 'Convert guaranteed payments to profit allocations where appropriate to reduce SE tax and maximize QBI.', savings: '$14,200', impact: 'high' },
        { icon: '🏛️', title: 'Estimated Payment Optimization', desc: 'Use annualized income installment method to reduce quarterly estimated payments during low-income quarters.', savings: '$3,800', impact: 'low' },
    ];

    // ---- PREDICTION ENGINE ----
    function predict(income, deductions, capitalGains, stateRate, partners) {
        const netIncome = income - deductions;
        const totalIncome = netIncome + capitalGains;
        const perPartner = totalIncome / partners;

        // Federal tax calculation (simplified progressive)
        let federalTax = 0;
        const brackets = [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 },
            { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
        ];

        let remaining = perPartner;
        let prev = 0;
        for (const bracket of brackets) {
            const taxable = Math.min(remaining, bracket.limit - prev);
            federalTax += taxable * bracket.rate;
            remaining -= taxable;
            prev = bracket.limit;
            if (remaining <= 0) break;
        }

        const totalFederal = federalTax * partners;

        // SE tax
        const seIncome = netIncome * 0.9235;
        const ssTax = Math.min(seIncome, 168600) * 0.124;
        const medicareTax = seIncome * 0.029;
        const additionalMedicare = Math.max(0, seIncome - 200000) * 0.009;
        const totalSE = ssTax + medicareTax + additionalMedicare;

        // Capital gains tax (simplified)
        const cgRate = perPartner > 492300 ? 0.20 : (perPartner > 47025 ? 0.15 : 0);
        const cgTax = capitalGains * cgRate;

        // State tax
        const stateTax = totalIncome * (stateRate / 100);

        // NIIT
        const niit = Math.max(0, (capitalGains - 250000)) * 0.038;

        // QBI deduction
        const qbi = Math.min(netIncome * 0.20, perPartner * 0.20 * partners);

        const totalLiability = totalFederal + totalSE + cgTax + stateTax + niit - (qbi * 0.24);
        const effectiveRate = (totalLiability / totalIncome) * 100;

        // Risk score (0-100)
        let riskScore = 30; // base
        if (effectiveRate > 35) riskScore += 20;
        if (stateRate > 8) riskScore += 10;
        if (capitalGains > 200000) riskScore += 10;
        if (deductions / income < 0.15) riskScore += 15;
        if (partners > 5) riskScore += 5;
        riskScore = Math.min(riskScore, 95);

        return {
            totalLiability: Math.round(totalLiability),
            federalTax: Math.round(totalFederal),
            seTax: Math.round(totalSE),
            cgTax: Math.round(cgTax),
            stateTax: Math.round(stateTax),
            niit: Math.round(niit),
            qbiDeduction: Math.round(qbi),
            effectiveRate: effectiveRate.toFixed(1),
            riskScore: Math.round(riskScore),
            perPartner: Math.round(perPartner),
            quarterly: Math.round(totalLiability / 4),
            netIncome: Math.round(netIncome),
            totalIncome: Math.round(totalIncome),
        };
    }

    // ---- RENDER RISK GAUGE ----
    function renderRiskGauge(score) {
        const gauge = document.getElementById('riskGauge');
        const circumference = Math.PI * 80; // half circle
        const offset = circumference - (score / 100) * circumference;

        let color;
        let label;
        if (score < 40) { color = '#10b981'; label = 'Low Risk'; }
        else if (score < 70) { color = '#f59e0b'; label = 'Moderate Risk'; }
        else { color = '#f43f5e'; label = 'High Risk'; }

        gauge.innerHTML = `
            <svg viewBox="0 0 200 120">
                <path class="gauge-bg" d="M 20 100 A 80 80 0 0 1 180 100" />
                <path class="gauge-fill" d="M 20 100 A 80 80 0 0 1 180 100"
                    stroke="${color}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}" />
            </svg>
            <div class="gauge-value" style="color:${color}">${score}</div>
        `;

        document.getElementById('riskLabel').textContent = label;
        document.getElementById('riskLabel').style.color = color;
    }

    // ---- RENDER FORECAST CARDS ----
    function renderForecast(result) {
        const grid = document.getElementById('forecastGrid');
        const cards = [
            { icon: '💰', label: 'Total Tax Liability', value: formatCurrency(result.totalLiability), change: '+4.2% vs prior yr', changeClass: 'up' },
            { icon: '🏛️', label: 'Federal Income Tax', value: formatCurrency(result.federalTax), change: 'Progressive rates', changeClass: 'neutral' },
            { icon: '📊', label: 'SE Tax', value: formatCurrency(result.seTax), change: '15.3% rate', changeClass: 'neutral' },
            { icon: '📈', label: 'Capital Gains Tax', value: formatCurrency(result.cgTax), change: result.cgTax > 0 ? 'LT rate applied' : 'No gains', changeClass: result.cgTax > 0 ? 'up' : 'down' },
            { icon: '🏠', label: 'State Tax', value: formatCurrency(result.stateTax), change: 'State rate applied', changeClass: 'neutral' },
            { icon: '📉', label: 'Effective Rate', value: result.effectiveRate + '%', change: result.effectiveRate > 30 ? 'Above avg' : 'Below avg', changeClass: result.effectiveRate > 30 ? 'up' : 'down' },
        ];

        grid.innerHTML = cards.map(c => `
            <div class="forecast-card glass-card">
                <span class="fc-icon">${c.icon}</span>
                <div class="fc-value">${c.value}</div>
                <div class="fc-label">${c.label}</div>
                <span class="fc-change ${c.changeClass}">${c.change}</span>
            </div>
        `).join('');
    }

    // ---- RENDER QUARTERLY ----
    function renderQuarterly(quarterly) {
        const grid = document.getElementById('quarterlyGrid');
        const quarters = [
            { label: 'Q1', due: 'Apr 15, 2026', status: 'due' },
            { label: 'Q2', due: 'Jun 15, 2026', status: 'upcoming' },
            { label: 'Q3', due: 'Sep 15, 2026', status: 'upcoming' },
            { label: 'Q4', due: 'Jan 15, 2027', status: 'upcoming' },
        ];

        grid.innerHTML = quarters.map(q => `
            <div class="quarter-card glass-card">
                <span class="q-status ${q.status}">${q.status === 'paid' ? '✓ Paid' : q.status === 'due' ? '⏰ Due' : '📅 Upcoming'}</span>
                <div class="q-label">${q.label}</div>
                <div class="q-amount">${formatCurrency(quarterly)}</div>
                <div class="q-due">${q.due}</div>
            </div>
        `).join('');
    }

    // ---- RENDER OPTIMIZATIONS ----
    function renderOptimizations(result) {
        const panel = document.getElementById('optimizationList');
        const relevant = optimizations.filter(o => {
            if (o.title.includes('QBI') && result.netIncome < 50000) return false;
            if (o.title.includes('Capital') && result.cgTax === 0) return false;
            if (o.title.includes('International') && result.totalIncome < 500000) return false;
            return true;
        }).slice(0, 8);

        panel.innerHTML = relevant.map(o => `
            <div class="opt-item ${o.impact}">
                <span class="opt-icon">${o.icon}</span>
                <div class="opt-info">
                    <h4>${o.title}</h4>
                    <p>${o.desc}</p>
                </div>
                <span class="opt-savings">Save ${o.savings}</span>
            </div>
        `).join('');
    }

    // ---- RENDER CHART ----
    function renderChart(result) {
        const chart = document.getElementById('trendChart');
        const years = ['2022', '2023', '2024', '2025', '2026 (Pred)'];
        const multiplier = result.totalLiability;
        const values = [
            Math.round(multiplier * 0.72),
            Math.round(multiplier * 0.81),
            Math.round(multiplier * 0.88),
            Math.round(multiplier * 0.95),
            multiplier,
        ];
        const max = Math.max(...values);

        chart.innerHTML = values.map((v, i) => {
            const height = (v / max) * 140;
            const isPrediction = i === 4;
            const bg = isPrediction ? 'var(--gradient-main)' : 'rgba(59,130,246,0.3)';
            return `
                <div class="chart-bar-group">
                    <div class="chart-bar" style="height:${height}px;background:${bg};" data-tooltip="${formatCurrency(v)}"></div>
                    <span class="chart-bar-label">${years[i]}</span>
                </div>
            `;
        }).join('');
    }

    // ---- RENDER SCENARIO ----
    function renderScenario(result) {
        const container = document.getElementById('scenarioContent');
        const optimized = predict(
            result.totalIncome * 1.0,
            result.totalIncome - result.netIncome + 69000 + 15000,
            0,
            parseFloat(document.getElementById('stateRate').value) || 5,
            parseInt(document.getElementById('partners').value) || 3
        );

        container.innerHTML = `
            <div class="scenario-comparison">
                <div class="scenario-col glass-card">
                    <h4>📊 Current Projection</h4>
                    <div class="scenario-row"><span class="label">Total Liability</span><span class="value">${formatCurrency(result.totalLiability)}</span></div>
                    <div class="scenario-row"><span class="label">Effective Rate</span><span class="value">${result.effectiveRate}%</span></div>
                    <div class="scenario-row"><span class="label">Federal Tax</span><span class="value">${formatCurrency(result.federalTax)}</span></div>
                    <div class="scenario-row"><span class="label">SE Tax</span><span class="value">${formatCurrency(result.seTax)}</span></div>
                    <div class="scenario-row"><span class="label">State Tax</span><span class="value">${formatCurrency(result.stateTax)}</span></div>
                    <div class="scenario-row"><span class="label">Quarterly Est.</span><span class="value">${formatCurrency(result.quarterly)}</span></div>
                </div>
                <div class="scenario-col glass-card">
                    <h4>✨ Optimized Scenario</h4>
                    <div class="scenario-row"><span class="label">Total Liability</span><span class="value" style="color:var(--accent-emerald)">${formatCurrency(optimized.totalLiability)}</span></div>
                    <div class="scenario-row"><span class="label">Effective Rate</span><span class="value" style="color:var(--accent-emerald)">${optimized.effectiveRate}%</span></div>
                    <div class="scenario-row"><span class="label">Federal Tax</span><span class="value">${formatCurrency(optimized.federalTax)}</span></div>
                    <div class="scenario-row"><span class="label">SE Tax</span><span class="value">${formatCurrency(optimized.seTax)}</span></div>
                    <div class="scenario-row"><span class="label">State Tax</span><span class="value">${formatCurrency(optimized.stateTax)}</span></div>
                    <div class="scenario-row"><span class="label">Quarterly Est.</span><span class="value">${formatCurrency(optimized.quarterly)}</span></div>
                </div>
            </div>
            <div class="scenario-diff">
                💰 Potential Savings: ${formatCurrency(Math.max(0, result.totalLiability - optimized.totalLiability))}
            </div>
        `;
    }

    // ---- RUN PREDICTION ----
    window.runPrediction = function () {
        const income = parseFloat(document.getElementById('income').value) || 800000;
        const deductions = parseFloat(document.getElementById('deductions').value) || 180000;
        const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 50000;
        const stateRate = parseFloat(document.getElementById('stateRate').value) || 5;
        const partners = parseInt(document.getElementById('partners').value) || 3;

        const result = predict(income, deductions, capitalGains, stateRate, partners);

        renderRiskGauge(result.riskScore);
        renderForecast(result);
        renderQuarterly(result.quarterly);
        renderOptimizations(result);
        renderChart(result);
        renderScenario(result);

        // Show results area
        document.getElementById('resultsArea').style.display = 'flex';
        document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth', block: 'start' });

        showToast(`Prediction complete — Risk Score: ${result.riskScore}/100`, result.riskScore < 40 ? 'success' : result.riskScore < 70 ? 'warning' : 'error');
    };

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        // Pre-fill and auto-run
        setTimeout(() => { runPrediction(); }, 500);
    });

})();
