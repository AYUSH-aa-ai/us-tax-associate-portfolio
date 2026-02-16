// ==========================================
// Project 5: Tax Filing Workflow & Deadline Manager
// ==========================================

(function () {
    'use strict';

    // ---- KANBAN DATA ----
    const kanbanColumns = [
        {
            id: 'backlog',
            title: '📥 Document Collection',
            color: 'var(--text-muted)',
            cards: [
                { title: 'Get engagement letter signed', client: 'New Client LLC', priority: 'high', due: 'Feb 28' },
                { title: 'Request prior year returns', client: 'Delta Partners LP', priority: 'medium', due: 'Feb 20' },
                { title: 'Collect 1099-INT/DIV/B', client: 'Sigma Holdings LLP', priority: 'medium', due: 'Mar 1' },
            ]
        },
        {
            id: 'dataentry',
            title: '📝 Data Entry',
            color: 'var(--accent-blue)',
            cards: [
                { title: 'Input trial balance into CCH', client: 'Alpha Ventures LLP', priority: 'high', due: 'Feb 25' },
                { title: 'Reconcile bank statements', client: 'Beta Capital Partners', priority: 'medium', due: 'Feb 22' },
                { title: 'Compute depreciation schedules', client: 'Alpha Ventures LLP', priority: 'low', due: 'Mar 1' },
            ]
        },
        {
            id: 'review',
            title: '🔍 Review',
            color: 'var(--accent-amber)',
            cards: [
                { title: 'Senior review – Form 1065', client: 'Gamma Investments LP', priority: 'high', due: 'Mar 5' },
                { title: 'QC check K-1 allocations', client: 'Gamma Investments LP', priority: 'high', due: 'Mar 6' },
            ]
        },
        {
            id: 'filing',
            title: '📤 E-File',
            color: 'var(--accent-cyan)',
            cards: [
                { title: 'E-file federal Form 1065', client: 'Omega Group LLP', priority: 'high', due: 'Mar 10' },
                { title: 'File state returns (CA, NY)', client: 'Omega Group LLP', priority: 'medium', due: 'Mar 12' },
            ]
        },
        {
            id: 'done',
            title: '✅ Completed',
            color: 'var(--accent-emerald)',
            cards: [
                { title: 'Filed – Form 1065 + K-1s', client: 'Epsilon Holdings LLP', priority: 'low', due: 'Feb 15' },
                { title: 'Distributed K-1s to partners', client: 'Epsilon Holdings LLP', priority: 'low', due: 'Feb 15' },
                { title: 'Filed – CA & NY state returns', client: 'Epsilon Holdings LLP', priority: 'low', due: 'Feb 16' },
            ]
        }
    ];

    // ---- CALENDAR DATA ----
    const taxDeadlines = [
        { date: '2026-01-15', title: 'Q4 2025 Estimated Tax Due', type: 'federal' },
        { date: '2026-01-31', title: 'W-2 & 1099-NEC Due', type: 'federal' },
        { date: '2026-02-28', title: 'Form 1099-MISC Due (paper)', type: 'federal' },
        { date: '2026-03-01', title: 'Internal: All data entry complete', type: 'internal' },
        { date: '2026-03-05', title: 'Internal: Senior review deadline', type: 'internal' },
        { date: '2026-03-10', title: 'Internal: QC review deadline', type: 'internal' },
        { date: '2026-03-15', title: 'Form 1065 Due (Fed)', type: 'federal' },
        { date: '2026-03-15', title: 'Schedule K-1s Due to Partners', type: 'federal' },
        { date: '2026-03-15', title: 'Form 7004 Extension Due', type: 'federal' },
        { date: '2026-03-15', title: 'CA Form 565 Due', type: 'state' },
        { date: '2026-03-15', title: 'NY IT-204 Due', type: 'state' },
        { date: '2026-03-15', title: 'IL Form IL-1065 Due', type: 'state' },
        { date: '2026-04-01', title: 'FL F-1065 Due', type: 'state' },
        { date: '2026-04-15', title: 'Individual 1040 Due', type: 'federal' },
        { date: '2026-04-15', title: 'Q1 2026 Estimated Tax Due', type: 'federal' },
        { date: '2026-04-15', title: 'FBAR (FinCEN 114) Due', type: 'federal' },
        { date: '2026-04-15', title: 'Most state returns due', type: 'state' },
        { date: '2026-05-01', title: 'VA Form 502 Due', type: 'state' },
        { date: '2026-05-15', title: 'TX Margin Tax Due', type: 'state' },
        { date: '2026-06-15', title: 'Q2 2026 Estimated Tax Due', type: 'federal' },
        { date: '2026-09-15', title: 'Extended Form 1065 Due', type: 'federal' },
        { date: '2026-09-15', title: 'Q3 2026 Estimated Tax Due', type: 'federal' },
        { date: '2026-10-15', title: 'Extended 1040 Due', type: 'federal' },
        { date: '2026-10-15', title: 'Extended FBAR Due', type: 'federal' },
    ];

    // ---- CLIENT DATA ----
    const clients = [
        { name: 'Alpha Ventures LLP', ein: '12-3456789', partners: 3, status: 'in-progress', assigned: 'Associate 1', due: 'Mar 15', progress: 45 },
        { name: 'Beta Capital Partners', ein: '23-4567890', partners: 5, status: 'in-progress', assigned: 'Associate 2', due: 'Mar 15', progress: 30 },
        { name: 'Gamma Investments LP', ein: '34-5678901', partners: 4, status: 'review', assigned: 'Senior 1', due: 'Mar 15', progress: 75 },
        { name: 'Delta Partners LP', ein: '45-6789012', partners: 2, status: 'not-started', assigned: 'Associate 1', due: 'Mar 15', progress: 5 },
        { name: 'Epsilon Holdings LLP', ein: '56-7890123', partners: 3, status: 'filed', assigned: 'Associate 2', due: 'Feb 15', progress: 100 },
        { name: 'Omega Group LLP', ein: '67-8901234', partners: 6, status: 'in-progress', assigned: 'Senior 2', due: 'Mar 15', progress: 60 },
        { name: 'Sigma Holdings LLP', ein: '78-9012345', partners: 4, status: 'not-started', assigned: 'Associate 1', due: 'Sep 15', progress: 0 },
        { name: 'New Client LLC', ein: 'Pending', partners: 2, status: 'not-started', assigned: 'TBD', due: 'Sep 15', progress: 0 },
    ];

    let currentMonth = 2; // March (0-indexed)
    let currentYear = 2026;

    // ---- RENDER KANBAN ----
    function renderKanban() {
        const board = document.getElementById('kanbanBoard');
        board.innerHTML = kanbanColumns.map(col => `
      <div class="kanban-column" data-col="${col.id}">
        <div class="kanban-column-header">
          <h4>${col.title}</h4>
          <span class="col-count">${col.cards.length}</span>
        </div>
        <div class="kanban-cards">
          ${col.cards.map(card => `
            <div class="kanban-card" onclick="this.classList.toggle('selected')">
              <div class="kc-title">${card.title}</div>
              <div class="kc-meta">
                <span class="kc-client">${card.client}</span>
                <span class="kc-priority priority-${card.priority}">${card.priority}</span>
              </div>
              <div class="kc-due">📅 ${card.due}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    }

    // ---- RENDER CALENDAR ----
    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const title = document.getElementById('calendarTitle');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();

        let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="cal-header">${d}</div>`).join('');

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const events = taxDeadlines.filter(dl => dl.date === dateStr);
            const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
            const hasDeadline = events.length > 0;

            html += `
        <div class="cal-day ${isToday ? 'today' : ''} ${hasDeadline ? 'has-deadline' : ''}">
          <div class="day-num">${d}</div>
          ${events.map(e => `<span class="day-event ${e.type}">${e.title.substring(0, 20)}${e.title.length > 20 ? '…' : ''}</span>`).join('')}
        </div>
      `;
        }

        grid.innerHTML = html;

        // Render upcoming deadlines
        renderUpcoming();
    }

    function renderUpcoming() {
        const container = document.getElementById('upcomingDeadlines');
        const today = new Date().toISOString().split('T')[0];
        const upcoming = taxDeadlines
            .filter(d => d.date >= '2026-02-16')
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 10);

        container.innerHTML = upcoming.map(d => {
            const date = new Date(d.date + 'T00:00:00');
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const typeClass = d.type === 'federal' ? 'federal' : d.type === 'state' ? 'state' : 'internal';
            const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
            return `
        <div class="deadline-item">
          <div class="dl-date">${dateStr}</div>
          <div class="dl-title">${d.title}</div>
          <span class="dl-type day-event ${typeClass}">${typeLabel}</span>
        </div>
      `;
        }).join('');
    }

    // ---- RENDER CLIENTS ----
    function renderClients() {
        const tbody = document.getElementById('clientTable');
        tbody.innerHTML = clients.map(c => {
            const statusMap = {
                'not-started': { label: 'Not Started', cls: 'status-not-started' },
                'in-progress': { label: 'In Progress', cls: 'status-in-progress' },
                'review': { label: 'Under Review', cls: 'status-review' },
                'filed': { label: 'Filed ✓', cls: 'status-filed' },
                'extended': { label: 'Extended', cls: 'status-extended' }
            };
            const s = statusMap[c.status] || statusMap['not-started'];

            return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.ein}</td>
          <td>${c.partners}</td>
          <td><span class="client-status ${s.cls}">${s.label}</span></td>
          <td>${c.assigned}</td>
          <td>${c.due}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="progress-bar" style="flex:1;">
                <div class="fill" style="width:${c.progress}%;background:${c.progress >= 100 ? 'var(--accent-emerald)' : c.progress >= 50 ? 'var(--accent-blue)' : 'var(--accent-amber)'};"></div>
              </div>
              <span style="font-size:0.78rem;font-weight:600;min-width:32px;">${c.progress}%</span>
            </div>
          </td>
        </tr>
      `;
        }).join('');
    }

    // ---- UPDATE STATS ----
    function updateStats() {
        let totalTasks = 0, inProgress = 0, completed = 0;
        kanbanColumns.forEach(col => {
            totalTasks += col.cards.length;
            if (col.id === 'done') completed += col.cards.length;
            if (col.id === 'dataentry' || col.id === 'review' || col.id === 'filing') inProgress += col.cards.length;
        });

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('inProgress').textContent = inProgress;
        document.getElementById('completed').textContent = completed;

        // Days until March 15, 2026
        const target = new Date('2026-03-15');
        const today = new Date();
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        document.getElementById('daysLeft').textContent = diff > 0 ? diff : '0';
    }

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        renderKanban();
        renderCalendar();
        renderClients();
        updateStats();

        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar();
        });

        document.getElementById('addClientBtn').addEventListener('click', () => {
            showToast('Add client form would open here – you can extend this!', 'info');
        });
    });

})();
