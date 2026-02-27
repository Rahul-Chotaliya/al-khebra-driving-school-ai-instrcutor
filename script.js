// ========== DATA ==========
// Expect DATA and DB objects from data.js

// ========== LANGUAGE ==========
let isArabic = false;
const LANG = {
  en: {
    greetingMorning: 'Good morning, Your Excellency',
    greetingAfternoon: 'Good afternoon, Your Excellency',
    greetingEvening: 'Good evening, Your Excellency',
    welcomeSub: 'I have <strong style="color:var(--gold)">3 urgent strategic insights</strong> waiting for you. What would you like to explore?',
    headerMain: 'CEO Strategic Advisor',
    headerSub: 'AI Intelligence Platform',
    statusText: 'Live Insights',
    chip1: 'Financial Bleed',
    chip2: 'Ethical Risk',
    chip3: 'AV ROI',
    chip4: 'Say hello',
    inputPlaceholder: 'Ask your Strategic Advisor anything...',
    langLabel: 'عربي',
    kpi1: 'Financial Bleed',
    kpi2: 'Ethics Alerts',
    kpi3: 'AV Savings',
    logoName: 'NexSolve LLC',
    logoSub: 'Accelerate Change'
  },
  ar: window.ARABIC_LANG || {
    greetingMorning: 'صباح الخير، سعادة الرئيس',
    greetingAfternoon: 'مساء الخير، سعادة الرئيس',
    greetingEvening: 'مساء النور، سعادة الرئيس',
    welcomeSub: 'لدي <strong style="color:var(--gold)">٣ رؤى استراتيجية عاجلة</strong> بانتظارك. ماذا تود استعراضه؟',
    headerMain: 'المستشار الاستراتيجي للرئيس',
    headerSub: 'منصة الذكاء الاصطناعي',
    statusText: 'رؤى مباشرة',
    chip1: 'النزيف المالي',
    chip2: 'مخاطر أخلاقية',
    chip3: 'عائد السيارة الذكية',
    chip4: 'تحية',
    inputPlaceholder: 'اسأل مستشارك الاستراتيجي...',
    langLabel: 'English',
    kpi1: 'النزيف المالي',
    kpi2: 'تنبيهات أخلاقية',
    kpi3: 'وفورات السيارة الذكية',
    logoName: 'NexSolve LLC',
    logoSub: 'تسريع التغيير'
  }
};

function applyLanguage(langCode) {
  // Temporarily disabled per requirement – Arabic UI switch is turned off
  return;
  isArabic = (langCode === 'ar');
  const L = isArabic ? LANG.ar : LANG.en;
  document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
  document.getElementById('langLabel').textContent = L.langLabel;
  document.getElementById('logoName').textContent = L.logoName;
  document.getElementById('logoSub').textContent = L.logoSub;
  document.getElementById('headerMain').textContent = L.headerMain;
  document.getElementById('headerSub').textContent = L.headerSub;
  document.getElementById('statusText').textContent = L.statusText;
  document.getElementById('chip1Text').textContent = L.chip1;
  document.getElementById('chip2Text').textContent = L.chip2;
  document.getElementById('chip3Text').textContent = L.chip3;
  document.getElementById('chip4Text').textContent = L.chip4;
  document.getElementById('chatInput').placeholder = L.inputPlaceholder;
  document.getElementById('kpi1Label').textContent = L.kpi1;
  document.getElementById('kpi2Label').textContent = L.kpi2;
  document.getElementById('kpi3Label').textContent = L.kpi3;
  document.getElementById('welcomeGreeting').textContent = getGreeting();
  document.getElementById('welcomeSub').innerHTML = L.welcomeSub;
  if (!isArabic) {
    document.getElementById('qFinanceLabel').innerHTML = 'Show me which instructors are costing us money by leaving too early<span>Financial Bleed Analysis</span>';
    document.getElementById('qEthicsLabel').innerHTML = 'Are there any instructors violating our Islamic values?<span>Ethical Risk Detection</span>';
    document.getElementById('qInnoLabel').innerHTML = 'Is our self-driving teaching car actually delivering value?<span>Autonomous Vehicle ROI</span>';
  } else {
    document.getElementById('qFinanceLabel').innerHTML = 'أي المدربين يتسببون بخسارة مالية بمغادرتهم المبكرة؟<span>تحليل النزيف المالي</span>';
    document.getElementById('qEthicsLabel').innerHTML = 'هل هناك مدربون ينتهكون قيمنا الإسلامية؟<span>اكتشاف المخاطر الأخلاقية</span>';
    document.getElementById('qInnoLabel').innerHTML = 'هل سيارة التعليم الذاتي تحقق قيمة حقيقية؟<span>عائد الاستثمار</span>';
  }
}

