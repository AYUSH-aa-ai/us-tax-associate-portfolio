// ==========================================
// SHARED UTILITIES – US Tax Associate Portfolio
// ==========================================

// Intersection Observer for scroll-triggered animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// Tab switching utility
function initTabs(container) {
    const tabsEl = container || document;
    tabsEl.querySelectorAll('.tabs').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const panelId = tab.dataset.panel;
                if (panelId) {
                    const panels = tabGroup.parentElement.querySelectorAll('.tab-panel');
                    panels.forEach(p => {
                        p.style.display = p.id === panelId ? 'block' : 'none';
                    });
                }
            });
        });
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Format percentage
function formatPercent(value) {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}

// Counter animation
function animateCounter(element, target, duration = 1500) {
    let start = 0;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
}

// Theme Toggle
function initTheme() {
    const saved = localStorage.getItem('taxai-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light'); // default light
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcons(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('taxai-theme', next);
    updateToggleIcons(next);
}

function updateToggleIcons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const colors = {
        info: 'var(--accent-blue)',
        success: 'var(--accent-emerald)',
        warning: 'var(--accent-amber)',
        error: 'var(--accent-rose)'
    };
    const toast = document.createElement('div');
    toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 14px 24px; border-radius: 12px;
    background: var(--bg-secondary); color: var(--text-primary);
    border: 1px solid ${colors[type]}; box-shadow: var(--shadow-lg);
    font-family: var(--font-body), sans-serif; font-size: 0.9rem;
    animation: fadeInUp 0.4s ease-out;
    display: flex; align-items: center; gap: 8px;
  `;
    toast.innerHTML = `<span style="color:${colors[type]}">●</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollAnimations();
    initTabs();
    // Bind all theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
});
