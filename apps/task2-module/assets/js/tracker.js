(function () {
  'use strict';
  var C = window.CONFIG || {};
  var DEBUG = !!C.DEBUG || /[?&]debug=1\b/.test(location.search);
  var SHOW_PANEL = /[?&]debug=1\b/.test(location.search);
  var MAX_QUEUE = 1000;

  function rand(n) {
    var s = '', a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var buf = new Uint32Array(n);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var i = 0; i < n; i++) s += a[buf[i] % a.length];
    return s;
  }

  function shortUA() {
    var ua = navigator.userAgent || '';
    var os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Other';
    var br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
    var mob = /Mobi|Android|iPhone/.test(ua) ? ' mobile' : '';
    return br + ' / ' + os + mob + ' / ' + window.screen.width + 'x' + window.screen.height;
  }

  var T = {
    learner: null,
    sessionId: 'S-' + rand(10),
    queue: [],
    recent: [],
    ctx: { screen_id: '', progress_pct: 0 },
    onChange: null,
    sending: false,
    ua: shortUA(),
    rand: rand,
    debug: DEBUG
  };

  T.setLearner = function (l) { T.learner = l; };
  T.setQueue = function (q) { if (Array.isArray(q)) T.queue = q.concat(T.queue).slice(-MAX_QUEUE); };

  T.track = function (event, p) {
    p = p || {};
    var L = T.learner || { id: '', name: '' };
    var e = {
      learner_id: L.id,
      learner_name: L.name,
      session_id: T.sessionId,
      timestamp: new Date().toISOString(),
      module_id: C.MODULE_ID || '',
      screen_id: p.screen_id != null ? p.screen_id : T.ctx.screen_id,
      event: event,
      item: p.item != null ? String(p.item) : '',
      correct: p.correct == null ? '' : (p.correct ? 1 : 0),
      attempt: p.attempt != null ? p.attempt : '',
      score: p.score != null ? p.score : '',
      lo: p.lo != null ? String(p.lo) : '',
      duration_sec: p.duration_sec != null ? p.duration_sec : '',
      value: p.value != null ? p.value : '',
      progress_pct: T.ctx.progress_pct,
      user_agent: T.ua
    };
    T.queue.push(e);
    if (T.queue.length > MAX_QUEUE) T.queue.splice(0, T.queue.length - MAX_QUEUE);
    T.recent.push(e);
    if (T.recent.length > 20) T.recent.shift();
    if (DEBUG && window.console) console.log('[track]', event, e);
    if (T.onChange) T.onChange();
    renderPanel();
    return e;
  };

  function endpoint() { return (C.SHEETS_ENDPOINT || '').trim(); }

  T.flush = function () {
    var url = endpoint();
    if (!url || T.sending || !T.queue.length) return;
    if (navigator.onLine === false) return;
    var batch = T.queue.slice(0, 50);
    T.sending = true;
    try {
      fetch(url, {
        method: 'POST', mode: 'no-cors', keepalive: false,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ events: batch })
      }).then(function () {
        removeSent(batch);
        T.sending = false;
        if (T.queue.length) setTimeout(T.flush, 300);
      }, function () { T.sending = false; });
    } catch (err) { T.sending = false; }
  };

  function removeSent(batch) {
    // remove exactly the sent events (they are at the head of the queue)
    var n = 0;
    while (n < batch.length && T.queue[0] === batch[n]) { T.queue.shift(); n++; }
    if (n < batch.length) {
      T.queue = T.queue.filter(function (e) { return batch.indexOf(e) < 0; });
    }
    if (T.onChange) T.onChange();
    renderPanel();
  }

  T.beacon = function () {
    var url = endpoint();
    if (!url || !T.queue.length || !navigator.sendBeacon) return;
    var batch = T.queue.slice(0, 50);
    try {
      var ok = navigator.sendBeacon(url, new Blob([JSON.stringify({ events: batch })], { type: 'text/plain;charset=utf-8' }));
      if (ok) removeSent(batch);
    } catch (err) { /* keep queued */ }
  };

  setInterval(T.flush, 5000);
  window.addEventListener('online', T.flush);
  window.addEventListener('pagehide', function () { T.beacon(); SCORM.finish(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') T.beacon(); });

  /* ---------- parent page messaging ---------- */
  T.post = function (type, data) {
    if (window.parent === window) return;
    var msg = { source: 'asaq-module', type: type };
    for (var k in data) msg[k] = data[k];
    try { window.parent.postMessage(msg, '*'); } catch (err) { /* ignore */ }
  };

  /* ---------- SCORM 1.2 (optional; only if an LMS API is present) ---------- */
  var SCORM = {
    api: null, on: false,
    find: function () {
      var w = window, n = 0;
      try {
        while (w && n < 12) {
          if (w.API) return w.API;
          if (w.parent === w) break;
          w = w.parent; n++;
        }
      } catch (err) { /* cross-origin */ }
      try { if (window.opener && window.opener.API) return window.opener.API; } catch (err) { /* ignore */ }
      return null;
    },
    init: function () {
      this.api = this.find();
      if (!this.api) return false;
      try {
        this.on = String(this.api.LMSInitialize('')) === 'true';
        if (this.on) {
          var st = this.get('cmi.core.lesson_status');
          if (!st || st === 'not attempted') this.set('cmi.core.lesson_status', 'incomplete');
          this.commit();
        }
      } catch (err) { this.on = false; }
      return this.on;
    },
    get: function (k) { try { return this.on ? this.api.LMSGetValue(k) : ''; } catch (err) { return ''; } },
    set: function (k, v) { try { if (this.on) this.api.LMSSetValue(k, String(v)); } catch (err) { /* ignore */ } },
    commit: function () { try { if (this.on) this.api.LMSCommit(''); } catch (err) { /* ignore */ } },
    learnerName: function () { return this.get('cmi.core.student_name'); },
    suspend: function (s) { if (!this.on) return; this.set('cmi.suspend_data', s.slice(0, 4000)); this.commit(); },
    score: function (pct) { if (!this.on) return; this.set('cmi.core.score.min', 0); this.set('cmi.core.score.max', 100); this.set('cmi.core.score.raw', Math.round(pct)); this.commit(); },
    status: function (s) { if (!this.on) return; this.set('cmi.core.lesson_status', s); this.commit(); },
    finished: false,
    finish: function () { if (!this.on || this.finished) return; this.finished = true; try { this.api.LMSFinish(''); } catch (err) { /* ignore */ } }
  };
  T.scorm = SCORM;

  /* ---------- debug panel (?debug=1 only) ---------- */
  var panel = null;
  function renderPanel() {
    if (!SHOW_PANEL) return;
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'debug';
      if (document.body) document.body.appendChild(panel); else return;
    }
    var mode = endpoint() ? 'sheets' : 'local';
    var h = '<b>queue: ' + T.queue.length + '</b> · mode: ' + mode + ' · ' + T.sessionId + '<br>';
    for (var i = T.recent.length - 1; i >= 0; i--) {
      var e = T.recent[i];
      h += e.timestamp.slice(11, 19) + ' <b>' + e.event + '</b> ' + e.screen_id + ' ' + esc(e.item) + (e.correct !== '' ? ' c=' + e.correct : '') + (e.score !== '' ? ' s=' + e.score : '') + '<br>';
    }
    panel.innerHTML = h;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  T.renderPanel = renderPanel;

  window.Tracker = T;
})();
