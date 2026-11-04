/* Sales Academy LMS prototype · learner pages */
'use strict';

/* ---------- login ---------- */
function vLogin() {
  const demo = [['u10', 'learner', 'user'], ['u2', 'manager', 'team'], ['u1', 'admin', 'admin']];
  return `<div class="login-wrap"><div class="login-top"><span class="brand">${icon('book', 22)} ${t('brand')}</span><span class="row">
      <button class="btn btn-ghost btn-sm" data-act="lang">${icon('globe', 16)} ${isAr() ? 'English' : 'العربية'}</button>
      <button class="btn btn-ghost btn-sm" data-act="theme">${icon(S.theme === 'dark' ? 'sun' : 'moon', 16)} ${t(S.theme === 'dark' ? 'theme.light' : 'theme.dark')}</button></span></div>
    <div class="login card"><h1>${t('login.title')}</h1><p class="muted">${t('login.sub')}</p>
      <form id="loginForm" class="form" novalidate>
        <label class="field"><span>${t('f.username')}</span><input name="username" value="faisal.al.harthi" autocomplete="username"></label>
        <label class="field"><span>${t('f.password')}</span><input name="password" type="password" value="demo-password" autocomplete="current-password"></label>
        <button class="btn btn-gold w100" type="submit">${t('login.btn')}</button>
        <button class="btn btn-ghost w100 wrap" type="button" disabled>${icon('key', 16)} <span>${t('login.sso')}</span> <span class="tag t-rec">${t('lbl.rec')}</span></button>
      </form>
      <div class="divider"><span>${t('login.demo')}</span></div>
      <div class="demo-accounts">${demo.map(([id, r, ic]) => { const u = user(id); return `<button class="demo-acc" data-act="loginAs0" data-id="${id}">${icon(ic, 22)}<span><b>${t('role.' + r)}</b><small>${esc(tx(u.name))}</small></span></button>`; }).join('')}</div>
      <p class="muted small">${t('login.note')}</p></div>
    <p class="muted small center">${t('demo.bar')}</p></div>`;
}

