/* Market Share: Region Challenge · facilitator screen
   Author: Muhammed Zaghloul. Plain JS; state saved in this browser. */
'use strict';
const T = {
  en: {
    title: 'Market Share', sub: 'Region Challenge', setup: 'Game setup', teams: 'Teams', team: 'Team', rounds: 'Rounds', timer: 'Turn timer', off: 'Off', sec: 's', start: 'Start the game',
    setupHelp: 'One room = one region. Teams compete for districts by selling to customers. The team with the largest share of regional sales wins.',
    target: 'Regional target', sales: 'Sales', share: 'Market share', budget: 'Budget', districts: 'Districts', round: 'Round', of: 'of', event: 'Market event', turn: 'Turn',
    pick: 'Pick a district to sell in', pickHelp: 'Unclaimed districts can be claimed. To take a rival’s district, beat its sales.', owner: 'Owner', none: 'Unclaimed', best: 'Best sale',
    customer: 'Customer', step1: 'Discover the need', step2: 'Recommend a product', step3: 'Upsell', step4: 'Cross-sell one add-on', step5: 'Handle the objection',
    q1: 'Which question do you ask first?', q2: 'Which product do you recommend?', q3: 'How do you raise the value?', q4: 'Which add-on do you suggest?',
    correct: 'Good choice.', wrong: 'Not the best choice.', next: 'Next', retry: 'Use Training: retry', leaves: 'The customer leaves without buying.',
    basket: 'Basket', footfall: 'Footfall', customersDay: 'customers', saleIn: 'Sales in', result: 'Turn result', claimed: '{team} claims {d}!', took: '{team} takes {d} from {other}!', held: '{other} keeps {d}. Sales still count for {team}.', kept: '{team} strengthens {d}.',
    endTurn: 'End turn', powerups: 'Power-ups', buy: 'Buy', notEnough: 'Not enough budget', active: 'Active', eventRound: 'Event for round {n}', go: 'Start round',
    results: 'Final results', winner: 'Winner', points: 'Points', bonus: 'Bonus', addonRate: 'Add-on rate', upt: 'Items per sale (UPT)', skill: 'Skill accuracy', skills: ['Discovery', 'Product knowledge', 'Upselling', 'Cross-selling', 'Objections'],
    debrief: 'Debrief: lowest skill in the room', lesson: 'Review lesson', exportCsv: 'Export CSV', newGame: 'New game', reached: 'The room reached the regional target!', notReached: 'The room reached {p}% of the regional target.',
    bonusAddon: 'Best add-on rate +5', bonusUpt: 'Best UPT +5', bonusDist: 'Most districts +5', reset: 'Reset', confirmReset: 'Start a new game? Current scores will be lost.', lmsSent: 'Results sent to the LMS (xAPI).', time: 'Time', timeUp: 'Time is up!', skip: 'Skip turn',
    rules: 'How to play', rulesList: ['Each turn the team picks a district. Harder districts (★★★) have more customers per day.', 'They draw a customer and make 5 selling decisions. Each right decision raises the basket; a weak first question loses the customer.', 'Sales in the district = basket × footfall. Claim free districts, or beat a rival’s best sale to take theirs.', '10% of every sale goes to the team budget to buy power-ups.', 'A market event changes the rules each round.', 'Winner: largest market share, plus bonuses for best add-on rate, best UPT and most districts.'],
    prices: 'Prices are illustrative for the game.', kit: 'Sample printable kit (PDF)', guide: 'Facilitator guide (Arabic PDF)', facil: 'Facilitator screen', demo: 'Prototype · dummy data'
  },
  ar: {
    title: 'حصة السوق', sub: 'تحدي المنطقة', setup: 'إعداد اللعبة', teams: 'الفرق', team: 'فريق', rounds: 'الجولات', timer: 'مؤقت الدور', off: 'بدون', sec: 'ث', start: 'ابدأ اللعبة',
    setupHelp: 'القاعة = منطقة واحدة. تتنافس الفرق على الأحياء بالبيع للعملاء. يفوز الفريق صاحب أكبر حصة من مبيعات المنطقة.',
    target: 'مستهدف المنطقة', sales: 'المبيعات', share: 'الحصة السوقية', budget: 'الميزانية', districts: 'الأحياء', round: 'الجولة', of: 'من', event: 'حدث السوق', turn: 'الدور',
    pick: 'اختر حياً للبيع فيه', pickHelp: 'يمكن الاستحواذ على الأحياء الحرة. لانتزاع حي منافس، تجاوز مبيعاته.', owner: 'المالك', none: 'حر', best: 'أعلى بيع',
    customer: 'العميل', step1: 'اكتشف الاحتياج', step2: 'أوصِ بمنتج', step3: 'الترقية', step4: 'بيع إضافة واحدة', step5: 'تعامل مع الاعتراض',
    q1: 'بأي سؤال تبدأ؟', q2: 'بأي منتج توصي؟', q3: 'كيف ترفع قيمة البيع؟', q4: 'أي إضافة تقترح؟',
    correct: 'اختيار موفّق.', wrong: 'ليس الاختيار الأفضل.', next: 'التالي', retry: 'استخدم التدريب: أعد المحاولة', leaves: 'غادر العميل دون شراء.',
    basket: 'السلة', footfall: 'العملاء يومياً', customersDay: 'عميل', saleIn: 'المبيعات في', result: 'نتيجة الدور', claimed: '{team} يستحوذ على {d}!', took: '{team} ينتزع {d} من {other}!', held: '{other} يحتفظ بـ{d}. المبيعات تُحسب لـ{team}.', kept: '{team} يعزّز {d}.',
    endTurn: 'إنهاء الدور', powerups: 'المعززات', buy: 'شراء', notEnough: 'الميزانية لا تكفي', active: 'مفعّل', eventRound: 'حدث الجولة {n}', go: 'ابدأ الجولة',
    results: 'النتائج النهائية', winner: 'الفائز', points: 'النقاط', bonus: 'مكافأة', addonRate: 'نسبة البيع الإضافي', upt: 'القطع لكل فاتورة (UPT)', skill: 'دقة المهارات', skills: ['الاكتشاف', 'معرفة المنتج', 'الترقية', 'البيع المتقاطع', 'الاعتراضات'],
    debrief: 'النقاش: أضعف مهارة في القاعة', lesson: 'راجع الدرس', exportCsv: 'تصدير CSV', newGame: 'لعبة جديدة', reached: 'حققت القاعة مستهدف المنطقة!', notReached: 'حققت القاعة {p}% من مستهدف المنطقة.',
    bonusAddon: 'أفضل نسبة بيع إضافي +5', bonusUpt: 'أفضل UPT +5', bonusDist: 'أكثر أحياء +5', reset: 'إعادة', confirmReset: 'بدء لعبة جديدة؟ ستضيع النتائج الحالية.', lmsSent: 'أُرسلت النتائج إلى المنصة (xAPI).', time: 'الوقت', timeUp: 'انتهى الوقت!', skip: 'تخطي الدور',
    rules: 'طريقة اللعب', rulesList: ['في كل دور يختار الفريق حياً. الأحياء الأصعب (★★★) فيها عملاء أكثر يومياً.', 'يسحب بطاقة عميل ويتخذ 5 قرارات بيع. كل قرار صحيح يرفع السلة، والسؤال الأول الضعيف يُفقد العميل.', 'مبيعات الحي = السلة × عدد العملاء. استحوذ على الأحياء الحرة، أو تجاوز أعلى بيع للمنافس لتنتزع حيّه.', '10% من كل بيع تذهب لميزانية الفريق لشراء المعززات.', 'حدث سوق يغيّر القواعد كل جولة.', 'الفائز: أكبر حصة سوقية، مع مكافآت لأفضل نسبة بيع إضافي وأفضل UPT وأكثر أحياء.'],
    prices: 'الأسعار توضيحية لأغراض اللعبة.', kit: 'عيّنة الأدوات المطبوعة (PDF)', guide: 'دليل الميسّر (PDF)', facil: 'شاشة الميسّر', demo: 'نموذج أولي · بيانات تجريبية'
  }
};
const COLORS = ['#C19941', '#3A5BA0', '#B3261E', '#2E7D6B'];
const DEF_NAMES = { en: ['Gold team', 'Blue team', 'Red team', 'Green team'], ar: ['الفريق الذهبي', 'الفريق الأزرق', 'الفريق الأحمر', 'الفريق الأخضر'] };
const KEY = 'sa_game_v1';
const app = document.getElementById('app');
let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
const P = new URLSearchParams(location.search);
if (!S) S = { lang: P.get('lang') === 'ar' ? 'ar' : 'en', theme: 'light', phase: 'setup' };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
const t = (k, v) => { let s = (T[S.lang][k] != null ? T[S.lang][k] : T.en[k]); if (v && typeof s === 'string') Object.keys(v).forEach(x => s = s.split('{' + x + '}').join(v[x])); return s; };
const tx = o => o == null ? '' : (typeof o === 'string' ? o : (o[S.lang] || o.en));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sar = n => (S.lang === 'ar' ? '' : 'SAR ') + Math.round(n).toLocaleString('en-US') + (S.lang === 'ar' ? ' ر.س' : '');
const stars = n => '★'.repeat(n) + '<span class="dim">' + '★'.repeat(3 - n) + '</span>';
const dist = id => GD.districts.find(d => d.id === id);
const team = i => S.teams[i];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function tgt() { return S.teams ? Math.round(25000 * S.teams.length * S.rounds / 6 / 1000) * 1000 * 2 : 300000; }
function totalSales() { return S.teams.reduce((s, x) => s + x.sales, 0); }

