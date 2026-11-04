/* Sales Academy LMS prototype · manager & admin pages */
'use strict';
window.BRANCHES = [{ en: 'Jeddah · Tahlia', ar: 'جدة · التحلية' }, { en: 'Riyadh · Olaya', ar: 'الرياض · العليا' }, { en: 'Makkah · Aziziyah', ar: 'مكة · العزيزية' }, { en: 'Dammam · Corniche', ar: 'الدمام · الكورنيش' }];
const demoNote = () => `<div class="notice warn">${icon('eye', 18)}<span>${t('demo.data')}</span></div>`;
const learnersOf = mid => DB.users.filter(u => u.managerId === mid);
function userSummary(u) {
  const es = myEnrols(u.id), assigned = es.filter(e => e.assigned).map(e => course(e.courseId));
  const pct = assigned.length ? Math.round(assigned.reduce((s, c) => s + coursePct(u.id, c), 0) / assigned.length) : 0;
  return { es, assigned, pct, overdue: assigned.filter(c => status(u.id, c) === 'overdue').length, done: assigned.filter(c => courseDoneAt(u.id, c.id)).length, hours: secs(u.id) };
}

/* ---------- manager: my team ---------- */
function vTeam() {
  const m = me(); if (!can('manager')) return vNotFound();
  const team = roleOf() === 'admin' ? DB.users.filter(u => u.role === 'learner') : learnersOf(m.id);
  const sm = team.map(u => Object.assign({ u }, userSummary(u)));
  const month = new Date(Date.now() - 30 * 864e5);
  const avg = sm.length ? Math.round(sm.reduce((s, x) => s + x.pct, 0) / sm.length) : 0;
  return shell('team', pageHead(t('team.title'), t('team.sub', { n: team.length }), `<button class="btn btn-gold btn-sm" data-act="assignModal" data-uid="">${icon('plus', 16)} ${t('team.assign')}</button><button class="btn btn-ghost btn-sm" data-act="exportTeam">${icon('download', 16)} ${t('exportCsv')}</button>`, ['mentees', 'learningplans', 'activitycompletionreport']) + demoNote() + `
    <div class="stats"><div class="card stat">${icon('team', 22)}<div><b>${team.length}</b><span>${t('team.members')}</span></div></div>
      <div class="card stat">${icon('chart', 22)}<div><b>${avg}%</b><span>${t('team.avg')}</span></div></div>
      <div class="card stat">${icon('clock', 22)}<div><b>${sm.reduce((s, x) => s + x.overdue, 0)}</b><span>${t('team.overdue')}</span></div></div>
      <div class="card stat">${icon('fire', 22)}<div><b>${fmtH(team.reduce((s, u) => s + secs(u.id, month), 0))}</b><span>${t('team.hoursMonth')}</span></div></div></div>
    <section class="card block"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('f.name')}</th><th>${t('f.branch')}</th><th>${t('team.progress')}</th><th>${t('team.done')}</th><th>${t('team.overdueCol')}</th><th>${t('team.hours')}</th><th>${t('team.last')}</th><th><span class="sr">${t('actions')}</span></th></tr></thead><tbody>
    ${sm.map(x => `<tr class="${x.u.status === 'suspended' ? 'dim' : ''}"><td><a href="#/team/${x.u.id}" class="usr"><span class="avatar sm">${esc(initials(x.u))}</span>${esc(tx(x.u.name))}</a></td><td>${esc(tx(window.BRANCHES[x.u.branch]))}</td>
      <td><div class="row nowrap" style="min-width:140px">${bar(x.pct, tx(x.u.name))}<small>${x.pct}%</small></div></td><td>${x.done}/${x.assigned.length}</td><td>${x.overdue ? `<span class="chip bad">${x.overdue}</span>` : '<span class="chip ok">0</span>'}</td><td>${fmtH(x.hours)}</td><td>${fmtDate(x.u.lastAccess)}</td>
      <td class="nowrap"><button class="icon-btn" data-act="remind" data-uid="${x.u.id}" title="${esc(t('team.remind'))}" aria-label="${esc(t('team.remind') + ' ' + tx(x.u.name))}">${icon('mail', 18)}</button><button class="icon-btn" data-act="assignModal" data-uid="${x.u.id}" title="${esc(t('team.assign'))}" aria-label="${esc(t('team.assign') + ' ' + tx(x.u.name))}">${icon('plus', 18)}</button></td></tr>`).join('')}</tbody></table></div></section>`);
}
function vMember(id) {
  const u = user(id); if (!u || !can('manager')) return vNotFound();
  if (roleOf() === 'manager' && u.managerId !== me().id) return vNotFound();
  const x = userSummary(u);
  return shell('team', `<nav class="crumbs"><a href="#/team">${t('nav.team')}</a> / ${esc(tx(u.name))}</nav>` + pageHead(esc(tx(u.name)), `${esc(tx(u.title))} · ${esc(tx(window.BRANCHES[u.branch]))} · ${esc(u.email)}`, `<button class="btn btn-gold btn-sm" data-act="assignModal" data-uid="${u.id}">${icon('plus', 16)} ${t('team.assign')}</button><button class="btn btn-ghost btn-sm" data-act="remind" data-uid="${u.id}">${icon('mail', 16)} ${t('team.remind')}</button>`) + `
    <section class="card block"><div class="block-h"><h2>${t('team.courses')}</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('course')}</th><th>${t('status')}</th><th>${t('due')}</th><th>${t('team.progress')}</th><th>${t('completedOn')}</th></tr></thead><tbody>
    ${x.es.map(e => { const c = course(e.courseId); return `<tr><td>${esc(tx(c.title))} ${e.assigned ? '' : `<small class="muted">(${t('team.self')})</small>`}</td><td>${statusChip(u.id, c)}</td><td>${e.due ? fmtDate(e.due) : '—'}</td><td><div class="row nowrap" style="min-width:140px">${bar(coursePct(u.id, c))}<small>${coursePct(u.id, c)}%</small></div></td><td>${fmtDate(courseDoneAt(u.id, c.id))}</td></tr>`; }).join('')}</tbody></table></div></section>
    ${vHistory(null, u.id)}`);
}
function assignModal(uidPre) {
  const pool = roleOf() === 'admin' ? DB.users.filter(u => u.role !== 'admin') : learnersOf(me().id);
  modal(t('team.assign'), `<form id="assignForm" class="form">
    <label class="field"><span>${t('course')}</span><select name="cid" required>${DB.courses.filter(c => c.status === 'published').map(c => `<option value="${c.id}">${esc(tx(c.title))}</option>`).join('')}</select></label>
    <fieldset class="field"><legend>${t('assign.to')}</legend><div class="checks">${pool.map(u => `<label class="radio"><input type="checkbox" name="u" value="${u.id}" ${uidPre === u.id || !uidPre ? 'checked' : ''}> ${esc(tx(u.name))}</label>`).join('')}</div></fieldset>
    <label class="field"><span>${t('due')}</span><input type="date" name="due" value="${new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)}" required></label>
    <label class="switch"><input type="checkbox" name="notify" checked><span>${t('assign.notify')}</span></label></form>`,
    [{ label: t('cancel'), act: 'closeModal' }, { label: t('team.assign'), cls: 'btn-gold', form: 'assignForm' }]);
}