/* ---------- dashboard ---------- */
function hoursChart(u) {
  const w = weekly(u, 8), max = Math.max(1, ...w.map(x => x.s));
  return `<div class="chart" role="img" aria-label="${esc(t('dash.hoursChart'))}">${w.map(x => `<div class="col"><div class="barv" style="height:${Math.max(3, Math.round(100 * x.s / max))}%" title="${fmtH(x.s)} ${t('unit.h')}"></div><span>${x.a.toLocaleDateString(locale(), { day: 'numeric', month: 'short' })}</span></div>`).join('')}</div>`;
}
function vDashboard() {
  const u = me(), list = myEnrols(u.id).map(e => course(e.courseId));
  const assigned = myEnrols(u.id).filter(e => e.assigned).map(e => course(e.courseId));
  const order = { overdue: 0, dueSoon: 1, inProgress: 2, notStarted: 3, completed: 4 };
  assigned.sort((a, b) => order[status(u.id, a)] - order[status(u.id, b)]);
  const main = assigned.find(c => enr(u.id, c.id).main) || assigned.find(c => status(u.id, c) !== 'completed') || assigned[0];
  const la = DB.lastAcc[u.id], lc = la && course(la.courseId), la_ = lc && actOf(lc, la.actId);
  const month = new Date(Date.now() - 30 * 864e5);
  const done = list.filter(c => courseDoneAt(u.id, c.id)).length, overdue = assigned.filter(c => status(u.id, c) === 'overdue');
  const deadlines = assigned.filter(c => status(u.id, c) !== 'completed' && enr(u.id, c.id).due).sort((a, b) => new Date(enr(u.id, a.id).due) - new Date(enr(u.id, b.id).due));
  const bdg = badgesOf(u.id);
  const nextA = c => acts(c).find(a => !isDone(u.id, a)) || acts(c)[0];
  return shell('dashboard', pageHead(t('dash.hi', { name: esc(tx(u.name).split(' ')[0]) }), t('dash.sub'), '', ['dashboard', 'timeline', 'overview']) + `
    ${overdue.length ? `<div class="alert bad" role="alert">${icon('clock', 18)} <span>${t('dash.overdueAlert', { n: overdue.length })} ${overdue.map(c => `<a href="#/course/${c.id}">${esc(tx(c.title))}</a>`).join('، ')}</span></div>` : ''}
    <div class="grid g-dash">
      <div class="stack">
        ${lc ? `<section class="card resume" aria-labelledby="rs"><div class="resume-in">${courseThumb(lc, true)}<div class="f1"><span class="eyebrow">${t('dash.continue')}</span><h2 id="rs">${esc(tx(lc.title))}</h2>
          <p class="muted">${la_ ? t('dash.lastAct', { act: esc(tx(la_.title)) }) : ''} · ${fmtDT(la.at)}</p>
          <div class="row nowrap">${bar(coursePct(u.id, lc))}<b>${coursePct(u.id, lc)}%</b></div></div>
          <a class="btn btn-gold" href="#/course/${lc.id}/a/${(la_ && !isDone(u.id, la_) ? la_ : nextA(lc)).id}">${icon('play', 16)} ${t('dash.resume')}</a></div></section>` : ''}
        <section class="stats" aria-label="${esc(t('dash.stats'))}">
          <div class="card stat">${icon('clock', 22)}<div><b>${fmtH(secs(u.id))}</b><span>${t('dash.hoursTotal')}</span></div></div>
          <div class="card stat">${icon('fire', 22)}<div><b>${fmtH(secs(u.id, month))}</b><span>${t('dash.hoursMonth')}</span></div></div>
          <div class="card stat">${icon('check', 22)}<div><b>${done}/${list.length}</b><span>${t('dash.coursesDone')}</span></div></div>
          <div class="card stat">${icon('award', 22)}<div><b>${bdg.length}</b><span>${t('dash.badges')}</span></div></div>
        </section>
        <section class="card block" aria-labelledby="ac"><div class="block-h"><h2 id="ac">${t('dash.assigned')}</h2><a href="#/home?tab=assigned">${t('viewAll')}</a></div>
          ${assigned.length ? `<ul class="clean courses-list">${assigned.map(c => { const e = enr(u.id, c.id); return `<li>${courseThumb(c)}<div class="f1"><a class="title" href="#/course/${c.id}">${esc(tx(c.title))}</a>
            <div class="meta">${statusChip(u.id, c)}<span>${e.due ? t('due') + ' ' + fmtDate(e.due) : t('noDue')}</span><span>${acts(c).length} ${t('unit.acts')}</span>${c === main ? `<span class="chip gold">${t('dash.main')}</span>` : ''}</div>
            <div class="row nowrap">${bar(coursePct(u.id, c), tx(c.title))}<small>${coursePct(u.id, c)}%</small></div></div>
            <a class="btn btn-sm ${status(u.id, c) === 'completed' ? 'btn-ghost' : 'btn-navy'}" href="${status(u.id, c) === 'completed' ? '#/certificate/' + c.id : '#/course/' + c.id + '/a/' + nextA(c).id}">${status(u.id, c) === 'completed' ? t('certificate') : coursePct(u.id, c) ? t('continue') : t('start')}</a></li>`; }).join('')}</ul>` : empty(t('dash.noAssigned'))}
        </section>
        <section class="card block" aria-labelledby="hc"><div class="block-h"><h2 id="hc">${t('dash.hoursChart')}</h2><a href="#/history">${t('nav.history')}</a></div>${hoursChart(u.id)}</section>
      </div>
      <aside class="stack">
        <section class="card block" aria-labelledby="tl"><div class="block-h"><h2 id="tl">${t('dash.timeline')}</h2></div>
          ${deadlines.length ? `<ul class="clean timeline">${deadlines.map(c => { const d = daysFrom(enr(u.id, c.id).due); return `<li class="${d < 0 ? 'od' : ''}"><div class="date"><b>${new Date(enr(u.id, c.id).due).toLocaleDateString(locale(), { day: 'numeric' })}</b><small>${new Date(enr(u.id, c.id).due).toLocaleDateString(locale(), { month: 'short' })}</small></div>
            <div><a href="#/course/${c.id}">${esc(tx(c.title))}</a><small class="${d < 0 ? 'txt-bad' : 'muted'}">${d < 0 ? t('st.overdueBy', { n: -d }) : t('st.dueIn', { n: d })}</small></div></li>`; }).join('')}</ul>` : empty(t('dash.noDeadlines'))}
        </section>
        <section class="card block" aria-labelledby="bd"><div class="block-h"><h2 id="bd">${t('dash.myBadges')}</h2></div>
          ${bdg.length ? `<div class="badges">${bdg.map(b => `<a href="#/certificate/${b.courseId}" class="badge-item">${badgeSvg(56)}<span>${esc(tx(b.name))}</span><small class="muted">${fmtDate(b.at)}</small></a>`).join('')}</div>` : empty(t('dash.noBadges'))}
        </section>
        <section class="card block"><div class="block-h"><h2>${t('dash.explore')}</h2></div><p class="muted">${t('dash.exploreTxt')}</p><a class="btn btn-ghost btn-sm" href="#/home">${icon('home', 16)} ${t('nav.home')}</a></section>
      </aside>
    </div>`);
}
function badgeSvg(s, off) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" aria-hidden="true" style="${off ? 'filter:grayscale(1);opacity:.4' : ''}"><path d="M60 4 108 32v56L60 116 12 88V32z" fill="#2B2E4A" stroke="#C19941" stroke-width="5"/><circle cx="60" cy="56" r="24" fill="none" stroke="#E7BF67" stroke-width="4"/><path d="m49 56 8 8 15-16" fill="none" stroke="#E7BF67" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/* ---------- home / catalog ---------- */
function vHome(q) {
  const u = me(), tab = q.get('tab') || 'all', term = (q.get('q') || '').toLowerCase(), cat = q.get('cat') || '', tp = q.get('type') || '';
  let list = DB.courses.filter(c => c.status === 'published' || (c.status !== 'draft' && enr(u.id, c.id)));
  if (tab === 'assigned') list = list.filter(c => enr(u.id, c.id) && enr(u.id, c.id).assigned);
  if (tab === 'mine') list = list.filter(c => enr(u.id, c.id));
  if (tab === 'completed') list = list.filter(c => courseDoneAt(u.id, c.id));
  if (term) list = list.filter(c => (tx(c.title) + ' ' + tx(c.summary)).toLowerCase().includes(term));
  if (cat) list = list.filter(c => c.cat === cat);
  if (tp) list = list.filter(c => acts(c).some(a => a.type === tp));
  const counts = { all: DB.courses.filter(c => c.status === 'published').length, assigned: myEnrols(u.id).filter(e => e.assigned).length, mine: myEnrols(u.id).length, completed: Object.keys(DB.courseDone[u.id] || {}).length };
  const qs = (o) => '#/home?' + new URLSearchParams(Object.assign({ tab, q: q.get('q') || '', cat, type: tp }, o)).toString();
  return shell('home', pageHead(t('home.title'), t('home.sub'), '', ['catalog', 'overview']) + `
    ${tabs([['all', t('home.all')], ['assigned', t('home.assigned')], ['mine', t('home.mine')], ['completed', t('home.completed')]].map(([k, l]) => [qs({ tab: k }), `${l} <span class="count">${counts[k]}</span>`]), qs({ tab }))}
    <form class="filters" id="catForm" role="search"><label class="search">${icon('search', 18)}<input name="q" value="${esc(q.get('q') || '')}" placeholder="${esc(t('home.search'))}" aria-label="${esc(t('home.search'))}"></label>
      <select name="cat" aria-label="${esc(t('f.category'))}"><option value="">${t('home.allCats')}</option>${DB.categories.map(c => `<option value="${c.id}" ${cat === c.id ? 'selected' : ''}>${esc(tx(c.name))}</option>`).join('')}</select>
      <select name="type" aria-label="${esc(t('f.type'))}"><option value="">${t('home.allTypes')}</option>${TYPES.map(x => `<option value="${x}" ${tp === x ? 'selected' : ''}>${t('type.' + x)}</option>`).join('')}</select>
      <input type="hidden" name="tab" value="${tab}"><button class="btn btn-navy btn-sm">${t('filter')}</button></form>
    ${list.length ? `<div class="grid-cards">${list.map(c => courseCard(u, c)).join('')}</div>` : empty(t('home.none'))}`);
}
function courseCard(u, c) {
  const e = enr(u.id, c.id), types = [...new Set(acts(c).map(a => a.type))];
  return `<article class="card ccard">${courseThumb(c)}<div class="ccard-b"><span class="eyebrow">${esc(tx((DB.categories.find(x => x.id === c.cat) || {}).name))}</span>
    <h3><a href="#/course/${c.id}">${esc(tx(c.title))}</a></h3><p class="muted">${esc(tx(c.summary))}</p>
    <div class="types">${types.map(typeChip).join('')}</div>
    <div class="meta"><span>${icon('clock', 14)} ${t('unit.hours', { n: c.hours })}</span>${e ? statusChip(u.id, c) : (c.selfEnrol ? `<span class="chip info">${t('home.open')}</span>` : `<span class="chip na">${t('home.byAssign')}</span>`)}</div>
    ${e ? `<div class="row nowrap">${bar(coursePct(u.id, c), tx(c.title))}<small>${coursePct(u.id, c)}%</small></div>` : ''}
    <div class="ccard-f">${e ? (courseDoneAt(u.id, c.id) ? `<a class="btn btn-ghost btn-sm" href="#/certificate/${c.id}">${icon('award', 16)} ${t('certificate')}</a>` : `<a class="btn btn-navy btn-sm" href="#/course/${c.id}">${coursePct(u.id, c) ? t('continue') : t('start')}</a>`) : c.selfEnrol ? `<button class="btn btn-gold btn-sm" data-act="selfEnrol" data-id="${c.id}">${t('home.enrol')}</button>` : `<a class="btn btn-ghost btn-sm" href="#/course/${c.id}">${t('details')}</a>`}</div></div></article>`;
}

