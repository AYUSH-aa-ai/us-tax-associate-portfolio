// ==========================================
// Project 6: AI Tax Research Assistant
// IRC Knowledge Engine + Conversational AI
// ==========================================

(function () {
    'use strict';

    // ---- IRC KNOWLEDGE BASE ----
    const knowledgeBase = {
        '704': {
            title: '§704 – Partner\'s Distributive Share',
            summary: 'Determines how partnership income, gain, loss, deductions, and credits are allocated among partners.',
            details: `<p>Under <span class="msg-highlight">IRC §704(a)</span>, a partner's distributive share of income, gain, loss, deduction, or credit is determined by the partnership agreement.</p>
<p>However, <span class="msg-highlight">§704(b)</span> requires that allocations have <strong>substantial economic effect</strong>. The allocation must be reflected in the partner's capital account, and liquidating distributions must be based on capital account balances.</p>
<p><strong>Key Tests:</strong></p>
<p>1. <strong>Economic Effect Test</strong> – The allocation must affect the partner's economic interest</p>
<p>2. <strong>Substantiality Test</strong> – There must be a reasonable possibility the allocation will substantially affect dollar amounts received</p>
<p>3. <strong>Alternate Test</strong> – If primary test fails, check qualified income offset + DRO provisions</p>`,
            citations: ['IRC §704(a)', 'IRC §704(b)', 'Treas. Reg. §1.704-1(b)(2)', 'Treas. Reg. §1.704-2']
        },
        '731': {
            title: '§731 – Partner Distributions',
            summary: 'Governs the tax treatment of distributions from partnerships to partners.',
            details: `<p><span class="msg-highlight">IRC §731</span> provides that a partner generally does <strong>not recognize gain</strong> on a distribution, except:</p>
<p>1. <strong>Cash exceeds basis</strong> – Gain is recognized to the extent cash distributed exceeds the partner's outside basis</p>
<p>2. <strong>Loss recognition</strong> – Losses are only recognized on <em>liquidating distributions</em> consisting solely of money, unrealized receivables, and inventory</p>
<p><strong>BDO Practice Tip:</strong> Always compare the distribution amount against the partner's outside basis <em>before</em> processing. Common error: forgetting to reduce basis by the partner's share of liabilities.</p>
<p>The distributed property takes a <strong>carryover basis</strong> in the partner's hands, limited to the partner's remaining outside basis.</p>`,
            citations: ['IRC §731(a)(1)', 'IRC §731(a)(2)', 'IRC §732', 'IRC §733']
        },
        '743': {
            title: '§743(b) – Basis Adjustments',
            summary: 'Provides for optional basis adjustments to partnership property upon transfer of a partnership interest.',
            details: `<p><span class="msg-highlight">IRC §743(b)</span> allows a basis adjustment when a partnership interest is transferred by sale or exchange, or upon death of a partner, <strong>if a §754 election is in effect</strong>.</p>
<p><strong>Mandatory §743(b) adjustment</strong> applies if the partnership has a <strong>substantial built-in loss</strong> (>$250,000) per the 2017 TCJA amendment.</p>
<p><strong>Calculation:</strong></p>
<p>§743(b) adjustment = Transferee's outside basis − Share of partnership's inside basis</p>
<p><strong>BDO Practice Alert:</strong> This is one of the most commonly missed adjustments in partnership returns. Always check for recent partner transfers and verify whether a §754 election has been made.</p>`,
            citations: ['IRC §743(b)', 'IRC §754', 'IRC §755', 'Treas. Reg. §1.743-1']
        },
        '751': {
            title: '§751 – Hot Assets (Unrealized Receivables & Inventory)',
            summary: 'Prevents partners from converting ordinary income into capital gain by selling their partnership interest.',
            details: `<p><span class="msg-highlight">IRC §751</span> identifies "hot assets" – <strong>unrealized receivables</strong> and <strong>inventory items</strong> that, if the partnership sold them, would generate ordinary income.</p>
<p><strong>Two applications:</strong></p>
<p>1. <strong>§751(a) – Sales/Exchanges</strong>: When a partner sells their interest, gain attributable to §751 property is treated as ordinary income, not capital gain</p>
<p>2. <strong>§751(b) – Distributions</strong>: Disproportionate distributions of §751 vs non-§751 property trigger deemed sales</p>
<p><strong>Common Hot Assets:</strong></p>
<p>• Accounts receivable (cash-basis partnerships)</p>
<p>• Substantially appreciated inventory (FMV > 120% of basis)</p>
<p>• Depreciation recapture (§1245/§1250 property)</p>`,
            citations: ['IRC §751(a)', 'IRC §751(b)', 'IRC §751(c)', 'IRC §751(d)', 'Treas. Reg. §1.751-1']
        },
        '752': {
            title: '§752 – Treatment of Partnership Liabilities',
            summary: 'Determines how partnership liabilities affect partners\' outside basis.',
            details: `<p><span class="msg-highlight">IRC §752</span> treats increases in a partner's share of partnership liabilities as a <strong>deemed cash contribution</strong>, and decreases as a <strong>deemed cash distribution</strong>.</p>
<p><strong>Recourse vs. Nonrecourse:</strong></p>
<p>• <strong>Recourse liabilities</strong> (§752 + Reg. 1.752-2): Allocated to partners who bear the economic risk of loss</p>
<p>• <strong>Nonrecourse liabilities</strong> (Reg. 1.752-3): Allocated using the three-tier system – (1) minimum gain, (2) §704(c) minimum gain, (3) profit-sharing ratios</p>
<p><strong>BDO Practice Tip:</strong> Liability shifts during partner admissions/withdrawals can trigger unexpected gain recognition under §731 if the deemed distribution exceeds the partner's basis.</p>`,
            citations: ['IRC §752(a)', 'IRC §752(b)', 'Treas. Reg. §1.752-1', 'Treas. Reg. §1.752-2', 'Treas. Reg. §1.752-3']
        },
        '754': {
            title: '§754 – Election for Basis Adjustments',
            summary: 'Election to adjust basis of partnership property on transfer of interest or distribution.',
            details: `<p><span class="msg-highlight">IRC §754</span> allows a partnership to elect to adjust the basis of partnership property under <strong>§734(b)</strong> (distributions) or <strong>§743(b)</strong> (transfers).</p>
<p><strong>Key Points:</strong></p>
<p>• The election is <strong>irrevocable</strong> once made (without IRS consent)</p>
<p>• Applies to <strong>all future</strong> transfers and distributions, not just the triggering event</p>
<p>• Must be filed with the partnership return for the year the election is to take effect</p>
<p><strong>When is it mandatory?</strong></p>
<p>• Substantial built-in loss (>$250,000) under §743(b)</p>
<p>• Substantial basis reduction (>$250,000) under §734(b)</p>
<p><strong>BDO Practice Alert:</strong> Always evaluate whether making a §754 election is beneficial long-term, as it creates additional compliance burden for all future transactions.</p>`,
            citations: ['IRC §754', 'IRC §734(b)', 'IRC §743(b)', 'Treas. Reg. §1.754-1']
        },
        '721': {
            title: '§721 – Contributions to Partnership',
            summary: 'No gain or loss is recognized on contribution of property to a partnership in exchange for a partnership interest.',
            details: `<p><span class="msg-highlight">IRC §721</span> provides the general rule of <strong>nonrecognition</strong> on contributions of property to a partnership.</p>
<p><strong>Exceptions:</strong></p>
<p>1. <strong>Services contribution</strong> – A partner contributing services in exchange for a capital interest recognizes ordinary income</p>
<p>2. <strong>Disguised sales</strong> under §707(a)(2)(B) – Contribution + related distribution may be recharacterized as a sale</p>
<p>3. <strong>Investment partnerships</strong> – §721(b) exception for contributions of appreciated stock/securities to investment companies</p>
<p><strong>Basis rules (§722-723):</strong></p>
<p>• Partner's outside basis = Adjusted basis of contributed property + gain recognized</p>
<p>• Partnership's inside basis = Transferor partner's adjusted basis (carryover)</p>`,
            citations: ['IRC §721(a)', 'IRC §721(b)', 'IRC §722', 'IRC §723', 'IRC §707(a)(2)(B)']
        },
        '1065': {
            title: 'Form 1065 – Partnership Return',
            summary: 'The informational return filed by partnerships to report income, deductions, gains, and losses.',
            details: `<p><span class="msg-highlight">Form 1065</span> is the annual information return for U.S. partnerships. The partnership itself does <strong>not pay income tax</strong> – income flows through to partners via <strong>Schedule K-1</strong>.</p>
<p><strong>Filing Requirements:</strong></p>
<p>• Due date: <strong>March 15</strong> (calendar year) / 15th day of 3rd month after fiscal year-end</p>
<p>• Extension: <strong>6 months</strong> (Form 7004)</p>
<p>• Late filing penalty: <strong>$220/partner/month</strong> (2024 rate), up to 12 months</p>
<p><strong>Key Schedules:</strong></p>
<p>• Schedule K – Partnership-level summary of all items</p>
<p>• Schedule K-1 – Each partner's distributive share</p>
<p>• Schedule K-2/K-3 – International items (added 2021)</p>
<p>• Schedule L – Balance sheet</p>
<p>• Schedule M-1/M-3 – Reconciliation of book vs tax income</p>`,
            citations: ['IRC §6031', 'IRC §6698', 'Form 1065 Instructions', 'Form 7004']
        },
        'k1': {
            title: 'Schedule K-1 – Partner\'s Share',
            summary: 'Reports each partner\'s distributive share of partnership income, deductions, and credits.',
            details: `<p><span class="msg-highlight">Schedule K-1 (Form 1065)</span> is furnished to each partner showing their share of:</p>
<p><strong>Separately Stated Items (Boxes 1-21):</strong></p>
<p>• Box 1: Ordinary business income/loss</p>
<p>• Box 2: Net rental real estate income/loss</p>
<p>• Box 4a-4c: Guaranteed payments</p>
<p>• Box 5: Interest income</p>
<p>• Box 6a: Dividends (ordinary + qualified)</p>
<p>• Box 8-9: Capital gains (short-term + long-term)</p>
<p>• Box 11: §179 deduction</p>
<p>• Box 13: Credits</p>
<p>• Box 14: Self-employment earnings</p>
<p>• Box 20: Other information (§199A, AMT items, etc.)</p>
<p><strong>BDO Practice Tip:</strong> Verify capital account analysis (Box L) reconciles with the partnership's capital accounts. This is now required to be reported on tax basis per IRS Notice 2020-43.</p>`,
            citations: ['Schedule K-1 (Form 1065)', 'IRS Instructions for Schedule K-1', 'IRS Notice 2020-43']
        },
        'basis': {
            title: 'Partner\'s Outside Basis',
            summary: 'The adjusted tax basis a partner has in their partnership interest.',
            details: `<p>A partner's <span class="msg-highlight">outside basis</span> determines the deductibility of losses, tax-free distributions, and gain on disposition.</p>
<p><strong>Basis Ordering Rules:</strong></p>
<p>1. <strong>Initial basis</strong> = Cash contributed + adjusted basis of property contributed</p>
<p>2. <strong>Increases:</strong> Distributive share of income + tax-exempt income + additional contributions + increased share of liabilities</p>
<p>3. <strong>Decreases:</strong> Distributions received + distributive share of losses + nondeductible expenses + decreased share of liabilities</p>
<p><strong>Limitations:</strong></p>
<p>• Losses limited to outside basis (<strong>§704(d)</strong>)</p>
<p>• At-risk rules (<strong>§465</strong>) apply next</p>
<p>• Passive activity rules (<strong>§469</strong>) apply last</p>
<p>• Suspended losses carry forward indefinitely</p>
<p><strong>BDO Practice Alert:</strong> The three-layer loss limitation must be applied in order. A common error is applying §469 before checking §704(d) and §465 limits.</p>`,
            citations: ['IRC §704(d)', 'IRC §705', 'IRC §722', 'IRC §465', 'IRC §469', 'Treas. Reg. §1.704-1(d)']
        },
        'property': {
            title: 'Contributing Appreciated Property',
            summary: 'Special rules apply when a partner contributes property with built-in gain or loss to a partnership.',
            details: `<p>When a partner contributes <span class="msg-highlight">appreciated property</span> (FMV > basis), the partnership takes a <strong>carryover basis</strong> (§723), creating a built-in gain.</p>
<p><strong>§704(c) Allocation Methods:</strong></p>
<p>1. <strong>Traditional Method</strong> – Allocate tax items to match book allocations, subject to "ceiling rule" limitation</p>
<p>2. <strong>Traditional with Curative Allocations</strong> – Use other partnership items to cure ceiling rule distortions</p>
<p>3. <strong>Remedial Method</strong> – Create notional tax items to eliminate ceiling rule effects entirely</p>
<p><strong>Anti-Abuse Rules:</strong></p>
<p>• <strong>§704(c)(1)(B)</strong> – Distribution of contributed property to another partner within 7 years triggers gain to contributing partner</p>
<p>• <strong>§737</strong> – Distribution of other property to contributing partner within 7 years triggers gain to extent of remaining built-in gain</p>`,
            citations: ['IRC §704(c)', 'IRC §723', 'IRC §737', 'Treas. Reg. §1.704-3']
        },
        'self-employment': {
            title: 'Self-Employment Tax for Partners',
            summary: 'Partnership income may be subject to self-employment tax depending on the partner type and activity.',
            details: `<p><span class="msg-highlight">Self-employment (SE) tax</span> is a critical consideration for partnership income allocation.</p>
<p><strong>General Partners:</strong></p>
<p>• Ordinary business income is subject to SE tax</p>
<p>• Guaranteed payments for services are subject to SE tax</p>
<p>• Guaranteed payments for use of capital are <strong>NOT</strong> subject to SE tax</p>
<p><strong>Limited Partners (§1402(a)(13)):</strong></p>
<p>• Generally exempt from SE tax on distributive share</p>
<p>• Guaranteed payments for services <strong>ARE</strong> subject to SE tax</p>
<p><strong>LLC Members:</strong></p>
<p>• No clear statutory rule – IRS proposed regulations never finalized</p>
<p>• Most practitioners follow the "functional test" – active members treated as general partners</p>
<p><strong>2024 SE Tax Rates:</strong> 15.3% (12.4% SS + 2.9% Medicare), plus 0.9% Additional Medicare Tax on earnings over $200K/$250K</p>`,
            citations: ['IRC §1402', 'IRC §1402(a)(13)', 'Prop. Reg. §1.1402(a)-2', 'IRS Pub 533']
        },
        '199a': {
            title: '§199A – Qualified Business Income Deduction',
            summary: 'Allows a 20% deduction for qualified business income from pass-through entities.',
            details: `<p><span class="msg-highlight">IRC §199A</span> provides a deduction of up to <strong>20%</strong> of qualified business income (QBI) from partnerships, S corporations, and sole proprietorships.</p>
<p><strong>Key Limitations:</strong></p>
<p>1. <strong>Taxable income threshold (2024):</strong> $191,950 (single) / $383,900 (MFJ) — below this, the deduction is generally allowed in full</p>
<p>2. <strong>W-2 wage limitation:</strong> Above the threshold, deduction is limited to the greater of (a) 50% of W-2 wages, or (b) 25% of W-2 wages + 2.5% of UBIA of qualified property</p>
<p>3. <strong>Specified Service Trades or Businesses (SSTBs):</strong> Health, law, accounting, consulting, athletics, financial services — deduction phases out above threshold</p>
<p><strong>BDO Practice Tip:</strong> For partnership clients, ensure each partner's K-1 reports all §199A information (Box 20 codes Z, AA, AB). Aggregation elections under Reg. 1.199A-4 can optimize the deduction across multiple businesses.</p>`,
            citations: ['IRC §199A', 'Treas. Reg. §1.199A-1 through -6', 'IRS Notice 2019-07', 'Form 8995/8995-A']
        },
        'bba': {
            title: 'BBA Partnership Audit Rules',
            summary: 'The Bipartisan Budget Act of 2015 replaced TEFRA with a centralized partnership audit regime.',
            details: `<p>The <span class="msg-highlight">BBA audit regime</span> (effective for tax years beginning after 2017) fundamentally changed how the IRS audits partnerships.</p>
<p><strong>Key Features:</strong></p>
<p>1. <strong>Partnership Representative (PR):</strong> Replaces the Tax Matters Partner — has sole authority to bind the partnership and all partners during audit proceedings</p>
<p>2. <strong>Imputed Underpayment:</strong> Default rule — the IRS assesses and collects any adjustment at the partnership level, at the highest individual tax rate</p>
<p>3. <strong>Push-Out Election (§6226):</strong> Partnership can elect to "push out" adjustments to reviewed year partners, who then adjust their own returns</p>
<p>4. <strong>Modification Procedures (§6225(c)):</strong> Partnership can reduce the imputed underpayment by showing amended returns, tax-exempt partners, or lower rates</p>
<p><strong>Small Partnership Opt-Out:</strong> Partnerships with ≤100 partners (all individuals, C corps, S corps, or estates) can elect out annually.</p>
<p><strong>BDO Practice Alert:</strong> Every partnership agreement should address PR designation, indemnification, and push-out election authority. This is one of the most overlooked provisions in modern partnership agreements.</p>`,
            citations: ['IRC §6221-6241', 'IRC §6223', 'IRC §6225', 'IRC §6226', 'Treas. Reg. §301.6221-1 through 301.6241-7']
        },
        '736': {
            title: '§736 – Payments to Retiring/Deceased Partners',
            summary: 'Governs the tax treatment of liquidating payments made to a retiring partner or successor of a deceased partner.',
            details: `<p><span class="msg-highlight">IRC §736</span> divides payments to retiring/deceased partners into two categories:</p>
<p><strong>§736(a) Payments</strong> — Treated as distributive share or guaranteed payments:</p>
<p>• Includes amounts for unrealized receivables and unstated goodwill (in service partnerships without written agreement valuing goodwill)</p>
<p>• Ordinary income to the recipient, deductible by the partnership</p>
<p><strong>§736(b) Payments</strong> — Treated as distributions in exchange for partnership interest:</p>
<p>• Payments for the partner's share of partnership property</p>
<p>• Generally capital gain treatment under §731/§741</p>
<p><strong>Critical Distinction:</strong> Whether the partnership is a <em>service partnership</em> or <em>capital-intensive partnership</em> affects how unrealized receivables and goodwill are classified.</p>
<p><strong>BDO Practice Tip:</strong> Structure the buyout agreement carefully — the allocation between §736(a) and §736(b) payments has significant tax consequences for both the retiring partner and remaining partners.</p>`,
            citations: ['IRC §736(a)', 'IRC §736(b)', 'IRC §741', 'Treas. Reg. §1.736-1']
        },
        'guaranteed': {
            title: 'Guaranteed Payments (§707(c))',
            summary: 'Fixed payments to partners for services or capital use, determined without regard to partnership income.',
            details: `<p><span class="msg-highlight">Guaranteed payments</span> under §707(c) are amounts paid to a partner for services or capital that are determined <strong>without regard to partnership income</strong>.</p>
<p><strong>Key Characteristics:</strong></p>
<p>1. Treated as <strong>ordinary income</strong> to the recipient partner</p>
<p>2. <strong>Deductible</strong> by the partnership (like a salary expense)</p>
<p>3. Reported on Schedule K-1, Box 4a-4c</p>
<p>4. Included in the partner's <strong>self-employment income</strong> (if for services)</p>
<p><strong>Timing Rule:</strong> Guaranteed payments are included in the partner's income for the partner's tax year that includes the <em>end</em> of the partnership's tax year — not when actually paid.</p>
<p><strong>Common Pitfall:</strong> Many practitioners confuse guaranteed payments with §707(a) payments (partner acting in non-partner capacity). The distinction matters for self-employment tax, deduction timing, and withholding requirements.</p>
<p><strong>BDO Practice Alert:</strong> If a guaranteed payment creates a partnership loss, the loss is allocated among all partners (including the recipient) per their profit-sharing ratios — the recipient doesn't bear the entire loss.</p>`,
            citations: ['IRC §707(c)', 'IRC §707(a)', 'Treas. Reg. §1.707-1(c)', 'IRS Pub 541']
        }
    };

    // ---- QUICK QUESTIONS ----
    const quickQuestions = [
        "What are the key deadlines for Form 1065?",
        "How does §704(b) substantial economic effect work?",
        "When is a §754 election mandatory?",
        "How are partnership liabilities allocated?",
        "What triggers self-employment tax for partners?",
        "Explain the hot asset rules under §751",
        "What is the §199A QBI deduction?",
        "How do the BBA audit rules work?",
        "How are retiring partner payments taxed?",
        "What are guaranteed payments?"
    ];

    // ---- RESPONSE MAPPING ----
    function findResponse(query) {
        const q = query.toLowerCase();
        const mappings = [
            { keywords: ['1065', 'form 1065', 'partnership return', 'filing', 'deadline', 'due date', 'when', 'march 15', 'filing date', 'extension', 'late filing', 'penalty form'], topic: '1065' },
            { keywords: ['k-1', 'k1', 'schedule k', 'distributive share', 'box 1', 'boxes', 'k-1 box'], topic: 'k1' },
            { keywords: ['704', 'allocat', 'substantial economic', 'special allocation', 'economic effect'], topic: '704' },
            { keywords: ['731', 'distribution to partner', 'cash distribution', 'liquidating distribution'], topic: '731' },
            { keywords: ['743', 'basis adjust', 'transfer of interest', 'buy sell'], topic: '743' },
            { keywords: ['754', 'election', 'optional adjustment', 'irrevocable'], topic: '754' },
            { keywords: ['751', 'hot asset', 'unrealized receivable', 'inventory', 'ordinary income convert'], topic: '751' },
            { keywords: ['752', 'liabilit', 'recourse', 'nonrecourse', 'debt', 'economic risk'], topic: '752' },
            { keywords: ['721', 'contribut', 'nonrecognition', 'property contribut'], topic: '721' },
            { keywords: ['basis', 'outside basis', '704(d)', '705', 'loss limit', 'at-risk', 'passive'], topic: 'basis' },
            { keywords: ['self-employment', 'se tax', 'fica', '1402', 'self employment', 'medicare', 'social security'], topic: 'self-employment' },
            { keywords: ['appreciated', 'built-in gain', '704(c)', 'ceiling rule', 'remedial', 'curative'], topic: 'property' },
            { keywords: ['199a', 'qbi', 'qualified business income', '20% deduction', 'pass-through deduction', 'sstb', 'specified service'], topic: '199a' },
            { keywords: ['bba', 'audit', 'partnership representative', 'tefra', 'imputed underpayment', 'push-out', 'centralized audit', '6221', '6226'], topic: 'bba' },
            { keywords: ['736', 'retiring partner', 'deceased partner', 'buyout', 'liquidating payment', 'retirement payment'], topic: '736' },
            { keywords: ['guaranteed payment', '707(c)', '707c', 'guaranteed', 'salary partner', 'fixed payment'], topic: 'guaranteed' },
        ];

        for (const map of mappings) {
            if (map.keywords.some(kw => q.includes(kw))) {
                return knowledgeBase[map.topic];
            }
        }

        // Try fuzzy matching — check if any knowledge base title words match
        for (const [key, entry] of Object.entries(knowledgeBase)) {
            const titleWords = entry.title.toLowerCase().split(/[\s–—,]+/).filter(w => w.length > 3);
            if (titleWords.some(w => q.includes(w))) {
                return entry;
            }
        }

        // Default response
        return {
            title: 'Let me point you in the right direction',
            summary: 'I didn\'t find an exact match, but here are related topics.',
            details: `<p>I'm not sure which topic you're asking about. Here are the areas I can help with:</p>
<p>• <strong>Partnership income</strong> → Ask about §704</p>
<p>• <strong>Distributions</strong> → Ask about §731</p>
<p>• <strong>Basis adjustments</strong> on transfers → Ask about §743 / §754</p>
<p>• <strong>Hot assets</strong> → Ask about §751</p>
<p>• <strong>Liability allocation</strong> → Ask about §752</p>
<p>• <strong>Property contributions</strong> → Ask about §721</p>
<p>• <strong>QBI deduction</strong> → Ask about §199A</p>
<p>• <strong>Partnership audits</strong> → Ask about BBA rules</p>
<p>• <strong>Retiring partners</strong> → Ask about §736</p>
<p>• <strong>Guaranteed payments</strong> → Ask about §707(c)</p>
<p>• <strong>Form 1065 / K-1</strong> → Ask about Form 1065 or K-1</p>
<p>Try using a specific IRC section number, or describe what you're working on and I'll do my best!</p>`,
            citations: ['IRC Subchapter K (§§701-777)']
        };
    }

    // ---- CHAT STATE ----
    let messageHistory = [];
    let queriesAnswered = 0;

    // ---- RENDER ----
    function renderQuickQuestions() {
        const container = document.getElementById('quickQuestions');
        container.innerHTML = quickQuestions.map(q =>
            `<button class="quick-q-btn" onclick="askQuestion('${q.replace(/'/g, "\\'")}')">${q}</button>`
        ).join('');
    }

    function renderIRCTopics() {
        const container = document.getElementById('ircTopics');
        const topics = Object.keys(knowledgeBase);
        container.innerHTML = topics.map(key => {
            const label = key.startsWith('§') ? key : (isNaN(key) ? key : `§${key}`);
            return `<button class="irc-chip" onclick="askQuestion('Explain ${knowledgeBase[key].title}')">${knowledgeBase[key].title.split('–')[0].trim()}</button>`;
        }).join('');
    }

    function addMessage(content, isUser = false, citations = []) {
        const chatMessages = document.getElementById('chatMessages');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'user' : 'ai'}`;

        let citationsHtml = '';
        if (citations.length > 0) {
            citationsHtml = `<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">${citations.map(c => `<span class="citation">📖 ${c}</span>`).join('')}</div>`;
        }

        msgDiv.innerHTML = `
            <div class="msg-avatar">${isUser ? '👤' : '🤖'}</div>
            <div>
                <div class="msg-content">${content}${citationsHtml}</div>
                <div class="msg-time">${timeStr}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function updateStats() {
        document.getElementById('statQueries').textContent = queriesAnswered;
        document.getElementById('statSections').textContent = Object.keys(knowledgeBase).length;
    }

    // ---- GLOBAL FUNCTION ----
    window.askQuestion = function (question) {
        const input = document.getElementById('chatInput');
        input.value = '';

        // Add user message
        addMessage(question, true);

        // Show typing
        showTypingIndicator();

        // Simulate AI processing time
        const delay = 800 + Math.random() * 1200;
        setTimeout(() => {
            removeTypingIndicator();

            // Find response
            const response = findResponse(question);
            const aiContent = `<strong>${response.title}</strong><br><br>${response.details}`;
            addMessage(aiContent, false, response.citations);

            queriesAnswered++;
            updateStats();
        }, delay);
    };

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        renderQuickQuestions();
        renderIRCTopics();
        updateStats();

        // Welcome message
        addMessage(
            `<strong>Hey — welcome to your tax research co-pilot.</strong><br><br>
            <p>I know <strong>${Object.keys(knowledgeBase).length} IRC topics</strong> inside out, from §704 allocations to the new BBA audit rules. I can pull up code sections, Treasury Regulations, and real BDO practice tips in seconds.</p>
            <p>Just type a question, click a quick question on the left, or try something like: <em>"What are the hot asset rules?"</em> or <em>"How do guaranteed payments work?"</em></p>`,
            false,
            ['IRC Subchapter K (§§701-777)']
        );

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => {
            const input = document.getElementById('chatInput');
            if (input.value.trim()) {
                window.askQuestion(input.value.trim());
            }
        });

        // Enter key
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = document.getElementById('chatInput');
                if (input.value.trim()) {
                    window.askQuestion(input.value.trim());
                }
            }
        });
    });

})();