/* ---------- admin: courses ---------- */
function adminTabs(cur) { return tabs([['#/admin/courses', `${icon('courses', 16)} ${t('adm.courses')}`], ['#/admin/users', `${icon('users', 16)} ${t('adm.users')}`], ['#/admin/reports', `${icon('reports', 16)} ${t('adm.reports')}`]], cur); }
function vAdminCourses() {
  if (!can('admin')) return vNotFound();
  const rows = DB.courses.map(c => { const es = DB.enrolments.filter(e => e.courseId === c.id); const done = es.filter(e => courseDoneAt(e.userId, c.id)).length; return { c, n: es.length, done, pct: es.length ? Math.round(100 * done / es.length) : 0 }; });
  return shell('admin', pageHead(t('adm.title'), '', `<a class="btn btn-gold btn-sm" href="#/admin/course/new">${icon('plus', 16)} ${t('adm.newCourse')}</a>`, ['addcourse', 'visibility', 'enrol']) + adminTabs('#/admin/courses') + `
    <section class="card block"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('course')}</th><th>${t('f.category')}</th><th>${t('content')}</th><th>${t('status')}</th><th>${t('adm.enrolled')}</th><th>${t('adm.completion')}</th><th><span class="sr">${t('actions')}</span></th></tr></thead><tbody>
    ${rows.map(({ c, n, pct }) => `<tr><td><a href="#/admin/course/${c.id}"><b>${esc(tx(c.title))}</b></a><br><small class="muted">${acts(c).length} ${t('unit.acts')} · ${t('unit.hours', { n: c.hours })}</small></td><td>${esc(tx((DB.categories.find(x => x.id === c.cat) || {}).name))}</td>
      <td><div class="types">${[...new Set(acts(c).map(a => a.type))].map(x => `<span class="tchip t-${x} only" title="${esc(t('type.' + x))}">${icon(x, 14)}<span class="sr">${t('type.' + x)}</span></span>`).join('')}</div></td>
      <td><span class="chip ${c.status === 'published' ? 'ok' : c.status === 'draft' ? 'warn' : 'na'}">${t('cs.' + c.status)}</span></td><td>${n}</td><td><div class="row nowrap" style="min-width:110px">${bar(pct)}<small>${pct}%</small></div></td>
      <td class="nowrap"><a class="icon-btn" href="#/admin/course/${c.id}" title="${esc(t('edit'))}" aria-label="${esc(t('edit'))}">${icon('edit', 18)}</a><a class="icon-btn" href="#/course/${c.id}" title="${esc(t('preview'))}" aria-label="${esc(t('preview'))}">${icon('eye', 18)}</a>
        <button class="icon-btn" data-act="launchModal" data-id="${c.id}" title="${esc(t('adm.launch'))}" aria-label="${esc(t('adm.launch'))}">${icon('rocket', 18)}</button><button class="icon-btn" data-act="dupCourse" data-id="${c.id}" title="${esc(t('duplicate'))}" aria-label="${esc(t('duplicate'))}">${icon('copy', 18)}</button>
        <button class="icon-btn danger" data-act="delCourseAsk" data-id="${c.id}" title="${esc(t('delete'))}" aria-label="${esc(t('delete'))}">${icon('trash', 18)}</button></td></tr>`).join('')}</tbody></table></div></section>`);
}
function vCourseEdit(cid) {
  if (!can('admin')) return vNotFound();
  let c = cid === 'new' ? null : course(cid);
  if (cid !== 'new' && !c) return vNotFound();
  const L2 = (k, o) => `<label class="field"><span>${t(k)} (EN)</span><input name="${k}_en" value="${esc(o ? o.en : '')}" required></label><label class="field"><span>${t(k)} (عربي)</span><input name="${k}_ar" value="${esc(o ? o.ar : '')}" dir="rtl" required></label>`;
  const settings = `<form id="courseForm" class="form two" data-id="${c ? c.id : ''}">${L2('f.ctitle', c && c.title)}
    <label class="field"><span>${t('f.summary')} (EN)</span><textarea name="sum_en" rows="2">${esc(c ? c.summary.en : '')}</textarea></label><label class="field"><span>${t('f.summary')} (عربي)</span><textarea name="sum_ar" rows="2" dir="rtl">${esc(c ? c.summary.ar : '')}</textarea></label>
    <label class="field"><span>${t('f.category')}</span><select name="cat">${DB.categories.map(x => `<option value="${x.id}" ${c && c.cat === x.id ? 'selected' : ''}>${esc(tx(x.name))}</option>`).join('')}</select></label>
    <label class="field"><span>${t('f.hours')}</span><input name="hours" type="number" step="0.25" min="0.25" value="${c ? c.hours : 1}"></label>
    <label class="field"><span>${t('f.visibility')}</span><select name="status">${['draft', 'published', 'hidden'].map(s => `<option value="${s}" ${(c ? c.status : 'draft') === s ? 'selected' : ''}>${t('cs.' + s)}</option>`).join('')}</select></label>
    <label class="field"><span>${t('f.color')}</span><input name="color" type="color" value="${c ? c.color : '#2B2E4A'}"></label>
    <label class="switch span2"><input type="checkbox" name="selfEnrol" ${c && c.selfEnrol ? 'checked' : ''}><span>${t('f.selfEnrol')}</span></label>
    <div class="span2 row"><button class="btn btn-gold">${c ? t('save') : t('adm.createCourse')}</button>${c ? `<button type="button" class="btn btn-navy" data-act="launchModal" data-id="${c.id}">${icon('rocket', 16)} ${t('adm.launch')}</button>` : ''}</div></form>`;
  const content = c ? `<section class="card block"><div class="block-h"><h2>${t('adm.content')}</h2><button class="btn btn-ghost btn-sm" data-act="addSection" data-id="${c.id}">${icon('plus', 16)} ${t('adm.addSection')}</button></div>
    ${c.sections.map((s, si) => `<div class="ed-sec"><div class="ed-sec-h"><input class="inline" data-act-input="secTitle" data-cid="${c.id}" data-si="${si}" value="${esc(tx(s.title))}" aria-label="${esc(t('adm.sectionName'))}">
      <span class="row nowrap"><button class="btn btn-gold btn-sm" data-act="addActModal" data-cid="${c.id}" data-si="${si}">${icon('plus', 16)} ${t('adm.addAct')}</button><button class="icon-btn danger" data-act="delSection" data-cid="${c.id}" data-si="${si}" aria-label="${esc(t('delete'))}">${icon('trash', 18)}</button></span></div>
      ${s.acts.length ? s.acts.map((a, ai) => `<div class="ed-act"><span class="act-ic t-${a.type}">${icon(a.type)}</span><div class="f1"><b>${esc(tx(a.title))}</b><div class="meta"><span>${t('type.' + a.type)}</span><span>${t('unit.min', { n: a.min })}</span><span>${t('cond.' + a.completion)}</span>${a.file ? `<span>${icon('upload', 12)} ${esc(a.file)}</span>` : ''}</div></div>
        <span class="row nowrap"><button class="icon-btn" data-act="moveAct" data-cid="${c.id}" data-si="${si}" data-ai="${ai}" data-d="-1" aria-label="${esc(t('moveUp'))}" ${ai === 0 ? 'disabled' : ''}>${icon('up', 18)}</button><button class="icon-btn" data-act="moveAct" data-cid="${c.id}" data-si="${si}" data-ai="${ai}" data-d="1" aria-label="${esc(t('moveDown'))}" ${ai === s.acts.length - 1 ? 'disabled' : ''}>${icon('down', 18)}</button>
        <a class="icon-btn" href="#/course/${c.id}/a/${a.id}" aria-label="${esc(t('preview'))}">${icon('eye', 18)}</a><button class="icon-btn danger" data-act="delAct" data-cid="${c.id}" data-si="${si}" data-ai="${ai}" aria-label="${esc(t('delete'))}">${icon('trash', 18)}</button></span></div>`).join('') : `<p class="muted small pad">${t('adm.emptySection')}</p>`}</div>`).join('')}</section>` : '';
  return shell('admin', `<nav class="crumbs"><a href="#/admin/courses">${t('adm.courses')}</a> / ${c ? esc(tx(c.title)) : t('adm.newCourse')}</nav>` + pageHead(c ? t('adm.editCourse') : t('adm.newCourse'), c ? `${t('status')}: ${t('cs.' + c.status)}` : t('adm.newSub'), '', ['addcourse', 'scorm', 'page', 'h5p']) +
    `<section class="card block"><div class="block-h"><h2>${t('adm.settings')}</h2></div>${settings}</section>${content}`);
}
function addActModal(cid, si) {
  modal(t('adm.addAct'), `<form id="actForm" class="form" data-cid="${cid}" data-si="${si}"><fieldset class="field"><legend>${t('adm.pickType')}</legend><div class="type-grid">${TYPES.map((x, i) => `<label class="type-opt"><input type="radio" name="type" value="${x}" ${i === 0 ? 'checked' : ''}><span class="act-ic t-${x}">${icon(x)}</span><b>${t('type.' + x)}</b><small>${t('typeDesc.' + x)}</small>${x === 'xapi' ? `<span class="chip gold">${t('lbl.advanced')}</span>` : ''}</label>`).join('')}</div></fieldset>
    <div class="two"><label class="field"><span>${t('f.ctitle')} (EN)</span><input name="t_en" required></label><label class="field"><span>${t('f.ctitle')} (عربي)</span><input name="t_ar" dir="rtl" required></label></div>
    <div class="two"><label class="field"><span>${t('f.minutes')}</span><input name="min" type="number" min="1" value="5"></label>
    <label class="field" id="srcField"><span>${t('f.source')}</span><input name="file" type="file" accept=".mp4,.webm,.mp3,.m4a,.wav,.png,.jpg,.jpeg,.svg,.zip,.html"><small class="muted">${t('f.sourceHelp')}</small></label></div>
    <label class="field"><span>${t('f.url')}</span><input name="url" type="url" placeholder="https://" dir="ltr"></label>
    <label class="field"><span>${t('f.html')}</span><textarea name="html" rows="4" placeholder="<h3>…</h3><p>…</p>" dir="ltr"></textarea></label></form>`,
    [{ label: t('cancel'), act: 'closeModal' }, { label: t('adm.addAct'), cls: 'btn-gold', form: 'actForm' }], true);
}
function launchModal(cid) {
  const c = course(cid);
  modal(t('adm.launch') + ': ' + esc(tx(c.title)), `<form id="launchForm" class="form" data-id="${cid}"><p class="muted">${t('launch.help')}</p>
    <fieldset class="field"><legend>${t('launch.audience')}</legend>
      <label class="radio"><input type="radio" name="aud" value="all" checked> ${t('launch.all')}</label>
      <label class="radio"><input type="radio" name="aud" value="branch"> ${t('launch.branch')} <select name="branch">${window.BRANCHES.map((b, i) => `<option value="${i}">${esc(tx(b))}</option>`).join('')}</select></label>
      <label class="radio"><input type="radio" name="aud" value="managers"> ${t('launch.managers')}</label></fieldset>
    <label class="field"><span>${t('due')}</span><input type="date" name="due" value="${new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10)}"></label>
    <label class="switch"><input type="checkbox" name="notify" checked><span>${t('assign.notify')}</span></label></form>`,
    [{ label: t('cancel'), act: 'closeModal' }, { label: t('adm.launch'), cls: 'btn-gold', form: 'launchForm' }]);
}