/* ---------- course page ---------- */
function vCourse(cid) {
  const u = me(), c = course(cid); if (!c) return vNotFound();
  const e = enr(u.id, c.id), preview = !e && can('admin');
  const nx = acts(c).find(a => !isDone(u.id, a)) || acts(c)[0];
  return shell('home', `<nav class="crumbs"><a href="#/home">${t('nav.home')}</a> / ${esc(tx(c.title))}</nav>
    <section class="card course-hero">${courseThumb(c, true)}<div class="f1"><span class="eyebrow">${esc(tx((DB.categories.find(x => x.id === c.cat) || {}).name))}</span><h1>${esc(tx(c.title))}</h1><p class="muted">${esc(tx(c.summary))}</p>
      <div class="meta"><span>${icon('clock', 14)} ${t('unit.hours', { n: c.hours })}</span><span>${acts(c).length} ${t('unit.acts')}</span>${e ? statusChip(u.id, c) : ''}${e && e.due ? `<span>${t('due')} ${fmtDate(e.due)}</span>` : ''}${c.status === 'draft' ? `<span class="chip warn">${t('cs.draft')}</span>` : ''}</div>
      ${e ? `<div class="row nowrap" style="max-width:420px">${bar(coursePct(u.id, c))}<b>${coursePct(u.id, c)}%</b></div>` : ''}</div>
      <div class="col-actions">${e ? (courseDoneAt(u.id, c.id) ? `<a class="btn btn-gold" href="#/certificate/${c.id}">${icon('award', 16)} ${t('certificate')}</a>` : `<a class="btn btn-gold" href="#/course/${c.id}/a/${nx.id}">${icon('play', 16)} ${coursePct(u.id, c) ? t('continue') : t('start')}</a>`)
        : c.selfEnrol ? `<button class="btn btn-gold" data-act="selfEnrol" data-id="${c.id}">${t('home.enrol')}</button>` : preview ? `<a class="btn btn-ghost" href="#/course/${c.id}/a/${nx.id}">${icon('eye', 16)} ${t('preview')}</a>` : `<p class="muted small">${t('course.askManager')}</p>`}</div></section>
    <div class="refs">${ref('completion')}${ref('coursecompletion')}</div>
    ${c.sections.map(s => `<section class="card section"><div class="section-h"><h2>${esc(tx(s.title))}</h2><span class="muted small">${s.acts.filter(a => isDone(u.id, a)).length}/${s.acts.length}</span></div>
      ${s.acts.map(a => `<div class="act-row"><span class="act-ic t-${a.type}">${icon(a.type)}</span><div class="f1">${e || preview ? `<a href="#/course/${c.id}/a/${a.id}" class="title">${esc(tx(a.title))}</a>` : `<span class="title">${esc(tx(a.title))}</span>`}
        <div class="meta"><span>${t('type.' + a.type)}</span><span>${t('unit.min', { n: a.min })}</span><span>${t('cond.' + a.completion)}</span>${a.type === 'xapi' ? `<span class="chip gold">${t('lbl.advanced')}</span>` : ''}</div></div>
        ${e ? (isDone(u.id, a) ? `<span class="chip ok">${icon('check', 14)} ${t('done')}</span>` : `<span class="chip na">${t('todo')}</span>`) : ''}</div>`).join('')}</section>`).join('')}`);
}

