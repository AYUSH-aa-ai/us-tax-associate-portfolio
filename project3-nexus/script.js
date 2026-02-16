// ==========================================
// Project 3: Multi-State Tax Nexus Tracker
// ==========================================

(function () {
    'use strict';

    const statesData = [
        { abbr: 'AL', name: 'Alabama', rate: '5.0%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'AK', name: 'Alaska', rate: '0%', type: 'No Income Tax', apportion: 'N/A', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'AZ', name: 'Arizona', rate: '2.5%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'AR', name: 'Arkansas', rate: '4.4%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'CA', name: 'California', rate: '13.3%', type: 'Income Tax + Franchise Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'No', noTax: false },
        { abbr: 'CO', name: 'Colorado', rate: '4.4%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'CT', name: 'Connecticut', rate: '6.99%', type: 'Income Tax + PTE Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes (Mandatory)', composite: 'Yes', noTax: false },
        { abbr: 'DE', name: 'Delaware', rate: '6.6%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 30', ext: '5.5 months', pte: 'No', composite: 'Yes', noTax: false },
        { abbr: 'FL', name: 'Florida', rate: '5.5%', type: 'Corporate Income Tax', apportion: 'Single Sales Factor', due: 'Apr 1', ext: '6 months', pte: 'No', composite: 'N/A', noTax: false },
        { abbr: 'GA', name: 'Georgia', rate: '5.49%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'HI', name: 'Hawaii', rate: '11.0%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 20', ext: '6 months', pte: 'No', composite: 'Yes', noTax: false },
        { abbr: 'ID', name: 'Idaho', rate: '5.8%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'IL', name: 'Illinois', rate: '4.95%', type: 'Income Tax (Flat) + PTE', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'IN', name: 'Indiana', rate: '3.05%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'IA', name: 'Iowa', rate: '5.7%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 30', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'KS', name: 'Kansas', rate: '5.7%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'KY', name: 'Kentucky', rate: '4.0%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'LA', name: 'Louisiana', rate: '4.25%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'May 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'ME', name: 'Maine', rate: '7.15%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MD', name: 'Maryland', rate: '5.75%', type: 'Income Tax + PTE', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MA', name: 'Massachusetts', rate: '5.0%', type: 'Income Tax (Flat) + PTE', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MI', name: 'Michigan', rate: '4.25%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MN', name: 'Minnesota', rate: '9.85%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MS', name: 'Mississippi', rate: '5.0%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MO', name: 'Missouri', rate: '4.8%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'MT', name: 'Montana', rate: '6.75%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'NE', name: 'Nebraska', rate: '5.84%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'NV', name: 'Nevada', rate: '0%', type: 'No Income Tax', apportion: 'N/A', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'NH', name: 'New Hampshire', rate: '3.0%', type: 'Interest & Dividends Tax', apportion: '3-Factor', due: 'Apr 15', ext: '6 months', pte: 'No', composite: 'No', noTax: false },
        { abbr: 'NJ', name: 'New Jersey', rate: '10.75%', type: 'Income Tax + PTE', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'NM', name: 'New Mexico', rate: '5.9%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'NY', name: 'New York', rate: '10.9%', type: 'Income Tax + PTE + NYC', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'NC', name: 'North Carolina', rate: '4.5%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'ND', name: 'North Dakota', rate: '2.5%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'OH', name: 'Ohio', rate: '0%/CAT', type: 'No Inc Tax (CAT applies)', apportion: 'Situsing', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'No', noTax: false },
        { abbr: 'OK', name: 'Oklahoma', rate: '4.75%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'OR', name: 'Oregon', rate: '9.9%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'PA', name: 'Pennsylvania', rate: '3.07%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'RI', name: 'Rhode Island', rate: '5.99%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'SC', name: 'South Carolina', rate: '6.4%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'SD', name: 'South Dakota', rate: '0%', type: 'No Income Tax', apportion: 'N/A', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'TN', name: 'Tennessee', rate: '0%', type: 'No Income Tax', apportion: 'N/A', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'TX', name: 'Texas', rate: '0%/Margin', type: 'No Inc Tax (Margin Tax)', apportion: 'Gross Receipts', due: 'May 15', ext: '6 months', pte: 'N/A', composite: 'N/A', noTax: false },
        { abbr: 'UT', name: 'Utah', rate: '4.65%', type: 'Income Tax (Flat)', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'VT', name: 'Vermont', rate: '8.75%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'VA', name: 'Virginia', rate: '5.75%', type: 'Income Tax', apportion: 'Double-Weighted Sales', due: 'May 1', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'WA', name: 'Washington', rate: '0%/B&O', type: 'No Inc Tax (B&O Tax)', apportion: 'Gross Receipts', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'WV', name: 'West Virginia', rate: '6.5%', type: 'Income Tax', apportion: '3-Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'WI', name: 'Wisconsin', rate: '7.65%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'Yes', composite: 'Yes', noTax: false },
        { abbr: 'WY', name: 'Wyoming', rate: '0%', type: 'No Income Tax', apportion: 'N/A', due: 'N/A', ext: 'N/A', pte: 'N/A', composite: 'N/A', noTax: true },
        { abbr: 'DC', name: 'District of Columbia', rate: '10.75%', type: 'Income Tax', apportion: 'Single Sales Factor', due: 'Apr 15', ext: '6 months', pte: 'No', composite: 'No', noTax: false },
    ];

    const selected = new Set();

    function renderGrid(filter = '') {
        const grid = document.getElementById('stateGrid');
        const filtered = statesData.filter(s =>
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.abbr.toLowerCase().includes(filter.toLowerCase())
        );

        grid.innerHTML = filtered.map(s => `
      <div class="state-tile ${selected.has(s.abbr) ? 'selected' : ''} ${s.noTax ? 'no-income-tax' : ''}" data-abbr="${s.abbr}">
        <div class="state-abbr">${s.abbr}</div>
        <div class="state-name">${s.name}</div>
        <div class="state-rate">${s.noTax ? 'No Income Tax' : 'Top: ' + s.rate}</div>
      </div>
    `).join('');

        // Attach click events
        grid.querySelectorAll('.state-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const abbr = tile.dataset.abbr;
                if (selected.has(abbr)) {
                    selected.delete(abbr);
                    tile.classList.remove('selected');
                } else {
                    selected.add(abbr);
                    tile.classList.add('selected');
                }
                updateDetail();
            });
        });
    }

    function updateDetail() {
        const detailSection = document.getElementById('detailSection');
        const selectedStates = statesData.filter(s => selected.has(s.abbr));

        // Stats
        document.getElementById('nexusCount').textContent = selected.size;
        document.getElementById('filingCount').textContent = selectedStates.filter(s => !s.noTax).length;

        const rates = selectedStates.filter(s => !s.noTax).map(s => parseFloat(s.rate));
        const avg = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : '0';
        document.getElementById('avgRate').textContent = avg + '%';

        if (selected.size === 0) {
            detailSection.style.display = 'none';
            return;
        }

        detailSection.style.display = 'block';

        const tbody = document.getElementById('detailTable');
        tbody.innerHTML = selectedStates.map(s => `
      <tr>
        <td><strong>${s.abbr}</strong> – ${s.name}</td>
        <td>${s.type}</td>
        <td><strong>${s.rate}</strong></td>
        <td>${s.apportion}</td>
        <td>${s.due}</td>
        <td>${s.ext}</td>
        <td><span class="${s.pte === 'Yes' || s.pte === 'Yes (Mandatory)' ? 'tag-yes' : s.pte === 'No' ? 'tag-no' : 'tag-none'}">${s.pte}</span></td>
        <td><span class="${s.composite === 'Yes' ? 'tag-yes' : s.composite === 'No' ? 'tag-no' : 'tag-none'}">${s.composite}</span></td>
      </tr>
    `).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderGrid();

        document.getElementById('stateSearch').addEventListener('input', (e) => {
            renderGrid(e.target.value);
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            statesData.forEach(s => selected.add(s.abbr));
            renderGrid(document.getElementById('stateSearch').value);
            updateDetail();
            showToast('All 51 jurisdictions selected', 'info');
        });

        document.getElementById('clearAllBtn').addEventListener('click', () => {
            selected.clear();
            renderGrid(document.getElementById('stateSearch').value);
            updateDetail();
            showToast('Selection cleared', 'info');
        });

        document.getElementById('selectCommonBtn').addEventListener('click', () => {
            selected.clear();
            ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'NJ', 'GA', 'MA', 'CT'].forEach(s => selected.add(s));
            renderGrid(document.getElementById('stateSearch').value);
            updateDetail();
            showToast('Common nexus states selected (10 states)', 'success');
        });
    });

})();
