/* Sales Academy LMS prototype · router & events */
'use strict';
const app = document.getElementById('app');
function applyLangTheme() {
  document.documentElement.lang = S.lang; document.documentElement.dir = isAr() ? 'rtl' : 'ltr';
  document.documentElement.dataset.theme = S.theme;
}
function route() {
  applyLangTheme();
  const h = location.hash.replace(/^#\/?/, ''), [path, qs] = h.split('?'), q = new URLSearchParams(qs || ''), p = path.split('/');
  if (!S.uid || !me()) { app.innerHTML = vLogin(); document.title = t('login.title') + ' · ' + t('brand'); return; }
  let html;
  switch (p[0]) {
    case '': case 'dashboard': html = vDashboard(); break;
    case 'home': html = vHome(q); break;
    case 'course': html = p[2] === 'a' ? vPlayer(p[1], p[3]) : vCourse(p[1]); break;
    case 'history': html = vHistory(q); break;
    case 'profile': html = vProfile(q); break;
    case 'certificate': html = vCert(p[1]); break;
    case 'references': html = vRefs(); break;
    case 'team': html = p[1] ? vMember(p[1]) : vTeam(); break;
    case 'admin':
      if (p[1] === 'users') html = vAdminUsers(q);
      else if (p[1] === 'reports') html = vReports(p[2], q);
      else if (p[1] === 'course') html = vCourseEdit(p[2]);
      else html = vAdminCourses();
      break;
    default: html = vNotFound();
  }
  app.innerHTML = html;
  const h1 = app.querySelector('h1'); document.title = (h1 ? h1.textContent.trim() + ' · ' : '') + t('brand');
  trackMedia(); scormPanel();
  if (!route.keep) { window.scrollTo(0, 0); const m = document.getElementById('main'); if (m) m.focus({ preventScroll: true }); }
  route.keep = false;
  if (MISSING.size) console.warn('i18n missing:', [...MISSING].join(', '));
}
function rerender() { route.keep = true; const y = scrollY; route(); scrollTo(0, y); }
window.addEventListener('hashchange', () => { closeModal(); route(); });

function login(id) { S.uid = id; delete S.realUid; const u = user(id); u.lastAccess = new Date().toISOString(); logEv(id, 'user_loggedin'); saveS(); save(); location.hash = '#/dashboard'; route(); }
const formObj = f => { const o = {}; new FormData(f).forEach((v, k) => { if (o[k] !== undefined) { o[k] = [].concat(o[k], v); } else o[k] = v; }); return o; };

/* ---------- submit ---------- */
document.addEventListener('submit', e => {
  const f = e.target, id = f.id; if (!id) return; e.preventDefault();
  const o = formObj(f), u = me();
  if (id === 'loginForm') { const x = DB.users.find(z => z.username === (o.username || '').trim().toLowerCase()); if (!x) return toast(t('login.err')); if (x.status !== 'active') return toast(t('login.suspended')); return login(x.id); }
  if (id === 'catForm') { location.hash = '#/home?' + new URLSearchParams(o).toString(); return; }
  if (id === 'userFilter') { location.hash = '#/admin/users?' + new URLSearchParams(o).toString(); return; }
  if (id === 'logFilter') { location.hash = '#/admin/reports/logs?' + new URLSearchParams(o).toString(); return; }
  if (id === 'profForm') { u.name = { en: o.nameEn.trim(), ar: (o.nameAr || o.nameEn).trim() }; u.email = o.email.trim(); u.phone = o.phone; u.bio = o.bio; logEv(u.id, 'user_profile_updated'); save(); toast(t('toast.saved')); return rerender(); }
  if (id === 'prefForm') { S.lang = o.lang; S.theme = o.theme; u.lang = o.lang; saveS(); save(); toast(t('toast.saved')); return route(); }
  if (id === 'notifForm') { DB.prefs[u.id] = {}; ['assign', 'due', 'overdue', 'complete', 'team', 'email', 'app'].forEach(k => DB.prefs[u.id][k] = !!o[k]); save(); return toast(t('toast.saved')); }
  if (id === 'pwForm') { const er = document.getElementById('pwErr'); if (o.n1 !== o.n2) { er.hidden = false; er.textContent = t('pw.mismatch'); return; } if (o.n1.length < 8) { er.hidden = false; er.textContent = t('pw.short'); return; } logEv(u.id, 'user_password_updated'); f.reset(); er.hidden = true; return toast(t('pw.ok')); }
  if (id === 'quizForm') return submitQuiz(f);
  if (id === 'fbForm') {
    if (!o.rating || !o.relevance || !o.confidence) { document.getElementById('fbErr').hidden = false; return; }
    const c = course(f.dataset.cid), a = actOf(c, f.dataset.aid);
    DB.feedback.push({ userId: u.id, courseId: c.id, rating: +o.rating, relevance: +o.relevance, confidence: +o.confidence, comment: o.comment ? { en: o.comment, ar: o.comment } : '', at: new Date().toISOString() });
    logEv(u.id, 'feedback_submitted', c.id, `${o.rating}/5`); markDone(u.id, c, a); return rerender();
  }
  if (id === 'assignForm') {
    const us = [].concat(o.u || []); if (!us.length) return toast(t('assign.none'));
    const c = course(o.cid), due = new Date(o.due + 'T23:59:00').toISOString();
    us.forEach(x => { const e = enr(x, c.id); if (e) { e.assigned = true; e.due = due; } else DB.enrolments.push({ userId: x, courseId: c.id, assigned: true, due, at: new Date().toISOString() });
      logEv(u.id, 'user_enrolment_created', c.id, tx(user(x).name)); if (o.notify) notify(x, { en: `You were assigned “${c.title.en}”. Due ${fmtDate(due)}.`, ar: `تم تعيين «${c.title.ar}» لك. الموعد ${fmtDate(due)}.` }, '#/course/' + c.id); });
    save(); closeModal(); toast(t('toast.assigned', { n: us.length })); return rerender();
  }
  if (id === 'courseForm') {
    const isNew = !f.dataset.id, c = isNew ? { id: uid('c'), sections: [{ id: uid('s'), title: { en: 'Section 1', ar: 'القسم 1' }, acts: [] }], created: new Date().toISOString() } : course(f.dataset.id);
    Object.assign(c, { title: { en: o['f.ctitle_en'], ar: o['f.ctitle_ar'] }, summary: { en: o.sum_en, ar: o.sum_ar }, cat: o.cat, hours: +o.hours || 1, status: o.status, color: o.color, selfEnrol: !!o.selfEnrol });
    if (isNew) { DB.courses.push(c); DB.badges.push({ id: 'b_' + c.id, courseId: c.id, name: c.title }); logEv(u.id, 'course_created', c.id); } else logEv(u.id, 'course_updated', c.id);
    save(); toast(t('toast.saved')); if (isNew) location.hash = '#/admin/course/' + c.id; else rerender(); return;
  }
  if (id === 'actForm') {
    const c = course(f.dataset.cid), s = c.sections[+f.dataset.si], file = f.querySelector('[name=file]').files[0];
    const a = { id: uid('a'), type: o.type, title: { en: o.t_en, ar: o.t_ar }, min: +o.min || 5, completion: { video: 'view90', audio: 'view90', image: 'view', html: 'view', scorm: 'scorm', xapi: 'xapi', quiz: 'pass', feedback: 'submit' }[o.type], data: {} };
    if (file) { a.file = file.name; if (['video', 'audio', 'image'].includes(o.type)) a.data.src = URL.createObjectURL(file); }
    if (o.url) a.data.src = o.url;
    if (o.type === 'html') a.html = o.html ? { en: o.html, ar: o.html } : { en: '<p>New page</p>', ar: '<p>صفحة جديدة</p>' };
    if (o.type === 'quiz') { a.pass = 80; a.questions = course('c1').sections[2].acts[1].questions.slice(0, 3); }
    if (o.type === 'image' && !a.data.src) a.data.src = null;
    s.acts.push(a); logEv(u.id, 'course_module_created', c.id, a.title.en); save(); closeModal(); toast(t('toast.actAdded')); return rerender();
  }
  if (id === 'launchForm') {
    const c = course(f.dataset.id), due = o.due ? new Date(o.due + 'T23:59:00').toISOString() : null;
    let aud = DB.users.filter(x => x.role !== 'admin' && x.status === 'active');
    if (o.aud === 'branch') aud = aud.filter(x => x.branch === +o.branch); if (o.aud === 'managers') aud = aud.filter(x => x.role === 'manager');
    c.status = 'published';
    aud.forEach(x => { const e = enr(x.id, c.id); if (e) { e.assigned = true; e.due = due; } else DB.enrolments.push({ userId: x.id, courseId: c.id, assigned: true, due, at: new Date().toISOString() }); if (o.notify) notify(x.id, { en: `New course: “${c.title.en}”.`, ar: `مقرر جديد: «${c.title.ar}».` }, '#/course/' + c.id); });
    logEv(u.id, 'course_launched', c.id, aud.length + ' users'); save(); closeModal(); toast(t('toast.launched', { n: aud.length })); return rerender();
  }
  if (id === 'userForm') {
    const er = document.getElementById('userErr'), isNew = !f.dataset.id, un = o.username.trim().toLowerCase();
    if (DB.users.some(x => x.username === un && x.id !== f.dataset.id)) { er.hidden = false; er.textContent = t('usr.dupe'); return; }
    if (!/^[a-z0-9._-]+$/.test(un)) { er.hidden = false; er.textContent = t('usr.badUser'); return; }
    const x = isNew ? { id: uid('u'), created: new Date().toISOString(), lastAccess: null, lang: 'en' } : user(f.dataset.id);
    Object.assign(x, { name: { en: o.nameEn.trim(), ar: (o.nameAr || o.nameEn).trim() }, username: un, email: o.email.trim(), phone: o.phone, title: { en: o.title, ar: o.title }, role: o.role, branch: +o.branch, managerId: o.managerId || null, status: o.status });
    if (isNew) { DB.users.push(x); logEv(u.id, 'user_created', null, un); if (o.welcome) notify(x.id, { en: 'Welcome to Sales Academy!', ar: 'مرحباً بك في أكاديمية المبيعات!' }, '#/dashboard'); } else logEv(u.id, 'user_updated', null, un);
    save(); closeModal(); toast(t('toast.saved')); return rerender();
  }
});

/* ---------- quiz ---------- */
function submitQuiz(f) {
  const u = me(), [, , cid, , aid] = location.hash.split('/'), c = course(cid), a = actOf(c, aid);
  let sc = 0;
  a.questions.forEach((q, i) => {
    const sel = [...f.querySelectorAll(`[name=q${i}]:checked`)].map(x => +x.value).sort();
    const ok = JSON.stringify(sel) === JSON.stringify([...q.correct].sort()); if (ok) sc++;
    f.querySelectorAll(`[name=q${i}]`).forEach(inp => { inp.disabled = true; const l = inp.closest('.opt'); if (q.correct.includes(+inp.value)) l.classList.add('correct'); else if (inp.checked) l.classList.add('wrong'); });
    document.getElementById('qfb' + i).innerHTML = `<div class="notice ${ok ? 'ok' : 'bad'}"><b>${ok ? t('q.right') : t('q.wrong')}</b> ${esc(tx(q.fb))}</div>`;
  });
  const pct = Math.round(100 * sc / a.questions.length), passed = pct >= (a.pass || 80);
  DB.progress[u.id] = DB.progress[u.id] || {}; const p = DB.progress[u.id][a.id] || {};
  p.attempts = (p.attempts || []).concat({ at: new Date().toISOString(), score: pct }); p.score = Math.max(p.score || 0, pct); p.last = new Date().toISOString();
  DB.progress[u.id][a.id] = p; logEv(u.id, 'quiz_attempt_submitted', c.id, pct + '%');
  if (passed && enr(u.id, c.id)) markDone(u.id, c, a, { passed: true }); else save();
  const btn = f.querySelector('[type=submit]'); btn.outerHTML = `<div class="notice ${passed ? 'ok' : 'bad'} big" role="status"><b>${t('score')}: ${pct}%</b> — ${passed ? t('passed') : t('failed')} (${t('quiz.pass')} ${a.pass || 80}%)</div><button type="button" class="btn btn-navy" data-act="rerender">${t('quiz.backInfo')}</button>`;
  if (passed) refreshState(a);
}

/* ---------- clicks ---------- */
const ACT = {
  closeModal: () => closeModal(), rerender: () => rerender(),
  lang: () => { S.lang = isAr() ? 'en' : 'ar'; saveS(); route.keep = true; route(); },
  theme: () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; saveS(); rerender(); },
  reset: () => confirmBox(t('demo.resetQ'), 'doReset'),
  doReset: () => { DB = window.SEED(); save(); const keep = S.uid; S.uid = user(keep) ? keep : null; delete S.realUid; saveS(); closeModal(); toast(t('toast.reset')); location.hash = '#/dashboard'; route(); },
  hamb: el => { const p = document.getElementById('primary'), o = p.classList.toggle('open'); el.setAttribute('aria-expanded', o); },
  loginAs0: el => login(el.dataset.id),
  logout: () => { S.uid = null; delete S.realUid; saveS(); location.hash = ''; route(); },
  readN: el => { const n = DB.notifications.find(x => x.id === el.dataset.id); if (n) { n.read = true; save(); } },
  readAll: () => { DB.notifications.forEach(n => { if (n.userId === S.uid) n.read = true; }); save(); rerender(); },
  selfEnrol: el => { const c = course(el.dataset.id); DB.enrolments.push({ userId: S.uid, courseId: c.id, assigned: false, due: null, at: new Date().toISOString() }); logEv(S.uid, 'user_enrolment_created', c.id, 'self'); save(); toast(t('toast.enrolled')); location.hash = '#/course/' + c.id; },
  print: () => window.print(),
  quizStart: () => { const [, , cid, , aid] = location.hash.split('/'); const a = actOf(course(cid), aid); document.getElementById('quizArea').innerHTML = quizForm(a); logEv(S.uid, 'quiz_attempt_started', cid); document.querySelector('#quizForm input').focus(); },
  xAns: el => { const st = XAPI_SC.steps[XS.step], o = st.o[+el.dataset.i]; stmt(XS.u, XS.a, 'answered', { success: o.ok, response: tx(o.t) }); if (o.ok) XS.correct++; XS.step++;
    if (XS.step >= XAPI_SC.steps.length) { const sc = XS.correct / XAPI_SC.steps.length; stmt(XS.u, XS.a, 'completed', { score: { scaled: +sc.toFixed(2) }, success: sc >= 0.67, completion: true });
      if (sc >= 0.67 && enr(XS.u.id, XS.c.id) && !isDone(XS.u.id, XS.a)) { markDone(XS.u.id, XS.c, XS.a, { score: Math.round(sc * 100) }); refreshState(XS.a); } }
    document.getElementById('xsc').innerHTML = `<div class="notice ${o.ok ? 'ok' : 'bad'}">${o.ok ? t('q.right') : t('q.wrong')}</div>` + xapiStep(); },
  xRestart: () => { XS.step = 0; XS.correct = 0; stmt(XS.u, XS.a, 'initialized'); document.getElementById('xsc').innerHTML = xapiStep(); },
  exportHistory: () => { const u = me(), rows = [[t('date'), t('course'), t('activity'), t('f.type'), t('time'), t('score')]]; Object.entries(DB.progress[u.id] || {}).forEach(([aid, p]) => { if (!p.done) return; const c = DB.courses.find(x => acts(x).some(y => y.id === aid)); if (!c) return; const a = actOf(c, aid); rows.push([p.done.slice(0, 10), tx(c.title), tx(a.title), t('type.' + a.type), Math.round((p.timeSec || 0) / 60), p.score == null ? '' : p.score]); }); csv(rows, 'learning-record.csv'); },
  exportMe: () => { const u = me(), data = { profile: u, enrolments: DB.enrolments.filter(e => e.userId === u.id), progress: DB.progress[u.id] || {}, completions: DB.courseDone[u.id] || {}, badges: DB.awarded[u.id] || [], feedback: DB.feedback.filter(f => f.userId === u.id), logs: DB.logs.filter(l => l.userId === u.id) };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); a.download = 'my-data.json'; document.body.appendChild(a); a.click(); a.remove(); logEv(u.id, 'data_export_requested'); toast(t('toast.exported')); },
  requestDelete: () => { logEv(S.uid, 'data_deletion_requested'); notify('u1', { en: `Data deletion request from ${me().name.en}.`, ar: `طلب حذف بيانات من ${me().name.ar}.` }, '#/admin/reports/logs'); toast(t('priv.sent')); },
  remind: el => { const x = user(el.dataset.uid), od = userSummary(x).assigned.filter(c => status(x.id, c) !== 'completed'); notify(x.id, { en: `Reminder from ${me().name.en}: please complete ${od.map(c => '“' + c.title.en + '”').join(', ') || 'your courses'}.`, ar: `تذكير من ${me().name.ar}: يرجى إكمال ${od.map(c => '«' + c.title.ar + '»').join('، ') || 'مقرراتك'}.` }, '#/dashboard'); logEv(S.uid, 'reminder_sent', null, x.username); toast(t('toast.reminded', { name: tx(x.name) })); },
  assignModal: el => assignModal(el.dataset.uid),
  exportTeam: () => { const team = roleOf() === 'admin' ? DB.users.filter(u => u.role === 'learner') : learnersOf(S.uid); csv([[t('f.name'), t('f.branch'), t('team.progress'), t('team.done'), t('team.overdueCol'), t('team.hours'), t('team.last')]].concat(team.map(u => { const x = userSummary(u); return [tx(u.name), tx(window.BRANCHES[u.branch]), x.pct + '%', x.done + '/' + x.assigned.length, x.overdue, fmtH(x.hours), (u.lastAccess || '').slice(0, 10)]; })), 'team-progress.csv'); },
  launchModal: el => launchModal(el.dataset.id),
  dupCourse: el => { const c = JSON.parse(JSON.stringify(course(el.dataset.id))); c.id = uid('c'); c.status = 'draft'; c.title = { en: c.title.en + ' (copy)', ar: c.title.ar + ' (نسخة)' }; c.sections.forEach(s => { s.id = uid('s'); s.acts.forEach(a => a.id = uid('a')); }); DB.courses.push(c); logEv(S.uid, 'course_created', c.id, 'duplicate'); save(); toast(t('toast.saved')); rerender(); },
  delCourseAsk: el => confirmBox(t('adm.delCourseQ', { name: esc(tx(course(el.dataset.id).title)) }), 'delCourse', { id: el.dataset.id }),
  delCourse: el => { const id = el.dataset.id; DB.courses = DB.courses.filter(c => c.id !== id); DB.enrolments = DB.enrolments.filter(e => e.courseId !== id); logEv(S.uid, 'course_deleted', null, id); save(); closeModal(); toast(t('toast.deleted')); location.hash = '#/admin/courses'; rerender(); },
  addSection: el => { const c = course(el.dataset.id), n = c.sections.length + 1; c.sections.push({ id: uid('s'), title: { en: 'Section ' + n, ar: 'القسم ' + n }, acts: [] }); save(); rerender(); },
  delSection: el => { const c = course(el.dataset.cid); c.sections.splice(+el.dataset.si, 1); save(); rerender(); },
  addActModal: el => addActModal(el.dataset.cid, el.dataset.si),
  moveAct: el => { const s = course(el.dataset.cid).sections[+el.dataset.si], i = +el.dataset.ai, j = i + +el.dataset.d; [s.acts[i], s.acts[j]] = [s.acts[j], s.acts[i]]; save(); rerender(); },
  delAct: el => { const s = course(el.dataset.cid).sections[+el.dataset.si]; s.acts.splice(+el.dataset.ai, 1); logEv(S.uid, 'course_module_deleted', el.dataset.cid); save(); rerender(); },
  userModal: el => userModal(el.dataset.id), uploadModal: () => uploadModal(),
  toggleUser: el => { const x = user(el.dataset.id); x.status = x.status === 'active' ? 'suspended' : 'active'; logEv(S.uid, x.status === 'active' ? 'user_activated' : 'user_suspended', null, x.username); save(); rerender(); },
  resetPw: el => { const x = user(el.dataset.id); logEv(S.uid, 'user_password_reset', null, x.username); notify(x.id, { en: 'Your password was reset. Check your email.', ar: 'تمت إعادة تعيين كلمة المرور. راجع بريدك.' }); toast(t('toast.pwReset', { email: x.email })); },
  loginAs: el => { S.realUid = S.uid; S.uid = el.dataset.id; logEv(S.realUid, 'user_loggedinas', null, user(el.dataset.id).username); saveS(); location.hash = '#/dashboard'; route(); },
  backAs: () => { S.uid = S.realUid; delete S.realUid; saveS(); location.hash = '#/admin/users'; route(); },
  delUserAsk: el => confirmBox(t('usr.delQ', { name: esc(tx(user(el.dataset.id).name)) }), 'delUser', { id: el.dataset.id }),
  delUser: el => { const id = el.dataset.id, x = user(id); DB.users = DB.users.filter(u => u.id !== id); DB.enrolments = DB.enrolments.filter(e => e.userId !== id); DB.users.forEach(u => { if (u.managerId === id) u.managerId = null; }); logEv(S.uid, 'user_deleted', null, x.username); save(); closeModal(); toast(t('toast.deleted')); rerender(); },
  selAll: el => { document.querySelectorAll('.sel').forEach(c => c.checked = el.checked); bulkBar(); },
  bulk: el => { const ids = [...document.querySelectorAll('.sel:checked')].map(c => c.value).filter(id => id !== S.uid), op = el.dataset.op; if (!ids.length) return;
    if (op === 'assign') { assignModal(''); setTimeout(() => document.querySelectorAll('#assignForm [name=u]').forEach(c => c.checked = ids.includes(c.value)), 0); return; }
    if (op === 'delete') return confirmBox(t('usr.bulkDelQ', { n: ids.length }), 'bulkDel', { ids: ids.join(',') });
    ids.forEach(id => { user(id).status = op === 'suspend' ? 'suspended' : 'active'; }); logEv(S.uid, 'users_bulk_' + op, null, ids.length + ''); save(); toast(t('toast.saved')); rerender(); },
  bulkDel: el => { const ids = el.dataset.ids.split(','); DB.users = DB.users.filter(u => !ids.includes(u.id)); DB.enrolments = DB.enrolments.filter(e => !ids.includes(e.userId)); logEv(S.uid, 'users_bulk_delete', null, ids.length + ''); save(); closeModal(); toast(t('toast.deleted')); rerender(); },
  csvTemplate: () => csv([['username', 'firstname', 'lastname', 'email', 'role', 'branch', 'manager'], ['sara.ahmed', 'Sara', 'Ahmed', 'sara.ahmed@example.com', 'learner', '0', 'khalid.al.subaie']], 'upload-users-template.csv'),
  csvImport: () => { const rows = window._csvRows || []; if (!rows.length) return toast(t('up.noFile')); let n = 0;
    rows.forEach(r => { if (!r.username || DB.users.some(x => x.username === r.username.toLowerCase())) return; const m = DB.users.find(x => x.username === (r.manager || '').toLowerCase());
      DB.users.push({ id: uid('u'), username: r.username.toLowerCase(), name: { en: (r.firstname + ' ' + r.lastname).trim(), ar: (r.firstname + ' ' + r.lastname).trim() }, email: r.email, phone: '', title: { en: 'Sales Consultant', ar: 'مستشار مبيعات' }, role: ['learner', 'manager', 'admin'].includes(r.role) ? r.role : 'learner', branch: +r.branch || 0, managerId: m ? m.id : null, status: 'active', lang: 'en', created: new Date().toISOString(), lastAccess: null }); n++; });
    logEv(S.uid, 'users_uploaded', null, n + ''); save(); closeModal(); window._csvRows = null; toast(t('toast.imported', { n })); rerender(); },
  exportUsers: () => csv([['username', 'name', 'email', 'role', 'branch', 'manager', 'status', 'lastaccess']].concat(DB.users.map(u => [u.username, u.name.en, u.email, u.role, tx(window.BRANCHES[u.branch]), u.managerId ? (user(u.managerId) || {}).username : '', u.status, (u.lastAccess || '').slice(0, 10)])), 'users.csv'),
  exportCompl: el => { const c = course(el.dataset.id); csv([[t('f.name'), t('status'), '%', t('due'), t('completedOn')]].concat(DB.enrolments.filter(e => e.courseId === c.id).map(e => { const u = user(e.userId); return u ? [tx(u.name), t('st.' + status(u.id, c)), coursePct(u.id, c), (e.due || '').slice(0, 10), (courseDoneAt(u.id, c.id) || '').slice(0, 10)] : null; }).filter(Boolean)), 'course-completion.csv'); },
  exportSat: () => csv([[t('course'), t('f.name'), t('fb.q1s'), t('fb.q2s'), t('fb.q3s'), t('rep.comments'), t('date')]].concat(DB.feedback.map(f => [tx((course(f.courseId) || {}).title), tx((user(f.userId) || { name: '' }).name), f.rating, f.relevance, f.confidence, tx(f.comment), (f.at || '').slice(0, 10)])), 'satisfaction.csv'),
  exportLogs: () => csv([['time', 'user', 'event', 'course', 'detail']].concat(DB.logs.map(l => [l.at, (user(l.userId) || {}).username || '', l.event, (course(l.courseId) || { title: { en: '' } }).title.en, l.detail])), 'logs.csv'),
  exportXapi: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(DB.xapi, null, 2)], { type: 'application/json' })); a.download = 'xapi-statements.json'; document.body.appendChild(a); a.click(); a.remove(); }
};
function bulkBar() { const n = document.querySelectorAll('.sel:checked').length, b = document.getElementById('bulk'); if (b) { b.hidden = !n; document.getElementById('bulkN').textContent = t('usr.selected', { n }); } }
document.addEventListener('click', e => {
  const dd = e.target.closest('[data-dd]');
  document.querySelectorAll('.dropdown.open').forEach(x => { if (!dd || x.id !== 'dd-' + dd.dataset.dd) { x.classList.remove('open'); const b = document.querySelector(`[data-dd="${x.id.slice(3)}"]`); if (b) b.setAttribute('aria-expanded', 'false'); } });
  if (dd) { const m = document.getElementById('dd-' + dd.dataset.dd), o = m.classList.toggle('open'); dd.setAttribute('aria-expanded', o); return; }
  if (e.target.classList.contains('modal-bg')) return closeModal();
  const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act]; if (fn) { if (el.tagName === 'BUTTON' && el.type !== 'submit') e.preventDefault(); fn(el, e); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.classList.contains('sel')) bulkBar();
  if (el.dataset.actChange === 'repCourse') location.hash = '#/admin/reports/completion?c=' + el.value;
  if (el.dataset.actChange === 'repCourseA') location.hash = '#/admin/reports/activity?c=' + el.value;
  if (el.dataset.actInput === 'secTitle') { const s = course(el.dataset.cid).sections[+el.dataset.si]; s.title = { en: isAr() ? s.title.en : el.value, ar: isAr() ? el.value : s.title.ar }; save(); toast(t('toast.saved')); }
  if (el.id === 'csvFile' && el.files[0]) {
    const r = new FileReader(); r.onload = () => {
      const lines = String(r.result).replace(/^﻿/, '').split(/\r?\n/).filter(Boolean), head = lines.shift().split(',').map(s => s.trim().toLowerCase());
      window._csvRows = lines.map(l => { const v = l.split(','); const o = {}; head.forEach((h, i) => o[h] = (v[i] || '').trim().replace(/^"|"$/g, '')); return o; });
      document.getElementById('csvPreview').innerHTML = `<p><b>${t('up.preview', { n: window._csvRows.length })}</b></p><div class="tbl-wrap"><table class="tbl"><thead><tr>${head.map(h => `<th dir="ltr">${esc(h)}</th>`).join('')}</tr></thead><tbody>${window._csvRows.slice(0, 5).map(o => `<tr>${head.map(h => `<td dir="ltr">${esc(o[h])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }; r.readAsText(el.files[0]);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); document.querySelectorAll('.dropdown.open').forEach(x => x.classList.remove('open')); } });
route();
