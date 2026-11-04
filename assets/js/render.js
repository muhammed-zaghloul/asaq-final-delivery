/* =====================================================================
   render.js · Builds every page from content/site-data.js and content/files.js
   Muhammed Zaghloul · ASAQ final delivery website

   Each page is a thin shell: <body data-page="landing|task|viewer|404" data-task="N">.
   You should not need to edit this file to change text or links:
   edit content/site-data.js (words) and content/files.js (Drive files).
   ===================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || {}, FILES = window.FILES || {};
  var META = SITE.meta || {};
  var TASKS = SITE.tasks || [];
  var MZ = window.MZ, D = window.MZDrive;
  var ic = MZ.icon;

  /* ---------- site links (relative, so the site works from a web server AND opened as local files) ---------- */
  // ROOT is the way from this page back to the site root, read from this script's own src
  // ("assets/js/render.js" on the home page -> "", "../assets/js/render.js" on a task page -> "../").
  var ROOT = (function () {
    var s = (document.currentScript && document.currentScript.getAttribute('src')) || '';
    return s.replace(/assets\/js\/render\.js(?:[?#].*)?$/, '');
  })();
  // link('task-2/#demo') -> ROOT + 'task-2/index.html#demo'. Accepts the older '/task-2/#demo' form too.
  // Folders get an explicit index.html, because a local file:// folder link would show a folder listing.
  function link(href) {
    href = String(href == null ? '' : href);
    if (!href || href.charAt(0) === '#' || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
    href = href.replace(/^\/+/, '');
    var m = href.match(/^([^?#]*)(.*)$/);
    var path = m[1], rest = m[2];
    if (path === '' || /\/$/.test(path)) path += 'index.html';
    return ROOT + path + rest;
  }
  function taskHref(n, hash) { return link('task-' + n + '/' + (hash || '')); }
  var HOME = ROOT + 'index.html';

  /* ---------- text helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var AR = '\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF';
  var AR_RUN = new RegExp('[' + AR + '](?:[' + AR + '\\s0-9\u060C\u061B\u061F.:!()\\-\u2013\u00B7\u2190+%/]*[' + AR + '\u061F!])?', 'g');
  // Wraps runs of Arabic in <span lang="ar" dir="rtl"> so they use Almarai and read right-to-left.
  function arabic(html) { return html.replace(AR_RUN, function (m) { return '<span lang="ar" dir="rtl">' + m + '</span>'; }); }
  // Escapes text, then applies **bold**, [label](task-2/#demo) and the Arabic wrapper.
  // Links are site pages or #anchors only (no "scheme:" links).
  function fmt(s) {
    var h = arabic(esc(s));
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\[([^\]]+)\]\(((?:\/|#|[\w-]+\/)[^)\s:]*)\)/g, function (all, label, href) { return '<a href="' + link(href) + '">' + label + '</a>'; });
    return h;
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function arBlock(s, tag) { return '<' + (tag || 'span') + ' lang="ar" dir="rtl">' + esc(s) + '</' + (tag || 'span') + '>'; }
  function fmtDate(iso) {
    if (!iso) return '';
    var p = String(iso).split('-'); if (p.length !== 3) return iso;
    var mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][(+p[1]) - 1] || p[1];
    return (+p[2]) + ' ' + mo + ' ' + p[0];
  }
  function task(n) { for (var i = 0; i < TASKS.length; i++) if (TASKS[i].n === n) return TASKS[i]; return null; }

  var STATUS = { covered: ['covered', 'Covered'], sample: ['sample', 'Covered \u00B7 sample'], partial: ['partial', 'Partial'], not: ['not', 'Not included'] };
  function pill(status) { var s = STATUS[status] || STATUS.covered; return '<span class="pill ' + s[0] + '">' + s[1] + '</span>'; }
  var TYPE_LABEL = { pdf: 'PDF', live: 'Live', video: 'Video' };
  function typeChips(types) { return (types || []).map(function (t) { return '<span class="chip">' + ic(t) + TYPE_LABEL[t] + '</span>'; }).join(''); }
  function statusChip(t) { return t.isSample ? '<span class="chip">' + ic('sample') + 'Includes sample</span>' : '<span class="chip">' + ic('check') + 'Complete</span>'; }

  /* ---------- shared chrome: skip link, notice bar, header, footer ---------- */
  var MONO = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><defs><linearGradient id="mzg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#4C1D95"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#mzg)"/><text x="20" y="25.5" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="15" font-weight="600" fill="#fff">MZ</text></svg>';
  function chrome(current) {
    var body = document.body;
    var bg = el('div', 'bg'); bg.setAttribute('aria-hidden', 'true'); bg.innerHTML = '<i></i><i></i><i></i>';
    var skip = el('a', 'skip', 'Skip to main content'); skip.href = '#main';
    var notice = el('div', 'notice', esc(META.notice)); notice.setAttribute('role', 'note'); notice.setAttribute('aria-label', 'Submission notice');
    var head = el('header', 'site-head');
    var nav = '<nav class="topnav" aria-label="Tasks">' + TASKS.map(function (t) {
      return '<a href="' + taskHref(t.n) + '"' + (current === t.n ? ' aria-current="page"' : '') + ' aria-label="Task ' + t.n + ': ' + esc(t.title) + '">' + t.n + '</a>';
    }).join('') + '</nav>';
    head.innerHTML = '<div class="wrap"><a class="brand" href="' + HOME + '"' + (current === 0 ? ' aria-current="page"' : '') + '>' + MONO + '<span>' + esc(META.owner) + '<small>' + esc(META.brandLine) + '</small></span></a>' + nav + '</div>';
    var foot = el('footer', 'site-foot');
    foot.innerHTML = '<div class="wrap">' + (META.footer || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
    body.insertBefore(foot, body.querySelector('script'));
    body.insertBefore(head, body.firstChild);
    body.insertBefore(notice, body.firstChild);
    body.insertBefore(skip, body.firstChild);
    body.insertBefore(bg, body.firstChild);
  }

  function section(id, title, cls) {
    var s = el('section', 'section ' + (cls || ''));
    if (id) s.id = id;
    var hid = (id || 's' + Math.random().toString(36).slice(2, 7)) + '-h';
    s.setAttribute('aria-labelledby', hid);
    s.innerHTML = '<h2 id="' + hid + '">' + fmt(title) + '</h2>';
    return s;
  }
  function details(title, open, onOpen) {
    var d = el('details', 'coll glass');
    if (open) d.open = true;
    d.innerHTML = '<summary>' + fmt(title) + '</summary><div class="coll-body"></div>';
    if (onOpen) {
      var done = false;
      var run = function () { if (d.open && !done) { done = true; onOpen(d.querySelector('.coll-body')); } };
      d.addEventListener('toggle', run);
      if (open) setTimeout(run, 0);
    }
    return d;
  }
  function fsButton(target, label) {
    var b = el('button', 'btn ghost sm', ic('expand') + esc(label || 'Open full screen'));
    b.type = 'button';
    b.addEventListener('click', function () { MZ.fullscreen(typeof target === 'function' ? target() : target); });
    return b;
  }
  function ribbon() { return '<span class="ribbon">' + ic('sample') + esc(META.sampleBadge) + '</span>'; }

  /* ---------- app frame (iframe of a patched app) ---------- */
  function appFrame(src, title, cls) {
    var w = el('div', 'frame-wrap ' + cls);
    var f = document.createElement('iframe');
    f.src = src; f.title = title;
    f.setAttribute('allow', 'autoplay; fullscreen');
    f.setAttribute('allowfullscreen', '');
    w.appendChild(f);
    return { wrap: w, frame: f };
  }

  /* ======================= LANDING ======================= */
  function landing(main) {
    var L = SITE.landing || {};
    var hero = el('section', 'hero');
    hero.setAttribute('aria-labelledby', 'hero-h');
    hero.innerHTML = '<p class="eyebrow">' + esc(L.eyebrow) + '</p><h1 id="hero-h">' + esc(L.title) + '</h1><p class="sub">' + fmt(L.sub) + '</p><p class="author">' + esc(L.author) + '</p>';
    main.appendChild(hero);

    var p = section('purpose', L.purposeTitle);
    p.appendChild(el('div', 'glass pad reveal', '<ol class="points">' + (L.purpose || []).map(function (x, i) { return '<li><span class="num" aria-hidden="true">' + (i + 1) + '</span><span>' + fmt(x) + '</span></li>'; }).join('') + '</ol>'));
    main.appendChild(p);

    if (D.hasFile('landingVideo')) {
      var v = section('overview', FILES.landingVideo.title);
      var holder = el('div', 'reveal');
      v.appendChild(holder);
      D.mount(holder, 'landingVideo', {});
      v.appendChild(el('p', 'muted small', esc(L.videoCaption)));
      main.appendChild(v);
    }

    var r = section('review', L.reviewTitle);
    r.appendChild(el('ol', 'steps', (L.review || []).map(function (s, i) { return '<li class="glass"><span class="sn" aria-hidden="true">' + (i + 1) + '</span>' + esc(s) + '</li>'; }).join('')));
    r.appendChild(el('p', 'muted', ic('clock').replace('<svg', '<svg style="display:inline;width:18px;height:18px;vertical-align:-3px;margin-right:6px"') + esc(L.reviewNote)));
    main.appendChild(r);

    var c = section('tasks', L.tasksTitle);
    var grid = el('div', 'cards');
    TASKS.forEach(function (t) {
      var a = el('a', 'tcard glass reveal');
      a.href = taskHref(t.n);
      a.innerHTML = '<div class="top"><span class="no">Task ' + t.n + '</span>' + statusChip(t) + '</div>' +
        '<h3>' + esc(t.title) + '</h3><p>' + fmt(t.cardSummary) + '</p>' +
        '<div class="bottom"><span class="types">' + typeChips(t.types) + '</span><span class="arrow">' + ic('arrow') + '</span></div>';
      grid.appendChild(a);
    });
    c.appendChild(grid);
    main.appendChild(c);

    var k = section('connect', L.connectTitle);
    k.appendChild(el('p', 'section-lead', fmt(L.connectText)));
    k.appendChild(el('div', 'glass pad reveal', diagram()));
    main.appendChild(k);

    var as = section('assumptions', L.assumptionsTitle);
    var d = details('Show the ' + (SITE.assumptions || []).length + ' assumptions', false);
    d.querySelector('.coll-body').innerHTML = '<ul>' + (SITE.assumptions || []).map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>';
    as.appendChild(d);
    main.appendChild(as);
  }

  /* Connection diagram, drawn in code (desktop: left to right; mobile: top to bottom). */
  function diagram() {
    function node(href, x, y, w, h, title, sub, inner) {
      return '<a href="' + link(href) + '"><rect class="node' + (inner ? ' inner' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14"/>' +
        '<text class="lbl" x="' + (x + 16) + '" y="' + (y + 26) + '">' + esc(title) + '</text><text class="sub" x="' + (x + 16) + '" y="' + (y + 46) + '">' + esc(sub) + '</text></a>';
    }
    var defs = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#A78BFA"/></marker></defs>';
    var desk = '<svg class="diagram diagram-desk" viewBox="0 0 1000 320" role="group" aria-labelledby="dg-t" aria-describedby="dg-d"><title id="dg-t">How the tasks connect</title><desc id="dg-d">Task 1 designs the programme. Task 2 is the module built from it; it plays the Task 6 videos and asks Task 3 questions 1 to 5. Task 5 is the LMS that would host the module. The Task 4 game records each turn in the LMS as an xAPI statement.</desc>' + defs +
      node('task-1/', 20, 120, 200, 80, 'Task 1', 'Instructional design') +
      '<path class="wire" d="M220 160 H 284" marker-end="url(#ah)"/><text class="edge" x="226" y="150">designs</text>' +
      '<rect class="node" x="290" y="30" width="320" height="260" rx="18"/><a href="' + taskHref(2) + '"><text class="lbl" x="310" y="60">Task 2 \u00B7 Interactive module</text><text class="sub" x="310" y="80">HTML5 \u00B7 SCORM 1.2 \u00B7 Lessons 0, 1.1, 1.2</text></a>' +
      node('task-6/', 310, 105, 280, 70, 'Task 6 \u00B7 Videos', 'Intro opens the module; explainer opens 1.2', true) +
      node('task-3/', 310, 195, 280, 70, 'Task 3 \u00B7 Quiz Q1\u20135', 'Graded at the end of Lesson 1.2', true) +
      '<path class="wire" d="M610 105 H 674" marker-end="url(#ah)"/><text class="edge" x="616" y="95">package</text>' +
      node('task-5/', 680, 50, 300, 100, 'Task 5 \u00B7 LMS', 'Sales Academy: hosts courses, quiz, reports') +
      node('task-4/', 680, 205, 300, 80, 'Task 4 \u00B7 Game', 'Market Share: Region Challenge') +
      '<path class="wire dash" d="M830 205 V 156" marker-end="url(#ah)"/><text class="edge" x="840" y="185">each turn = xAPI record</text>' +
      '</svg>';
    var mob = '<svg class="diagram diagram-mobile" viewBox="0 0 340 700" role="group" aria-labelledby="dm-t" aria-describedby="dm-d"><title id="dm-t">How the tasks connect</title><desc id="dm-d">Task 1 designs the programme. Task 2 is the module built from it; it plays the Task 6 videos and asks Task 3 questions 1 to 5. Task 5 is the LMS that would host the module. The Task 4 game records each turn in the LMS as an xAPI statement.</desc>' + defs +
      node('task-1/', 20, 10, 300, 70, 'Task 1', 'Instructional design') +
      '<path class="wire" d="M170 80 V 114" marker-end="url(#ah)"/><text class="edge" x="180" y="102">designs</text>' +
      '<rect class="node" x="20" y="120" width="300" height="270" rx="18"/><a href="' + taskHref(2) + '"><text class="lbl" x="36" y="148">Task 2 \u00B7 Interactive module</text><text class="sub" x="36" y="168">HTML5 \u00B7 SCORM 1.2</text></a>' +
      node('task-6/', 36, 190, 268, 80, 'Task 6 \u00B7 Videos', 'Intro and explainer', true) +
      node('task-3/', 36, 290, 268, 80, 'Task 3 \u00B7 Quiz Q1\u20135', 'End of Lesson 1.2', true) +
      '<path class="wire" d="M170 390 V 424" marker-end="url(#ah)"/><text class="edge" x="180" y="412">package</text>' +
      node('task-5/', 20, 430, 300, 90, 'Task 5 \u00B7 LMS', 'Courses, quiz, reports') +
      node('task-4/', 20, 600, 300, 80, 'Task 4 \u00B7 Game', 'Market Share: Region Challenge') +
      '<path class="wire dash" d="M170 600 V 526" marker-end="url(#ah)"/><text class="edge" x="180" y="566">each turn = xAPI record</text>' +
      '</svg>';
    return desk + mob;
  }

  /* ======================= TASK PAGE ======================= */
  function taskPage(main, n) {
    var t = task(n);
    if (!t) { notFound(main); return; }
    document.title = 'Task ' + t.n + ' \u00B7 ' + t.title + ' \u00B7 Muhammed Zaghloul';

    // Header
    var head = el('section', 'page-head');
    head.setAttribute('aria-labelledby', 'page-h');
    head.innerHTML = '<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="' + HOME + '">Home</a></li><li aria-current="page">Task ' + t.n + '</li></ol></nav>' +
      '<p class="eyebrow">Task ' + t.n + ' of ' + TASKS.length + '</p>' +
      '<h1 id="page-h">' + esc(t.title) + '</h1>' +
      (t.titleAr ? '<p class="sum"><span lang="ar" dir="rtl">' + esc(t.titleAr) + '</span> \u00B7 ' + esc(t.titleGloss) + '</p>' : '') +
      '<p class="sum">' + fmt(t.summary) + '</p>' +
      '<div class="chips">' + statusChip(t) + typeChips(t.types) + (t.isSample ? '<span class="chip">' + ic('sample') + esc(META.sampleBadge) + '</span>' : '') + '</div>';
    if (t.isSample && t.sampleReason) head.appendChild(el('div', 'sample-note glass', ribbon() + '<p>' + fmt(t.sampleReason) + '</p>'));
    main.appendChild(head);

    // Quick facts
    var facts = el('dl', 'facts section');
    facts.setAttribute('aria-label', 'Quick facts');
    facts.innerHTML = (t.facts || []).map(function (f) { return '<div class="fact glass"><dt>' + esc(f.label) + '</dt><dd>' + fmt(f.value) + '</dd></div>'; }).join('');
    main.appendChild(facts);

    // Required vs Covered
    var rq = section('required', 'Required vs Covered');
    var rows = (t.requirements || []).map(function (r) {
      return '<tr><td data-label="Requirement">' + fmt(r.req) + '</td><td data-label="What we delivered">' + fmt(r.delivered) +
        (r.status !== 'covered' && r.why ? '<span class="why"><b>Why:</b> ' + fmt(r.why) + '</span>' : '') + '</td>' +
        '<td data-label="Where to see it" class="where">' + fmt(r.where) + '</td><td data-label="Status">' + pill(r.status) + '</td></tr>';
    }).join('');
    rq.appendChild(el('div', 'glass reveal', '<table class="req"><caption class="sr-only">What the brief required for Task ' + t.n + ' and how it is covered</caption><thead><tr><th scope="col">Requirement</th><th scope="col">What we delivered</th><th scope="col">Where to see it</th><th scope="col">Status</th></tr></thead><tbody>' + rows + '</tbody></table>'));
    main.appendChild(rq);

    // What we did
    var did = section('approach', 'What we did');
    did.appendChild(el('div', 'glass pad reveal prose', '<ul class="did">' + (t.did || []).map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>'));
    main.appendChild(did);

    // Demonstration
    var demo = section('demo', 'Demonstration');
    var builder = DEMOS[(t.demo || {}).kind];
    if (builder) builder(demo, t);
    main.appendChild(demo);

    // Task 6 script
    if (t.script) main.appendChild(scriptSection(t));

    // Deliverables
    main.appendChild(deliverables(t));

    // Notes
    if (t.notes && t.notes.length) {
      var nt = section('notes', 'Notes and assumptions');
      nt.appendChild(el('div', 'glass pad prose', '<ul>' + t.notes.map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>'));
      main.appendChild(nt);
    }

    // Prev / next
    var prev = task(n - 1), next = task(n + 1);
    var pg = el('nav', 'pager');
    pg.setAttribute('aria-label', 'Task navigation');
    pg.innerHTML = (prev ? '<a class="glass prev" href="' + taskHref(prev.n) + '"><small>\u2190 Previous</small>Task ' + prev.n + ' \u00B7 ' + esc(prev.title) + '</a>' : '<span></span>') +
      '<a class="glass all" href="' + HOME + '#tasks' + '"><small>Overview</small>Back to all tasks</a>' +
      (next ? '<a class="glass next" href="' + taskHref(next.n) + '"><small>Next \u2192</small>Task ' + next.n + ' \u00B7 ' + esc(next.title) + '</a>' : '<span></span>');
    main.appendChild(pg);
  }

  function demoHead(sec, t, fsTarget) {
    var bar = el('div', 'demo-bar');
    var left = el('div', 'btn-row');
    if (t.isSample) left.innerHTML = ribbon();
    bar.appendChild(left);
    var right = el('div', 'btn-row');
    if (fsTarget) right.appendChild(fsButton(fsTarget));
    bar.appendChild(right);
    sec.appendChild(bar);
    if (t.demo.hint) sec.appendChild(el('p', 'hint', ic('info') + '<span>' + fmt(t.demo.hint) + '</span>'));
    return right;
  }

  /* ---------- demonstration builders, one per kind ---------- */
  var DEMOS = {
    // Task 1: key highlights + both PDFs inline
    pdfs: function (sec, t) {
      sec.appendChild(el('div', 'highlights', (t.highlights || []).map(function (h) {
        return '<div class="hl glass reveal"><h3>' + esc(h.title) + '</h3><ul>' + h.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ul></div>';
      }).join('')));
      demoHead(sec, t, null);
      (t.files || []).forEach(function (k) {
        var f = FILES[k]; if (!f) return;
        var meta = el('div', 'viewer-meta', '<h3>' + esc(f.title) + '</h3>');
        var holder = el('div', '');
        var box = D.mount(holder, k, {});
        if (box.classList.contains('dv')) meta.appendChild(fsButton(box));
        var wrap = el('div', 'section'); wrap.style.marginTop = '24px';
        wrap.appendChild(meta); wrap.appendChild(holder);
        sec.appendChild(wrap);
      });
    },

    // Task 2: live module + session tracking panel
    module: function (sec, t) {
      var app = appFrame(link(t.demo.src), t.demo.title, 'r169 app');
      demoHead(sec, t, app.wrap);
      var split = el('div', 'demo-split');
      split.appendChild(app.wrap);
      var panel = el('aside', 'track glass');
      panel.setAttribute('aria-labelledby', 'trk-h');
      panel.innerHTML = '<h3 id="trk-h">' + esc(t.demo.trackingTitle) + ' <span class="pill impl">Implemented</span></h3>' +
        '<p class="muted small">' + esc(t.demo.trackingNote) + '</p>' +
        '<div class="small">Progress <b data-k="pct">0%</b></div><div class="meter" role="progressbar" aria-label="Module progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>' +
        '<dl><dt>Status</dt><dd data-k="status">Waiting for sign-in</dd><dt>Screen</dt><dd data-k="screen">\u2014</dd><dt>Drag & drop</dt><dd data-k="dnd">\u2014</dd><dt>Customer interaction</dt><dd data-k="scen">\u2014</dd><dt>Quiz</dt><dd data-k="quiz">\u2014</dd><dt>Completion</dt><dd data-k="done">Not yet</dd></dl>' +
        '<div class="log" aria-live="polite" aria-label="Latest tracking events"></div>';
      split.appendChild(panel);
      sec.appendChild(split);
      var q = function (k) { return panel.querySelector('[data-k="' + k + '"]'); };
      var log = panel.querySelector('.log');
      function addLog(text) { var d = el('div', '', esc(new Date().toLocaleTimeString('en-GB')) + ' \u00B7 ' + esc(text)); log.insertBefore(d, log.firstChild); while (log.children.length > 8) log.lastChild.remove(); }
      window.addEventListener('message', function (e) {
        if (e.source !== app.frame.contentWindow || !MZ.trusted(e)) return;
        var m = e.data; if (!m || m.source !== 'asaq-module') return;
        if (m.type === 'ready') { q('status').textContent = 'Sign-in screen'; addLog('module ready'); }
        if (m.type === 'progress') {
          var p = Math.max(0, Math.min(100, Math.round(m.percent || 0)));
          q('pct').textContent = p + '%';
          panel.querySelector('.meter i').style.width = p + '%';
          panel.querySelector('.meter').setAttribute('aria-valuenow', p);
          q('screen').textContent = (m.screen || '\u2014') + ' (' + m.step + ')';
          if (q('done').textContent === 'Not yet') q('status').textContent = 'In progress';
          addLog('progress ' + p + '% \u00B7 screen ' + m.screen);
        }
        if (m.type === 'score' || m.type === 'complete') {
          var s = m.scores || {};
          if (s.dnd != null) q('dnd').textContent = s.dnd + ' first-try correct';
          if (s.scenario != null && s.scenario !== '') q('scen').textContent = s.scenario + ' / 30';
          if (s.quiz != null && s.quiz !== '') q('quiz').textContent = s.quiz + ' / 5' + (s.quizPassed ? ' \u00B7 passed' : (s.quizPassed === false ? ' \u00B7 not passed' : ''));
          addLog(m.type === 'complete' ? 'module complete' : 'score update');
        }
        if (m.type === 'complete') { q('done').textContent = 'Complete'; q('status').textContent = 'Complete'; q('pct').textContent = '100%'; panel.querySelector('.meter i').style.width = '100%'; }
      });
    },

    // Task 3: read-only question gallery + links to the live versions
    gallery: function (sec, t) {
      demoHead(sec, t, null);
      var g = el('div', 'qgrid');
      (t.questions || []).forEach(function (qq) {
        g.appendChild(el('article', 'qcard glass reveal',
          '<div class="qhead"><span class="qno">Question ' + qq.n + '</span><span class="chips"><span class="chip">' + esc(qq.type) + '</span><span class="chip">' + esc(qq.lo) + '</span>' + (qq.inModule ? '<span class="chip">' + ic('live') + 'Live in Task 2</span>' : '') + '</span></div>' +
          '<p class="stem ar-block" lang="ar" dir="rtl">' + esc(qq.stem) + '</p>' +
          '<ul class="opts" lang="ar" dir="rtl">' + qq.options.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' +
          '<p class="gloss">' + fmt(qq.gloss) + ' <span class="muted">(Content section ' + esc(qq.section) + ')</span></p>'));
      });
      sec.appendChild(g);
      sec.appendChild(el('p', 'hint', ic('info') + '<span>Answer key and explanations: see the document below.</span>'));
      var live = el('div', 'section');
      live.innerHTML = '<h3>' + esc(t.demo.liveTitle) + '</h3>';
      var row = el('div', 'grid');
      row.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
      (t.demo.live || []).forEach(function (l) {
        row.appendChild(el('a', 'glass pad tcard', '<h3>' + esc(l.label) + '</h3><p>' + fmt(l.text) + '</p><div class="bottom"><span></span><span class="arrow">' + ic('arrow') + '</span></div>'));
        row.lastChild.href = link(l.href);
      });
      live.appendChild(row);
      sec.appendChild(live);
    },

    // Task 4: live game + language switch
    game: function (sec, t) {
      var app = appFrame(link(t.demo.src), t.demo.title, 'r169 app');
      var right = demoHead(sec, t, app.wrap);
      var KEY = 'sa_game_v1';
      function lang() { try { return (JSON.parse(localStorage.getItem(KEY)) || {}).lang || 'en'; } catch (e) { return 'en'; } }
      var b = el('button', 'btn ghost sm'); b.type = 'button';
      function label() { b.innerHTML = ic('globe') + esc(lang() === 'ar' ? t.demo.langButtonBack : t.demo.langButton); }
      label();
      b.addEventListener('click', function () {
        var to = lang() === 'ar' ? 'en' : 'ar';
        // The game keeps its language in its saved state; set it there, then reload the frame.
        try { var s = JSON.parse(localStorage.getItem(KEY)) || null; if (s) { s.lang = to; localStorage.setItem(KEY, JSON.stringify(s)); } } catch (e) { /* ignore */ }
        app.frame.src = link(t.demo.src) + (to === 'ar' ? '?lang=ar' : '?lang=en');
        setTimeout(label, 50);
      });
      app.frame.addEventListener('load', label);
      right.insertBefore(b, right.firstChild);
      sec.appendChild(app.wrap);
      if (t.demo.extra) sec.appendChild(el('p', 'hint', ic('info') + '<span>' + fmt(t.demo.extra) + '</span>'));
    },

    // Task 5: LMS + demo accounts + legend + wireframe
    lms: function (sec, t) {
      var app = appFrame(link(t.demo.src), t.demo.title, 'tall');
      demoHead(sec, t, app.wrap);
      sec.appendChild(app.wrap);
      sec.appendChild(el('div', 'accounts', (t.demo.accounts || []).map(function (a) { return '<div class="account glass"><b>' + esc(a.role) + '</b><code>' + esc(a.user) + '</code></div>'; }).join('') + '<div class="account glass"><b>Password</b><code>any</code></div>'));
      var lg = el('div', 'section');
      lg.innerHTML = '<h3>Feature labels used in the LMS and its documentation</h3>';
      lg.appendChild(el('div', 'legend', (t.legend || []).map(function (c) {
        return '<div class="col glass"><span class="pill ' + c.status + '">' + esc(c.label) + '</span><p class="small" style="margin:10px 0 0">' + esc(c.text) + '</p><ul>' + c.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ul></div>';
      }).join('')));
      sec.appendChild(lg);
      var wf = el('div', 'section');
      var d = details(t.demo.wireTitle, false, function (body) {
        var w = appFrame(link(t.demo.wireSrc), t.demo.wireTitle, 'wire');
        var bar = el('div', 'demo-bar', '<span class="muted small">Sitemap by role, annotated screens, and mobile, Arabic and dark-mode notes.</span>');
        bar.appendChild(fsButton(w.wrap));
        body.appendChild(bar); body.appendChild(w.wrap);
      });
      wf.appendChild(d);
      sec.appendChild(wf);
    },

    // Task 6: two Drive videos with posters
    videos: function (sec, t) {
      demoHead(sec, t, null);
      (t.demo.videos || []).forEach(function (v, i) {
        var f = FILES[v.key]; if (!f) return;
        var wrap = el('div', i ? 'section' : '');
        if (i) wrap.style.marginTop = '28px';
        var meta = el('div', 'viewer-meta', '<h3>' + esc(f.title) + '</h3>');
        var holder = el('div', '');
        var box = D.mount(holder, v.key, { poster: v.poster ? link(v.poster) : '' });
        if (box.classList.contains('dv')) meta.appendChild(fsButton(box));
        wrap.appendChild(meta); wrap.appendChild(holder);
        sec.appendChild(wrap);
      });
      sec.appendChild(el('p', 'hint', ic('info') + '<span>' + fmt(t.demo.captionsNote) + '</span>'));
    }
  };

  /* ---------- Task 6 script tables ---------- */
  function scriptSection(t) {
    var s = section('script', t.scriptTitle || 'Script');
    s.appendChild(el('p', 'section-lead', fmt(t.scriptLead)));
    t.script.forEach(function (part) {
      var box = el('div', 'glass pad reveal');
      box.style.marginTop = '16px';
      box.innerHTML = '<h3>' + fmt(part.title) + '</h3><div class="tbl-scroll"><table class="script"><caption class="sr-only">' + esc(part.title) + '</caption><thead><tr><th scope="col">Time</th><th scope="col">Voice-over (Arabic)</th><th scope="col">English gloss</th><th scope="col">On-screen text</th></tr></thead><tbody>' +
        part.rows.map(function (r) {
          return '<tr><td class="t" data-label="Time"><span class="seg">' + esc(r.seg) + '</span>' + esc(r.t) + '</td>' +
            '<td data-label="Voice-over (Arabic)" lang="ar" dir="rtl">' + esc(r.vo) + '</td>' +
            '<td data-label="English gloss">' + esc(r.en) + '</td>' +
            (r.ost ? '<td data-label="On-screen text" class="ost" lang="ar" dir="rtl">' + esc(r.ost) + '</td>' : '<td data-label="On-screen text" class="ost"><span class="muted">\u2014</span></td>') + '</tr>';
        }).join('') + '</tbody></table></div>';
      s.appendChild(box);
    });
    if (t.scriptFileKey && D.hasFile(t.scriptFileKey)) {
      var w = el('div', 'section');
      w.innerHTML = '<h3>' + esc(t.scriptFileTitle) + '</h3>';
      D.mount(w, t.scriptFileKey, {});
      s.appendChild(w);
    }
    return s;
  }

  /* ---------- Deliverables list ---------- */
  function deliverables(t) {
    var s = section('files', 'Deliverables');
    var keys = t.files || [];
    if (!keys.length) {
      s.appendChild(el('div', 'glass pad', '<p style="margin:0">' + fmt(t.filesNote || 'This task\u2019s deliverable is the live module in the [demonstration](#demo) above: an HTML5 web module packaged as SCORM 1.2. Its videos are listed under [Task 6](task-6/#files) and its design under [Task 1](task-1/#files).') + '</p>'));
      return s;
    }
    var ul = el('ul', 'files');
    keys.forEach(function (k) {
      var f = FILES[k]; if (!f) return;
      var has = D.hasFile(k);
      var li = el('li', 'file glass reveal');
      var meta = [f.type === 'video' ? 'Video' : 'PDF' + (f.pages ? ' \u00B7 ' + f.pages + ' pp' : ''), f.lang].filter(Boolean).map(esc).join(' \u00B7 ');
      li.innerHTML = '<span class="ico">' + ic(f.type === 'video' ? 'video' : 'pdf') + '</span>' +
        '<div><h3>' + esc(f.title) + '</h3><div class="meta"><span>' + meta + '</span>' + (f.version ? '<span class="chip">' + esc(f.version) + '</span>' : '') +
        (f.updated ? '<span>Updated ' + esc(fmtDate(f.updated)) + '</span>' : '') + (f.sample ? '<span class="chip">' + ic('sample') + esc(META.sampleBadge) + '</span>' : '') + '</div></div>';
      var act = el('div', 'act');
      if (has) {
        var b = el('button', 'btn sm', ic('eye') + 'View');
        b.type = 'button';
        b.setAttribute('aria-label', 'View ' + f.title);
        b.addEventListener('click', function () { MZ.openFile(k); });
        act.appendChild(b);
      } else act.innerHTML = '<span class="chip">' + ic('clock') + 'File link coming soon</span>';
      li.appendChild(act);
      var note = (t.fileNotes || {})[k] || f.note;
      if (note) li.appendChild(el('p', 'note', fmt(note)));
      ul.appendChild(li);
    });
    s.appendChild(ul);
    // The task's first PDF is also shown inline, collapsed by default.
    if (t.inlineFirst) {
      var first = keys.filter(function (k) { return FILES[k] && FILES[k].type === 'pdf' && D.hasFile(k); })[0];
      if (first) {
        var w = el('div', 'section'); w.style.marginTop = '16px';
        w.appendChild(details('Show inline: ' + FILES[first].title, false, function (body) {
          var box = D.mount(body, first, {});
          if (box.classList.contains('dv')) { var bar = el('div', 'demo-bar', '<span></span>'); bar.appendChild(fsButton(box)); body.insertBefore(bar, box); }
        }));
        s.appendChild(w);
      }
    }
    return s;
  }

  /* ======================= VIEWER PAGE (viewer/index.html?f=key) ======================= */
  function viewer(main) {
    var key = (new URLSearchParams(location.search).get('f') || '').replace(/[^a-z0-9_]/gi, '');
    var f = FILES[key];
    var head = el('section', 'page-head');
    head.setAttribute('aria-labelledby', 'page-h');
    head.innerHTML = '<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="' + HOME + '">Home</a></li><li aria-current="page">File viewer</li></ol></nav>' +
      '<h1 id="page-h" style="font-size:clamp(1.6rem,3.5vw,2.4rem)">' + esc(f ? f.title : 'File not found') + '</h1>';
    var back = el('button', 'btn ghost sm', ic('back') + 'Back');
    back.type = 'button';
    back.addEventListener('click', function () { if (history.length > 1) history.back(); else location.href = HOME; });
    head.appendChild(el('div', 'btn-row'));
    head.lastChild.appendChild(back);
    main.appendChild(head);
    var s = el('section', 'section');
    s.setAttribute('aria-label', 'Document');
    if (f) { document.title = f.title + ' \u00B7 Muhammed Zaghloul'; D.mount(s, key, { eager: true }); }
    else s.appendChild(el('div', 'glass pad', '<p style="margin:0">This file is not available. <a href="' + HOME + '">Return to the home page</a>.</p>'));
    main.appendChild(s);
  }

  /* ======================= 404 ======================= */
  function notFound(main) {
    document.title = 'Page not found \u00B7 Muhammed Zaghloul';
    main.appendChild(el('section', 'nf glass pad', '<h1 style="font-size:2rem">Page not found</h1><p class="muted">The page you asked for does not exist.</p><a class="btn" href="' + HOME + '">' + ic('back') + 'Go to the home page</a>'));
  }

  /* ======================= boot ======================= */
  function boot() {
    document.documentElement.classList.remove('no-js');
    var page = document.body.getAttribute('data-page');
    var n = parseInt(document.body.getAttribute('data-task'), 10);
    chrome(page === 'task' ? n : (page === 'landing' ? 0 : -1));
    var main = document.getElementById('main');
    var inner = el('div', 'wrap');
    main.appendChild(inner);
    if (page === 'landing') landing(inner);
    else if (page === 'task') taskPage(inner, n);
    else if (page === 'viewer') viewer(inner);
    else notFound(inner);
    MZ.reveal(document);
    // Jump to #demo / #files after the page is built.
    if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) setTimeout(function () { target.scrollIntoView(); }, 30); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