/* ---------- player ---------- */
function vPlayer(cid, aid) {
  const u = me(), c = course(cid); if (!c) return vNotFound();
  const a = actOf(c, aid); if (!a) return vCourse(cid);
  const e = enr(u.id, c.id);
  if (!e && !can('admin')) return vCourse(cid);
  touch(u.id, c, a);
  const list = acts(c), i = list.findIndex(x => x.id === a.id), prev = list[i - 1], next = list[i + 1];
  return shell('home', `<nav class="crumbs"><a href="#/home">${t('nav.home')}</a> / <a href="#/course/${c.id}">${esc(tx(c.title))}</a> / ${esc(tx(a.title))}</nav>
    <div class="player">
      <aside class="card cindex" id="cindex" aria-label="${esc(t('course.index'))}"><div class="row nowrap">${bar(coursePct(u.id, c))}<b>${coursePct(u.id, c)}%</b></div>
        ${c.sections.map(s => `<p class="sec">${esc(tx(s.title))}</p>${s.acts.map(x => `<a href="#/course/${c.id}/a/${x.id}" class="${x.id === a.id ? 'cur' : ''}" ${x.id === a.id ? 'aria-current="page"' : ''}><span class="ck ${isDone(u.id, x) ? 'on' : ''}" aria-hidden="true"></span><span>${esc(tx(x.title))}<span class="sr">${isDone(u.id, x) ? ' — ' + t('done') : ''}</span></span></a>`).join('')}`).join('')}</aside>
      <section class="card act-main" aria-labelledby="at">
        <div class="act-h"><span class="act-ic t-${a.type}">${icon(a.type)}</span><div class="f1"><h1 id="at">${esc(tx(a.title))}</h1><div class="meta"><span>${t('type.' + a.type)}</span><span>${t('unit.min', { n: a.min })}</span><span>${t('cond.' + a.completion)}</span></div></div>
          <span id="actState">${isDone(u.id, a) ? `<span class="chip ok">${icon('check', 14)} ${t('done')}</span>` : `<span class="chip na">${t('todo')}</span>`}</span></div>
        <div class="act-body">${renderAct(u, c, a)}</div>
        <div class="refs">${ref({ video: 'file', audio: 'file', image: 'file', html: 'page', scorm: 'scorm', xapi: 'h5p', quiz: 'quiz', feedback: 'feedback' }[a.type])}${a.type === 'xapi' ? ref('xapi') : ''}</div>
      </section>
    </div>
    <nav class="pager" aria-label="${esc(t('course.nav'))}">${prev ? `<a class="btn btn-ghost" href="#/course/${c.id}/a/${prev.id}">${isAr() ? '→' : '←'} ${t('prev')}</a>` : '<span></span>'}
      <span class="muted small">${i + 1} / ${list.length}</span>${next ? `<a class="btn btn-navy" href="#/course/${c.id}/a/${next.id}">${t('next')} ${isAr() ? '←' : '→'}</a>` : `<a class="btn btn-gold" href="#/course/${c.id}">${t('course.back')}</a>`}</nav>`);
}
function transcript(txt) { return `<details class="transcript"><summary>${t('transcript')}</summary><p>${txt}</p></details>`; }
const TRANS = { en: 'Every fragrance has three layers. The top notes give the first impression and fade within minutes. The heart notes are the character of the fragrance for hours. The base notes stay the longest, sometimes until the next day.', ar: 'كل عطر له ثلاث طبقات. الافتتاحية انطباع أول وتختفي خلال دقائق. القلب هو شخصية العطر لساعات. والقاعدة تبقى أطول، أحياناً لليوم التالي.' };
function renderAct(u, c, a) {
  const d = a.data || {};
  switch (a.type) {
    case 'video': return `<div class="media"><video controls playsinline preload="metadata" data-track="${c.id}|${a.id}" aria-label="${esc(tx(a.title))}"><source src="${esc(d.src || 'media/sample-video.mp4')}" type="video/mp4">
        <track kind="captions" srclang="en" label="English" src="media/captions-en.vtt" ${isAr() ? '' : 'default'}><track kind="captions" srclang="ar" label="العربية" src="media/captions-ar.vtt" ${isAr() ? 'default' : ''}></video></div>
        <p class="muted small">${t('act.video.help')}</p>${transcript(TRANS[S.lang])}`;
    case 'audio': return `<div class="audio-card">${icon('audio', 28)}<div class="f1"><b>${esc(tx(a.title))}</b><audio controls preload="metadata" data-track="${c.id}|${a.id}" src="${esc(d.src || 'media/sample-audio-' + S.lang + '.mp3')}" aria-label="${esc(tx(a.title))}"></audio></div></div>
        <p class="muted small">${t('act.audio.help')}</p>${transcript(TRANS[S.lang])}`;
    case 'image': setTimeout(() => autoView(u, c, a), 400); return `<figure class="figure"><img src="${esc(d.src || 'media/pyramid-' + S.lang + '.svg')}" alt="${esc(tx(d.alt) || t('act.image.alt'))}"><figcaption>${esc(tx(d.alt) || t('act.image.alt'))}</figcaption></figure>`;
    case 'html': setTimeout(() => autoView(u, c, a), 400); return `<div class="prose">${tx(a.html) || `<p>${t('act.html.empty')}</p>`}</div>`;
    case 'scorm': return scormView(u, c, a);
    case 'xapi': return xapiView(u, c, a);
    case 'quiz': return quizView(u, c, a);
    case 'feedback': return feedbackView(u, c, a);
  }
  return '';
}
function autoView(u, c, a) { if (!isDone(u.id, a) && location.hash.includes('/a/' + a.id) && enr(u.id, c.id)) { markDone(u.id, c, a); refreshState(a); } }
function refreshState(a) { const s = document.getElementById('actState'); if (s) s.innerHTML = `<span class="chip ok">${icon('check', 14)} ${t('done')}</span>`; document.querySelectorAll('.cindex a.cur .ck').forEach(x => x.classList.add('on')); toast(t('toast.actDone')); }
function trackMedia() {
  document.querySelectorAll('[data-track]').forEach(m => {
    const [cid, aid] = m.dataset.track.split('|'), c = course(cid), a = actOf(c, aid), u = me();
    const done = () => { if (!isDone(u.id, a) && enr(u.id, c.id)) { markDone(u.id, c, a); refreshState(a); } };
    m.addEventListener('timeupdate', () => { if (m.duration && m.currentTime / m.duration >= 0.9) done(); });
    m.addEventListener('ended', done);
  });
}

