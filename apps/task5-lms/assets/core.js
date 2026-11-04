/* Sales Academy LMS prototype · core (state, i18n, helpers, shell)
   Author: Muhammed Zaghloul · Plain HTML/CSS/JS. Data is stored in this browser only. */
'use strict';
const KEY = 'salesacademy_lms_v3', SKEY = 'salesacademy_session_v3';
let MEM = {};
function lsGet(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return MEM[k] || null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { MEM[k] = JSON.parse(JSON.stringify(v)); } }
let DB = lsGet(KEY);
if (!DB || DB.version !== 4) { DB = window.SEED(); lsSet(KEY, DB); }
const urlLang = new URLSearchParams(location.search).get('lang');
let S = lsGet(SKEY) || { uid: null, lang: 'en', theme: 'light' };
if (urlLang === 'ar' || urlLang === 'en') S.lang = urlLang;
function save() { lsSet(KEY, DB); }
function saveS() { lsSet(SKEY, S); }

/* ---------- i18n ---------- */
const MISSING = new Set();
function t(k, v) {
  const d = window.I18N[S.lang] || {}, e = window.I18N.en;
  let s = d[k] != null ? d[k] : (e[k] != null ? e[k] : (MISSING.add(k), k));
  if (v) Object.keys(v).forEach(x => { s = s.split('{' + x + '}').join(v[x]); });
  return s;
}
const tx = o => o == null ? '' : (typeof o === 'string' ? o : (o[S.lang] || o.en || ''));
const isAr = () => S.lang === 'ar';
const locale = () => isAr() ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB';
const fmtDate = d => d ? new Date(d).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtDT = d => d ? new Date(d).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
const daysFrom = d => Math.ceil((new Date(d) - Date.now()) / 864e5);
const fmtH = sec => { const h = sec / 3600; return h >= 10 ? Math.round(h) + '' : (Math.round(h * 10) / 10) + ''; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = p => (p || 'id') + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
const bdi = s => `<bdi>${s}</bdi>`;

/* ---------- icons ---------- */
const IC = {
  video: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
  scorm: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
  html: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
  audio: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  xapi: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="m6 7 4 3M18 7l-4 3M6 17l4-3M18 17l-4-3"/>',
  quiz: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 2 2 4-4M8 16h8"/>',
  feedback: '<path d="M4 4h16v12H8l-4 4z"/><path d="m12 7 1 2 2 .3-1.5 1.4.4 2.1L12 11.8 10.1 12.8l.4-2.1L9 9.3l2-.3z"/>',
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  team: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5 5"/>',
  admin: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  reports: '<path d="M3 3v18h18"/><path d="M7 15v3M11 10v8M15 13v5M19 6v12"/>',
  courses: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 8h8M8 12h6"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-2 8 5.5-3 5.5 3-2-8"/>',
  play: '<path d="M6 4v16l14-8z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 12a12 12 0 0 1 11-9 12 12 0 0 1-9 11l-2 1-3-3z"/><circle cx="15" cy="9" r="1.5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m11 12 9-9M17 6l3 3"/>',
  book: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  up: '<path d="m18 15-6-6-6 6"/>', down: '<path d="m6 9 6 6 6-6"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>', star: '<path d="m12 2 3 7 7 .6-5.4 4.7L18 22l-6-3.7L6 22l1.4-7.7L2 9.6 9 9z"/>',
  fire: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z"/>'
};
const icon = (k, s) => `<svg class="ic" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || IC.book}</svg>`;
const TYPES = ['video', 'scorm', 'html', 'audio', 'image', 'xapi', 'quiz', 'feedback'];

/* ---------- Moodle references ---------- */
const MD = 'https://docs.moodle.org/en/';
const REF = {
  dashboard: ['Dashboard', MD + 'Dashboard'], timeline: ['Timeline block', MD + 'Timeline_block'], overview: ['Course overview block', MD + 'Course_overview'],
  completion: ['Activity completion', MD + 'Activity_completion'], coursecompletion: ['Course completion', MD + 'Course_completion'], badges: ['Badges', MD + 'Badges'],
  catalog: ['Course categories & self enrolment', MD + 'Self_enrolment'], scorm: ['SCORM activity', MD + 'SCORM_activity'], page: ['Page resource', MD + 'Page_resource'],
  file: ['File resource (video, audio, image)', MD + 'File_resource'], h5p: ['H5P & xAPI', MD + 'H5P'], xapi: ['xAPI (developer docs)', 'https://moodledev.io/docs/apis/subsystems/xapi'],
  quiz: ['Quiz activity', MD + 'Quiz_activity'], feedback: ['Feedback activity', MD + 'Feedback_activity'], certificate: ['Course certificates', MD + 'Course_certificates'],
  profile: ['User profiles & preferences', MD + 'User_profiles'], privacy: ['Data requests (privacy)', MD + 'Data_requests'], learningplans: ['Learning plans', MD + 'Learning_plans'],
  mentees: ['Mentees block (parent/mentor role)', MD + 'Mentees_block'], addcourse: ['Adding a new course', MD + 'Adding_a_new_course'], visibility: ['Course visibility', MD + 'Course_visibility'],
  enrol: ['Manual enrolment', MD + 'Manual_enrolment'], browseusers: ['Browse list of users', MD + 'Browse_list_of_users'], adduser: ['Add a new user', MD + 'Add_a_new_user'],
  uploadusers: ['Upload users', MD + 'Upload_users'], roles: ['Roles', MD + 'Roles'], loginas: ['Log in as', MD + 'Log_in_as'], customreports: ['Custom reports', MD + 'Custom_reports'],
  logs: ['Logs', MD + 'Logs'], activitycompletionreport: ['Activity completion report', MD + 'Activity_completion_report'], coursecompletionreport: ['Course completion report', MD + 'Course_completion_report'],
  language: ['Language packs (RTL)', MD + 'Language_packs'], moodlecloud: ['Moodle Cloud', 'https://moodle.com/cloud/'], notifications: ['Notifications', MD + 'Notifications'], accessibility: ['Accessibility', MD + 'Accessibility']
};
const ref = k => REF[k] ? `<a class="ref" href="${REF[k][1]}" target="_blank" rel="noopener" title="${esc(t('ref.tip'))}">${icon('link', 14)}<span>Moodle: ${esc(REF[k][0])}</span></a>` : '';

/* ---------- data helpers ---------- */
const user = id => DB.users.find(u => u.id === id);
const me = () => user(S.uid);
const course = id => DB.courses.find(c => c.id === id);
const acts = c => c.sections.flatMap(s => s.acts.map(a => Object.assign({ sec: s }, a)));
const actOf = (c, aid) => acts(c).find(a => a.id === aid);
const enr = (u, c) => DB.enrolments.find(e => e.userId === u && e.courseId === c);
const myEnrols = u => DB.enrolments.filter(e => e.userId === u && course(e.courseId) && course(e.courseId).status !== 'draft');
const prog = (u, a) => ((DB.progress[u] || {})[a]) || null;
const isDone = (u, a) => { const p = prog(u, a.id || a); return !!(p && p.done); };
const coursePct = (u, c) => { const l = acts(c); return l.length ? Math.round(100 * l.filter(a => isDone(u, a)).length / l.length) : 0; };
const courseDoneAt = (u, c) => (DB.courseDone[u] || {})[c];
function status(u, c) {
  const e = enr(u, c.id), done = courseDoneAt(u, c.id), pct = coursePct(u, c);
  if (done) return 'completed';
  if (e && e.due && daysFrom(e.due) < 0) return 'overdue';
  if (e && e.due && daysFrom(e.due) <= 7) return 'dueSoon';
  return pct > 0 ? 'inProgress' : 'notStarted';
}
const ST_CLS = { completed: 'ok', overdue: 'bad', dueSoon: 'warn', inProgress: 'info', notStarted: 'na' };
function statusChip(u, c) {
  const s = status(u, c), e = enr(u, c.id);
  let txt = t('st.' + s);
  if (s === 'overdue') txt = t('st.overdueBy', { n: Math.abs(daysFrom(e.due)) });
  if (s === 'dueSoon') txt = t('st.dueIn', { n: Math.max(0, daysFrom(e.due)) });
  return `<span class="chip ${ST_CLS[s]}">${txt}</span>`;
}
function secs(u, since) { let s = 0; Object.values(DB.progress[u] || {}).forEach(p => { if ((p.done || p.last) && (!since || new Date(p.done || p.last) >= since)) s += p.timeSec || 0; }); return s; }
function weekly(u, n) {
  const out = []; const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - start.getDay());
  for (let i = n - 1; i >= 0; i--) { const a = new Date(start - i * 7 * 864e5), b = new Date(+a + 7 * 864e5); let s = 0; Object.values(DB.progress[u] || {}).forEach(p => { const d = new Date(p.done || p.last || 0); if (d >= a && d < b) s += p.timeSec || 0; }); out.push({ a, s }); }
  return out;
}
const badgesOf = u => (DB.awarded[u] || []).map(x => Object.assign({}, DB.badges.find(b => b.id === x.badgeId), { at: x.at })).filter(b => b.id);
function logEv(u, event, cid, detail) { DB.logs.unshift({ at: new Date().toISOString(), userId: u, event, courseId: cid || null, detail: detail || '' }); if (DB.logs.length > 2000) DB.logs.length = 2000; save(); }
function notify(u, text, link) { DB.notifications.unshift({ id: uid('n'), userId: u, at: new Date().toISOString(), text, link: link || '', read: false }); save(); }
function markDone(u, c, a, extra) {
  DB.progress[u] = DB.progress[u] || {};
  const p = DB.progress[u][a.id] || {};
  if (!p.done) { p.done = new Date().toISOString(); p.timeSec = (p.timeSec || 0) + Math.round((a.min || 2) * 60); }
  Object.assign(p, extra || {});
  DB.progress[u][a.id] = p;
  logEv(u, 'course_module_completion_updated', c.id, tx(a.title));
  if (!courseDoneAt(u, c.id) && acts(c).every(x => isDone(u, x))) {
    DB.courseDone[u] = DB.courseDone[u] || {}; DB.courseDone[u][c.id] = new Date().toISOString();
    DB.awarded[u] = DB.awarded[u] || [];
    if (!DB.badges.find(b => b.courseId === c.id)) DB.badges.push({ id: 'b_' + c.id, courseId: c.id, name: c.title });
    DB.awarded[u].push({ badgeId: 'b_' + c.id, at: new Date().toISOString() });
    logEv(u, 'course_completed', c.id, ''); logEv(u, 'badge_awarded', c.id, '');
    notify(u, { en: `Course completed: “${c.title.en}”. Your badge and certificate are ready.`, ar: `اكتمل المقرر: «${c.title.ar}». الشارة والشهادة جاهزتان.` }, '#/certificate/' + c.id);
    setTimeout(() => toast(t('toast.courseDone')), 200);
  }
  save();
}
function touch(u, c, a) { DB.lastAcc[u] = { courseId: c.id, actId: a ? a.id : null, at: new Date().toISOString() }; const us = user(u); if (us) us.lastAccess = new Date().toISOString(); save(); }
const roleOf = () => (me() || {}).role;
const can = r => ({ learner: ['learner', 'manager', 'admin'], manager: ['manager', 'admin'], admin: ['admin'] }[r] || []).includes(roleOf());