/* ---------- admin: users ---------- */
function vAdminUsers(q) {
  if (!can('admin')) return vNotFound();
  const term = (q.get('q') || '').toLowerCase(), role = q.get('role') || '', st = q.get('st') || '';
  let list = DB.users.filter(u => (!term || (u.name.en + ' ' + u.name.ar + ' ' + u.email + ' ' + u.username).toLowerCase().includes(term)) && (!role || u.role === role) && (!st || u.status === st));
  return shell('admin', pageHead(t('adm.title'), '', `<button class="btn btn-gold btn-sm" data-act="userModal" data-id="">${icon('plus', 16)} ${t('usr.add')}</button><button class="btn btn-ghost btn-sm" data-act="uploadModal">${icon('upload', 16)} ${t('usr.upload')}</button><button class="btn btn-ghost btn-sm" data-act="exportUsers">${icon('download', 16)} ${t('exportCsv')}</button>`, ['browseusers', 'adduser', 'uploadusers', 'roles', 'loginas']) + adminTabs('#/admin/users') + demoNote() + `
    <form class="filters" id="userFilter" role="search"><label class="search">${icon('search', 18)}<input name="q" value="${esc(q.get('q') || '')}" placeholder="${esc(t('usr.search'))}" aria-label="${esc(t('usr.search'))}"></label>
      <select name="role" aria-label="${esc(t('f.role'))}"><option value="">${t('usr.allRoles')}</option>${['learner', 'manager', 'admin'].map(r => `<option value="${r}" ${role === r ? 'selected' : ''}>${t('role.' + r)}</option>`).join('')}</select>
      <select name="st" aria-label="${esc(t('status'))}"><option value="">${t('usr.allStatus')}</option>${['active', 'suspended'].map(r => `<option value="${r}" ${st === r ? 'selected' : ''}>${t('us.' + r)}</option>`).join('')}</select><button class="btn btn-navy btn-sm">${t('filter')}</button></form>
    <div class="bulk row" id="bulk" hidden><span id="bulkN"></span><button class="btn btn-ghost btn-sm" data-act="bulk" data-op="suspend">${icon('ban', 16)} ${t('usr.suspend')}</button><button class="btn btn-ghost btn-sm" data-act="bulk" data-op="activate">${icon('check', 16)} ${t('usr.activate')}</button><button class="btn btn-ghost btn-sm" data-act="bulk" data-op="assign">${icon('plus', 16)} ${t('team.assign')}</button><button class="btn btn-danger btn-sm" data-act="bulk" data-op="delete">${icon('trash', 16)} ${t('delete')}</button></div>
    <section class="card block"><p class="muted small">${t('usr.count', { n: list.length, m: DB.users.length })}</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th><input type="checkbox" data-act="selAll" aria-label="${esc(t('selectAll'))}"></th><th>${t('f.name')}</th><th>${t('f.username')}</th><th>${t('f.role')}</th><th>${t('f.branch')}</th><th>${t('f.manager')}</th><th>${t('status')}</th><th>${t('team.last')}</th><th><span class="sr">${t('actions')}</span></th></tr></thead><tbody>
    ${list.map(u => `<tr class="${u.status === 'suspended' ? 'dim' : ''}"><td><input type="checkbox" class="sel" value="${u.id}" aria-label="${esc(tx(u.name))}"></td><td><span class="usr"><span class="avatar sm">${esc(initials(u))}</span><span>${esc(tx(u.name))}<br><small class="muted">${esc(u.email)}</small></span></span></td><td dir="ltr">${esc(u.username)}</td>
      <td><span class="chip ${u.role === 'admin' ? 'gold' : u.role === 'manager' ? 'info' : 'na'}">${t('role.' + u.role)}</span></td><td>${esc(tx(window.BRANCHES[u.branch]))}</td><td>${u.managerId && user(u.managerId) ? esc(tx(user(u.managerId).name)) : '—'}</td>
      <td><span class="chip ${u.status === 'active' ? 'ok' : 'bad'}">${t('us.' + u.status)}</span></td><td>${fmtDate(u.lastAccess)}</td>
      <td class="nowrap"><button class="icon-btn" data-act="userModal" data-id="${u.id}" title="${esc(t('edit'))}" aria-label="${esc(t('edit') + ' ' + tx(u.name))}">${icon('edit', 18)}</button>
        <button class="icon-btn" data-act="toggleUser" data-id="${u.id}" title="${esc(u.status === 'active' ? t('usr.suspend') : t('usr.activate'))}" aria-label="${esc(u.status === 'active' ? t('usr.suspend') : t('usr.activate'))}" ${u.id === S.uid ? 'disabled' : ''}>${icon(u.status === 'active' ? 'ban' : 'check', 18)}</button>
        <button class="icon-btn" data-act="resetPw" data-id="${u.id}" title="${esc(t('usr.resetPw'))}" aria-label="${esc(t('usr.resetPw'))}">${icon('key', 18)}</button>
        <button class="icon-btn" data-act="loginAs" data-id="${u.id}" title="${esc(t('usr.loginAs'))}" aria-label="${esc(t('usr.loginAs') + ' ' + tx(u.name))}" ${u.id === S.uid || u.status !== 'active' ? 'disabled' : ''}>${icon('login', 18)}</button>
        <button class="icon-btn danger" data-act="delUserAsk" data-id="${u.id}" title="${esc(t('delete'))}" aria-label="${esc(t('delete') + ' ' + tx(u.name))}" ${u.id === S.uid ? 'disabled' : ''}>${icon('trash', 18)}</button></td></tr>`).join('')}</tbody></table></div></section>`);
}
function userModal(id) {
  const u = id ? user(id) : null, mgrs = DB.users.filter(x => x.role === 'manager' && x.id !== id);
  modal(u ? t('usr.edit') : t('usr.add'), `<form id="userForm" class="form two" data-id="${id || ''}">
    <label class="field"><span>${t('f.nameEn')}</span><input name="nameEn" value="${esc(u ? u.name.en : '')}" required></label><label class="field"><span>${t('f.nameAr')}</span><input name="nameAr" dir="rtl" value="${esc(u ? u.name.ar : '')}"></label>
    <label class="field"><span>${t('f.username')}</span><input name="username" dir="ltr" value="${esc(u ? u.username : '')}" required></label><label class="field"><span>${t('f.email')}</span><input name="email" type="email" dir="ltr" value="${esc(u ? u.email : '')}" required></label>
    <label class="field"><span>${t('f.phone')}</span><input name="phone" dir="ltr" value="${esc(u ? u.phone : '')}"></label><label class="field"><span>${t('f.jobTitle')}</span><input name="title" value="${esc(u ? tx(u.title) : '')}"></label>
    <label class="field"><span>${t('f.role')}</span><select name="role">${['learner', 'manager', 'admin'].map(r => `<option value="${r}" ${(u ? u.role : 'learner') === r ? 'selected' : ''}>${t('role.' + r)}</option>`).join('')}</select></label>
    <label class="field"><span>${t('f.branch')}</span><select name="branch">${window.BRANCHES.map((b, i) => `<option value="${i}" ${u && u.branch === i ? 'selected' : ''}>${esc(tx(b))}</option>`).join('')}</select></label>
    <label class="field"><span>${t('f.manager')}</span><select name="managerId"><option value="">—</option>${mgrs.map(m => `<option value="${m.id}" ${u && u.managerId === m.id ? 'selected' : ''}>${esc(tx(m.name))}</option>`).join('')}</select></label>
    <label class="field"><span>${t('status')}</span><select name="status">${['active', 'suspended'].map(s => `<option value="${s}" ${(u ? u.status : 'active') === s ? 'selected' : ''}>${t('us.' + s)}</option>`).join('')}</select></label>
    ${u ? '' : `<label class="switch span2"><input type="checkbox" name="welcome" checked><span>${t('usr.welcome')}</span></label>`}
    <p class="notice bad span2" id="userErr" hidden></p></form>`, [{ label: t('cancel'), act: 'closeModal' }, { label: u ? t('save') : t('usr.add'), cls: 'btn-gold', form: 'userForm' }], true);
}
function uploadModal() {
  modal(t('usr.upload'), `<p>${t('up.help')}</p><pre class="code" dir="ltr">username,firstname,lastname,email,role,branch,manager
sara.ahmed,Sara,Ahmed,sara.ahmed@example.com,learner,0,khalid.al.subaie</pre>
    <div class="row"><button class="btn btn-ghost btn-sm" data-act="csvTemplate">${icon('download', 16)} ${t('up.template')}</button></div>
    <label class="field"><span>${t('up.file')}</span><input type="file" id="csvFile" accept=".csv,text/csv"></label><div id="csvPreview"></div>`,
    [{ label: t('cancel'), act: 'closeModal' }, { label: t('up.import'), cls: 'btn-gold', act: 'csvImport' }], true);
}