function getGreeting() {
  const h = new Date().getHours();
  const L = isArabic ? LANG.ar : LANG.en;
  if (h < 12) return L.greetingMorning;
  if (h < 17) return L.greetingAfternoon;
  return L.greetingEvening;
}

function toggleLang() {
  // Header toggle still available if needed
  applyLanguage(isArabic ? 'en' : 'ar');
}

function chooseLanguage(langCode) {
  applyLanguage(langCode === 'ar' ? 'ar' : 'en');
  const overlay = document.getElementById('languageOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ========== CHAT ENGINE ==========
let chatStarted = false;

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

function hideWelcome() {
  if (!chatStarted) {
    const ws = document.getElementById('welcomeScreen');
    if (ws) ws.style.display = 'none';
    chatStarted = true;
  }
}

function scrollToBottom() {
  const area = document.getElementById('messagesArea');
  area.scrollTop = area.scrollHeight;
}

function isNearBottom(area, threshold = 160) {
  return (area.scrollHeight - area.scrollTop - area.clientHeight) <= threshold;
}

function scrollToFirstResponse() {
  const area = document.getElementById('messagesArea');
  area.scrollTop = 0;
}

function addMessage(type, html, time, shouldScroll = false) {
  const area = document.getElementById('messagesArea');
  const wasNearBottom = isNearBottom(area);
  const row = document.createElement('div');
  row.className = `message-row ${type}`;
  const avatarClass = type === 'ai' ? 'ai' : 'user';
  const avatarIcon = type === 'ai' ? '✦' : '<i class="fas fa-user"></i>';
  row.innerHTML = `
    <div class="msg-avatar ${avatarClass}">${avatarIcon}</div>
    <div class="msg-content">
      <div class="msg-bubble">${html}</div>
      <div class="msg-time">${time || getCurrentTime()}</div>
    </div>`;
  area.appendChild(row);
  if (shouldScroll || wasNearBottom) scrollToBottom();
  return row;
}

function showTyping() {
  const area = document.getElementById('messagesArea');
  const wasNearBottom = isNearBottom(area);
  const row = document.createElement('div');
  row.className = 'message-row ai';
  row.id = 'typingRow';
  row.innerHTML = `
    <div class="msg-avatar ai">✦</div>
    <div class="msg-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  area.appendChild(row);
  if (wasNearBottom) scrollToBottom();
}

function removeTyping() {
  const t = document.getElementById('typingRow');
  if (t) t.remove();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function handleSend() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';

  const lower = text.toLowerCase();
  let type = 'fallback';
  if (/finance|money|cost|leaving|bleed|instructor|loss|profit|salary|qar|profitable|breakeven/.test(lower)) type = 'finance';
  else if (/ethic|islamic|values|brib|inappro|violation|conduct|harass|corrupt|religion/.test(lower)) type = 'ethics';
  else if (/car|auto|vehicle|driving|roi|value|invest|tech|robot|ai car|self.driv/.test(lower)) type = 'innovation';
  else if (/hello|hi|how are|marhaba|السلام|مرحبا|what can|help|morning|good/.test(lower)) type = 'greeting';

  sendQuestion(type, text);
}

function sendQuestion(type, userText) {
  hideWelcome();
  const qAr = window.ARABIC_QUESTIONS || {};
  const questions = {
    finance: isArabic ? (qAr.finance || 'أي المدربين يتسببون بخسارة مالية بمغادرتهم المبكرة؟') : 'Show me which instructors are costing us money by leaving too early',
    ethics: isArabic ? (qAr.ethics || 'هل هناك مدربون ينتهكون قيمنا الإسلامية؟') : 'Are there any instructors showing signs of behavior that violates our Islamic values?',
    innovation: isArabic ? (qAr.innovation || 'هل سيارة التعليم الذاتي تحقق قيمة فعلية؟') : 'Is our self-driving teaching car actually delivering value?',
    greeting: isArabic ? (qAr.greeting || 'السلام عليكم') : 'Hello',
    fallback: userText
  };

  const displayText = userText || questions[type] || userText;
  addMessage('user', displayText, null, true);
  showTyping();

  const delay = type === 'fallback' ? 900 : 1400;
  setTimeout(() => {
    removeTyping();
    switch(type) {
      case 'finance': renderFinanceResponse(); break;
      case 'ethics': renderEthicsResponse(); break;
      case 'innovation': renderInnovationResponse(); break;
      case 'greeting': renderGreeting(); break;
      default: renderFallback(); break;
    }
  }, delay);
}

// ========== RESPONSES ==========

function renderGreeting() {
  if (isArabic) {
    addMessage('ai', `وعليكم السلام، سعادة الرئيس 🌟<br><br>أنا مستشارك الاستراتيجي الذكي لأكاديمية الخبرة. لدي اليوم <strong style="color:var(--gold)">٣ رؤى عاجلة</strong> تستحق اهتمامك:<br><br>
    📊 <strong>النزيف المالي</strong> — خسارة تتجاوز ٢٣٧,٠٠٠ ريال من المدربين المغادرين<br>
    🛡️ <strong>مخاطر أخلاقية</strong> — تنبيهان حرجان يستلزمان تدخلاً فورياً<br>
    🚗 <strong>عائد الاستثمار</strong> — وفورات ٩٠٠,٠٠٠ ريال سنوياً من السيارة الذكية<br><br>
    بأي منها تبدأ، سعادتكم؟`);
  } else {
    addMessage('ai', `Good to have you, Your Excellency 🌟<br><br>I'm your AI Strategic Advisor for Alkhebra Academy. I have <strong style="color:var(--gold)">3 urgent insights</strong> ready for your review:<br><br>
    📊 <strong>Financial Bleed</strong> — 237,000 QAR loss from early instructor departures<br>
    🛡️ <strong>Ethical Alerts</strong> — 2 critical flags requiring immediate action<br>
    🚗 <strong>Innovation ROI</strong> — 900,000 QAR annual savings from the autonomous car<br><br>
    Which would you like to explore first, Your Excellency?`);
  }
}

function renderFallback() {
  if (isArabic) {
    addMessage('ai', `سعادة الرئيس، يمكنني حالياً تزويدكم بالرؤى في ثلاثة محاور:<br><br>
    📊 <strong>النزيف المالي</strong> للمدربين<br>
    🛡️ <strong>المخاطر الأخلاقية</strong> وانتهاكات القيم الإسلامية<br>
    🚗 <strong>عائد الاستثمار</strong> في سيارة التعليم الذاتي<br><br>
    أيها تفضل، سعادتكم؟`);
  } else {
    addMessage('ai', `Your Excellency, I can currently provide insights on three strategic areas:<br><br>
    📊 <strong>Financial Bleed</strong> — Instructor lifetime value analysis<br>
    🛡️ <strong>Ethical Risk</strong> — Islamic values protection & conduct monitoring<br>
    🚗 <strong>Innovation ROI</strong> — Autonomous vehicle performance analysis<br><br>
    Which area would you like to explore?`);
  }
}

function renderFinanceResponse() {
  const area = document.getElementById('messagesArea');

  const textMsg = isArabic
    ? `سعادة الرئيس، أجريت تحليل شامل للعائد على مدى حياة المدرب.<br><br>
       <strong style="color:var(--red)">⚠️ النتيجة: خسارة إجمالية قدرها ٢٣٧,٠٠٠ ريال</strong> من ٤ مدربين غادروا قبل تجاوز نقطة التعادل (تكلفة الترخيص ٥٠,٠٠٠ ريال + التوظيف + الرواتب دون عائد).<br><br>
       كما أن هناك <strong style="color:var(--gold)">٦ مدربين حاليين</strong> في منطقة الخطر — ٢٠٦,١٠٠ ريال مهددة.`
    : `Your Excellency, I've completed a full instructor lifetime value analysis.<br><br>
       <strong style="color:var(--red)">⚠️ Critical Finding: 237,000 QAR total loss</strong> from 4 instructors who departed before reaching breakeven (50k QAR licensing cost + recruitment + salaries with no return).<br><br>
       Additionally, <strong style="color:var(--gold)">6 current instructors</strong> are still in the loss zone — 206,100 QAR at risk.`;

  addMessage('ai', textMsg);

  const terminated = (DATA && DATA.financial && DATA.financial.terminated) ? DATA.financial.terminated : [];

  const chartRow = document.createElement('div');
  chartRow.className = 'message-row ai';
  chartRow.innerHTML = `
    <div class="msg-avatar ai">✦</div>
    <div class="msg-content" style="max-width:min(90%,600px)">
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">${isArabic?'الخسارة المالية لكل مدرب':'Financial Loss per Instructor'}</div>
          <div class="chart-badge badge-red">${isArabic?'مغادرون':'Terminated'}</div>
        </div>
        <div class="chart-body">
          <canvas class="finance-chart" height="160"></canvas>
        </div>
      </div>
      <div class="msg-time">${getCurrentTime()}</div>
    </div>`;
  area.appendChild(chartRow);

  const insRow = document.createElement('div');
  insRow.className = 'message-row ai';
  let insHtml = `<div class="msg-avatar ai">✦</div><div class="msg-content" style="max-width:min(90%,600px)">
    <div class="msg-bubble">
      <div style="font-weight:600;margin-bottom:10px;color:var(--red)">
        <i class="fas fa-exclamation-triangle"></i> ${isArabic?'المدربون المغادرون — خسارة إجمالية: ٢٣٧,٠٠٠ ريال':'Departed Instructors — Total Loss: 237,000 QAR'}
      </div>`;
  terminated.forEach(inst => {
    const pct = Math.round((inst.months / inst.breakeven) * 100);
    insHtml += `
      <div class="loss-row danger">
        <div class="loss-inst-info">
          <div class="inst-avatar red">${inst.name[0]}</div>
          <div>
            <div class="inst-name">${inst.name}</div>
            <div class="inst-detail">${inst.id} · ${inst.nationality || ''} · ${isArabic?'مغادر':'Departed'} @ ${inst.months} ${isArabic?'شهر':'mo'} (${isArabic?'التعادل':'breakeven'}: ${inst.breakeven} ${isArabic?'شهر':'mo'})</div>
            <div class="breakeven-bar"><div class="breakeven-fill" style="width:${pct}%;background:linear-gradient(90deg,#e05252,#ff6b6b)"></div></div>
          </div>
        </div>
        <div class="loss-amount">
          <div class="loss-qar">-${inst.loss.toLocaleString()} QAR</div>
          <div class="loss-status">${isArabic?'خسارة صافية':'Net Loss'}</div>
        </div>
      </div>`;
  });

  insHtml += `<div style="margin-top:12px;padding:10px 14px;background:rgba(212,166,66,0.08);border:1px solid rgba(212,166,66,0.2);border-radius:10px;">
    <div style="font-size:12px;font-weight:600;color:var(--gold);margin-bottom:4px">
      <i class="fas fa-lightbulb"></i> ${isArabic?'التوصية الاستراتيجية':'Strategic Recommendation'}
    </div>
    <div style="font-size:12.5px;color:var(--text2);line-height:1.6">
      ${isArabic
        ? 'أنصح بمكافأة احتجاز فورية لـ INS005 و INS007 (١,٥٠٠ ريال لكل منهما) لمنع خسارة إضافية تبلغ ٦١,٢٠٠ ريال.'
        : 'I recommend an immediate retention bonus for INS005 (Yusuf Abdi) and INS007 (Aisha Syed) at 1,500 QAR each — preventing an additional 61,200 QAR potential loss.'}
    </div>
  </div>`;

  insHtml += `<div class="action-buttons">
    <button class="action-btn success" onclick="doAction('approve_bonus','${isArabic?'تمت الموافقة على مكافأة الاحتجاز البالغة ٣,٠٠٠ ريال لـ INS005 و INS007':'3,000 QAR retention bonus approved for Yusuf Abdi & Aisha Syed'}','success')">
      <i class="fas fa-check-circle"></i> ${isArabic?'اعتماد مكافأة ٣,٠٠٠ ريال':'Approve 3,000 QAR Retention Bonus'}
    </button>
    <button class="action-btn outline" onclick="doAction('view_all','${isArabic?'عرض تقرير كامل لجميع المدربين':'Full instructor lifetime value report generated'}','gold')">
      <i class="fas fa-table"></i> ${isArabic?'عرض الكل':'View All Instructors'}
    </button>
  </div>`;

  insHtml += `</div><div class="msg-time">${getCurrentTime()}</div></div>`;
  insRow.innerHTML = insHtml;
  area.appendChild(insRow);
  scrollToBottom();

  setTimeout(() => {
    const canvas = chartRow.querySelector('canvas.finance-chart');
    if (canvas) {
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: terminated.map(i => i.name.split(' ')[0]),
          datasets: [{
            label: isArabic ? 'الخسارة (ريال قطري)' : 'Net Loss (QAR)',
            data: terminated.map(i => i.loss),
            backgroundColor: ['rgba(224,82,82,0.7)','rgba(224,82,82,0.7)','rgba(224,82,82,0.85)','rgba(224,82,82,0.6)'],
            borderColor: ['#e05252','#e05252','#e05252','#e05252'],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `-${ctx.raw.toLocaleString()} QAR`
              }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3b0', font: { size: 11 } } },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                color: '#9aa3b0',
                font: { size: 10 },
                callback: v => '-' + (v/1000).toFixed(0) + 'k'
              }
            }
          }
        }
      });
    }
  }, 100);
}

function renderEthicsResponse() {
  const area = document.getElementById('messagesArea');

  const openMsg = isArabic
    ? `سعادة الرئيس، اكتشف نظام الرصد الأخلاقي <strong style="color:var(--red)">تنبيهين حرجين</strong> يستلزمان تدخلاً فورياً.<br><br>
       تم تحليل <strong>١٥ شكوى طالب</strong> بالكشف عن الكلمات المفتاحية. النتائج خطيرة للغاية.`
    : `Your Excellency, the ethical monitoring system has detected <strong style="color:var(--red)">2 CRITICAL alerts</strong> requiring immediate action.<br><br>
       I analyzed <strong>15 student feedback records</strong> using keyword detection. The findings are serious.`;

  addMessage('ai', openMsg);

  const highRisk = (DATA && DATA.ethics && DATA.ethics.highRisk) ? DATA.ethics.highRisk : [];
  highRisk.forEach((person, idx) => {
    const row = document.createElement('div');
    row.className = 'message-row ai';
    const scoreClass = person.score >= 90 ? 'critical' : 'warning';
    const cardClass = person.score >= 90 ? 'critical' : 'warning';
    const badgeText = isArabic ? (person.category === 'Inappropriate Conduct' ? 'سلوك غير لائق' : 'رشوة/فساد') : person.category;

    let factors = person.factors.map(f => `<div class="alert-factor"><i class="fas fa-dot-circle"></i><span>${f}</span></div>`).join('');

    const suspendAction = person.id === 'INS010'
      ? `<button class="action-btn danger"
        onclick="doAction('suspend_david', \`${isArabic
          ? 'تم إيقاف داود عمندي. تم إعادة تعيين ٤ طالبات إلى قسم السيدات.'
          : "David Omondi suspended. 4 female students reassigned to Women's Section."
        }\`, 'danger')">
       <i class="fas fa-ban"></i> ${isArabic ? 'إيقاف فوري' : 'Suspend David Now'}
     </button>
     <button class="action-btn outline"
        onclick="doAction('reassign', \`${isArabic
          ? 'تم إعادة تعيين الطالبات إلى فاطمة الهاجري وعائشة سيد'
          : '4 students reassigned to Fatima Al-Hajri & Aisha Syed'
        }\`, 'success')">
       <i class="fas fa-users"></i> ${isArabic ? 'إعادة تعيين الطالبات' : 'Reassign Students'}
     </button>`
      : `<button class="action-btn danger"
        onclick="doAction('legal_samir', \`${isArabic
          ? 'تم إخطار الفريق القانوني للمراجعة. سيتم إرسال التقرير خلال ٢٤ ساعة.'
          : 'Legal team notified. Full investigation report scheduled within 24 hours.'
        }\`, 'danger')">
       <i class="fas fa-gavel"></i> ${isArabic ? 'مراجعة قانونية' : 'Legal Review for Samir'}
     </button>
     <button class="action-btn outline"
        onclick="doAction('suspend_samir', \`${isArabic
          ? 'تم إيقاف سمير خليل فوراً'
          : 'Samir Khalil suspended pending investigation'
        }\`, 'danger')">
       <i class="fas fa-ban"></i> ${isArabic ? 'إيقاف فوري' : 'Suspend Now'}
     </button>`;

    row.innerHTML = `
      <div class="msg-avatar ai">✦</div>
      <div class="msg-content" style="max-width:min(90%,560px)">
        <div class="msg-bubble">
          <div class="alert-card ${cardClass}">
            <div class="alert-header">
              <div>
                <div style="font-size:10px;color:var(--red);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">
                  🔴 RED ALERT ${idx+1}/${highRisk.length} — ${badgeText}
                </div>
                <div class="alert-name">${person.name} <span style="font-size:12px;color:var(--text2);font-weight:400">(${person.id})</span></div>
                <div style="font-size:11px;color:var(--text2);margin-top:2px">${isArabic?'شكاوى:':'Complaints:'} ${person.complaints} | ${isArabic?'نمط مكتشف':'Pattern detected'}</div>
              </div>
              <div style="text-align:right">
                <div class="risk-score ${scoreClass}">${person.score}</div>
                <div class="risk-label">${isArabic?'نقاط الخطر':'Risk Score'}/100</div>
                <div class="progress-bar" style="width:60px;margin-top:4px">
                  <div class="progress-fill red" style="width:${person.score}%"></div>
                </div>
              </div>
            </div>
            <div class="alert-factors">${factors}</div>
            <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:8px 10px;margin-top:4px;font-size:11px">
              <span style="color:var(--text2);font-weight:600">${isArabic?'التوصية:':'Recommended Action:'}</span>
              <span style="color:${person.score>=90?'var(--red)':'var(--gold)'}"> ${person.action}</span>
            </div>
          </div>
          <div class="action-buttons" style="margin-top:10px">${suspendAction}</div>
        </div>
        <div class="msg-time">${getCurrentTime()}</div>
      </div>`;
    area.appendChild(row);
  });

  const chartRow = document.createElement('div');
  chartRow.className = 'message-row ai';
  chartRow.innerHTML = `
    <div class="msg-avatar ai">✦</div>
    <div class="msg-content" style="max-width:min(90%,560px)">
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">${isArabic?'خريطة مخاطر المدربين':'Instructor Risk Heat Map'}</div>
          <div class="chart-badge badge-red">${isArabic?'المشبوهون فقط':'Flagged Only'}</div>
        </div>
        <div class="chart-body">
          <canvas class="ethics-chart" height="160"></canvas>
        </div>
      </div>
      <div class="msg-time">${getCurrentTime()}</div>
    </div>`;
  area.appendChild(chartRow);
  scrollToBottom();

  setTimeout(() => {
    const canvas = chartRow.querySelector('canvas.ethics-chart');
    if (canvas) {
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['David Omondi', 'Samir Khalil', 'Yusuf Abdi', 'Mohammed Iqbal', 'Nadia Cherif'],
          datasets: [{
            label: isArabic ? 'درجة الخطر' : 'Risk Score',
            data: [94, 97, 12, 8, 3],
            backgroundColor: [
              'rgba(224,82,82,0.8)', 
              'rgba(224,82,82,0.9)', 
              'rgba(76,175,125,0.6)', 
              'rgba(76,175,125,0.5)', 
              'rgba(76,175,125,0.4)'
            ],
            borderColor: ['#e05252', '#e05252', '#4caf7d', '#4caf7d', '#4caf7d'],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `Risk: ${ctx.raw}/100` } }
          },
          scales: {
            x: { 
              grid: { color: 'rgba(255,255,255,0.04)' }, 
              ticks: { color: '#9aa3b0', font: { size: 10 } } 
            },
            y: { 
              min: 0, 
              max: 100, 
              grid: { color: 'rgba(255,255,255,0.04)' }, 
              ticks: { 
                color: '#9aa3b0', 
                callback: v => v + '/100', 
                font: { size: 10 } 
              } 
            }
          }
        }
      });
    }
  }, 100);
}