/* ---------- UI helpers ---------- */
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2800);
}
function modal(title, body, actions, wide) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal-bg'; m.id = 'modal';
  m.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="modal-h"><h2 id="mt">${title}</h2><button class="icon-btn" data-act="closeModal" aria-label="${esc(t('close'))}">${icon('x')}</button></div><div class="modal-b">${body}</div>
    <div class="modal-f">${(actions || []).map(a => `<button class="btn ${a.cls || 'btn-ghost'}" ${a.act ? `data-act="${a.act}"` : ''} ${a.data ? Object.entries(a.data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ') : ''} ${a.form ? `type="submit" form="${a.form}"` : ''}>${a.label}</button>`).join('')}</div></div>`;
  document.body.appendChild(m);
  const f = m.querySelector('input,select,textarea,button:not(.icon-btn)'); if (f) f.focus();
}
function closeModal() { const m = document.getElementById('modal'); if (m) m.remove(); }
function confirmBox(text, act, data) { modal(t('confirm'), `<p>${text}</p>`, [{ label: t('cancel'), act: 'closeModal' }, { label: t('confirm.yes'), cls: 'btn-danger', act, data }]); }
function bar(p, label) { return `<div class="progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(label || t('progress'))}"><i style="width:${p}%"></i></div>`; }
function csv(rows, name) {
  const s = '﻿' + rows.map(r => r.map(v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([s], { type: 'text/csv;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast(t('toast.exported'));
}
function typeChip(tp) { return `<span class="tchip t-${tp}" title="${esc(t('type.' + tp))}">${icon(tp, 14)}<span>${t('type.' + tp)}</span></span>`; }
function initials(u) { const n = tx(u.name).trim().split(/\s+/); return (n[0] || '?')[0] + (n.length > 1 ? (n[n.length - 1].replace(/^(Al-|ال)/, '')[0] || '') : ''); }
function courseThumb(c, big) { return `<div class="thumb ${big ? 'big' : ''}" style="--c:${c.color || '#2B2E4A'}" aria-hidden="true"><div class="bottles"></div>${icon((acts(c)[0] || {}).type || 'book', big ? 40 : 30)}</div>`; }
function empty(msg) { return `<div class="empty">${icon('book', 28)}<p>${msg}</p></div>`; }

/* ---------- shell ---------- */
function navItems() {
  const r = roleOf(), n = [['dashboard', 'nav.dashboard', 'dashboard'], ['home', 'nav.home', 'home'], ['history', 'nav.history', 'history']];
  if (r === 'manager') n.push(['team', 'nav.team', 'team']);
  if (r === 'admin') n.push(['admin/courses', 'nav.admin', 'admin']);
  return n;
}
function shell(active, body) {
  const u = me(), unread = DB.notifications.filter(n => n.userId === u.id && !n.read);
  return `<a class="skip" href="#main">${t('skip')}</a>
  <div class="demo-bar"><div class="in"><span>${icon('eye', 14)} ${t('demo.bar')}</span><span class="row"><a href="wireframe.html">${t('nav.wireframe')}</a><a href="#/references">${t('nav.references')}</a><button data-act="reset">${t('demo.reset')}</button></span></div></div>
  <header class="topnav"><div class="in">
    <button class="icon-btn hamb" data-act="hamb" aria-label="${esc(t('menu'))}" aria-expanded="false" aria-controls="primary">${icon('menu')}</button>
    <a class="brand" href="#/dashboard"><span class="mark">${icon('book', 20)}</span><span>${t('brand')}<small>${t('brand.sub')}</small></span></a>
    <nav class="primary" id="primary" aria-label="${esc(t('nav.main'))}">${navItems().map(([h, k, ic]) => `<a href="#/${h}" ${active === h.split('/')[0] ? 'aria-current="page"' : ''}>${icon(ic, 18)}<span>${t(k)}</span></a>`).join('')}</nav>
    <div class="nav-end">
      <button class="icon-btn" data-act="lang" aria-label="${esc(t('lang.switch'))}" title="${esc(t('lang.switch'))}"><span class="lang-badge">${isAr() ? 'EN' : 'ع'}</span></button>
      <button class="icon-btn" data-act="theme" aria-label="${esc(t(S.theme === 'dark' ? 'theme.light' : 'theme.dark'))}" title="${esc(t(S.theme === 'dark' ? 'theme.light' : 'theme.dark'))}">${icon(S.theme === 'dark' ? 'sun' : 'moon')}</button>
      <div class="menu-wrap"><button class="icon-btn" data-dd="notif" aria-expanded="false" aria-label="${esc(t('notif') + (unread.length ? ' (' + unread.length + ')' : ''))}">${icon('bell')}${unread.length ? `<span class="dot">${unread.length}</span>` : ''}</button>
        <div class="dropdown" id="dd-notif"><div class="dd-h"><b>${t('notif')}</b>${unread.length ? `<button class="link" data-act="readAll">${t('notif.readAll')}</button>` : ''}</div>
        ${DB.notifications.filter(n => n.userId === u.id).slice(0, 6).map(n => `<a href="${n.link || '#/dashboard'}" data-act="readN" data-id="${n.id}" class="${n.read ? '' : 'unread'}">${esc(tx(n.text))}<small>${fmtDT(n.at)}</small></a>`).join('') || `<p class="muted pad">${t('notif.none')}</p>`}</div></div>
      <div class="menu-wrap"><button class="icon-btn" data-dd="user" aria-expanded="false" aria-label="${esc(t('menu.user'))}"><span class="avatar">${esc(initials(u))}</span></button>
        <div class="dropdown" id="dd-user"><div class="dd-h col"><b>${esc(tx(u.name))}</b><small class="muted">${t('role.' + u.role)} · ${esc(u.email)}</small></div>
          <a href="#/profile">${icon('user', 16)} ${t('nav.profile')}</a><a href="#/history">${icon('history', 16)} ${t('nav.history')}</a><a href="#/references">${icon('link', 16)} ${t('nav.references')}</a>
          ${S.realUid ? `<button data-act="backAs">${icon('login', 16)} ${t('loginas.back')}</button>` : ''}
          <button data-act="logout">${icon('logout', 16)} ${t('logout')}</button></div></div>
    </div></div></header>
  ${S.realUid ? `<div class="loginas">${icon('eye', 16)} ${t('loginas.banner', { name: esc(tx(u.name)) })} <button class="link" data-act="backAs">${t('loginas.back')}</button></div>` : ''}
  <main id="main" tabindex="-1">${body}</main>`;
}
function pageHead(title, sub, actions, refs) {
  return `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}${refs ? `<div class="refs">${refs.map(ref).join('')}</div>` : ''}</div>${actions ? `<div class="row">${actions}</div>` : ''}</div>`;
}
function tabs(items, cur) { return `<nav class="tabs" role="tablist">${items.map(([h, l]) => `<a href="${h}" role="tab" ${cur === h ? 'aria-selected="true" aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`; }
