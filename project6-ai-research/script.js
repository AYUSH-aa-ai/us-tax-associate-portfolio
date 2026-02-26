// ==========================================
// Project 6: AI Tax Research Assistant
// OpenRouter API — Real Conversational AI
// ==========================================

(function () {
    'use strict';

    // ---- CONFIGURATION ----
    const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';
    const APP_NAME = 'TaxPro AI Research Assistant';
    const APP_URL = window.location.href;

    // ---- SYSTEM PROMPT ----
    const SYSTEM_PROMPT = `You are **TaxPro AI**, an elite US Tax Research Assistant specialising in partnership (Subchapter K) and corporate taxation.

## Your Knowledge Domains
- IRC Subchapter K (§§701-777): Partnership formation, allocations, distributions, transfers, liabilities, basis adjustments
- §704 — Partner's distributive share & substantial economic effect
- §721 — Nonrecognition on contributions to partnerships
- §731/§732/§733 — Distributions (current & liquidating)
- §743(b)/§754/§755 — Optional basis adjustments on transfers
- §751 — Hot assets (unrealized receivables & inventory)
- §752 — Treatment of partnership liabilities (recourse vs nonrecourse)
- §199A — Qualified Business Income (QBI) deduction for pass-throughs
- §736 — Payments to retiring/deceased partners
- §707(c) — Guaranteed payments
- BBA Partnership Audit Regime (§§6221-6241)
- Self-employment tax rules for partners (§1402)
- Form 1065, Schedule K-1, Form 1120, and related schedules
- Corporate tax (§11, flat 21%), dividends-received deduction (§243), NOLs (§172), accumulated earnings tax (§531-537)
- Treasury Regulations, IRS Notices & Revenue Procedures

## Response Guidelines
1. **Always cite** the specific IRC section, Treasury Regulation, or IRS guidance you reference (e.g., "Under IRC §704(b)…", "Per Treas. Reg. §1.704-1(b)(2)…").
2. Provide **practical tips** and common pitfalls that practitioners encounter.
3. Use clear structure with bold headings, bullet points, and numbered lists.
4. When comparing alternatives (e.g., §704(c) methods), present them side-by-side.
5. If a question is outside US tax law, politely note your specialisation and answer to the best of your ability.
6. Keep answers thorough but concise — aim for clarity over length.
7. Format your responses in **Markdown** (bold, italic, bullets, numbered lists, headings). Do NOT use raw HTML tags.
8. When discussing forms, mention key line numbers and boxes where relevant.
9. If something is uncertain or a grey area, say so honestly and note the prevailing practitioner view.`;

    // ---- IRC TOPICS FOR SIDEBAR ----
    const ircTopics = [
        { key: '704', label: '§704 Allocations' },
        { key: '721', label: '§721 Contributions' },
        { key: '731', label: '§731 Distributions' },
        { key: '743', label: '§743(b) Basis Adj.' },
        { key: '751', label: '§751 Hot Assets' },
        { key: '752', label: '§752 Liabilities' },
        { key: '754', label: '§754 Election' },
        { key: '199a', label: '§199A QBI' },
        { key: '736', label: '§736 Retiring Partners' },
        { key: '707c', label: '§707(c) Guar. Payments' },
        { key: 'bba', label: 'BBA Audit Rules' },
        { key: '1065', label: 'Form 1065' },
        { key: 'k1', label: 'Schedule K-1' },
        { key: '1120', label: 'Form 1120' },
        { key: 'se', label: 'Self-Employment Tax' },
    ];

    // ---- QUICK QUESTIONS ----
    const quickQuestions = [
        "What are the key deadlines for Form 1065?",
        "What is Form 1120 and when is it due?",
        "How does §704(b) substantial economic effect work?",
        "When is a §754 election mandatory?",
        "How are partnership liabilities allocated under §752?",
        "What triggers self-employment tax for partners?",
        "Explain the hot asset rules under §751",
        "What is the §199A QBI deduction?",
        "How do the BBA audit rules work?",
        "How are retiring partner payments taxed under §736?",
        "What are guaranteed payments under §707(c)?",
        "What is the dividends-received deduction for C-corps?",
        "Explain §704(c) allocation methods for contributed property",
        "What is a partner's outside basis and how is it calculated?"
    ];

    // ---- CHAT STATE ----
    let conversationMessages = []; // OpenRouter message history
    let queriesAnswered = 0;
    let isStreaming = false;

    // ---- API KEY MANAGEMENT ----
    function getApiKey() {
        return localStorage.getItem('openrouter_api_key') || '';
    }

    function saveApiKey(key) {
        localStorage.setItem('openrouter_api_key', key.trim());
    }

    function clearApiKey() {
        localStorage.removeItem('openrouter_api_key');
    }

    function getModel() {
        const select = document.getElementById('modelSelect');
        return select ? select.value : DEFAULT_MODEL;
    }

    // ---- MARKDOWN → HTML CONVERTER ----
    function markdownToHtml(md) {
        let html = md;

        // Code blocks (```...```)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Headings (### → h5, ## → h4, # → h3)
        html = html.replace(/^### (.+)$/gm, '<h5 style="margin:12px 0 6px;color:var(--accent-purple);">$1</h5>');
        html = html.replace(/^## (.+)$/gm, '<h4 style="margin:14px 0 8px;color:var(--accent-blue);">$1</h4>');
        html = html.replace(/^# (.+)$/gm, '<h3 style="margin:16px 0 10px;">$1</h3>');

        // Unordered lists
        html = html.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');

        // Numbered lists
        html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

        // Wrap consecutive <li> in <ul> / <ol>
        html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul style="margin:8px 0;padding-left:20px;">$1</ul>');

        // Paragraphs — wrap lines that aren't already HTML
        html = html.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('<')) return trimmed;
            return `<p style="margin:6px 0;">${trimmed}</p>`;
        }).join('\n');

        // Highlight IRC section references
        html = html.replace(/(§\d+[A-Za-z]?(?:\([a-z0-9]+\))*)/g, '<span class="msg-highlight">$1</span>');
        html = html.replace(/(IRC\s+§?\d+[A-Za-z]?)/g, '<span class="msg-highlight">$1</span>');
        html = html.replace(/(Treas\.\s*Reg\.\s*§[\d.\-]+(?:\([a-z0-9]+\))*)/g, '<span class="msg-highlight">$1</span>');

        return html;
    }

    // ---- OPENROUTER API CALL ----
    async function callOpenRouter(userMessage) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API_KEY_MISSING');
        }

        // Add user message to conversation history
        conversationMessages.push({ role: 'user', content: userMessage });

        // Keep last 20 messages to avoid token overflow
        const recentMessages = conversationMessages.slice(-20);

        const body = {
            model: getModel(),
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...recentMessages
            ],
            stream: true,
            temperature: 0.4,
            max_tokens: 2048,
        };

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': APP_URL,
                'X-Title': APP_NAME,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            if (response.status === 401 || response.status === 403) {
                throw new Error('INVALID_API_KEY');
            }
            if (response.status === 429) {
                throw new Error('RATE_LIMITED');
            }
            throw new Error(errData.error?.message || `API error: ${response.status}`);
        }

        return response;
    }

    // ---- STREAM RESPONSE ----
    async function streamResponse(response, msgContentEl) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]') continue;
                if (!trimmed.startsWith('data: ')) continue;

                try {
                    const json = JSON.parse(trimmed.slice(6));
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullContent += delta;
                        // Update the message content with converted markdown
                        msgContentEl.innerHTML = markdownToHtml(fullContent);
                        // Auto-scroll
                        const chatMessages = document.getElementById('chatMessages');
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                } catch (e) {
                    // Skip malformed chunks
                }
            }
        }

        // Save assistant message to conversation history
        if (fullContent) {
            conversationMessages.push({ role: 'assistant', content: fullContent });
        }

        return fullContent;
    }

    // ---- RENDER FUNCTIONS ----
    function renderQuickQuestions() {
        const container = document.getElementById('quickQuestions');
        container.innerHTML = quickQuestions.map(q =>
            `<button class="quick-q-btn" onclick="askQuestion('${q.replace(/'/g, "\\'")}')">${q}</button>`
        ).join('');
    }

    function renderIRCTopics() {
        const container = document.getElementById('ircTopics');
        container.innerHTML = ircTopics.map(t =>
            `<button class="irc-chip" onclick="askQuestion('Explain ${t.label} in detail')">${t.label}</button>`
        ).join('');
    }

    function addMessage(content, isUser = false, isHtml = false) {
        const chatMessages = document.getElementById('chatMessages');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'user' : 'ai'}`;

        const displayContent = isHtml ? content : (isUser ? content : markdownToHtml(content));

        msgDiv.innerHTML = `
            <div class="msg-avatar">${isUser ? '👤' : '🤖'}</div>
            <div>
                <div class="msg-content">${displayContent}</div>
                <div class="msg-time">${timeStr}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

    function addStreamingMessage() {
        const chatMessages = document.getElementById('chatMessages');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg ai';
        msgDiv.id = 'streamingMsg';

        msgDiv.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div>
                <div class="msg-content streaming-content">
                    <span class="streaming-cursor"></span>
                </div>
                <div class="msg-time">${timeStr}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv.querySelector('.msg-content');
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
        document.getElementById('statSections').textContent = ircTopics.length;
    }

    function showError(message) {
        const chatMessages = document.getElementById('chatMessages');
        const errDiv = document.createElement('div');
        errDiv.className = 'chat-error';
        errDiv.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${message}</span>
        `;
        chatMessages.appendChild(errDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ---- MAIN ASK FUNCTION ----
    window.askQuestion = async function (question) {
        if (isStreaming) return;

        const input = document.getElementById('chatInput');
        input.value = '';

        // Add user message
        addMessage(question, true);

        // Check API key
        const apiKey = getApiKey();
        if (!apiKey) {
            showError('Please enter your OpenRouter API key above to start chatting. <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--accent-blue);text-decoration:underline;">Get a free key →</a>');
            return;
        }

        // Show typing indicator
        showTypingIndicator();
        isStreaming = true;
        setInputState(false);

        try {
            const response = await callOpenRouter(question);

            // Remove typing, add streaming message placeholder
            removeTypingIndicator();
            const msgContentEl = addStreamingMessage();

            // Stream the response
            const fullContent = await streamResponse(response, msgContentEl);

            // Remove streaming cursor
            msgContentEl.classList.remove('streaming-content');

            if (!fullContent) {
                msgContentEl.innerHTML = '<em>No response received. Please try again.</em>';
            }

            queriesAnswered++;
            updateStats();

        } catch (err) {
            removeTypingIndicator();

            if (err.message === 'API_KEY_MISSING') {
                showError('Please enter your OpenRouter API key above. <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--accent-blue);text-decoration:underline;">Get a free key →</a>');
            } else if (err.message === 'INVALID_API_KEY') {
                showError('Invalid API key. Please check your key and try again. <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--accent-blue);text-decoration:underline;">Manage keys →</a>');
            } else if (err.message === 'RATE_LIMITED') {
                showError('Rate limited — please wait a moment and try again.');
            } else {
                showError(`Something went wrong: ${err.message}`);
            }

            // Remove the failed user message from conversation history
            if (conversationMessages.length && conversationMessages[conversationMessages.length - 1].role === 'user') {
                conversationMessages.pop();
            }
        } finally {
            isStreaming = false;
            setInputState(true);
        }
    };

    function setInputState(enabled) {
        const input = document.getElementById('chatInput');
        const btn = document.getElementById('sendBtn');
        input.disabled = !enabled;
        btn.disabled = !enabled;
        btn.style.opacity = enabled ? '1' : '0.5';
    }

    // ---- API KEY UI ----
    function initApiKeyUI() {
        const keyInput = document.getElementById('apiKeyInput');
        const saveBtn = document.getElementById('apiKeySaveBtn');
        const clearBtn = document.getElementById('apiKeyClearBtn');
        const statusDot = document.getElementById('apiKeyStatus');

        // Load saved key
        const savedKey = getApiKey();
        if (savedKey) {
            keyInput.value = savedKey;
            statusDot.classList.add('connected');
            statusDot.title = 'API key saved';
        }

        saveBtn.addEventListener('click', () => {
            const key = keyInput.value.trim();
            if (key) {
                saveApiKey(key);
                statusDot.classList.add('connected');
                statusDot.title = 'API key saved';
                addMessage('✅ API key saved! I\'m ready to answer your tax questions. Try asking me anything about partnership or corporate taxation.', false, true);
            }
        });

        clearBtn.addEventListener('click', () => {
            keyInput.value = '';
            clearApiKey();
            statusDot.classList.remove('connected');
            statusDot.title = 'No API key';
        });

        // Save on Enter in key input
        keyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveBtn.click();
            }
        });
    }

    // ---- NEW CHAT ----
    window.newChat = function () {
        conversationMessages = [];
        queriesAnswered = 0;
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        updateStats();
        showWelcome();
    };

    // ---- WELCOME MESSAGE ----
    function showWelcome() {
        const hasKey = !!getApiKey();
        const keyMsg = hasKey
            ? '<p>Your API key is loaded — <strong>ask me anything!</strong></p>'
            : '<p>⚠️ Enter your <a href="https://openrouter.ai/keys" target="_blank" style="color:var(--accent-blue);text-decoration:underline;">OpenRouter API key</a> above to get started.</p>';

        addMessage(
            `<strong>Hey — welcome to your AI-powered tax research co-pilot.</strong><br><br>
            <p>I'm connected to a real AI model and can give you <strong>expert-level answers</strong> on US partnership tax (Subchapter K), corporate tax (Form 1120), and more. I cite IRC sections, Treasury Regulations, and provide practical tips — just like a senior tax associate would.</p>
            ${keyMsg}
            <p>Try asking: <em>"How does §704(b) substantial economic effect work?"</em> or click a quick question on the left.</p>`,
            false,
            true
        );
    }

    // ---- INIT ----
    document.addEventListener('DOMContentLoaded', () => {
        renderQuickQuestions();
        renderIRCTopics();
        updateStats();
        initApiKeyUI();
        showWelcome();

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => {
            const input = document.getElementById('chatInput');
            if (input.value.trim() && !isStreaming) {
                window.askQuestion(input.value.trim());
            }
        });

        // Enter key
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = document.getElementById('chatInput');
                if (input.value.trim() && !isStreaming) {
                    window.askQuestion(input.value.trim());
                }
            }
        });
    });

})();