/* SCORM 1.2 runtime (API object that a package finds in its parent window) */
let SCO = null;
function scormView(u, c, a) {
  const p = prog(u.id, a.id) || {};
  SCO = { u, c, a, data: { 'cmi.core.student_id': u.username, 'cmi.core.student_name': tx(u.name), 'cmi.core.lesson_status': p.done ? 'completed' : 'not attempted', 'cmi.core.score.raw': p.score != null ? String(p.score) : '', 'cmi.core.lesson_location': p.loc || '', 'cmi.suspend_data': p.suspend || '', 'cmi.core.session_time': '0000:00:00' } };
  window.API = {
    LMSInitialize: () => { logEv(u.id, 'scorm_launched', c.id, tx(a.title)); scormPanel(); return 'true'; },
    LMSGetValue: k => SCO.data[k] || '',
    LMSSetValue: (k, v) => { SCO.data[k] = String(v); scormPanel(); return 'true'; },
    LMSCommit: () => { scormCommit(false); return 'true'; },
    LMSFinish: () => { scormCommit(true); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => ''
  };
  return `<div class="scorm"><iframe title="${esc(tx(a.title))}" class="scorm-frame" srcdoc="${esc(scormPackage(S.lang))}"></iframe>
    <details class="runtime" open><summary>${t('scorm.runtime')}</summary><pre id="cmi" dir="ltr"></pre></details></div><p class="muted small">${t('scorm.help')}</p>`;
}
function scormPanel() { const el = document.getElementById('cmi'); if (el && SCO) el.textContent = Object.entries(SCO.data).map(([k, v]) => k + ' = ' + v).join('\n'); }
function scormCommit(fin) {
  const { u, c, a, data } = SCO; DB.progress[u.id] = DB.progress[u.id] || {}; const p = DB.progress[u.id][a.id] || {};
  p.loc = data['cmi.core.lesson_location']; p.suspend = data['cmi.suspend_data']; p.last = new Date().toISOString();
  if (data['cmi.core.score.raw']) p.score = +data['cmi.core.score.raw'];
  DB.progress[u.id][a.id] = p; save();
  if (fin) logEv(u.id, 'scorm_status_submitted', c.id, data['cmi.core.lesson_status'] + (p.score != null ? ' · ' + p.score : ''));
  if (['completed', 'passed'].includes(data['cmi.core.lesson_status']) && !p.done) { markDone(u.id, c, a, { score: p.score }); refreshState(a); }
}
function scormPackage(lang) {
  const ar = lang === 'ar';
  const T = ar ? { s1: 'الهرم العطري', p1: 'لكل عطر ثلاث طبقات تتبخر بسرعات مختلفة.', s2: 'رتّب الطبقات', p2: 'ما الطبقة التي تبقى أطول على البشرة؟', o: ['الافتتاحية', 'القلب', 'القاعدة'], ok: 'صحيح! القاعدة تبقى لساعات، أحياناً لليوم التالي.', no: 'ليس تماماً. القاعدة هي الأطول بقاءً.', fin: 'اكتمل الدرس', next: 'التالي', done: 'إنهاء وإرسال النتيجة', score: 'النتيجة' }
    : { s1: 'The fragrance pyramid', p1: 'Every fragrance has three layers that evaporate at different speeds.', s2: 'Check your understanding', p2: 'Which layer stays on the skin the longest?', o: ['Top notes', 'Heart notes', 'Base notes'], ok: 'Correct! Base notes last for hours, sometimes until the next day.', no: 'Not quite. Base notes last the longest.', fin: 'Lesson complete', next: 'Next', done: 'Finish and send result', score: 'Score' };
  return `<!DOCTYPE html><html lang="${lang}" dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  body{margin:0;font-family:${ar ? 'Almarai,Tahoma' : 'system-ui,Segoe UI,Arial'},sans-serif;background:#F7F5EF;color:#2B2E4A;display:grid;place-items:center;min-height:100vh}
  .s{display:none;max-width:520px;padding:24px;text-align:center}.s.on{display:block}h2{color:#421A00;margin:.2em 0}.p{display:flex;flex-direction:column;align-items:center;gap:6px;margin:16px 0}
  .p div{border-radius:8px;padding:10px;font-weight:700}button{font:inherit;border:0;border-radius:999px;padding:10px 20px;margin:4px;cursor:pointer;background:#2B2E4A;color:#fff;min-height:44px}
  .o button{background:#fff;color:#2B2E4A;border:2px solid #E4DFD2;display:block;width:100%}.o button.ok{border-color:#2E7D4F;background:#E6F3EA}.o button.no{border-color:#B3261E;background:#FBE9E7}
  .tag{font-size:12px;color:#7A5A12;font-weight:700;letter-spacing:.05em}</style></head><body>
  <div class="s on" id="a"><div class="tag">SCORM 1.2</div><h2>${T.s1}</h2><p>${T.p1}</p><div class="p"><div style="width:120px;background:#C19941">${T.o[0]}</div><div style="width:190px;background:#7A5A12;color:#fff">${T.o[1]}</div><div style="width:260px;background:#2B2E4A;color:#E7BF67">${T.o[2]}</div></div><button onclick="go('b')">${T.next}</button></div>
  <div class="s" id="b"><h2>${T.s2}</h2><p>${T.p2}</p><div class="o">${T.o.map((o, i) => `<button onclick="ans(this,${i})">${o}</button>`).join('')}</div><p id="fb" aria-live="polite"></p><button id="fin" onclick="finish()" disabled>${T.done}</button></div>
  <div class="s" id="c"><h2>${T.fin}</h2><p>${T.score}: <b id="sc"></b></p></div>
  <script>
  var api=null,w=window;for(var i=0;i<5&&w;i++){if(w.API){api=w.API;break}w=w.parent}
  var tries=0,score=0,t0=Date.now();if(api){api.LMSInitialize("");var loc=api.LMSGetValue("cmi.core.lesson_location");if(loc==="b")go("b");if(api.LMSGetValue("cmi.core.lesson_status")==="not attempted")api.LMSSetValue("cmi.core.lesson_status","incomplete")}
  function go(id){document.querySelectorAll('.s').forEach(function(s){s.classList.remove('on')});document.getElementById(id).classList.add('on');if(api){api.LMSSetValue("cmi.core.lesson_location",id);api.LMSCommit("")}}
  function ans(b,i){tries++;var ok=i===2;b.className=ok?'ok':'no';document.getElementById('fb').textContent=ok?${JSON.stringify(T.ok)}:${JSON.stringify(T.no)};if(ok){score=tries===1?100:(tries===2?80:60);document.getElementById('fin').disabled=false}}
  function pad(n){return(n<10?'0':'')+n}
  function finish(){var s=Math.round((Date.now()-t0)/1000);if(api){api.LMSSetValue("cmi.core.score.raw",score);api.LMSSetValue("cmi.core.lesson_status",score>=80?"passed":"failed");api.LMSSetValue("cmi.core.session_time","00"+pad(Math.floor(s/3600))+":"+pad(Math.floor(s/60)%60)+":"+pad(s%60));api.LMSCommit("");api.LMSFinish("")}document.getElementById('sc').textContent=score+'%';go('c')}
  <\/script></body></html>`;
}

/* xAPI (advanced): a branching scenario that emits statements to an in-browser LRS */
const XAPI_SC = {
  steps: [
    { q: { en: 'A customer says: “I want something for my wedding, it must last all night.” What do you ask first?', ar: 'قال العميل: «أبي عطر لعرسي، لازم يثبت طول الليل.» بماذا تبدأ؟' },
      o: [{ t: { en: '“Which fragrance do you usually wear?”', ar: '«وش العطر اللي تستخدمه عادة؟»' }, ok: true }, { t: { en: '“Here is our most expensive oud.”', ar: '«هذا أغلى عود عندنا.»' }, ok: false }] },
    { q: { en: 'They like warm, rich scents. What do you recommend?', ar: 'يحب الروائح الدافئة الفخمة. بماذا توصي؟' },
      o: [{ t: { en: 'An oud spray with an amber base', ar: 'بخاخ عود بقاعدة عنبر' }, ok: true }, { t: { en: 'A light citrus cologne', ar: 'كولونيا حمضية خفيفة' }, ok: false }] },
    { q: { en: 'Suggest one add-on linked to what they said:', ar: 'اقترح إضافة واحدة مرتبطة بكلامه:' },
      o: [{ t: { en: 'White body musk to help it last through the night', ar: 'مسك الجسم الأبيض ليساعد على الثبات طوال السهرة' }, ok: true }, { t: { en: 'Three different gift sets', ar: 'ثلاث مجموعات هدايا مختلفة' }, ok: false }] }
  ]
};
function stmt(u, a, verb, result) {
  const s = { id: uid('st'), timestamp: new Date().toISOString(), actor: { objectType: 'Agent', name: tx(u.name), account: { homePage: 'https://lms.example.com', name: u.username } },
    verb: { id: 'http://adlnet.gov/expapi/verbs/' + verb, display: { 'en-US': verb } }, object: { objectType: 'Activity', id: 'https://lms.example.com/xapi/activities/' + a.id, definition: { name: { 'en-US': a.title.en } } } };
  if (result) s.result = result;
  DB.xapi.unshift(s); if (DB.xapi.length > 500) DB.xapi.length = 500; save();
  const el = document.getElementById('lrs'); if (el) el.textContent = DB.xapi.filter(x => x.actor.account.name === u.username && x.object.id.endsWith(a.id)).slice(0, 4).map(x => JSON.stringify(x, null, 2)).join('\n\n');
}
let XS = null;
function xapiView(u, c, a) {
  XS = { u, c, a, step: 0, correct: 0 };
  setTimeout(() => stmt(u, a, 'initialized'), 50);
  return `<div class="notice info">${icon('xapi', 18)}<span>${t('xapi.help')}</span></div><div id="xsc" class="xsc" aria-live="polite">${xapiStep()}</div>
    <details class="runtime"><summary>${t('xapi.lrs')}</summary><pre id="lrs" dir="ltr"></pre></details>`;
}
function xapiStep() {
  if (XS.step >= XAPI_SC.steps.length) { const sc = XS.correct / XAPI_SC.steps.length; return `<div class="notice ${sc >= 0.67 ? 'ok' : 'bad'}"><b>${t('xapi.done', { n: XS.correct, m: XAPI_SC.steps.length })}</b></div>${sc < 0.67 ? `<button class="btn btn-navy" data-act="xRestart">${t('retry')}</button>` : ''}`; }
  const st = XAPI_SC.steps[XS.step];
  return `<p class="muted small">${t('xapi.step', { n: XS.step + 1, m: XAPI_SC.steps.length })}</p><p class="lead">${esc(tx(st.q))}</p><div class="opts">${st.o.map((o, i) => `<button class="opt" data-act="xAns" data-i="${i}">${esc(tx(o.t))}</button>`).join('')}</div>`;
}

/* Quiz */
function quizView(u, c, a) {
  const p = prog(u.id, a.id) || {}, att = p.attempts || [], best = att.length ? Math.max(...att.map(x => x.score)) : null;
  return `<div class="quiz-info"><dl class="kv"><dt>${t('quiz.pass')}</dt><dd>${a.pass || 80}%</dd><dt>${t('quiz.attempts')}</dt><dd>${att.length} / 3</dd><dt>${t('quiz.best')}</dt><dd>${best == null ? '—' : best + '%'}</dd><dt>${t('quiz.grading')}</dt><dd>${t('quiz.highest')}</dd></dl></div>
    ${att.length ? `<table class="tbl"><thead><tr><th>#</th><th>${t('date')}</th><th>${t('score')}</th><th>${t('result')}</th></tr></thead><tbody>${att.map((x, i) => `<tr><td>${i + 1}</td><td>${fmtDT(x.at)}</td><td>${x.score}%</td><td><span class="chip ${x.score >= (a.pass || 80) ? 'ok' : 'bad'}">${x.score >= (a.pass || 80) ? t('passed') : t('failed')}</span></td></tr>`).join('')}</tbody></table>` : ''}
    <div id="quizArea">${att.length >= 3 && !p.done ? `<p class="notice bad">${t('quiz.noMore')}</p>` : p.done ? `<p class="notice ok">${t('quiz.passedMsg')}</p><button class="btn btn-ghost" data-act="quizStart">${t('quiz.review')}</button>` : `<button class="btn btn-gold" data-act="quizStart">${att.length ? t('quiz.again') : t('quiz.start')}</button>`}</div>`;
}
function quizForm(a) {
  return `<form id="quizForm" class="quiz">${a.questions.map((q, i) => `<fieldset class="q"><legend><span class="qn">${i + 1}</span> ${esc(tx(q.text))}</legend>
    ${q.opts.map((o, j) => `<label class="opt"><input type="${q.type === 'multi' ? 'checkbox' : 'radio'}" name="q${i}" value="${j}"><span>${esc(tx(o))}</span></label>`).join('')}<div class="qfb" id="qfb${i}" aria-live="polite"></div></fieldset>`).join('')}
    <button class="btn btn-gold" type="submit">${t('quiz.submit')}</button></form>`;
}

/* Feedback / satisfaction */
function feedbackView(u, c, a) {
  const f = DB.feedback.find(x => x.userId === u.id && x.courseId === c.id);
  if (f) return `<div class="notice ok">${icon('check', 18)}<span>${t('fb.thanks')}</span></div>`;
  const lik = (n, l) => `<fieldset class="likert"><legend>${l}</legend><div>${[1, 2, 3, 4, 5].map(v => `<label><input type="radio" name="${n}" value="${v}" required><span>${v}</span></label>`).join('')}</div><div class="lk-ends"><small>${t('fb.low')}</small><small>${t('fb.high')}</small></div></fieldset>`;
  return `<form id="fbForm" class="form" data-cid="${c.id}" data-aid="${a.id}"><p class="muted">${t('fb.intro')}</p>${lik('rating', t('fb.q1'))}${lik('relevance', t('fb.q2'))}${lik('confidence', t('fb.q3'))}
    <label class="field"><span>${t('fb.q4')}</span><textarea name="comment" rows="3" maxlength="500"></textarea></label><p class="notice bad" id="fbErr" hidden>${t('fb.err')}</p><button class="btn btn-gold" type="submit">${t('submit')}</button></form>`;
}

/* ---------- history ---------- */
function vHistory(q, uidOverride) {
  const u = uidOverride ? user(uidOverride) : me();
  const rows = [];
  Object.entries(DB.progress[u.id] || {}).forEach(([aid, p]) => { if (!p.done) return; const c = DB.courses.find(x => acts(x).some(y => y.id === aid)); if (!c) return; const a = actOf(c, aid); rows.push({ c, a, p }); });
  rows.sort((x, y) => new Date(y.p.done) - new Date(x.p.done));
  const certs = Object.entries(DB.courseDone[u.id] || {}).map(([cid, at]) => ({ c: course(cid), at })).filter(x => x.c);
  const body = `<div class="stats">
      <div class="card stat">${icon('clock', 22)}<div><b>${fmtH(secs(u.id))}</b><span>${t('dash.hoursTotal')}</span></div></div>
      <div class="card stat">${icon('check', 22)}<div><b>${rows.length}</b><span>${t('hist.acts')}</span></div></div>
      <div class="card stat">${icon('courses', 22)}<div><b>${certs.length}</b><span>${t('dash.coursesDone')}</span></div></div>
      <div class="card stat">${icon('award', 22)}<div><b>${badgesOf(u.id).length}</b><span>${t('dash.badges')}</span></div></div></div>
    <section class="card block"><div class="block-h"><h2>${t('hist.certs')}</h2></div>${certs.length ? `<ul class="clean list">${certs.map(x => `<li>${badgeSvg(36)}<div class="f1"><b>${esc(tx(x.c.title))}</b><small class="muted">${t('completedOn')} ${fmtDate(x.at)}</small></div>${uidOverride ? '' : `<a class="btn btn-ghost btn-sm" href="#/certificate/${x.c.id}">${icon('eye', 16)} ${t('view')}</a>`}</li>`).join('')}</ul>` : empty(t('hist.noCerts'))}</section>
    <section class="card block"><div class="block-h"><h2>${t('hist.record')}</h2>${uidOverride ? '' : `<button class="btn btn-ghost btn-sm" data-act="exportHistory">${icon('download', 16)} ${t('exportCsv')}</button>`}</div>
      ${rows.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('date')}</th><th>${t('course')}</th><th>${t('activity')}</th><th>${t('f.type')}</th><th>${t('time')}</th><th>${t('score')}</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${fmtDate(r.p.done)}</td><td>${esc(tx(r.c.title))}</td><td>${esc(tx(r.a.title))}</td><td>${typeChip(r.a.type)}</td><td>${t('unit.min', { n: Math.round((r.p.timeSec || 0) / 60) })}</td><td>${r.p.score != null ? r.p.score + '%' : '—'}</td></tr>`).join('')}</tbody></table></div>` : empty(t('hist.none'))}</section>`;
  if (uidOverride) return body;
  return shell('history', pageHead(t('hist.title'), t('hist.sub'), '', ['completion', 'badges']) + body);
}

/* ---------- profile & settings ---------- */
function vProfile(q) {
  const u = me(), tab = q.get('tab') || 'personal', np = (DB.prefs[u.id] || {});
  const T = [['personal', t('prof.personal')], ['prefs', t('prof.prefs')], ['notif', t('prof.notif')], ['privacy', t('prof.privacy')], ['security', t('prof.security')]];
  let body = '';
  if (tab === 'personal') body = `<form id="profForm" class="form two">
      <label class="field"><span>${t('f.nameEn')}</span><input name="nameEn" value="${esc(u.name.en)}" required></label><label class="field"><span>${t('f.nameAr')}</span><input name="nameAr" value="${esc(u.name.ar)}" dir="rtl"></label>
      <label class="field"><span>${t('f.email')}</span><input name="email" type="email" value="${esc(u.email)}" required></label><label class="field"><span>${t('f.phone')}</span><input name="phone" value="${esc(u.phone || '')}" dir="ltr"></label>
      <label class="field"><span>${t('f.username')}</span><input value="${esc(u.username)}" disabled></label><label class="field"><span>${t('f.role')}</span><input value="${esc(t('role.' + u.role))}" disabled></label>
      <label class="field"><span>${t('f.title')}</span><input value="${esc(tx(u.title))}" disabled></label><label class="field"><span>${t('f.branch')}</span><input value="${esc(tx(window.BRANCHES[u.branch]))}" disabled></label>
      <label class="field span2"><span>${t('f.bio')}</span><textarea name="bio" rows="3">${esc(u.bio || '')}</textarea></label>
      <p class="muted small span2">${t('prof.hrNote')}</p><div class="span2"><button class="btn btn-gold">${t('save')}</button></div></form>`;
  if (tab === 'prefs') body = `<form id="prefForm" class="form"><fieldset class="field"><legend>${t('f.language')}</legend><label class="radio"><input type="radio" name="lang" value="en" ${S.lang === 'en' ? 'checked' : ''}> English</label><label class="radio"><input type="radio" name="lang" value="ar" ${S.lang === 'ar' ? 'checked' : ''}> العربية</label></fieldset>
      <fieldset class="field"><legend>${t('f.theme')}</legend><label class="radio"><input type="radio" name="theme" value="light" ${S.theme === 'light' ? 'checked' : ''}> ${t('theme.lightName')}</label><label class="radio"><input type="radio" name="theme" value="dark" ${S.theme === 'dark' ? 'checked' : ''}> ${t('theme.darkName')}</label></fieldset>
      <button class="btn btn-gold">${t('save')}</button></form>`;
  if (tab === 'notif') body = `<form id="notifForm" class="form">${['assign', 'due', 'overdue', 'complete', 'team'].map(k => `<label class="switch"><input type="checkbox" name="${k}" ${np[k] === false ? '' : 'checked'}><span>${t('np.' + k)}</span></label>`).join('')}
      <fieldset class="field"><legend>${t('np.channel')}</legend><label class="radio"><input type="checkbox" checked disabled> ${t('np.web')}</label><label class="radio"><input type="checkbox" name="email" ${np.email === false ? '' : 'checked'}> ${t('np.email')} <span class="tag t-sim">${t('lbl.sim')}</span></label><label class="radio"><input type="checkbox" name="app" ${np.app ? 'checked' : ''}> ${t('np.app')} <span class="tag t-rec">${t('lbl.rec')}</span></label></fieldset>
      <button class="btn btn-gold">${t('save')}</button></form>`;
  if (tab === 'privacy') body = `<div class="prose"><p>${t('priv.p1')}</p><ul><li>${t('priv.l1')}</li><li>${t('priv.l2')}</li><li>${t('priv.l3')}</li></ul><p>${t('priv.p2')}</p></div>
      <div class="row"><button class="btn btn-navy" data-act="exportMe">${icon('download', 16)} ${t('priv.export')}</button><button class="btn btn-ghost" data-act="requestDelete">${icon('trash', 16)} ${t('priv.delete')}</button></div>`;
  if (tab === 'security') body = `<form id="pwForm" class="form"><label class="field"><span>${t('pw.current')}</span><input type="password" name="cur" autocomplete="current-password" required></label><label class="field"><span>${t('pw.new')}</span><input type="password" name="n1" minlength="8" autocomplete="new-password" required></label><label class="field"><span>${t('pw.confirm')}</span><input type="password" name="n2" minlength="8" autocomplete="new-password" required></label><p class="notice bad" id="pwErr" hidden></p><button class="btn btn-gold">${t('pw.change')}</button> <span class="tag t-sim">${t('lbl.sim')}</span></form>`;
  return shell('', pageHead(t('nav.profile'), '', '', ['profile', tab === 'privacy' ? 'privacy' : 'notifications']) + `<div class="profile"><aside class="card pcard"><span class="avatar big">${esc(initials(u))}</span><h2>${esc(tx(u.name))}</h2><p class="muted">${esc(tx(u.title))}<br>${esc(tx(window.BRANCHES[u.branch]))}</p><p class="small muted">${t('memberSince')} ${fmtDate(u.created)}</p></aside>
    <section class="card block f1">${tabs(T.map(([k, l]) => ['#/profile?tab=' + k, l]), '#/profile?tab=' + tab)}${body}</section></div>`);
}

/* ---------- certificate ---------- */
function vCert(cid, uidx) {
  const u = uidx ? user(uidx) : me(), c = course(cid); if (!c) return vNotFound();
  const at = courseDoneAt(u.id, c.id);
  if (!at) return shell('home', `<section class="card block"><div class="notice warn">${icon('lock', 18)}<span>${t('cert.locked')}</span></div><a class="btn btn-gold" href="#/course/${c.id}">${t('course.back')}</a></section>`);
  const code = 'SA-' + new Date(at).getFullYear() + '-' + (c.id + u.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return shell('home', pageHead(t('certificate'), '', `<button class="btn btn-navy btn-sm" data-act="print">${icon('download', 16)} ${t('cert.print')}</button>`, ['certificate', 'badges']) + `
    <div class="cert"><div class="cert-in"><div class="bottles"></div><span class="pill">${t('brand')}</span><h2>${t('cert.title')}</h2><p class="muted">${t('cert.line1')}</p>
      <div class="cname">${esc(tx(u.name))}</div><p>${t('cert.line2')}</p><h3>${esc(tx(c.title))}</h3>
      <p>${t('cert.date')}: <b>${fmtDate(at)}</b> · ${t('unit.hours', { n: c.hours })}</p><div class="spread small"><span>${t('cert.code')}: <b dir="ltr">${code}</b></span><span>${t('cert.sign')}</span></div></div></div>`);
}

/* ---------- references ---------- */
function vRefs() {
  const rows = [
    ['ref.r.dashboard', ['dashboard', 'timeline', 'overview'], 'impl'], ['ref.r.catalog', ['catalog'], 'impl'], ['ref.r.completion', ['completion', 'coursecompletion'], 'impl'],
    ['ref.r.video', ['file'], 'impl'], ['ref.r.scorm', ['scorm'], 'impl'], ['ref.r.html', ['page'], 'impl'], ['ref.r.xapi', ['h5p', 'xapi'], 'sim'],
    ['ref.r.quiz', ['quiz'], 'impl'], ['ref.r.feedback', ['feedback'], 'impl'], ['ref.r.badges', ['badges', 'certificate'], 'impl'], ['ref.r.history', ['completion'], 'impl'],
    ['ref.r.profile', ['profile', 'privacy', 'notifications'], 'impl'], ['ref.r.team', ['mentees', 'learningplans'], 'impl'], ['ref.r.courses', ['addcourse', 'visibility', 'enrol'], 'impl'],
    ['ref.r.users', ['browseusers', 'adduser', 'uploadusers', 'roles', 'loginas'], 'impl'], ['ref.r.reports', ['coursecompletionreport', 'activitycompletionreport', 'customreports', 'logs'], 'impl'],
    ['ref.r.lang', ['language'], 'impl'], ['ref.r.dark', [], 'impl'], ['ref.r.sso', [], 'rec'], ['ref.r.storage', [], 'sim'], ['ref.r.email', ['notifications'], 'sim'], ['ref.r.app', ['moodlecloud'], 'rec']
  ];
  return shell('', pageHead(t('ref.title'), t('ref.sub'), '', ['moodlecloud']) + `<div class="notice info">${icon('link', 18)}<span>${t('ref.note')}</span></div>
    <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('ref.feature')}</th><th>${t('ref.moodle')}</th><th>${t('ref.status')}</th></tr></thead><tbody>
    ${rows.map(([k, rs, st]) => `<tr><td>${t(k)}</td><td><div class="refs col">${rs.map(ref).join('') || `<span class="muted small">${t(k + '.n')}</span>`}</div></td><td><span class="tag t-${st}">${t('lbl.' + st)}</span></td></tr>`).join('')}</tbody></table></div></div>
    <p class="muted small">${t('ref.legend')}</p>`);
}
function vNotFound() { return shell('', `<section class="card block">${empty(t('notfound'))}<a class="btn btn-gold" href="#/dashboard">${t('nav.dashboard')}</a></section>`); }