function renderInnovationResponse() {
  const area = document.getElementById('messagesArea');

  const openMsg = isArabic
    ? `سعادة الرئيس، الأرقام تتحدث بوضوح.<br><br>
       سيارة القيادة الذكية تحقق <strong style="color:var(--green)">وفورات سنوية تبلغ ٩٠٠,٠٠٠ ريال</strong>، وتجاوزت عائدها على الاستثمار في غضون <strong style="color:var(--gold)">٨ أشهر</strong> فقط.`
    : `Your Excellency, the numbers speak for themselves.<br><br>
       The autonomous teaching car is generating <strong style="color:var(--green)">900,000 QAR in annual savings</strong> and recouped its entire R&D investment within <strong style="color:var(--gold)">8 months</strong>.`;

  addMessage('ai', openMsg);

  const statsRow = document.createElement('div');
  statsRow.className = 'message-row ai';
  statsRow.innerHTML = `
    <div class="msg-avatar ai">✦</div>
    <div class="msg-content" style="max-width:min(90%,560px)">
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">${isArabic?'الوفورات السنوية':'Annual Savings'}</div>
          <div class="stat-value green">900K</div>
          <div class="stat-sub">QAR / year</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${isArabic?'العائد على الاستثمار':'ROI Achieved'}</div>
          <div class="stat-value gold">8 ${isArabic?'أشهر':'Months'}</div>
          <div class="stat-sub">${isArabic?'استرداد كامل':'Full recoup'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${isArabic?'معدل النجاح':'Pass Rate'}</div>
          <div class="stat-value green">94%</div>
          <div class="stat-sub">${isArabic?'مقارنة بـ':'vs'} 68% ${isArabic?'تقليدي':'traditional'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${isArabic?'تخفيض الدروس':'Lesson Reduction'}</div>
          <div class="stat-value gold">-33%</div>
          <div class="stat-sub">${isArabic?'من ١٨ إلى ١٢ درساً':'18 → 12 lessons'}</div>
        </div>
      </div>
      <div class="msg-time">${getCurrentTime()}</div>
    </div>`;
  area.appendChild(statsRow);

  const tableRow = document.createElement('div');
  tableRow.className = 'message-row ai';
  let tableHtml = `
    <div class="msg-avatar ai">✦</div>
    <div class="msg-content" style="max-width:min(90%,580px)">
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title">${isArabic?'مقارنة: تقليدي مقابل ذكي':'Performance: Traditional vs Autonomous'}</div>
          <div class="chart-badge badge-green">${isArabic?'فوز ساحق':'Clear Winner'}</div>
        </div>
        <div class="chart-body" style="padding:0">
          <table class="compare-table">
            <thead>
              <tr>
                <th>${isArabic?'المقياس':'Metric'}</th>
                <th>${isArabic?'التقليدي':'Traditional'}</th>
                <th class="col-new">${isArabic?'الذكي':'Autonomous'}</th>
                <th>${isArabic?'الفرق':'Difference'}</th>
              </tr>
            </thead>
            <tbody>`;
  const comparisonRows = (DATA && DATA.innovation && DATA.innovation.comparison) ? DATA.innovation.comparison : [];
  comparisonRows.forEach(r => {
    tableHtml += `<tr><td>${r.metric}</td><td>${r.traditional}</td><td>${r.autonomous}</td><td>${r.diff}</td></tr>`;
  });
  tableHtml += `</tbody></table></div></div>`;

  tableHtml += `<div class="chart-card" style="margin-top:8px">
    <div class="chart-header">
      <div class="chart-title">${isArabic?'التكلفة لكل طالب':'Cost per Student (QAR)'}</div>
      <div class="chart-badge badge-green">-750 QAR</div>
    </div>
    <div class="chart-body"><canvas class="innov-chart" height="140"></canvas></div>
  </div>`;

  tableHtml += `<div class="msg-bubble" style="margin-top:8px;background:rgba(76,175,125,0.08);border:1px solid rgba(76,175,125,0.2)">
    <div style="font-weight:600;color:var(--green);margin-bottom:6px">
      <i class="fas fa-robot"></i> ${isArabic?'التوصية الاستراتيجية':'Strategic Recommendation'}
    </div>
    <div style="font-size:13px;color:var(--text2);line-height:1.6">
      ${isArabic
        ? 'بناءً على تحليل العائد على الاستثمار، أوصي بشراء مركبتين إضافيتين. التكلفة الإجمالية تُسترد في أقل من ١٠ أشهر، مع وفورات دائمة تبلغ ١.٨ مليون ريال سنوياً.'
        : 'Based on the ROI analysis, I recommend purchasing 2 additional autonomous vehicles. Total investment fully recovered in under 10 months, with ongoing savings of 1.8M QAR annually.'}
    </div>
  </div>
  <div class="action-buttons">
    <button class="action-btn success" onclick="doAction('generate_proposal','${isArabic?'تم إنشاء مقترح مجلس الإدارة لمركبتين إضافيتين. سيُرسل للمراجعة.':'Board proposal for 2 additional autonomous vehicles generated & queued for review.'}','success')">
      <i class="fas fa-file-alt"></i> ${isArabic?'توليد مقترح للمجلس':'Generate Board Proposal'}
    </button>
    <button class="action-btn gold" onclick="doAction('roi_calc','${isArabic?'حاسبة العائد على الاستثمار تُظهر: ١.٨ مليون ريال وفورات سنوية لمركبتين إضافيتين':'ROI Calculator: 2 additional vehicles = 1.8M QAR annual savings'}','gold')">
      <i class="fas fa-calculator"></i> ${isArabic?'حاسبة العائد':'ROI Calculator'}
    </button>
  </div>
  <div class="msg-time">${getCurrentTime()}</div>
    </div>`;

  tableRow.innerHTML = tableHtml;
  area.appendChild(tableRow);
  scrollToBottom();

  setTimeout(() => {
    const canvas = tableRow.querySelector('canvas.innov-chart');
    if (canvas) {
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: [isArabic ? 'تقليدي' : 'Traditional', isArabic ? 'ذكي' : 'Autonomous'],
          datasets: [{
            data: [1350, 600],
            backgroundColor: ['rgba(156,163,176,0.5)', 'rgba(76,175,125,0.7)'],
            borderColor: ['#9ca3af', '#4caf7d'],
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ctx.raw + ' QAR' } }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#9aa3b0' } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#9aa3b0', callback: v => v + ' QAR', font:{size:10} } }
          }
        }
      });
    }
  }, 100);

  // Extra chart using dataset_2_lesson_performance: average satisfaction by vehicle type
  const allLessons = (window.DB && window.DB.dataset_2_lesson_performance) ? window.DB.dataset_2_lesson_performance : [];
  if (allLessons.length) {
    const traditional = allLessons.filter(l => l.vehicle_type === 'Traditional');
    const autonomous = allLessons.filter(l => l.vehicle_type === 'Autonomous');
    const avg = arr => arr.reduce((s, l) => s + (l.satisfaction || 0), 0) / (arr.length || 1);
    const avgTrad = avg(traditional);
    const avgAuto = avg(autonomous);

    const extraRow = document.createElement('div');
    extraRow.className = 'message-row ai';
    extraRow.innerHTML = `
      <div class="msg-avatar ai">✦</div>
      <div class="msg-content" style="max-width:min(90%,580px)">
        <div class="chart-card" style="margin-top:8px">
          <div class="chart-header">
            <div class="chart-title">${isArabic ? 'رضا الطلاب حسب نوع السيارة' : 'Student Satisfaction by Vehicle Type'}</div>
            <div class="chart-badge badge-green">1–5</div>
          </div>
          <div class="chart-body"><canvas class="satisfaction-chart" height="140"></canvas></div>
        </div>
        <div class="msg-time">${getCurrentTime()}</div>
      </div>`;
    area.appendChild(extraRow);
    scrollToBottom();

    setTimeout(() => {
      const canvas = extraRow.querySelector('canvas.satisfaction-chart');
      if (canvas) {
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: [isArabic ? 'تقليدي' : 'Traditional', isArabic ? 'ذكي' : 'Autonomous'],
            datasets: [{
              data: [avgTrad.toFixed(2), avgAuto.toFixed(2)],
              backgroundColor: ['rgba(156,163,176,0.6)', 'rgba(76,175,125,0.8)'],
              borderColor: ['#9ca3af', '#4caf7d'],
              borderWidth: 1,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => ctx.raw + '/5' } }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#9aa3b0' } },
              y: {
                min: 0, max: 5,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#9aa3b0', callback: v => v + '/5', font: { size: 10 } }
              }
            }
          }
        });
      }
    }, 120);
  }
}