/* ---------- views ---------- */
function topbar() {
  const r = S.phase === 'setup' ? '' : `<span class="chip">${t('round')} <b>${Math.min(S.round, S.rounds)}</b> ${t('of')} ${S.rounds}</span>${S.event ? `<span class="chip ev" title="${esc(tx(S.event.text))}">⚡ ${esc(tx(S.event.name))}</span>` : ''}`;
  return `<header class="top"><div class="brand"><span class="mark">◆</span><div><b>${t('title')}</b><small>${t('sub')} · ${esc(tx(GD.region.name))}</small></div></div><div class="top-mid">${r}</div>
    <div class="top-end"><button class="ib" data-a="rules" title="${esc(t('rules'))}" aria-label="${esc(t('rules'))}">?</button><button class="ib" data-a="lang" aria-label="language">${S.lang === 'ar' ? 'EN' : 'ع'}</button><button class="ib" data-a="theme" aria-label="theme">${S.theme === 'dark' ? '☀' : '☾'}</button>${S.phase !== 'setup' ? `<button class="ib" data-a="reset" aria-label="${esc(t('reset'))}" title="${esc(t('reset'))}">↺</button>` : ''}</div></header>`;
}
function vSetup() {
  const n = S.nTeams || 3;
  return topbar() + `<main class="setup"><section class="card pad"><h1>${t('setup')}</h1><p class="muted">${t('setupHelp')}</p>
    <form id="setupForm" class="form">
      <fieldset><legend>${t('teams')}</legend><div class="seg">${[2, 3, 4].map(k => `<label><input type="radio" name="n" value="${k}" ${k === n ? 'checked' : ''}><span>${k}</span></label>`).join('')}</div>
        <div class="names">${[0, 1, 2, 3].map(i => `<label class="nm ${i >= n ? 'hide' : ''}" style="--c:${COLORS[i]}"><span class="sw"></span><input name="t${i}" value="${esc(DEF_NAMES[S.lang][i])}" aria-label="${t('team')} ${i + 1}"></label>`).join('')}</div></fieldset>
      <div class="two"><fieldset><legend>${t('rounds')}</legend><div class="seg">${[4, 6, 8].map(k => `<label><input type="radio" name="rounds" value="${k}" ${k === 6 ? 'checked' : ''}><span>${k}</span></label>`).join('')}</div></fieldset>
        <fieldset><legend>${t('timer')}</legend><div class="seg">${[0, 90, 120].map(k => `<label><input type="radio" name="timer" value="${k}" ${k === 90 ? 'checked' : ''}><span>${k ? k + t('sec') : t('off')}</span></label>`).join('')}</div></fieldset></div>
      <button class="btn gold big">${t('start')} →</button></form></section>
    <section class="card pad"><h2>${t('rules')}</h2><ol class="rules">${t('rulesList').map(x => `<li>${x}</li>`).join('')}</ol><p class="muted small">${t('prices')}</p><div class="row" style="justify-content:flex-start"><a class="btn sm" href="../../viewer/index.html?f=t4_kit" target="_top" data-mz-file="t4_kit">${t('kit')}</a><a class="btn sm" href="../../viewer/index.html?f=t4_guide" target="_top" data-mz-file="t4_guide">${t('guide')}</a></div></section></main>`;
}
function vBoard() {
  const tot = totalSales(), pct = Math.min(100, Math.round(100 * tot / tgt())), cur = S.turnTeam;
  const map = GD.districts.map(d => {
    const own = S.own[d.id], c = own ? COLORS[own.team] : '';
    return `<button class="tile ${own ? 'owned' : ''} ${S.phase === 'pick' ? 'pickable' : ''}" style="grid-column:${d.x + 1};grid-row:${d.y + 1};${own ? `--c:${c}` : ''}" data-a="pick" data-id="${d.id}" ${S.phase !== 'pick' ? 'disabled' : ''}>
      <span class="dn">${esc(tx(d.name))}</span><span class="st">${stars(d.stars)}</span><span class="ff">${GD.footfall[d.stars]} ${t('customersDay')}</span>
      <span class="ow">${own ? `${esc(team(own.team).name)}<br><b>${sar(own.best)}</b>` : t('none')}</span></button>`;
  }).join('');
  const teams = S.teams.map((x, i) => {
    const share = tot ? Math.round(100 * x.sales / tot) : 0, nd = Object.values(S.own).filter(o => o.team === i).length;
    return `<div class="tcard ${i === cur && S.phase !== 'end' ? 'cur' : ''}" style="--c:${COLORS[i]}"><div class="th"><span class="sw"></span><b>${esc(x.name)}</b>${i === cur && S.phase !== 'end' ? `<span class="chip now">${t('turn')}</span>` : ''}</div>
      <div class="big">${sar(x.sales)}</div><div class="bar"><i style="width:${share}%"></i></div><div class="row3"><span>${t('share')} <b>${share}%</b></span><span>${t('districts')} <b>${nd}</b></span><span>${t('budget')} <b>${sar(x.budget)}</b></span></div></div>`;
  }).join('');
  return topbar() + `<main class="board">
    <section class="card pad mapcard"><div class="target"><span>${t('target')}: <b>${sar(tgt())}</b></span><div class="bar wide"><i style="width:${pct}%"></i></div><b>${pct}%</b></div>
      <div class="map" role="group" aria-label="${esc(tx(GD.region.name))}">${map}</div>
      ${S.phase === 'pick' ? `<div class="pickbar"><span class="dot" style="background:${COLORS[cur]}"></span><b>${esc(team(cur).name)}</b>: ${t('pick')} <small class="muted">${t('pickHelp')}</small></div>` : ''}</section>
    <aside class="side">${teams}${S.phase === 'pick' ? powerPanel() : ''}</aside></main>${S.modal ? modal() : ''}`;
}
function powerPanel() {
  const x = team(S.turnTeam);
  return `<div class="card pad pw"><h3>${t('powerups')}</h3>${GD.powerups.map(p => { const on = (S.turnPw || []).includes(p.id);
    return `<div class="pwr"><div><b>${esc(tx(p.name))}</b> <small class="muted">${sar(p.cost)}</small><br><small>${esc(tx(p.text))}</small></div>${on ? `<span class="chip ok">${t('active')}</span>` : `<button class="btn sm" data-a="buy" data-id="${p.id}" ${x.budget < p.cost ? 'disabled' : ''} title="${x.budget < p.cost ? esc(t('notEnough')) : ''}">${t('buy')}</button>`}</div>`; }).join('')}</div>`;
}