/* ---------- admin: reports ---------- */
function vReports(tab, q) {
  if (!can('admin')) return vNotFound();
  tab = tab || 'overview';
  const T = [['overview', t('rep.overview')], ['completion', t('rep.completion')], ['satisfaction', t('rep.satisfaction')], ['activity', t('rep.activity')], ['logs', t('rep.logs')], ['xapi', t('rep.xapi')]];
  const learners = DB.users.filter(u => u.role !== 'admin');
  let body = '';
  if (tab === 'overview') {
    const es = DB.enrolments.filter(e => course(e.courseId) && course(e.courseId).status !== 'draft');
    const done = es.filter(e => courseDoneAt(e.userId, e.courseId)).length, od = es.filter(e => status(e.userId, course(e.courseId)) === 'overdue').length;
    const fb = DB.feedback, avg = fb.length ? (fb.reduce((s, f) => s + f.rating, 0) / fb.length).toFixed(1) : '—';
    const active = DB.users.filter(u => daysFrom(u.lastAccess) >= -7).length;
    const byCourse = DB.courses.filter(c => c.status !== 'draft').map(c => { const e = es.filter(x => x.courseId === c.id); return [tx(c.title), e.length ? Math.round(100 * e.filter(x => courseDoneAt(x.userId, c.id)).length / e.length) : 0]; });
    const byBranch = window.BRANCHES.map((b, i) => { const us = learners.filter(u => u.branch === i); const e = es.filter(x => us.some(u => u.id === x.userId)); return [tx(b), e.length ? Math.round(100 * e.filter(x => courseDoneAt(x.userId, x.courseId)).length / e.length) : 0]; });
    body = `<div class="stats six"><div class="card stat">${icon('users', 22)}<div><b>${DB.users.length}</b><span>${t('rep.users')}</span></div></div><div class="card stat">${icon('login', 22)}<div><b>${active}</b><span>${t('rep.active7')}</span></div></div>
      <div class="card stat">${icon('courses', 22)}<div><b>${es.length}</b><span>${t('rep.enrolments')}</span></div></div><div class="card stat">${icon('check', 22)}<div><b>${es.length ? Math.round(100 * done / es.length) : 0}%</b><span>${t('rep.complRate')}</span></div></div>
      <div class="card stat">${icon('clock', 22)}<div><b>${od}</b><span>${t('rep.overdue')}</span></div></div><div class="card stat">${icon('star', 22)}<div><b>${avg}</b><span>${t('rep.sat')}</span></div></div></div>
      <div class="grid g2"><section class="card block"><h2>${t('rep.byCourse')}</h2>${hbars(byCourse)}</section><section class="card block"><h2>${t('rep.byBranch')}</h2>${hbars(byBranch)}</section></div>`;
  }
  if (tab === 'completion') {
    const cid = q.get('c') || 'c1', c = course(cid) || DB.courses[0], es = DB.enrolments.filter(e => e.courseId === c.id);
    body = `<div class="filters"><label class="field inline-f"><span>${t('course')}</span><select data-act-change="repCourse">${DB.courses.map(x => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${esc(tx(x.title))}</option>`).join('')}</select></label><button class="btn btn-ghost btn-sm" data-act="exportCompl" data-id="${c.id}">${icon('download', 16)} ${t('exportCsv')}</button></div>
      <section class="card block"><h2>${t('rep.courseCompl')}</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('f.name')}</th><th>${t('f.branch')}</th><th>${t('status')}</th><th>${t('team.progress')}</th><th>${t('due')}</th><th>${t('completedOn')}</th><th>${t('team.hours')}</th></tr></thead><tbody>
      ${es.map(e => { const u = user(e.userId); if (!u) return ''; return `<tr><td>${esc(tx(u.name))}</td><td>${esc(tx(window.BRANCHES[u.branch]))}</td><td>${statusChip(u.id, c)}</td><td><div class="row nowrap" style="min-width:120px">${bar(coursePct(u.id, c))}<small>${coursePct(u.id, c)}%</small></div></td><td>${e.due ? fmtDate(e.due) : '—'}</td><td>${fmtDate(courseDoneAt(u.id, c.id))}</td><td>${fmtH(acts(c).reduce((s, a) => s + ((prog(u.id, a.id) || {}).timeSec || 0), 0))}</td></tr>`; }).join('') || `<tr><td colspan="7">${t('none')}</td></tr>`}</tbody></table></div></section>`;
  }
  if (tab === 'activity') {
    const cid = q.get('c') || 'c1', c = course(cid) || DB.courses[0], es = DB.enrolments.filter(e => e.courseId === c.id), L = acts(c);
    body = `<div class="filters"><label class="field inline-f"><span>${t('course')}</span><select data-act-change="repCourseA">${DB.courses.map(x => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${esc(tx(x.title))}</option>`).join('')}</select></label></div>
      <section class="card block"><h2>${t('rep.actCompl')}</h2><div class="tbl-wrap"><table class="tbl mx"><thead><tr><th>${t('f.name')}</th>${L.map(a => `<th title="${esc(tx(a.title))}"><span class="act-ic sm t-${a.type}">${icon(a.type, 14)}</span><span class="sr">${esc(tx(a.title))}</span></th>`).join('')}<th>%</th></tr></thead><tbody>
      ${es.map(e => { const u = user(e.userId); if (!u) return ''; return `<tr><td class="nowrap">${esc(tx(u.name))}</td>${L.map(a => `<td>${isDone(u.id, a) ? `<span class="y" title="${fmtDate(prog(u.id, a.id).done)}">✓</span>` : '<span class="n">○</span>'}</td>`).join('')}<td><b>${coursePct(u.id, c)}%</b></td></tr>`; }).join('')}</tbody></table></div>
      <p class="muted small">${L.map((a, i) => `${i + 1}. ${esc(tx(a.title))} (${t('type.' + a.type)})`).join(' · ')}</p></section>`;
  }
  if (tab === 'satisfaction') {
    const fb = DB.feedback, dist = [1, 2, 3, 4, 5].map(v => fb.filter(f => f.rating === v).length), mx = Math.max(1, ...dist);
    const per = DB.courses.map(c => { const f = fb.filter(x => x.courseId === c.id); return { c, n: f.length, r: f.length ? (f.reduce((s, x) => s + x.rating, 0) / f.length).toFixed(1) : '—', rel: f.length ? (f.reduce((s, x) => s + x.relevance, 0) / f.length).toFixed(1) : '—', conf: f.length ? (f.reduce((s, x) => s + x.confidence, 0) / f.length).toFixed(1) : '—' }; }).filter(x => x.n);
    body = `<div class="grid g2"><section class="card block"><h2>${t('rep.dist', { n: fb.length })}</h2>${dist.map((n, i) => `<div class="hbar"><span>${'★'.repeat(i + 1)}</span><div class="track"><i style="width:${Math.round(100 * n / mx)}%"></i></div><b>${n}</b></div>`).reverse().join('')}</section>
      <section class="card block"><h2>${t('rep.comments')}</h2><ul class="comments">${fb.filter(f => tx(f.comment)).slice(0, 8).map(f => `<li>“${esc(tx(f.comment))}”<small class="muted"> · ${esc(tx((course(f.courseId) || {}).title))}</small></li>`).join('') || `<li class="muted">${t('none')}</li>`}</ul></section></div>
      <section class="card block"><div class="block-h"><h2>${t('rep.perCourse')}</h2><button class="btn btn-ghost btn-sm" data-act="exportSat">${icon('download', 16)} ${t('exportCsv')}</button></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('course')}</th><th>${t('rep.responses')}</th><th>${t('fb.q1s')}</th><th>${t('fb.q2s')}</th><th>${t('fb.q3s')}</th></tr></thead><tbody>
      ${per.map(x => `<tr><td>${esc(tx(x.c.title))}</td><td>${x.n}</td><td>${x.r} / 5</td><td>${x.rel} / 5</td><td>${x.conf} / 5</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  if (tab === 'logs') {
    const fu = q.get('u') || '', fe = q.get('e') || '', events = [...new Set(DB.logs.map(l => l.event))].sort();
    const L = DB.logs.filter(l => (!fu || l.userId === fu) && (!fe || l.event === fe)).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 200);
    body = `<form class="filters" id="logFilter"><select name="u" aria-label="${esc(t('f.name'))}"><option value="">${t('rep.allUsers')}</option>${DB.users.map(u => `<option value="${u.id}" ${fu === u.id ? 'selected' : ''}>${esc(tx(u.name))}</option>`).join('')}</select>
      <select name="e" aria-label="${esc(t('rep.event'))}"><option value="">${t('rep.allEvents')}</option>${events.map(e => `<option ${fe === e ? 'selected' : ''}>${e}</option>`).join('')}</select><button class="btn btn-navy btn-sm">${t('filter')}</button><button type="button" class="btn btn-ghost btn-sm" data-act="exportLogs">${icon('download', 16)} ${t('exportCsv')}</button></form>
      <section class="card block"><p class="muted small">${t('rep.logsNote', { n: L.length })}</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('time')}</th><th>${t('f.name')}</th><th>${t('rep.event')}</th><th>${t('course')}</th><th>${t('rep.detail')}</th></tr></thead><tbody>
      ${L.map(l => `<tr><td class="nowrap">${fmtDT(l.at)}</td><td>${esc(tx((user(l.userId) || { name: { en: '—' } }).name))}</td><td dir="ltr"><code>${l.event}</code></td><td>${esc(tx((course(l.courseId) || {}).title))}</td><td>${esc(l.detail)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  if (tab === 'xapi') {
    body = `<div class="notice info">${icon('xapi', 18)}<span>${t('rep.xapiNote')}</span></div><section class="card block"><div class="block-h"><h2>${t('rep.xapi')} (${DB.xapi.length})</h2><button class="btn btn-ghost btn-sm" data-act="exportXapi">${icon('download', 16)} JSON</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('time')}</th><th>${t('rep.actor')}</th><th>${t('rep.verb')}</th><th>${t('rep.object')}</th><th>${t('result')}</th></tr></thead><tbody>
      ${DB.xapi.slice(0, 100).map(s => `<tr><td class="nowrap">${fmtDT(s.timestamp)}</td><td dir="ltr">${esc(s.actor.account.name)}</td><td dir="ltr"><code>${esc(s.verb.display['en-US'])}</code></td><td dir="ltr">${esc(s.object.definition.name['en-US'])}</td><td dir="ltr">${s.result ? esc(JSON.stringify(s.result)) : '—'}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  return shell('admin', pageHead(t('adm.title'), '', '', ['customreports', 'coursecompletionreport', 'activitycompletionreport', 'logs', 'feedback']) + adminTabs('#/admin/reports') + demoNote() + tabs(T.map(([k, l]) => ['#/admin/reports/' + k, l]), '#/admin/reports/' + tab) + body);
}
function hbars(rows) { return rows.map(([l, v]) => `<div class="hbar"><span title="${esc(l)}">${esc(l)}</span><div class="track" role="img" aria-label="${esc(l)} ${v}%"><i class="${v < 50 ? 'low' : v < 70 ? 'mid' : ''}" style="width:${v}%"></i></div><b>${v}%</b></div>`).join(''); }