// ========== ACTION BUTTONS ==========
function doAction(type, message, toastType) {
  showToast(message, toastType || 'success');
  if (event && event.target) {
    event.target.disabled = true;
    event.target.style.opacity = '0.6';
    event.target.style.cursor = 'not-allowed';
  }
}

function showToast(message, type='success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'star';
  toast.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('welcomeGreeting').textContent = getGreeting();
  document.getElementById('chatInput').placeholder = 'Ask your Strategic Advisor anything...';

  const area = document.getElementById('messagesArea');
  const scrollBtn = document.getElementById('scrollBtn');
  area.addEventListener('scroll', () => {
    const fromBottom = area.scrollHeight - area.scrollTop - area.clientHeight;
    scrollBtn.classList.toggle('visible', fromBottom > 200);
  });

  if (window.ALKHEBRA_DATA && !window.DATA) {
    window.DATA = window.ALKHEBRA_DATA;
  }
  if (DATA && DATA.kpis) {
    const bleed = DATA.kpis.annualBleedQar;
    const alerts = DATA.kpis.activeEthicsAlerts;
    const faster = DATA.kpis.aiCarFasterPassPercent;
    if (typeof bleed === 'number') {
      document.getElementById('kpi1Val').textContent = `${Math.round(bleed / 1000)}K QAR`;
    }
    if (typeof alerts === 'number') {
      document.getElementById('kpi2Val').textContent = `${alerts} Active`;
    }
    if (typeof faster === 'number') {
      document.getElementById('kpi3Val').textContent = `${faster}% Faster`;
    }
  }
});