const STEPS = ['disc', 'rec', 'ups', 'add', 'obj'];
function startTurn(did) {
  const d = dist(did), pool = GD.customers.filter(c => c.stars === d.stars).filter(c => !(S.used || []).includes(c.id));
  const list = pool.length ? pool : GD.customers.filter(c => c.stars === d.stars);
  const card = shuffle(list)[0]; S.used = (S.used || []).concat(card.id);
  S.turn = { did, cid: card.id, step: 0, basket: 0, items: 0, res: {}, msgs: [], retried: false, left: false };
  S.modal = 'turn'; S.phase = 'turn'; S.deadline = S.timer ? Date.now() + S.timer * 1000 : 0; save(); render();
}
function stepOptions(card, step) {
  if (step === 'disc') return card.disc.map((o, i) => ({ i, t: tx(o.t), ok: o.ok, why: tx(o.why) }));
  if (step === 'rec') return card.rec.opts.map((p, i) => ({ i, t: `${tx(GD.products[p].name)} · ${sar(GD.products[p].price)}`, sub: tx(GD.products[p].fam), ok: p === card.rec.ok, why: tx(card.rec.why) }));
  if (step === 'ups') return card.ups.opts.map((o, i) => ({ i, t: tx(o.t), ok: o.ok, why: tx(o.why) }));
  if (step === 'add') return card.add.opts.map((a, i) => ({ i, t: `${tx(GD.addons[a].name)} · ${sar(GD.addons[a].price)}`, ok: a === card.add.ok, why: tx(card.add.why) }));
  const oid = (S.event && S.event.fx.obj) || card.obj; return GD.objections[oid].opts.map((o, i) => ({ i, t: tx(o.t), ok: o.ok, why: tx(o.why) }));
}
function shuffledOrder(n, seed) { const a = [...Array(n).keys()]; let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) % 9973; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function modal() {
  if (S.modal === 'event') return `<div class="mbg"><div class="modal center"><span class="eyebrow">${t('eventRound', { n: S.round })}</span><div class="evicon">⚡</div><h2>${esc(tx(S.event.name))}</h2><p class="lead">${esc(tx(S.event.text))}</p><button class="btn gold big" data-a="goRound">${t('go')} →</button></div></div>`;
  if (S.modal === 'rules') return `<div class="mbg" data-a="close"><div class="modal"><h2>${t('rules')}</h2><ol class="rules">${t('rulesList').map(x => `<li>${x}</li>`).join('')}</ol><button class="btn" data-a="close">OK</button></div></div>`;
  if (S.modal === 'result') return resultModal();
  const tr = S.turn, card = GD.customers.find(c => c.id === tr.cid), d = dist(tr.did), step = STEPS[tr.step], x = team(S.turnTeam);
  const titles = { disc: [t('step1'), t('q1')], rec: [t('step2'), t('q2')], ups: [t('step3'), t('q3')], add: [t('step4'), t('q4')], obj: [t('step5'), tx(GD.objections[(S.event && S.event.fx.obj) || card.obj].q)] };
  const opts = stepOptions(card, step), ord = shuffledOrder(opts.length, tr.cid + step), ans = tr.res[step];
  const canRetry = ans && !ans.ok && !tr.retried && (S.turnPw || []).includes('train');
  return `<div class="mbg"><div class="modal turn" style="--c:${COLORS[S.turnTeam]}">
    <div class="mh"><span class="dot"></span><b>${esc(x.name)}</b><span class="muted">· ${esc(tx(d.name))} ${stars(d.stars)}</span><span class="grow"></span>${S.deadline ? `<span class="timer" id="timer"></span>` : ''}<span class="chip">${t('basket')}: <b>${sar(tr.basket)}</b></span></div>
    <div class="steps">${STEPS.map((s, i) => `<span class="${i < tr.step ? (tr.res[s] && tr.res[s].ok ? 'ok' : 'no') : i === tr.step ? 'cur' : ''}">${i + 1}</span>`).join('')}</div>
    <div class="cust"><span class="eyebrow">${t('customer')} ${stars(card.stars)}</span><p class="quote">${esc(tx(card.need))}</p></div>
    ${tr.step === 0 && !ans && (S.turnPw || []).includes('tester') && !tr.redrawn ? `<button class="btn sm" data-a="redraw">↻ ${esc(tx(GD.powerups[1].name))}</button>` : ''}
    <h2>${tr.step + 1} · ${titles[step][0]}</h2><p class="lead">${esc(titles[step][1])}</p>
    <div class="opts">${ord.map(k => { const o = opts[k]; const cls = ans ? (o.ok ? 'ok' : (ans.i === o.i ? 'no' : 'dim')) : ''; return `<button class="opt ${cls}" data-a="ans" data-i="${o.i}" ${ans ? 'disabled' : ''}><span>${esc(o.t)}</span>${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</button>`; }).join('')}</div>
    ${ans ? `<div class="fb ${ans.ok ? 'ok' : 'no'}" role="status"><b>${ans.ok ? t('correct') : t('wrong')}</b> ${esc(opts.find(o => o.ok).why)}${ans.msg ? `<br><b>${esc(ans.msg)}</b>` : ''}</div>
      <div class="row">${canRetry ? `<button class="btn" data-a="retry">${t('retry')}</button>` : ''}<button class="btn gold" data-a="nextStep">${tr.left || tr.step === STEPS.length - 1 ? t('result') : t('next')} →</button></div>` : ''}
  </div></div>`;
}
function answer(i) {
  const tr = S.turn, card = GD.customers.find(c => c.id === tr.cid), step = STEPS[tr.step];
  const o = stepOptions(card, step).find(z => z.i === i), x = team(S.turnTeam);
  const r = { i, ok: o.ok }; x.skill = x.skill || {}; x.skill[step] = x.skill[step] || [0, 0]; x.skill[step][1]++; if (o.ok) x.skill[step][0]++;
  if (step === 'disc') { if (!o.ok) { tr.left = true; r.msg = t('leaves'); } }
  if (step === 'rec') { const p = GD.products[card.rec.ok].price; tr.basket = o.ok ? p : Math.round(p * 0.4); tr.items = 1; }
  if (step === 'ups') { if (o.ok) { tr.basket += card.ups.plus; if (card.ups.plus) tr.items++; } else tr.basket = Math.round(tr.basket * 0.85); }
  if (step === 'add') { if (o.ok) { tr.basket += GD.addons[card.add.ok].price; tr.items++; tr.addon = card.add.ok; x.addons = (x.addons || 0) + 1; } else tr.basket = Math.round(tr.basket * 0.9); }
  if (step === 'obj') { if (!o.ok) tr.basket = Math.round(tr.basket * 0.7); }
  tr.res[step] = r; save(); render();
}
function retry() { const tr = S.turn, step = STEPS[tr.step], x = team(S.turnTeam), r = tr.res[step];
  x.skill[step][1]--; tr.retried = true; tr.left = false; delete tr.res[step];
  if (step === 'rec') { tr.basket = 0; tr.items = 0; } save(); render(); }
function nextStep() { const tr = S.turn; if (tr.left || tr.step >= STEPS.length - 1) return finishTurn(); tr.step++; save(); render(); }
function finishTurn() {
  const tr = S.turn, d = dist(tr.did), x = team(S.turnTeam), ev = (S.event || {}).fx || {};
  let basket = tr.left ? 0 : tr.basket;
  if (basket) {
    if (ev.all) basket *= 1 + ev.all;
    if (ev.addon && tr.addon === ev.addon) basket *= 1 + ev.bonus;
    if (ev.districts && ev.districts.includes(d.id)) basket *= 1 + ev.bonus;
    if ((S.turnPw || []).includes('promo')) basket *= 1.2;
  }
  const foot = GD.footfall[d.stars] * (1 + (ev.foot || 0)), sale = Math.round(basket * foot);
  x.sales += sale; x.budget += Math.round(sale * GD.budgetRate); x.turns = (x.turns || 0) + 1; if (sale) { x.sold = (x.sold || 0) + 1; x.items = (x.items || 0) + tr.items; }
  const own = S.own[d.id], names = { team: x.name, d: tx(d.name) };
  let msg = '';
  if (!sale) msg = t('leaves');
  else if (!own) { S.own[d.id] = { team: S.turnTeam, best: sale }; msg = t('claimed', names); }
  else if (own.team === S.turnTeam) { own.best = Math.max(own.best, sale); msg = t('kept', names); }
  else if (sale > own.best || (ev.challenge && sale >= own.best)) { const other = team(own.team).name; S.own[d.id] = { team: S.turnTeam, best: sale }; msg = t('took', Object.assign({ other }, names)); }
  else msg = t('held', Object.assign({ other: team(own.team).name }, names));
  S.last = { sale, basket: Math.round(basket), foot, msg, did: d.id };
  S.log.push({ round: S.round, team: x.name, district: tx(d.name), customer: tr.cid, basket: Math.round(basket), sale, steps: STEPS.map(s => tr.res[s] ? (tr.res[s].ok ? 1 : 0) : '').join('') });
  lms(x, tr, sale);
  S.modal = 'result'; save(); render();
}
function resultModal() {
  const l = S.last;
  return `<div class="mbg"><div class="modal center" style="--c:${COLORS[S.turnTeam]}"><span class="eyebrow">${t('result')}</span>
    <div class="calc"><div><small>${t('basket')}</small><b>${sar(l.basket)}</b></div><span>×</span><div><small>${t('footfall')}</small><b>${Math.round(l.foot * 10) / 10}</b></div><span>=</span><div class="tot"><small>${t('saleIn')} ${esc(tx(dist(l.did).name))}</small><b>${sar(l.sale)}</b></div></div>
    <p class="lead">${esc(l.msg)}</p><button class="btn gold big" data-a="endTurn">${t('endTurn')} →</button></div></div>`;
}
function endTurn() {
  S.turnPw = []; S.turn = null; S.modal = null; S.deadline = 0;
  S.turnTeam++;
  if (S.turnTeam >= S.teams.length) { S.turnTeam = 0; S.round++; if (S.round > S.rounds) { S.phase = 'end'; save(); return render(); } S.event = shuffle(GD.events)[0]; S.modal = 'event'; }
  S.phase = 'pick'; save(); render();
}

/* ---------- results ---------- */
function vEnd() {
  const tot = totalSales(), share = x => tot ? Math.round(100 * x.sales / tot) : 0;
  const rate = x => x.turns ? x.addons / x.turns : 0, upt = x => x.sold ? x.items / x.sold : 0, nd = i => Object.values(S.own).filter(o => o.team === i).length;
  const best = f => Math.max(...S.teams.map(f));
  const rows = S.teams.map((x, i) => { const b = []; if (rate(x) === best(rate) && rate(x) > 0) b.push(t('bonusAddon')); if (upt(x) === best(upt) && upt(x) > 0) b.push(t('bonusUpt')); if (nd(i) === best((_, j) => nd(j)) && nd(i) > 0) b.push(t('bonusDist'));
    return { x, i, share: share(x), b, pts: share(x) + 5 * b.length, rate: Math.round(100 * rate(x)), upt: Math.round(upt(x) * 10) / 10, nd: nd(i) }; }).sort((a, b) => b.pts - a.pts);
  const sk = [0, 1, 2, 3, 4].map(k => { let c = 0, n = 0; S.teams.forEach(x => { const v = (x.skill || {})[STEPS[k]]; if (v) { c += v[0]; n += v[1]; } }); return n ? Math.round(100 * c / n) : 0; });
  const low = sk.indexOf(Math.min(...sk)), lessons = ['3.1', '1.3 · 2.1', '3.3', '3.3', '3.4'];
  const pct = Math.round(100 * tot / tgt());
  return topbar() + `<main class="endp"><section class="card pad center hero" style="--c:${COLORS[rows[0].i]}"><span class="eyebrow">${t('winner')}</span><h1>🏆 ${esc(rows[0].x.name)}</h1><p class="lead">${rows[0].pts} ${t('points')} · ${t('share')} ${rows[0].share}%</p>
      <p>${pct >= 100 ? t('reached') : t('notReached', { p: pct })}</p></section>
    <section class="card pad"><h2>${t('results')}</h2><div class="tw"><table><thead><tr><th>#</th><th>${t('team')}</th><th>${t('sales')}</th><th>${t('share')}</th><th>${t('districts')}</th><th>${t('addonRate')}</th><th>${t('upt')}</th><th>${t('bonus')}</th><th>${t('points')}</th></tr></thead><tbody>
      ${rows.map((r, k) => `<tr><td>${k + 1}</td><td><span class="dot" style="background:${COLORS[r.i]}"></span> ${esc(r.x.name)}</td><td>${sar(r.x.sales)}</td><td>${r.share}%</td><td>${r.nd}</td><td>${r.rate}%</td><td>${r.upt}</td><td>${r.b.map(esc).join('<br>') || '—'}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></div></section>
    <section class="card pad"><h2>${t('skill')}</h2><div class="skills">${t('skills').map((s, k) => `<div class="sk"><span>${s}</span><div class="bar"><i class="${sk[k] < 60 ? 'low' : sk[k] < 80 ? 'mid' : ''}" style="width:${sk[k]}%"></i></div><b>${sk[k]}%</b></div>`).join('')}</div>
      <div class="fb no"><b>${t('debrief')}: ${t('skills')[low]} (${sk[low]}%)</b> · ${t('lesson')} ${lessons[low]}</div>
      <div class="row"><button class="btn" data-a="csv">${t('exportCsv')}</button><button class="btn gold" data-a="newGame">${t('newGame')}</button></div></section></main>`;
}

/* ---------- LMS (xAPI) ---------- */
function lms(x, tr, sale) {
  try {
    const k = 'salesacademy_lms_v3', db = JSON.parse(localStorage.getItem(k)); if (!db || !db.xapi) return;
    db.xapi.unshift({ id: 'g' + Date.now(), timestamp: new Date().toISOString(), actor: { objectType: 'Group', name: x.name, account: { homePage: 'https://lms.example.com', name: 'team-' + x.name.toLowerCase().replace(/\s+/g, '-') } },
      verb: { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'en-US': 'completed' } }, object: { objectType: 'Activity', id: 'https://lms.example.com/xapi/activities/market-share/' + tr.cid, definition: { name: { 'en-US': 'Market Share game turn' } } },
      result: { success: sale > 0, score: { raw: STEPS.filter(s => tr.res[s] && tr.res[s].ok).length, max: 5 }, extensions: { 'https://lms.example.com/xapi/sales': sale } } });
    localStorage.setItem(k, JSON.stringify(db));
  } catch (e) { }
}

/* ---------- render & events ---------- */
let tick;
function render() {
  document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.dataset.theme = S.theme;
  document.title = t('title') + ' · ' + t('sub');
  app.innerHTML = (S.phase === 'setup' ? vSetup() : S.phase === 'end' ? vEnd() : vBoard()) + (S.phase === 'setup' && S.modal === 'rules' ? modal() : '') + (S.phase === 'end' && S.modal === 'rules' ? modal() : '');
  clearInterval(tick);
  if (S.deadline) { const f = () => { const el = document.getElementById('timer'); if (!el) return; const s = Math.max(0, Math.ceil((S.deadline - Date.now()) / 1000)); el.textContent = s ? `⏱ ${s}${t('sec')}` : t('timeUp'); el.classList.toggle('late', s <= 10); }; f(); tick = setInterval(f, 500); }
  const f = app.querySelector('.modal .opt:not([disabled]), .modal .btn.gold'); if (f) f.focus({ preventScroll: true });
}
document.addEventListener('change', e => { if (e.target.name === 'n') document.querySelectorAll('.nm').forEach((l, i) => l.classList.toggle('hide', i >= +e.target.value)); });
document.addEventListener('submit', e => {
  if (e.target.id !== 'setupForm') return; e.preventDefault();
  const fd = new FormData(e.target), n = +fd.get('n');
  S.teams = [...Array(n).keys()].map(i => ({ name: (fd.get('t' + i) || DEF_NAMES[S.lang][i]).trim(), sales: 0, budget: 0, skill: {}, addons: 0, items: 0, sold: 0, turns: 0 }));
  S.rounds = +fd.get('rounds'); S.timer = +fd.get('timer'); S.own = {}; S.round = 1; S.turnTeam = 0; S.log = []; S.used = []; S.turnPw = [];
  S.event = shuffle(GD.events)[0]; S.modal = 'event'; S.phase = 'pick'; save(); render();
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  const a = el.dataset.a;
  if (a === 'close' && e.target !== el && e.target.closest('.modal')) return;
  if (a === 'lang') { S.lang = S.lang === 'ar' ? 'en' : 'ar'; save(); render(); }
  if (a === 'theme') { S.theme = S.theme === 'dark' ? 'light' : 'dark'; save(); render(); }
  if (a === 'rules') { S.modal = S.modal === 'rules' ? null : 'rules'; S._back = S.modal ? null : S._back; render(); }
  if (a === 'close') { S.modal = S.phase === 'turn' ? 'turn' : null; render(); }
  if (a === 'reset' || a === 'newGame') { if (a === 'newGame' || confirm(t('confirmReset'))) { S = { lang: S.lang, theme: S.theme, phase: 'setup', nTeams: S.teams ? S.teams.length : 3 }; save(); render(); } }
  if (a === 'goRound') { S.modal = null; save(); render(); }
  if (a === 'pick') startTurn(el.dataset.id);
  if (a === 'buy') { const p = GD.powerups.find(z => z.id === el.dataset.id), x = team(S.turnTeam); if (x.budget >= p.cost) { x.budget -= p.cost; S.turnPw = (S.turnPw || []).concat(p.id); save(); render(); } }
  if (a === 'ans') answer(+el.dataset.i);
  if (a === 'retry') retry();
  if (a === 'redraw') { const tr = S.turn, d = dist(tr.did), pool = GD.customers.filter(c => c.stars === d.stars && c.id !== tr.cid); tr.cid = shuffle(pool)[0].id; tr.redrawn = true; S.used.push(tr.cid); save(); render(); }
  if (a === 'nextStep') nextStep();
  if (a === 'endTurn') endTurn();
  if (a === 'csv') { const rows = [['round', 'team', 'district', 'customer', 'basket', 'sale', 'steps(disc,rec,ups,add,obj)']].concat(S.log.map(l => [l.round, l.team, l.district, l.customer, l.basket, l.sale, l.steps]));
    const s = '﻿' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([s], { type: 'text/csv' })); link.download = 'market-share-results.csv'; document.body.appendChild(link); link.click(); link.remove(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.modal === 'rules') { S.modal = S.phase === 'turn' ? 'turn' : null; render(); } });
render();
