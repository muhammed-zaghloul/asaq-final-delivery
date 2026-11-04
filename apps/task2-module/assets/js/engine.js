(function () {
  'use strict';
  var M = window.MODULE, C = window.CONFIG || {}, T = window.Tracker, U = M.ui, SC = M.screens;
  var KEY = 'asaq_ibrahim_v1:';
  var LETTERS = ['أ', 'ب', 'ج', 'د'];
  var NSTEPS = M.steps.length;
  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var mobileMQ = window.matchMedia ? window.matchMedia('(max-width: 699px)') : { matches: false };

  /* ================= helpers ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function ic(n, c) { return window.icon(n, c); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(s, n) { return s.replace('{n}', n); }
  function idx(id) { for (var i = 0; i < NSTEPS; i++) if (M.steps[i].id === id) return i; return -1; }
  function layerName(id) { var l = SC.layers.filter(function (x) { return x.id === id; })[0]; return l ? l.t : id; }
  function whoLabel(w) { return w === 'ibrahim' ? U.ibrahim : w === 'customer' ? U.customer : U.narrator; }
  function rm() { return reduceMQ.matches; }
  function bubble(who, text, label) {
    var cls = who === 'customer' ? 'cu' : 'ib';
    return '<div class="bubwrap ' + cls + '">' + (label !== false ? '<div class="who ' + cls + '">' + esc(label || whoLabel(who)) + '</div>' : '') +
      '<div class="bub ' + cls + '">' + esc(text) + '</div></div>';
  }

  /* ================= state ================= */
  var learner = null, S = null, scale = 1;

  function fresh() {
    return {
      v: 1, step: 0, maxStep: 0, done: {}, data: {},
      dndFirst: {},
      scen: { pts: [null, null, null], picks: [null, null, null], total: null, ending: null, passed: false, play: 1, logged: 0 },
      quiz: { order: [0, 1, 2, 3, 4], answers: {}, score: null, passed: false, attempt: 1, logged: 0, reviewed: false },
      video: { intro: { done: false, max: 0 }, explainer: { done: false, max: 0 } },
      lessonDone: false, moduleDone: false, survey: null, startedAt: Date.now(), queue: []
    };
  }
  function save() {
    if (!learner || !S) return;
    S.queue = T.queue;
    var json = JSON.stringify(S);
    try { localStorage.setItem(KEY + learner.id, json); } catch (err) { /* storage full or blocked */ }
    if (T.scorm.on) {
      var lite = JSON.parse(json); delete lite.queue;
      T.scorm.suspend(JSON.stringify(lite));
    }
  }
  function load(id) {
    try { var j = localStorage.getItem(KEY + id); if (j) return JSON.parse(j); } catch (err) { /* ignore */ }
    if (T.scorm.on) { try { var s = T.scorm.get('cmi.suspend_data'); if (s) return JSON.parse(s); } catch (err) { /* ignore */ } }
    return null;
  }
  function storedLearner() { try { return JSON.parse(localStorage.getItem(KEY + 'learner') || 'null'); } catch (err) { return null; } }
  function storeLearner(l) { try { localStorage.setItem(KEY + 'learner', JSON.stringify(l)); } catch (err) { /* ignore */ } }
  T.onChange = function () { if (learner && S) { S.queue = T.queue; try { localStorage.setItem(KEY + learner.id, JSON.stringify(S)); } catch (err) { /* ignore */ } } };

  var prefs = (function () { try { return JSON.parse(localStorage.getItem(KEY + 'prefs') || '{}'); } catch (err) { return {}; } })();
  function savePrefs() { try { localStorage.setItem(KEY + 'prefs', JSON.stringify(prefs)); } catch (err) { /* ignore */ } }
  if (prefs.cc == null) prefs.cc = true;

  /* ================= DOM refs ================= */
  var D = {};
  function refs() {
    D.frame = $('#frame'); D.stage = $('#stage'); D.host = $('#host');
    D.label = $('#pbar-label'); D.title = $('#title'); D.badge = $('#badge');
    D.prev = $('#prev'); D.next = $('#next'); D.fill = $('#prog-fill'); D.plabel = $('#prog-label');
    D.track = $('#prog-track'); D.play = $('#btn-play'); D.replay = $('#btn-replay'); D.mute = $('#btn-mute');
    D.extra = $('#pbar-extra'); D.live = $('#sr-live'); D.strip = $('#vo-strip'); D.bbar = $('#bbar');
  }

  function announce(t) { D.live.textContent = ''; setTimeout(function () { D.live.textContent = t; }, 40); }

  /* ================= scaling ================= */
  function fit() {
    if (mobileMQ.matches) { scale = 1; D.frame.style.transform = ''; return; }
    scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    D.frame.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
  }

  /* ================= audio: SFX ================= */
  var SFX = {};
  ['notify', 'click', 'correct', 'wrong', 'flip', 'success', 'door'].forEach(function (n) {
    var a = new Audio(); a.preload = 'auto'; a.src = 'media/sfx/' + n + '.mp3'; a.volume = 0.55; SFX[n] = a;
  });
  function sfx(n) {
    if (prefs.mute || rm() || prefs.sound === false) return;
    var a = SFX[n]; if (!a) return;
    try { a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () { }); } catch (err) { /* ignore */ }
  }

  /* ================= narration ================= */
  var VO_FILES = C.VO_AVAILABLE || [];
  var N = {
    audio: null, timer: null, remain: 0, startT: 0, paused: false, last: null, token: 0,
    play: function (stateId, lines, cb) {
      N.stop();
      if (!lines) { if (cb) cb(); return; }
      if (!Array.isArray(lines)) lines = [lines];
      N.last = { stateId: stateId, lines: lines, cb: cb };
      var tok = ++N.token, i = 0;
      var hasFile = VO_FILES.indexOf(stateId) >= 0;
      function show(l) {
        D.strip.innerHTML = '<b>' + esc(whoLabel(l.who)) + ':</b><span>' + esc(l.t) + '</span>';
        D.strip.classList.add('on');
      }
      function finish() {
        if (tok !== N.token) return;
        D.strip.classList.remove('on'); N.audio = null; N.timer = null;
        updPlay();
        if (cb) cb();
      }
      function nextLine() {
        if (tok !== N.token) return;
        if (i >= lines.length) return finish();
        var l = lines[i++]; show(l);
        N.timed(Math.max(2000, 60 * l.t.length), nextLine);
      }
      if (hasFile) {
        var a = new Audio('media/vo/' + stateId + '.mp3');
        a.muted = !!prefs.mute; N.audio = a;
        show({ who: lines[0].who, t: lines.map(function (l) { return l.t; }).join(' ') });
        a.addEventListener('ended', function () { setTimeout(finish, 250); });
        a.addEventListener('error', function () { if (tok === N.token) { N.audio = null; nextLine(); } });
        var p = a.play(); if (p && p.catch) p.catch(function () { if (tok === N.token) { N.audio = null; nextLine(); } });
      } else nextLine();
      N.paused = false; updPlay();
    },
    timed: function (ms, fn) { N.remain = ms; N.fn = fn; N.startT = Date.now(); clearTimeout(N.timer); N.timer = setTimeout(fn, ms); },
    stop: function () {
      N.token++; clearTimeout(N.timer); N.timer = null;
      if (N.audio) { try { N.audio.pause(); } catch (err) { /* ignore */ } N.audio = null; }
      if (D.strip) D.strip.classList.remove('on');
      N.paused = false; updPlay();
    },
    active: function () { return !!(N.audio || N.timer); },
    toggle: function () {
      if (!N.active()) { if (N.last) N.replay(); return; }
      if (N.paused) {
        N.paused = false;
        if (N.audio) N.audio.play().catch(function () { });
        else { N.startT = Date.now(); N.timer = setTimeout(N.fn, N.remain); }
        D.strip.classList.add('on');
      } else {
        N.paused = true;
        if (N.audio) N.audio.pause();
        else { clearTimeout(N.timer); N.remain = Math.max(300, N.remain - (Date.now() - N.startT)); }
      }
      updPlay();
    },
    replay: function () { if (N.last) N.play(N.last.stateId, N.last.lines, null); },
    setMute: function (m) { if (N.audio) N.audio.muted = m; }
  };

  /* ================= player bar ================= */
  var ctl = null; // per-screen control override {toggle, replay, playing()}
  function updPlay() {
    if (!D.play) return;
    var playing = ctl && ctl.playing ? ctl.playing() : (N.active() && !N.paused);
    D.play.innerHTML = ic(playing ? 'pause' : 'play');
    D.play.setAttribute('aria-label', U.play);
  }
  function updMute() {
    D.mute.innerHTML = ic(prefs.mute ? 'mute' : 'volume');
    D.mute.setAttribute('aria-pressed', prefs.mute ? 'true' : 'false');
  }

  /* ================= overlays ================= */
  var openOv = null;
  function overlay(o) {
    closeOverlay(true);
    var head = o.head || 'navy';
    var card = el('<div class="ov" role="dialog" aria-modal="true" aria-labelledby="ov-title">' +
      '<div class="ov-card ' + (o.cls || '') + '">' +
      '<div class="ov-head ' + head + '">' + ic(o.icon || (head === 'green' ? 'check' : head === 'red' ? 'x' : 'chat')) +
      '<h3 id="ov-title">' + esc(o.title || '') + '</h3>' + (o.pts != null ? '<span class="pts">+' + o.pts + '</span>' : '') + '</div>' +
      '<div class="ov-body"></div><div class="ov-foot"></div></div></div>');
    var body = $('.ov-body', card);
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    var foot = $('.ov-foot', card);
    (o.buttons || []).forEach(function (b) {
      var btn = el('<button type="button" class="btn ' + (b.cls || 'btn-navy') + '">' + esc(b.label) + (b.icon ? ic(b.icon) : '') + '</button>');
      if (b.disabled) btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', function () { if (btn.getAttribute('aria-disabled') === 'true') return; b.onClick && b.onClick(btn); });
      if (b.id) btn.id = b.id;
      foot.appendChild(btn);
    });
    if (!foot.children.length) foot.remove();
    var prevFocus = document.activeElement;
    D.stage.appendChild(card);
    D.host.setAttribute('inert', ''); D.bbar.setAttribute('inert', '');
    D.host.setAttribute('aria-hidden', 'true'); D.bbar.setAttribute('aria-hidden', 'true');
    function onKey(e) {
      if (e.key === 'Escape') { if (o.dismissable) { e.preventDefault(); api.close(); } return; }
      if (e.key !== 'Tab') return;
      var f = $$('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', card).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    card.addEventListener('keydown', onKey);
    var api = {
      el: card, body: body, foot: foot,
      close: function (quiet) {
        if (!card.parentNode) return;
        card.parentNode.removeChild(card);
        if (openOv === api) openOv = null;
        if (!openOv) {
          D.host.removeAttribute('inert'); D.bbar.removeAttribute('inert');
          D.host.removeAttribute('aria-hidden'); D.bbar.removeAttribute('aria-hidden');
        }
        if (o.onClose) o.onClose();
        if (!quiet && prevFocus && document.body.contains(prevFocus) && !prevFocus.closest('[inert]')) prevFocus.focus({ preventScroll: true });
      }
    };
    openOv = api;
    setTimeout(function () {
      var f = o.focus ? $(o.focus, card) : $('.ov-foot .btn, .ov-body button', card);
      (f || $('#ov-title', card)).focus({ preventScroll: true });
      if (!f) $('#ov-title', card).setAttribute('tabindex', '-1');
    }, 60);
    if (o.announce !== false) announce((o.title || '') + '. ' + (body.textContent || '').slice(0, 300));
    return api;
  }
  function closeOverlay(quiet) { if (openOv) openOv.close(quiet); }

  function reasonHtml(t, now) { return t ? '<div class="reason' + (now ? ' now' : '') + '">' + ic('bulb') + '<p>' + esc(t) + '</p></div>' : ''; }

  /* ================= video player ================= */
  function fmtT(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function makePlayer(key, o) {
    var V = M.videos[key], vs = S.video[key], review = !!o.review;
    var root = el('<div class="s-vid' + (o.cls ? ' ' + o.cls : '') + '">' +
      '<div class="vbox"><div class="vwrap">' +
      '<video preload="metadata" playsinline poster="' + V.poster + '">' +
      '<source src="' + V.src + '" type="video/mp4">' +
      '<track kind="captions" srclang="ar" label="العربية" src="' + V.vtt + '" default></video>' +
      '<div class="vcap" aria-hidden="true"><span hidden></span></div>' +
      '<button type="button" class="vbig" aria-label="' + esc(U.play) + '">' + ic('play') + '</button>' +
      '</div><div class="vbar">' +
      (o.inline ? '<button type="button" class="rbtn sm v-pp" aria-label="' + esc(U.play) + '">' + ic('play') + '</button><button type="button" class="rbtn sm v-b10" aria-label="' + esc(U.replay10) + '">' + ic('back10') + '</button><button type="button" class="rbtn sm v-cc" aria-label="' + esc(U.cc) + '">' + ic('cc') + '</button>' : '') +
      '<div class="vseek" role="slider" tabindex="0" aria-label="موضع التشغيل" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="tr"></div><div class="mx"></div><div class="cu"></div><div class="kn"></div></div>' +
      '<span class="vtime">0:00 / 0:00</span>' +
      ((!vs.done && !review) ? '<span class="vnote">' + ic('lock') + esc(U.watchFirst) + '</span>' : '') +
      '</div></div>' +
      '<aside class="vtx card" hidden aria-label="' + esc(U.transcriptTitle) + '"><h4>' + ic('text') + esc(U.transcriptTitle) + '</h4><ol>' +
      V.cues.map(function (c, i) { return '<li data-i="' + i + '"><time>' + fmtT(c[0]) + '</time>' + esc(c[2]) + '</li>'; }).join('') +
      '</ol></aside></div>');
    var v = $('video', root), cap = $('.vcap span', root), big = $('.vbig', root), seek = $('.vseek', root);
    var tx = $('.vtx', root), lis = $$('li', tx), timeEl = $('.vtime', root);
    var free = function () { return review || vs.done; };
    var marks = {}, started = false, lastCue = -1, completedNow = false;
    v.muted = !!prefs.mute;
    function trackHidden() { try { for (var i = 0; i < v.textTracks.length; i++) v.textTracks[i].mode = 'hidden'; } catch (err) { /* ignore */ } }
    v.addEventListener('loadedmetadata', function () { trackHidden(); upd(); });
    v.addEventListener('loadeddata', trackHidden);
    v.addEventListener('play', trackHidden);
    try { v.textTracks.addEventListener('change', function () { for (var i = 0; i < v.textTracks.length; i++) if (v.textTracks[i].mode === 'showing') v.textTracks[i].mode = 'hidden'; }); v.textTracks.addEventListener('addtrack', trackHidden); } catch (err) { /* ignore */ }
    trackHidden();
    function setCC(on) {
      prefs.cc = on; savePrefs(); cap.hidden = !on || !cap.textContent;
      $$('.v-cc', root).forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      if (o.onCC) o.onCC(on);
    }
    function upd() {
      var d = v.duration || 0, t = v.currentTime || 0;
      var mx = free() ? d : Math.max(vs.max, t);
      $('.cu', seek).style.width = d ? (100 * t / d) + '%' : '0';
      $('.kn', seek).style.right = d ? (100 * t / d) + '%' : '0';
      $('.mx', seek).style.width = d ? (100 * Math.min(mx, d) / d) + '%' : '0';
      seek.setAttribute('aria-valuenow', d ? Math.round(100 * t / d) : 0);
      timeEl.textContent = fmtT(t) + ' / ' + fmtT(d);
      // captions + transcript highlight
      var ci = -1;
      for (var i = 0; i < V.cues.length; i++) if (t >= V.cues[i][0] && t <= V.cues[i][1] + 0.25) { ci = i; break; }
      if (ci !== lastCue) {
        lastCue = ci;
        cap.textContent = ci >= 0 ? V.cues[ci][2] : '';
        cap.hidden = !prefs.cc || ci < 0;
        lis.forEach(function (li, k) { li.classList.toggle('now', k === ci); });
        if (ci >= 0 && !tx.hidden) { var li = lis[ci]; li.parentNode.scrollTop = li.offsetTop - li.parentNode.offsetTop - 40; }
      }
      var playing = !v.paused && !v.ended;
      big.hidden = playing || (o.hideBigOnEnd && v.ended);
      $$('.v-pp', root).forEach(function (b) { b.innerHTML = ic(playing ? 'pause' : 'play'); });
      updPlay();
    }
    v.addEventListener('timeupdate', function () {
      var t = v.currentTime, d = v.duration || 0;
      if (!review && !vs.done) {
        if (t > vs.max && t - vs.max < 1.5 * Math.max(1, v.playbackRate || 1)) vs.max = t;
        [25, 50, 75].forEach(function (p) {
          if (!marks[p] && d && vs.max / d * 100 >= p) { marks[p] = 1; T.track('video_progress', { value: p, duration_sec: Math.round(vs.max) }); }
        });
        if (d && vs.max / d > 0.95) complete();
      }
      upd();
    });
    v.addEventListener('seeking', function () {
      if (!free() && v.currentTime > vs.max + 0.6) { v.currentTime = vs.max; }
    });
    v.addEventListener('play', function () {
      if (!started) { started = true; if (!review) T.track('video_start', { duration_sec: Math.round(v.duration || 0) }); }
      upd();
    });
    v.addEventListener('pause', upd);
    v.addEventListener('ended', function () { if (!review) complete(); upd(); if (o.onEnded) o.onEnded(); });
    function complete() {
      if (vs.done) return;
      vs.done = true; completedNow = true; vs.max = v.duration || vs.max;
      T.track('video_complete', { duration_sec: Math.round(v.duration || 0) });
      var n = $('.vnote', root); if (n) n.remove();
      save();
      if (o.onComplete) o.onComplete();
    }
    function toggle() {
      if (v.paused || v.ended) { var p = v.play(); if (p && p.catch) p.catch(function () { upd(); }); } else v.pause();
    }
    function back10() { v.currentTime = Math.max(0, v.currentTime - 10); }
    function seekTo(t) {
      var d = v.duration || 0; if (!d) return;
      if (!free()) t = Math.min(t, vs.max);
      v.currentTime = Math.max(0, Math.min(d - 0.05, t));
    }
    big.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    seek.addEventListener('click', function (e) {
      var r = seek.getBoundingClientRect();
      seekTo((r.right - e.clientX) / r.width * (v.duration || 0));
    });
    seek.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { seekTo(v.currentTime + 5); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { seekTo(v.currentTime - 5); e.preventDefault(); }
      else if (e.key === ' ' || e.key === 'Enter') { toggle(); e.preventDefault(); }
    });
    tx.addEventListener('click', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      var c = V.cues[+li.getAttribute('data-i')]; if (free() || c[0] <= vs.max) seekTo(c[0]);
    });
    $$('.v-pp', root).forEach(function (b) { b.addEventListener('click', toggle); });
    $$('.v-b10', root).forEach(function (b) { b.addEventListener('click', back10); });
    $$('.v-cc', root).forEach(function (b) { b.addEventListener('click', function () { setCC(!prefs.cc); }); });
    setCC(prefs.cc);
    var api = {
      el: root, video: v, toggle: toggle, back10: back10, setCC: setCC,
      playing: function () { return !v.paused && !v.ended; },
      setTx: function (on) { tx.hidden = !on; lastCue = -2; upd(); },
      txOn: function () { return !tx.hidden; },
      autoplay: function () { var p = v.play(); if (p && p.catch) p.catch(function () { upd(); }); },
      mute: function (m) { v.muted = m; },
      destroy: function () { try { v.pause(); v.removeAttribute('src'); } catch (err) { /* ignore */ } }
    };
    return api;
  }

  function openReviewVideo(onClose) {
    var p = makePlayer('explainer', { review: true, inline: true, cls: 'rev' });
    N.stop();
    var prevCtl = ctl;
    ctl = { toggle: p.toggle, replay: p.back10, playing: p.playing, mute: p.mute };
    overlay({
      head: 'navy', icon: 'play', title: M.steps[idx('3.4')].title, cls: 'video', dismissable: true, body: p.el,
      buttons: [{ label: U.close, cls: 'btn-gold', onClick: function () { openOv.close(); } }],
      onClose: function () { p.destroy(); ctl = prevCtl; updPlay(); if (onClose) onClose(); }
    });
    T.track('click', { item: 'review_explainer' });
    setTimeout(p.autoplay, 120);
  }

  /* ================= chrome & navigation ================= */
  var cur = null;

  function buildProgress() {
    D.track.querySelectorAll('.prog-div').forEach(function (n) { n.remove(); });
    M.partEnds.forEach(function (s) {
      var d = document.createElement('i'); d.className = 'prog-div';
      d.style.right = (100 * s / NSTEPS) + '%'; D.track.appendChild(d);
    });
  }
  function pct(i) { return Math.round(100 * (i + 1) / NSTEPS); }

  function setNext(on) {
    if (!cur) return;
    var last = cur.i === NSTEPS - 1;
    D.next.hidden = last;
    D.next.setAttribute('aria-disabled', on ? 'false' : 'true');
    if (on && !cur.nextOn) { D.next.classList.remove('ready'); void D.next.offsetWidth; D.next.classList.add('ready'); }
    cur.nextOn = on;
  }

  function go(i, opts) {
    opts = opts || {};
    if (i < 0 || i >= NSTEPS) return;
    if (cur) {
      cur.ctx.dispose();
    }
    closeOverlay(true);
    N.stop(); ctl = null;
    S.step = i; if (i > S.maxStep) S.maxStep = i;
    var def = M.steps[i];
    T.ctx.screen_id = def.id; T.ctx.progress_pct = pct(i);
    D.label.textContent = def.label;
    D.badge.innerHTML = ic(def.icon);
    D.title.textContent = def.title;
    D.fill.style.width = pct(i) + '%';
    D.plabel.textContent = U.progress + ' ' + pct(i) + '%';
    D.track.setAttribute('aria-valuenow', pct(i));
    D.prev.disabled = i === 0;
    D.extra.innerHTML = '';
    var ctx = makeCtx(def, i);
    cur = { i: i, def: def, ctx: ctx, nextOn: !!S.done[def.id] };
    D.host.innerHTML = '';
    D.host.appendChild(ctx.root);
    D.next.classList.remove('ready');
    D.next.hidden = i === NSTEPS - 1;
    D.next.setAttribute('aria-disabled', cur.nextOn ? 'false' : 'true');
    R[def.type](def, ctx);
    save();
    T.track('screen_view', { screen_id: def.id });
    T.post('progress', { step: i + 1, percent: pct(i), screen: def.id });
    updPlay();
    if (!opts.noFocus) setTimeout(function () { D.title.focus({ preventScroll: true }); }, 30);
    if (mobileMQ.matches) window.scrollTo(0, 0);
  }

  function makeCtx(def, i) {
    var timers = [], cleanups = [];
    var root = el('<section class="screen" aria-labelledby="title"></section>');
    var ctx = {
      def: def, i: i, id: def.id, root: root,
      get done() { return !!S.done[def.id]; },
      data: S.data[def.id] || (S.data[def.id] = {}),
      later: function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; },
      onDispose: function (fn) { cleanups.push(fn); },
      dispose: function () { timers.forEach(clearTimeout); cleanups.forEach(function (f) { try { f(); } catch (err) { /* ignore */ } }); },
      complete: function (silent) {
        var was = !!S.done[def.id];
        S.done[def.id] = true; save(); setNext(true);
        if (!was && !silent) { sfx('success'); }
        return !was;
      },
      setNext: setNext,
      track: function (ev, p) { p = p || {}; if (p.screen_id == null) p.screen_id = def.id; return T.track(ev, p); },
      narrate: function (stateId, lines, cb) { N.play(stateId, lines, cb); },
      setTitle: function (t) { D.title.textContent = t; },
      toast: function (slot, kind, text, ms) {
        slot.innerHTML = '';
        var t = el('<div class="toast ' + kind + '" role="status">' + ic(kind === 'ok' ? 'check' : 'x') + '<span>' + esc(text) + '</span></div>');
        slot.appendChild(t); announce(text);
        clearTimeout(slot._t);
        slot._t = setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 3000);
        timers.push(slot._t);
      },
      save: save
    };
    return ctx;
  }

  function goNext() { if (cur && cur.nextOn && cur.i < NSTEPS - 1) go(cur.i + 1); }

  /* ================= knowledge check (lesson 1.1) ================= */
  function knowledgeCheck(ctx, kc, done) {
    var attempt = 1;
    function ask() {
      var opts = shuffle(kc.options);
      var body = el('<div><div class="bubbles" style="display:flex;flex-direction:column;gap:8px"></div>' +
        (kc.sub ? '<p class="q-text" style="margin-top:6px">' + esc(kc.sub) + '</p>' : '') +
        '<div class="opts" role="radiogroup" aria-label="' + esc(kc.heading) + '" style="margin-top:6px"></div></div>');
      $('.bubbles', body).innerHTML = bubble(kc.askerLabel, kc.q);
      var box = $('.opts', body);
      opts.forEach(function (op, k) {
        var b = el('<button type="button" class="opt" role="radio" aria-checked="false"><span class="letter">' + LETTERS[k] + '</span><span>' + esc(op.t) + '</span></button>');
        b.addEventListener('click', function () {
          $$('.opt', box).forEach(function (x) { x.disabled = true; });
          b.setAttribute('aria-checked', 'true');
          ctx.track('kc_answer', { item: op.t, attempt: attempt });
          setTimeout(function () { feedback(op, opts, k); }, 350);
        });
        box.appendChild(b);
      });
      overlay({ head: 'navy', icon: 'chat', title: kc.heading, body: body, focus: '.opt' });
      ctx.narrate(kc.stateId, kc.vo);
    }
    function feedback(op, opts) {
      var ok = !!op.correct;
      ctx.track('kc_result', { item: op.t, correct: ok, attempt: attempt });
      sfx(ok ? 'success' : 'wrong');
      var right = kc.options.filter(function (x) { return x.correct; })[0];
      var stateId = kc.stateId.replace(/\.(\d+)$/, function (m, d) { return '.' + (+d + 1); });
      var body, buttons;
      if (ok) {
        body = bubble(kc.right.who, kc.right.reaction) + reasonHtml(kc.right.reason);
        buttons = [{ label: U.cont, onClick: finish }];
        ctx.narrate(stateId, { who: kc.right.who, t: kc.right.reaction });
      } else {
        var w = kc.wrong[op.id] || {};
        if (attempt === 1) {
          body = bubble(w.who, w.reaction) + reasonHtml(w.reason);
          buttons = [{ label: U.tryAgain, onClick: function () { attempt++; ask(); } }];
        } else {
          body = bubble(w.who, w.reaction) + '<p class="answer-line">' + esc(U.correctAnswer + right.t) + '</p>' + reasonHtml(kc.right.reason);
          buttons = [{ label: U.cont, onClick: finish }];
        }
      }
      overlay({ head: ok ? 'green' : 'red', title: ok ? U.correctTitle : U.wrongTitle, body: body, buttons: buttons });
    }
    function finish() { closeOverlay(); N.stop(); ctx.data.kc = true; ctx.complete(true); done && done(); }
    ask();
  }

  /* ================= renderers ================= */
  var R = {};

  /* ----- video ----- */
  R.video = function (def, ctx) {
    var key = def.video, vs = S.video[key], V = M.videos[key];
    var p = makePlayer(key, {
      onCC: function (on) { if (ccBtn) ccBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); },
      onComplete: function () {
        ctx.complete(true);
        if (def.doneTitle) ctx.setTitle(def.doneTitle);
        announce(def.doneTitle || U.next);
      },
      onEnded: function () { if (V.cta) showCta(); },
      hideBigOnEnd: !!V.cta
    });
    p.el.style.flex = '1'; p.el.style.minHeight = '0';
    ctx.root.appendChild(p.el);
    if (vs.done && def.doneTitle) ctx.setTitle(def.doneTitle);
    ctl = { toggle: p.toggle, replay: p.back10, playing: p.playing, mute: p.mute };
    D.replay.setAttribute('aria-label', U.replay10);
    var ccBtn = el('<button type="button" class="rbtn" aria-label="' + esc(U.cc) + '" aria-pressed="' + (prefs.cc ? 'true' : 'false') + '">' + ic('cc') + '</button>');
    var txBtn = el('<button type="button" class="rbtn" aria-label="' + esc(U.transcript) + '" aria-pressed="false" title="' + esc(U.transcript) + '">' + ic('text') + '</button>');
    ccBtn.addEventListener('click', function () { p.setCC(!prefs.cc); });
    txBtn.addEventListener('click', function () { var on = !p.txOn(); p.setTx(on); txBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    D.extra.appendChild(txBtn); D.extra.appendChild(ccBtn);
    function showCta() {
      if ($('.vcta', ctx.root)) return;
      var c = el('<div class="vcta"><p>' + esc(V.cues[V.cues.length - 1][2]) + '</p><button type="button" class="btn btn-gold pulse">' + esc(V.cta) + ic('arrowL') + '</button></div>');
      $('button', c).addEventListener('click', function () { ctx.track('click', { item: V.cta }); go(ctx.i + 1); });
      $('.vwrap', ctx.root).appendChild(c);
      $('button', c).focus({ preventScroll: true });
    }
    ctx.onDispose(function () { p.destroy(); D.replay.setAttribute('aria-label', U.replay); });
    if (!vs.done) ctx.later(p.autoplay, 350);
  };

  /* ----- 3.3.1 chat ----- */
  R.chat = function (def, ctx) {
    var c = SC['3.3.1'];
    ctx.root.classList.add('s-chat');
    ctx.root.innerHTML =
      '<div class="intro"><div class="kicker">' + esc(c.kicker) + '</div><h3>' + esc(c.title) + '</h3>' +
      '<div class="st-grid">' + c.stations.map(function (s) { return '<div class="st-chip">' + ic(s.icon) + '<span>' + esc(s.t) + '</span></div>'; }).join('') + '</div>' +
      '<div class="cta-slot"><span class="cta-ph">' + esc(c.btnHint) + '</span></div></div>' +
      '<div class="phone" aria-label="' + esc(U.phoneHeader) + '"><div class="phone-screen"><div class="phone-head">' + ic('chat') + '<span>' + esc(U.phoneHeader) + '</span></div>' +
      '<div class="phone-body" aria-live="polite"></div></div></div>';
    var body = $('.phone-body', ctx.root), slot = $('.cta-slot', ctx.root);
    function add(m, silent) {
      var t = $('.typing', body); if (t) t.remove();
      body.insertAdjacentHTML('beforeend', bubble(m.who === 'ib' ? 'ibrahim' : 'customer', m.t));
      body.scrollTop = body.scrollHeight;
      if (!silent) sfx('notify');
    }
    function typing() { body.insertAdjacentHTML('beforeend', '<div class="typing" aria-label="' + esc(U.typing) + '"><span>' + esc(U.typing) + '</span><i></i><i></i><i></i></div>'); body.scrollTop = body.scrollHeight; }
    function showBtn(pulse) {
      slot.innerHTML = '<button type="button" class="btn btn-navy' + (pulse ? ' pulse' : '') + '">' + esc(c.btn) + ic('arrowL') + '</button>';
      $('button', slot).addEventListener('click', function () {
        ctx.track('click', { item: 'help_ibrahim' });
        ctx.complete(true); go(ctx.i + 1);
      });
    }
    if (ctx.done || ctx.data.seen) {
      c.msgs1.concat(c.msgs2).forEach(function (m) { add(m, true); });
      showBtn(!ctx.done);
      return;
    }
    var v1done = false, s1 = false;
    ctx.narrate('3.3.1.1', c.vo1, function () { v1done = true; if (s1) state2(); });
    ctx.later(function () { add(c.msgs1[0]); }, 500);
    ctx.later(function () { add(c.msgs1[1]); }, 1900);
    ctx.later(function () { typing(); }, 2900);
    ctx.later(function () { s1 = true; if (v1done) state2(); }, 3800);
    function state2() {
      ctx.later(function () { add(c.msgs2[0]); }, 500);
      ctx.later(function () { typing(); }, 1200);
      ctx.later(function () {
        add(c.msgs2[1]); ctx.data.seen = true; save();
        ctx.narrate('3.3.1.2', c.vo2);
        showBtn(true);
      }, 2300);
    }
  };

  /* ----- 3.3.2 hotspots ----- */
  R.hotspots = function (def, ctx) {
    var c = SC['3.3.2'], d = ctx.data; d.visited = d.visited || {};
    ctx.root.classList.add('s-hot');
    var pos = { p1: 'top:66%;left:80%', p2: 'top:82%;left:24%', p3: 'top:33%;left:50%' };
    ctx.root.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:6px"><p class="instr">' + esc(c.instr) + '</p>' +
      '<div class="hot-art"><div class="halo"></div><div class="hot-bottle">' +
      '<svg viewBox="0 0 280 330" aria-hidden="true"><circle cx="140" cy="52" r="46" fill="#2B2E4A"/><rect x="110" y="92" width="60" height="34" rx="9" fill="#2B2E4A"/>' +
      '<path d="M140 118C52 118 16 168 16 226c0 60 52 94 124 94s124-34 124-94c0-58-36-108-124-108z" fill="#2B2E4A"/>' +
      '<path d="M26 200c60 22 168 22 228 0M20 240c66 24 174 24 240 0" stroke="#fff" stroke-opacity=".16" stroke-width="10" fill="none"/>' +
      '<ellipse cx="96" cy="42" rx="14" ry="9" fill="#fff" fill-opacity=".14"/><path d="M48 262c10 22 34 36 62 42" stroke="#E7BF67" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/></svg>' +
      c.spots.map(function (s) { return '<button type="button" class="hs" data-id="' + s.id + '" style="' + pos[s.id] + '" aria-label="' + esc('النقطة ' + s.n + ': ' + s.title) + '" aria-pressed="false">' + s.n + '</button>'; }).join('') +
      '</div>' +
      '</div></div>' +
      '<div class="hot-panel"><div class="hot-slot"></div><div class="counter" aria-live="polite"></div></div>';
    var slot = $('.hot-slot', ctx.root), counter = $('.counter', ctx.root);
    function n() { return Object.keys(d.visited).length; }
    function paint(openId) {
      $$('.hs', ctx.root).forEach(function (b) {
        var id = b.getAttribute('data-id');
        b.classList.toggle('visited', !!d.visited[id]);
        b.classList.toggle('open', id === openId);
        b.setAttribute('aria-pressed', id === openId ? 'true' : 'false');
      });
      counter.textContent = fmt(c.counter, n());
    }
    function card(s) {
      slot.innerHTML = '<div class="card hot-card" role="region" aria-label="' + esc(s.title) + '"><h3>' + ic(s.icon) + esc(s.n + ' · ' + s.title) + '</h3><p>' + esc(s.body) + '</p>' +
        '<div class="tags">' + s.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div></div>';
    }
    slot.innerHTML = '<div class="card hot-card empty">' + ic('hand') + '<p>' + esc(c.hint) + '</p></div>';
    paint(null);
    ctx.root.addEventListener('click', function (e) {
      var b = e.target.closest('.hs'); if (!b) return;
      var s = c.spots.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
      var first = !d.visited[s.id];
      d.visited[s.id] = true; sfx('click');
      card(s); paint(s.id); save();
      ctx.track('hotspot_open', { item: s.item });
      announce(s.title + '. ' + s.body + ' ' + fmt(c.counter, n()));
      if (first && n() === 3 && !ctx.done) {
        ctx.complete(); ctx.track('screen_complete');
      }
    });
    if (ctx.done) { card(c.spots[0]); paint(c.spots[0].id); }
    else ctx.narrate('3.3.2.1', c.vo);
  };

  /* ----- flip cards (3.3.3 / 3.3.4) ----- */
  R.flip = function (def, ctx) {
    var c = SC[def.id], d = ctx.data; d.seen = d.seen || {}; d.open = d.open || {};
    var three = c.cards.length === 3;
    ctx.root.classList.add('s-flip');
    ctx.root.innerHTML = '<p class="instr">' + esc(c.instr) + '</p><div class="flip-row"></div><div class="counter" aria-live="polite"></div>';
    var row = $('.flip-row', ctx.root), counter = $('.counter', ctx.root);
    c.cards.forEach(function (k) {
      var b = el('<button type="button" class="flip' + (three ? ' three' : '') + '" data-id="' + k.id + '" aria-pressed="false">' +
        '<span class="flip-in"><span class="face front"><span class="disc">' + ic(k.icon) + '</span><h3>' + esc(k.title) + '</h3><span class="hint">' + ic('sync') + esc(U.flipHint) + '</span></span>' +
        '<span class="face back"><h3>' + ic(k.icon) + esc(k.title) + '</h3><p>' + esc(k.back) + '</p><span class="read">' + esc(U.read) + '</span></span></span></button>');
      b.style.height = (three ? 270 : 290) + 'px';
      row.appendChild(b);
    });
    function n() { return Object.keys(d.seen).length; }
    function paint() {
      $$('.flip', row).forEach(function (b) {
        var id = b.getAttribute('data-id'), k = c.cards.filter(function (x) { return x.id === id; })[0];
        var on = !!d.open[id];
        b.classList.toggle('flipped', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.setAttribute('aria-label', k.title + (on ? ': ' + k.back : ' · ' + U.flipHint));
        $('.read', b).hidden = !d.seen[id];
      });
      counter.textContent = fmt(c.counter, n());
    }
    var kcTimer = null;
    function maybeKc() {
      if (ctx.done || n() < c.cards.length || kcTimer) return;
      kcTimer = ctx.later(function () { knowledgeCheck(ctx, c.kc); }, 2000);
    }
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.flip'); if (!b) return;
      var id = b.getAttribute('data-id'), k = c.cards.filter(function (x) { return x.id === id; })[0];
      d.open[id] = !d.open[id];
      sfx('flip');
      if (d.open[id] && !d.seen[id]) { d.seen[id] = true; ctx.track('card_flip', { item: k.item }); }
      paint(); save();
      if (d.open[id]) announce(k.title + ': ' + k.back);
      maybeKc();
    });
    if (ctx.done) c.cards.forEach(function (k) { d.open[k.id] = true; d.seen[k.id] = true; });
    paint();
    if (!ctx.done) { ctx.narrate(def.id + '.1', c.vo); maybeKc(); }
  };

  /* ----- 3.3.5 stations ----- */
  R.stations = function (def, ctx) {
    var c = SC['3.3.5'], d = ctx.data; d.reached = d.reached || 1; d.cur = d.cur || 1;
    if (ctx.done) d.reached = 5;
    ctx.root.classList.add('s-st');
    ctx.root.innerHTML = '<p class="instr">' + esc(c.instr) + '</p>' +
      '<div class="st-track" role="list"><div class="st-line"><i></i></div>' +
      c.stations.map(function (s) { return '<button type="button" class="st-node" role="listitem" data-n="' + s.n + '"><span class="dot">' + ic(s.icon) + '</span><span>' + esc(s.n + ' · ' + s.t) + '</span></button>'; }).join('') +
      '</div><div class="st-wrap" style="flex:1;display:flex;min-height:0"></div>';
    var wrap = $('.st-wrap', ctx.root);
    function paint() {
      $('.st-line i', ctx.root).style.width = (100 * (d.reached - 1) / 4) + '%';
      $$('.st-node', ctx.root).forEach(function (b) {
        var n = +b.getAttribute('data-n');
        b.className = 'st-node' + (n === d.cur ? ' cur' : n <= d.reached ? ' done' : n === d.reached + 1 ? ' avail' : '');
        var tk = $('.tick', b); if (tk) tk.remove();
        if (n <= d.reached && n !== d.cur) b.insertAdjacentHTML('beforeend', '<span class="tick">' + ic('check') + '</span>');
        b.disabled = n > d.reached + 1;
        b.setAttribute('aria-current', n === d.cur ? 'step' : 'false');
        b.setAttribute('aria-label', c.stations[n - 1].t + (n <= d.reached && n !== d.cur ? ' ✓' : ''));
      });
      var s = c.stations[d.cur - 1];
      var h = '<div class="card st-panel" aria-live="polite"><h3><span class="num">' + s.n + '</span>' + esc(s.t) + '</h3><p class="body">' + esc(s.body) + '</p>';
      if (s.methods) {
        h += '<div class="st-methods">' + s.methods.map(function (m) { return '<div class="st-method"><b>' + ic(m.icon) + esc(m.t) + '</b><span>' + esc(m.d) + '</span></div>'; }).join('') + '</div>';
        h += '<div class="st-note">' + ic('chat') + '<p><b>' + esc(c.sayLabel) + ':</b> ' + esc(s.say) + '</p></div>';
      }
      if (s.note) h += '<div class="st-note">' + ic('bulb') + '<p>' + esc(s.note) + '</p></div>';
      h += '<div class="st-foot">';
      if (d.cur < 5) h += '<button type="button" class="btn btn-navy st-next">' + esc(c.nextBtn) + ic('arrowL') + '</button>';
      else if (d.reached === 5) h += '<span class="st-done">' + ic('check') + esc(c.doneLine) + '</span>';
      h += '</div></div>';
      wrap.innerHTML = h;
      var nb = $('.st-next', wrap); if (nb) nb.addEventListener('click', function () { open(d.cur + 1); });
    }
    function open(n, initial) {
      if (n > d.reached + 1 || n < 1 || n > 5) return;
      var isNew = n > d.reached || (initial && !d.logged1);
      if (n > d.reached) d.reached = n;
      d.cur = n; paint(); save();
      var s = c.stations[n - 1];
      if (isNew) {
        if (n === 1) d.logged1 = true;
        ctx.track('step_open', { item: 'المحطة ' + n });
        ctx.narrate('3.3.5.' + n, s.vo);
        if (n === 5 && !ctx.done) { ctx.complete(); ctx.track('screen_complete'); paint(); }
      } else if (!initial) sfx('click');
    }
    ctx.root.addEventListener('click', function (e) {
      var b = e.target.closest('.st-node'); if (!b || b.disabled) return; open(+b.getAttribute('data-n'));
    });
    if (ctx.done) paint(); else open(d.cur, true);
  };

  /* ----- 3.3.6 compose ----- */
  R.compose = function (def, ctx) {
    var c = SC['3.3.6'], d = ctx.data; d.picks = d.picks || {}; d.attempt = d.attempt || 1;
    ctx.root.classList.add('s-comp');
    ctx.root.innerHTML = '<div class="comp-main">' + bubble('ibrahim', c.msg) + '<div class="lines" style="display:flex;flex-direction:column;gap:10px"></div>' +
      '<div><button type="button" class="btn btn-navy send">' + esc(c.send) + ic('send') + '</button></div></div>' +
      '<aside class="card sum-card dim" aria-label="' + esc(c.summaryTitle) + '"><h4>' + ic('star') + esc(c.summaryTitle) + '</h4><ul>' + c.summary.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></aside>';
    var lines = $('.lines', ctx.root), send = $('.send', ctx.root), sum = $('.sum-card', ctx.root);
    var orders = {};
    function renderLines(reshuffle) {
      lines.innerHTML = '';
      c.lines.forEach(function (ln) {
        if (reshuffle || !orders[ln.id]) orders[ln.id] = shuffle(ln.options);
        var st = d.state && d.state[ln.id];
        var box = el('<div class="comp-line' + (st ? ' ' + st : '') + '"><span class="lead">' + esc(ln.lead) + '</span><div class="choice-row" role="radiogroup" aria-label="' + esc(ln.lead) + '"></div></div>');
        orders[ln.id].forEach(function (op) {
          var on = d.picks[ln.id] === op.id;
          var b = el('<button type="button" class="choice" role="radio" aria-checked="' + on + '">' + ic('check') + esc(op.t) + '</button>');
          if (ctx.done) b.disabled = true;
          b.addEventListener('click', function () {
            d.picks[ln.id] = op.id; if (d.state) delete d.state[ln.id];
            save(); renderLines(false); updSend();
          });
          $('.choice-row', box).appendChild(b);
        });
        lines.appendChild(box);
      });
    }
    function updSend() {
      var ok = !ctx.done && c.lines.every(function (ln) { return d.picks[ln.id]; });
      send.setAttribute('aria-disabled', ok ? 'false' : 'true');
      send.hidden = ctx.done;
    }
    function optOf(ln) { return ln.options.filter(function (o) { return o.id === d.picks[ln.id]; })[0]; }
    function success() {
      sum.classList.remove('dim'); sum.classList.add('lit');
      sfx('success');
      overlay({
        head: 'green', icon: 'star', title: c.okHeading,
        body: bubble('customer', c.okCustomer) + bubble('ibrahim', c.okIbrahim) +
          '<div class="reason">' + ic('star') + '<div><b>' + esc(c.summaryTitle) + '</b><p>' + c.summary.map(esc).join(' · ') + '</p></div></div>',
        buttons: [{ label: c.finish, icon: 'arrowL', onClick: function () {
          closeOverlay(true); N.stop();
          if (!S.lessonDone) { S.lessonDone = true; ctx.track('lesson_complete', { item: '1.1' }); }
          ctx.complete(true); go(ctx.i + 1);
        } }]
      });
      ctx.narrate('3.3.6.3', c.okVo);
    }
    send.addEventListener('click', function () {
      if (send.getAttribute('aria-disabled') === 'true') return;
      var picks = c.lines.map(function (ln) { return optOf(ln); });
      var item = picks.map(function (o) { return o.t; }).join(' | ');
      ctx.track('reply_submit', { item: item, attempt: d.attempt });
      var wrong = c.lines.filter(function (ln) { return !optOf(ln).correct; });
      if (!wrong.length) {
        ctx.track('reply_result', { item: item, correct: true, attempt: d.attempt });
        d.state = { l1: 'good', l2: 'good' }; save(); renderLines(false);
        success(); return;
      }
      ctx.track('reply_result', { item: item, correct: false, attempt: d.attempt });
      sfx('wrong');
      d.state = {}; c.lines.forEach(function (ln) { d.state[ln.id] = optOf(ln).correct ? 'good' : 'bad'; });
      var body = bubble('customer', wrong[0].wrongReaction) + wrong.map(function (ln) { return reasonHtml(ln.hint); }).join('');
      if (d.attempt >= 2) {
        body = bubble('customer', wrong[0].wrongReaction) + '<p class="answer-line">' + esc(c.answerLine) + '</p>' + wrong.map(function (ln) { return reasonHtml(ln.hint); }).join('');
        overlay({ head: 'red', title: c.badHeading, body: body, buttons: [{ label: U.cont, onClick: function () {
          c.lines.forEach(function (ln) { d.picks[ln.id] = ln.options.filter(function (o) { return o.correct; })[0].id; d.state[ln.id] = 'good'; });
          save(); renderLines(false); updSend(); success();
        } }] });
      } else {
        overlay({ head: 'red', title: c.badHeading, body: body, buttons: [{ label: U.tryAgain, onClick: function () {
          d.attempt++;
          wrong.forEach(function (ln) { delete d.picks[ln.id]; });
          save(); closeOverlay(); renderLines(true); updSend();
        } }] });
      }
      save();
    });
    if (ctx.done) { sum.classList.remove('dim'); sum.classList.add('lit'); }
    renderLines(true); updSend();
    if (!ctx.done) ctx.narrate('3.3.6.1', c.vo);
  };

  /* ----- pyramid helpers ----- */
  function pyramidHtml(fill) {
    return '<div class="pyr">' + SC.layers.map(function (l) {
      return '<div class="zone ' + l.id + (fill ? ' filled' : '') + '" data-zone="' + l.id + '" aria-label="' + esc(l.t) + '"><span class="zl">' + esc(l.t) + '</span><div class="zitems"></div></div>';
    }).join('') + '</div>';
  }
  function chipHtml(t, cls) { return '<span class="chip ' + (cls || '') + '">' + ic('check') + esc(t) + '</span>'; }

  /* ----- 3.5.1 D&D intro ----- */
  R.dndIntro = function (def, ctx) {
    var c = SC['3.5.1'];
    ctx.root.innerHTML = '<div class="cols"><div style="display:flex;flex-direction:column;gap:14px;justify-content:center">' +
      '<h3 style="font-size:30px">' + esc(c.heading) + '</h3>' +
      '<div class="phone" style="height:auto"><div class="phone-screen"><div class="phone-head">' + ic('chat') + '<span>' + esc(U.phoneHeader) + '</span></div><div class="phone-body">' + bubble('ibrahim', c.msg) + '</div></div></div>' +
      '<p class="instr">' + esc(c.instr) + '</p><div><button type="button" class="btn btn-navy start">' + esc(c.btn) + ic('arrowL') + '</button></div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">' + pyramidHtml(false) +
      '<div class="row" style="gap:10px;color:var(--navy)"><span style="font-size:56px">' + ic('bottle') + '</span><b>' + esc(c.bottle) + '</b></div></div></div>';
    $('.start', ctx.root).addEventListener('click', function () { ctx.track('click', { item: c.btn }); ctx.complete(true); go(ctx.i + 1); });
    if (!ctx.done) { sfx('notify'); ctx.narrate('3.5.1', c.vo); }
  };

  /* ----- generic D&D activity (notes / times) ----- */
  function dndActivity(def, ctx, o) {
    var c = SC[def.id], d = ctx.data; d.placed = d.placed || {}; d.tries = d.tries || {}; d.auto = d.auto || {};
    var cards = c.cards, total = cards.length;
    ctx.root.classList.add('s-dnd');
    ctx.root.innerHTML = '<div class="pyr-col" style="display:flex;flex-direction:column;justify-content:center;gap:8px">' + o.board() + '</div>' +
      '<div class="bank"><div class="bank-head"><span>' + esc(c.instr) + '</span><span class="counter" aria-live="polite"></span></div>' +
      '<p class="sr-only">' + esc(U.tapCard) + '</p>' +
      '<div class="bank-grid" role="group" aria-label="' + esc(c.instr) + '"></div><div class="toast-slot" aria-live="polite"></div><div class="done-slot"></div></div>';
    var grid = $('.bank-grid', ctx.root), slot = $('.toast-slot', ctx.root), counter = $('.counter', ctx.root), doneSlot = $('.done-slot', ctx.root);
    if (o.oneCol) grid.style.gridTemplateColumns = '1fr';
    function n() { return Object.keys(d.placed).length; }
    function zoneEls() { return $$(o.zoneSel, ctx.root); }
    function zoneOf(id) { return $(o.zoneSel + '[data-zone="' + id + '"]', ctx.root); }
    function place(card, auto, isNew) {
      var z = zoneOf(card.zone);
      o.put(z, card, auto, isNew);
      var b = $('.dcard[data-id="' + card.id + '"]', grid); if (b) b.remove();
    }
    shuffle(cards).forEach(function (k) {
      if (d.placed[k.id]) return;
      grid.appendChild(el('<button type="button" class="dcard" data-id="' + k.id + '" aria-pressed="false" aria-label="' + esc(k.t) + '"><span>' + esc(k.t) + '</span>' + ic(k.icon === 'clock' ? 'clock' : 'strip') + '</button>'));
    });
    cards.forEach(function (k) { if (d.placed[k.id]) place(k, d.auto[k.id], false); });
    function upd() {
      counter.textContent = fmt(c.counter, n());
      if (n() === total) { doneSlot.innerHTML = o.doneHtml ? o.doneHtml() : ''; }
    }
    upd();
    if (n() === total) return;
    var dnd = DnD.attach({
      root: grid,
      items: function () { return $$('.dcard', grid); },
      zones: zoneEls,
      scale: function () { return scale; },
      zoneLabel: function (z) { return layerName(z.getAttribute('data-zone')); },
      announce: announce,
      pickedText: U.picked,
      onDrop: function (b, z) {
        var id = b.getAttribute('data-id'), card = cards.filter(function (x) { return x.id === id; })[0];
        var zid = z.getAttribute('data-zone');
        var attempt = (d.tries[id] || 0) + 1;
        var ok = zid === card.zone;
        ctx.track('drop', { item: card.t + '→' + layerName(zid), correct: ok, attempt: attempt });
        if (d.tries[id] == null) S.dndFirst[id] = ok;
        d.tries[id] = attempt;
        if (ok) {
          d.placed[id] = card.zone; place(card, false, true);
          sfx('correct'); ctx.toast(slot, 'ok', card.ok, 3000);
        } else if (attempt < 2) {
          z.classList.add('badflash'); ctx.later(function () { z.classList.remove('badflash'); }, 700);
          b.classList.remove('bounce'); void b.offsetWidth; b.classList.add('bounce');
          sfx('wrong'); ctx.toast(slot, 'bad', card.bad + ' ' + U.attemptOf, 3500);
        } else {
          z.classList.add('badflash'); ctx.later(function () { z.classList.remove('badflash'); }, 700);
          d.placed[id] = card.zone; d.auto[id] = true; place(card, true, true);
          sfx('wrong'); ctx.toast(slot, 'bad', card.bad, 3500);
        }
        save(); upd();
        if (n() === total) finished();
      }
    });
    ctx.onDispose(function () { dnd.destroy(); });
    function finished() {
      var first = cards.filter(function (k) { return S.dndFirst[k.id]; }).length;
      o.onDone(first);
    }
  }

  /* ----- 3.5.2 notes ----- */
  R.dndNotes = function (def, ctx) {
    var c = SC['3.5.2'];
    dndActivity(def, ctx, {
      board: function () { return pyramidHtml(false); },
      zoneSel: '.zone',
      put: function (z, card, auto, isNew) {
        z.classList.add('filled');
        $('.zitems', z).insertAdjacentHTML('beforeend', chipHtml(card.t, (isNew ? 'new' : '') + (auto ? ' auto' : '')));
      },
      doneHtml: function () { return '<div class="dnd-done">' + ic('check') + '<div><b>' + esc(c.doneTitle) + '</b><span>' + esc(c.doneNext) + '</span></div></div>'; },
      onDone: function (first) {
        ctx.track('part_complete', { item: 'النوتات', score: first });
        ctx.complete();
      }
    });
  };

  /* ----- 3.5.3 times ----- */
  R.dndTimes = function (def, ctx) {
    var c = SC['3.5.3'], notes = SC['3.5.2'].cards;
    function popup() {
      overlay({
        head: 'navy', icon: 'chat', title: c.popHeading, body: bubble('ibrahim', c.popMsg),
        buttons: [{ label: c.popBtn, icon: 'arrowL', onClick: function () { closeOverlay(true); go(ctx.i + 1); } }]
      });
      ctx.narrate('3.5.3.2', c.popVo);
    }
    dndActivity(def, ctx, {
      oneCol: true,
      board: function () {
        return '<div class="trows">' + SC.layers.map(function (l) {
          var chips = notes.filter(function (k) { return k.zone === l.id; }).map(function (k) { return '<span class="chip">' + esc(k.t) + '</span>'; }).join('');
          return '<div class="trow"><div class="zone layer filled ' + l.id + '"><span class="zl">' + esc(l.t) + '</span><div class="zitems">' + chips + '</div></div>' +
            '<div class="tslot" data-zone="' + l.id + '" aria-label="' + esc(l.t) + '">' + ic('clock') + '</div></div>';
        }).join('') + '</div>';
      },
      zoneSel: '.tslot',
      put: function (z, card, auto) {
        z.classList.add('filled'); z.setAttribute('data-locked', '');
        z.innerHTML = chipHtml(card.t, 'new' + (auto ? ' auto' : ''));
      },
      onDone: function (first) {
        if (!ctx.done) { ctx.track('part_complete', { item: 'الأوقات', score: first }); ctx.complete(); }
        ctx.later(popup, 900);
      }
    });
    if (!ctx.done) ctx.narrate('3.5.3.1', c.vo);
  };

  /* ----- score ring ----- */
  function ringHtml(n, of, caption) {
    var r = 80, C2 = 2 * Math.PI * r;
    return '<div class="ring" role="img" aria-label="' + esc(n + ' ' + U.of + ' ' + of + ' ' + caption) + '"><svg viewBox="0 0 190 190"><circle class="bg" cx="95" cy="95" r="' + r + '"/>' +
      '<circle class="fg" cx="95" cy="95" r="' + r + '" stroke-dasharray="' + C2 + '" stroke-dashoffset="' + C2 + '" data-off="' + (C2 * (1 - n / of)) + '"/></svg>' +
      '<div class="rv"><b>' + n + ' ' + esc(U.of) + ' ' + of + '</b><span>' + esc(caption) + '</span></div></div>';
  }
  function animRing(root) { setTimeout(function () { $$('.ring .fg', root).forEach(function (c) { c.style.strokeDashoffset = c.getAttribute('data-off'); }); }, 80); }

  /* ----- 3.5.4 D&D result ----- */
  R.dndResult = function (def, ctx) {
    var c = SC['3.5.4'], d = ctx.data;
    var all = SC['3.5.2'].cards.concat(SC['3.5.3'].cards);
    var score = all.filter(function (k) { return S.dndFirst[k.id]; }).length;
    var low = score < 8;
    ctx.root.classList.add('s-res');
    ctx.root.innerHTML = ringHtml(score, 11, c.scoreCaption) +
      '<div class="res-side"><div class="sum-pills">' + c.summary.map(function (s) { return '<span class="sum-pill">' + esc(s) + '</span>'; }).join('') + '</div>' +
      (low ? '<p class="warn">' + ic('bulb') + esc(c.low) + '</p>' : '') +
      '<div class="btn-row"></div></div>';
    var row = $('.btn-row', ctx.root);
    var rev = el('<button type="button" class="btn ' + (low && !d.reviewed ? 'btn-navy' : 'btn-ghost') + '">' + ic('play') + esc(c.reviewVideo) + '</button>');
    var go2 = el('<button type="button" class="btn ' + (low && !d.reviewed ? 'btn-ghost' : 'btn-navy') + '">' + esc(c.toCustomer) + ic('arrowL') + '</button>');
    if (low) { row.appendChild(rev); row.appendChild(go2); } else { row.appendChild(go2); row.appendChild(rev); }
    function updBtns() { var on = !low || d.reviewed; go2.setAttribute('aria-disabled', on ? 'false' : 'true'); if (on) ctx.complete(true); }
    rev.addEventListener('click', function () {
      openReviewVideo(function () { d.reviewed = true; save(); updBtns(); go2.className = 'btn btn-navy'; rev.className = 'btn btn-ghost'; go2.focus(); });
    });
    go2.addEventListener('click', function () { if (go2.getAttribute('aria-disabled') === 'true') return; go(ctx.i + 1); });
    if (!d.logged) { d.logged = true; ctx.track('activity_complete', { score: score }); sfx('success'); ctx.narrate('3.5.4', c.vo); T.post('score', { scores: scores() }); save(); }
    updBtns(); animRing(ctx.root);
  };

  /* ----- scenario helpers ----- */
  function scenTotal() { return S.scen.pts.reduce(function (a, b) { return a + (b || 0); }, 0); }
  function meterHtml(v) {
    return '<div class="meter" role="img" aria-label="' + esc(U.meterLabel + ' ' + v + ' ' + U.of + ' 30') + '"><div class="ml"><span>' + esc(U.meterLabel) + '</span></div><div class="mt"><div class="mf" style="width:' + (100 * v / 30) + '%"></div></div><div class="mv">' + v + ' ' + esc(U.of) + ' 30</div></div>';
  }
  function setMeter(root, v) {
    var f = $('.mf', root); if (f) f.style.width = (100 * v / 30) + '%';
    var t = $('.mv', root); if (t) t.textContent = v + ' ' + U.of + ' 30';
    var m = $('.meter', root); if (m) m.setAttribute('aria-label', U.meterLabel + ' ' + v + ' ' + U.of + ' 30');
  }
  function sideHtml(v) {
    return '<aside class="scn-side">' + meterHtml(v) + '<span class="mbottle">' + ic('bottle') + '</span><span class="mbottle-l">' + esc(SC.scenario.bottle) + '</span></aside>';
  }

  /* ----- 3.6.1 ----- */
  R.scenIntro = function (def, ctx) {
    var c = SC['3.6.1'];
    if (!ctx.done && S.scen.pts.every(function (p) { return p == null; })) { /* fresh start */ }
    ctx.root.classList.add('s-scn');
    ctx.root.innerHTML = '<div class="scn-main scn-intro"><div class="msgs" style="display:flex;flex-direction:column;gap:12px"></div><div class="cta-slot" style="justify-content:flex-start"></div></div>' + sideHtml(0);
    var msgs = $('.msgs', ctx.root), slot = $('.cta-slot', ctx.root);
    function btn() {
      slot.innerHTML = '<button type="button" class="btn btn-navy' + (ctx.done ? '' : ' pulse') + '">' + esc(c.btn) + ic('arrowL') + '</button>';
      $('button', slot).addEventListener('click', function () { ctx.track('click', { item: c.btn }); ctx.complete(true); go(ctx.i + 1); });
    }
    if (ctx.done) { msgs.innerHTML = bubble('customer', c.customer) + bubble('ibrahim', c.ibrahim); btn(); return; }
    sfx('door');
    ctx.later(function () { msgs.insertAdjacentHTML('beforeend', bubble('customer', c.customer)); }, 600);
    ctx.later(function () { msgs.insertAdjacentHTML('beforeend', bubble('ibrahim', c.ibrahim)); sfx('notify'); btn(); }, 3000);
    ctx.later(function () { ctx.narrate('3.6.1', c.vo); }, 700);
  };

  /* ----- 3.6.2–3.6.4 decisions ----- */
  R.decision = function (def, ctx) {
    var k = def.decision, dc = SC.scenario.decisions[k], sc = SC.scenario;
    var before = S.scen.pts.slice(0, k).reduce(function (a, b) { return a + (b || 0); }, 0);
    var picked = S.scen.picks[k];
    ctx.root.classList.add('s-scn');
    ctx.root.innerHTML = '<div class="scn-main">' + bubble('customer', dc.customer) +
      '<div class="who">' + esc(U.ibrahim + ': ' + sc.ask) + '</div><div class="opts" role="radiogroup" aria-label="' + esc(sc.ask) + '"></div></div>' +
      sideHtml(picked ? before + S.scen.pts[k] : before);
    var box = $('.opts', ctx.root);
    var order = picked ? dc.options : shuffle(dc.options);
    order.forEach(function (op, j) {
      var on = picked === op.id;
      var b = el('<button type="button" class="opt' + (on ? ' sel' : '') + '" role="radio" aria-checked="' + on + '"><span class="letter">' + LETTERS[j] + '</span><span>' + esc(op.t) + '</span></button>');
      if (picked) b.disabled = true;
      b.addEventListener('click', function () { choose(op, b); });
      box.appendChild(b);
    });
    function choose(op, b) {
      $$('.opt', box).forEach(function (x) { x.disabled = true; });
      b.classList.add('sel'); b.setAttribute('aria-checked', 'true');
      S.scen.pts[k] = op.pts; S.scen.picks[k] = op.id; save();
      ctx.track('decision', { item: op.t, score: op.pts });
      ctx.later(function () {
        sfx(op.pts === 10 ? 'correct' : 'wrong');
        ctx.track('feedback_view', { item: dc.label });
        overlay({
          head: 'navy', icon: 'chat', title: sc.reactionTitle, pts: op.pts,
          body: bubble('customer', op.reaction) + reasonHtml(op.coach),
          buttons: [{ label: U.cont, onClick: function () { closeOverlay(true); N.stop(); ctx.complete(true); go(ctx.i + 1); } }]
        });
        ctx.narrate(def.id + '.2' + op.id, { who: 'customer', t: op.reaction });
        ctx.later(function () { setMeter(ctx.root, before + op.pts); }, 400);
      }, 380);
    }
    if (!picked) ctx.narrate(def.id + '.1', dc.vo);
  };

  /* ----- 3.6.5 endings ----- */
  R.endings = function (def, ctx) {
    var sc = SC.scenario, total = scenTotal();
    var end = sc.endings.filter(function (e) { return total >= e.min; })[0];
    var passed = total >= 24;
    S.scen.total = total; S.scen.ending = end.t; S.scen.passed = passed;
    if (S.scen.logged !== S.scen.play) {
      S.scen.logged = S.scen.play;
      ctx.track('scenario_complete', { score: total, item: end.t });
      sfx(passed ? 'success' : 'wrong');
      T.post('score', { scores: scores() });
    }
    if (passed) S.done[def.id] = true;
    save();
    ctx.root.classList.add('s-scn');
    var weak = sc.decisions.map(function (dc, k) {
      var op = dc.options.filter(function (o) { return o.id === S.scen.picks[k]; })[0];
      return op && op.pts < 10 ? { dc: dc, op: op } : null;
    }).filter(Boolean);
    var h = '<div class="scn-main"><div class="end-cards">' + sc.endings.map(function (e) {
      return '<div class="end-card' + (e === end ? ' on' : '') + (e.id === 'lost' ? ' lost' : '') + '"' + (e === end ? ' aria-current="true"' : '') + '><h4>' + ic(e.icon) + esc(e.t) + '</h4><span class="rg">' + esc(e.range) + '</span><p>' + esc(e.body) + '</p></div>';
    }).join('') + '</div>';
    if (end.id === 'win') h += bubble('ibrahim', end.ib);
    if (!passed) {
      h += '<div class="weak"><h5>' + esc(sc.weakTitle) + '</h5>' + weak.map(function (w) { return '<div class="weak-item">' + ic('bulb') + '<span><b>' + esc(w.dc.label) + ':</b> ' + esc(w.op.coach) + '</span></div>'; }).join('') + '</div>';
      h += '<p class="warn">' + ic('lock') + esc(end.hint || sc.mustReplay) + '</p>';
    }
    h += '<div class="btn-row"><button type="button" class="btn ' + (passed ? 'btn-navy' : 'btn-ghost') + ' toq">' + esc(sc.toQuiz) + ic('arrowL') + '</button>' +
      '<button type="button" class="btn ' + (passed ? 'btn-ghost' : 'btn-navy') + ' rep">' + ic('replay') + esc(sc.replay) + '</button>' +
      (end.id === 'lost' ? '<button type="button" class="btn btn-ghost rv">' + ic('play') + esc(U.reviewVideo) + '</button>' : '') + '</div></div>';
    ctx.root.innerHTML = h + sideHtml(total);
    var toq = $('.toq', ctx.root);
    toq.setAttribute('aria-disabled', passed ? 'false' : 'true');
    setNext(passed);
    toq.addEventListener('click', function () { if (passed) go(ctx.i + 1); });
    $('.rep', ctx.root).addEventListener('click', function () {
      ctx.track('click', { item: 'replay_scenario' });
      S.scen.pts = [null, null, null]; S.scen.picks = [null, null, null]; S.scen.play++; S.scen.passed = false;
      ['3.6.2', '3.6.3', '3.6.4', '3.6.5'].forEach(function (id) { delete S.done[id]; delete S.data[id]; });
      save(); go(idx('3.6.2'));
    });
    var rv = $('.rv', ctx.root); if (rv) rv.addEventListener('click', function () { openReviewVideo(); });
    if (end.id === 'win') ctx.narrate('3.6.5', sc.endVo);
  };

  /* ----- quiz ----- */
  function qOf(slot) { return M.quiz.questions[S.quiz.order[slot]]; }
  function shortAnswer(q, display) {
    if (q.type === 'match') return 'المطابقة الصحيحة للأربع';
    if (q.type === 'order') return 'الترتيب الصحيح كاملاً';
    if (q.id === 'q5') return display || q.answerText;
    return q.answerText;
  }
  function answerText(q, a) {
    if (!a) return '';
    if (q.type === 'mcq' || q.type === 'tf') { var o = q.options.filter(function (x) { return x.id === a.value; })[0]; return o ? o.t : ''; }
    if (q.type === 'match') return q.pairs.map(function (p) { return p.t + ' ← ' + (a.value[p.id] ? layerName(a.value[p.id]) : '—'); }).join(' · ');
    if (q.type === 'order') return a.value.map(function (id) { return q.items.filter(function (x) { return x.id === id; })[0].t; }).join(' ← ');
    return '';
  }

  R.quiz = function (def, ctx) {
    var q = qOf(def.slot), d = ctx.data, A = S.quiz.answers[q.id];
    var locked = !!A;
    if (!d.att || d.att !== S.quiz.attempt) { d.att = S.quiz.attempt; d.order = null; d.val = null; }
    T.ctx.screen_id = q.screen;
    ctx.root.classList.add('s-quiz');
    ctx.root.innerHTML = '<span class="qtag">' + esc(q.typeLabel) + '</span><p class="q-text" id="qtext">' + esc(q.q) + '</p><div class="q-area" style="flex:1;min-height:0"></div>' +
      '<div class="q-foot"><button type="button" class="btn btn-navy submit" aria-disabled="true">' + esc(U.submit) + ic('send') + '</button></div>';
    var area = $('.q-area', ctx.root), submit = $('.submit', ctx.root);
    var val = locked ? A.value : d.val;
    var displayLetter = '';
    function canSubmit() {
      if (locked) return false;
      if (q.type === 'mcq' || q.type === 'tf') return !!val;
      if (q.type === 'match') return val && q.pairs.every(function (p) { return val[p.id]; });
      if (q.type === 'order') return !!val;
      return false;
    }
    function upd() { submit.setAttribute('aria-disabled', canSubmit() ? 'false' : 'true'); submit.hidden = locked; d.val = val; }
    var dnd = null;

    if (q.type === 'mcq' || q.type === 'tf') {
      var opts = q.type === 'tf' ? q.options : (d.order ? d.order.map(function (id) { return q.options.filter(function (o) { return o.id === id; })[0]; }) : shuffle(q.options));
      d.order = opts.map(function (o) { return o.id; });
      var box = el('<div class="' + (q.type === 'tf' ? 'tf-row' : 'opts') + '" role="radiogroup" aria-labelledby="qtext"></div>');
      opts.forEach(function (op, j) {
        var on = val === op.id;
        var cls = 'opt' + (locked ? (op.correct ? ' right' : on ? ' wrong' : ' locked') : '');
        var b = el('<button type="button" class="' + cls + '" role="radio" aria-checked="' + on + '">' + (q.type === 'tf' ? '' : '<span class="letter">' + LETTERS[j] + '</span>') + '<span>' + esc(op.t) + '</span></button>');
        if (op.correct) displayLetter = LETTERS[j];
        if (locked) b.disabled = true;
        b.addEventListener('click', function () {
          val = op.id;
          $$('.opt', box).forEach(function (x) { x.setAttribute('aria-checked', 'false'); });
          b.setAttribute('aria-checked', 'true'); upd();
        });
        box.appendChild(b);
      });
      area.appendChild(box);
    }

    if (q.type === 'match') {
      val = val || {};
      var rows = d.order ? d.order.map(function (id) { return q.pairs.filter(function (p) { return p.id === id; })[0]; }) : shuffle(q.pairs);
      d.order = rows.map(function (p) { return p.id; });
      var useSelect = mobileMQ.matches;
      var wrap = el('<div class="match-wrap"><div class="match-rows"></div>' + (useSelect || locked ? '' : '<div class="palette" role="group" aria-label="' + esc(U.choose) + '"><p class="counter">' + esc(U.tapCard) + '</p></div>') + '</div>');
      var mrows = $('.match-rows', wrap);
      rows.forEach(function (p) {
        var r = el('<div class="mrow"><span class="note">' + ic('strip') + esc(p.t) + '</span><div class="mslot" data-zone="' + p.id + '" aria-label="' + esc(p.t) + '"></div></div>');
        var s = $('.mslot', r);
        if (useSelect && !locked) {
          var sel = el('<select aria-label="' + esc(p.t + ' · ' + U.choose) + '"><option value="">' + esc(U.choose) + '</option>' + SC.layers.map(function (l) { return '<option value="' + l.id + '">' + esc(l.t) + '</option>'; }).join('') + '</select>');
          sel.value = val[p.id] || '';
          sel.addEventListener('change', function () { val[p.id] = sel.value || undefined; if (!sel.value) delete val[p.id]; s.classList.toggle('filled', !!sel.value); upd(); });
          s.appendChild(sel); s.classList.toggle('filled', !!val[p.id]);
        } else paintSlot(s, p);
        mrows.appendChild(r);
      });
      function paintSlot(s, p) {
        var v = val[p.id];
        s.classList.toggle('filled', !!v);
        if (locked) { s.classList.add(v === p.zone ? 'right' : 'wrong'); s.innerHTML = esc(v ? layerName(v) : '—') + (v !== p.zone ? ' <span class="counter">(' + esc(layerName(p.zone)) + ')</span>' : ''); }
        else s.innerHTML = v ? esc(layerName(v)) : '<span>' + esc(U.choose) + '</span>';
      }
      area.appendChild(wrap);
      if (!useSelect && !locked) {
        var pal = $('.palette', wrap);
        SC.layers.forEach(function (l) { pal.appendChild(el('<button type="button" class="dcard" data-id="' + l.id + '" aria-pressed="false">' + esc(l.t) + '</button>')); });
        dnd = DnD.attach({
          root: pal, items: function () { return $$('.dcard', pal); }, zones: function () { return $$('.mslot', wrap); },
          scale: function () { return scale; }, announce: announce, pickedText: U.picked,
          zoneLabel: function (z) { return q.pairs.filter(function (p) { return p.id === z.getAttribute('data-zone'); })[0].t; },
          onDrop: function (b, z) {
            var pid = z.getAttribute('data-zone');
            val[pid] = b.getAttribute('data-id');
            paintSlot(z, q.pairs.filter(function (p) { return p.id === pid; })[0]);
            sfx('click'); upd();
          }
        });
      }
    }

    if (q.type === 'order') {
      if (!val) {
        var ids = q.items.map(function (x) { return x.id; }), sh;
        do { sh = shuffle(ids); } while (sh.join() === ids.join());
        val = sh;
      }
      var list = el('<div class="ord-list" role="list"></div>');
      function paintOrder() {
        list.innerHTML = '';
        val.forEach(function (id, j) {
          var it = q.items.filter(function (x) { return x.id === id; })[0];
          var st = locked ? (q.items[j].id === id ? ' right' : ' wrong') : '';
          var row = el('<div class="ord-item ord-slot" role="listitem" data-zone="' + j + '"><span class="pos">' + esc(q.slots[j]) + '</span>' +
            '<button type="button" class="dcard' + st + '" data-id="' + id + '" aria-pressed="false" aria-label="' + esc(q.slots[j] + ': ' + it.t) + '">' + ic('strip') + '<span>' + esc(it.t) + '</span></button>' +
            (locked ? '' : '<span class="ord-btns"><button type="button" class="rbtn up" aria-label="' + esc(U.up + ': ' + it.t) + '"' + (j === 0 ? ' disabled' : '') + '>' + ic('up') + '</button><button type="button" class="rbtn down" aria-label="' + esc(U.down + ': ' + it.t) + '"' + (j === val.length - 1 ? ' disabled' : '') + '>' + ic('down') + '</button></span>') + '</div>');
          if (locked) $('.dcard', row).disabled = true;
          list.appendChild(row);
        });
      }
      function swap(a, b, focusSel) {
        var t = val[a]; val[a] = val[b]; val[b] = t; paintOrder(); upd(); sfx('click');
        if (focusSel) { var f = $$('.ord-item', list)[b]; var x = f && $(focusSel, f); if (x && !x.disabled) x.focus(); else if (f) $('.dcard', f).focus(); }
        announce(val.map(function (id, j) { return q.slots[j] + ': ' + q.items.filter(function (x) { return x.id === id; })[0].t; }).join('، '));
      }
      list.addEventListener('click', function (e) {
        var row = e.target.closest('.ord-item'); if (!row || locked) return;
        var j = +row.getAttribute('data-zone');
        if (e.target.closest('.up')) swap(j, j - 1, '.up');
        else if (e.target.closest('.down')) swap(j, j + 1, '.down');
      });
      paintOrder();
      area.appendChild(list);
      if (!locked) {
        dnd = DnD.attach({
          root: list, items: function () { return $$('.dcard', list); }, zones: function () { return $$('.ord-slot', list); },
          scale: function () { return scale; }, announce: announce, pickedText: U.picked,
          zoneLabel: function (z) { return q.slots[+z.getAttribute('data-zone')]; },
          onDrop: function (b, z) {
            var from = val.indexOf(b.getAttribute('data-id')), to = +z.getAttribute('data-zone');
            if (from !== to) { var it = val.splice(from, 1)[0]; val.splice(to, 0, it); paintOrder(); upd(); sfx('click'); }
          }
        });
      }
    }
    if (dnd) ctx.onDispose(function () { dnd.destroy(); });
    upd();

    submit.addEventListener('click', function () {
      if (submit.getAttribute('aria-disabled') === 'true') return;
      var ok;
      if (q.type === 'mcq' || q.type === 'tf') ok = !!q.options.filter(function (o) { return o.id === val && o.correct; })[0];
      else if (q.type === 'match') ok = q.pairs.every(function (p) { return val[p.id] === p.zone; });
      else ok = val.join() === q.items.map(function (x) { return x.id; }).join();
      S.quiz.answers[q.id] = { value: val, correct: ok };
      if (dnd) { dnd.destroy(); dnd = null; }
      ctx.track('quiz_answer', { screen_id: q.screen, item: answerText(q, S.quiz.answers[q.id]), correct: ok, lo: q.lo });
      sfx(ok ? 'success' : 'wrong');
      locked = true; save();
      // re-render locked view behind the overlay
      R.quiz(def, rerender());
      var last = def.slot === 4;
      var title = ok ? U.correctTitle : U.wrongTitle + ' · ' + U.correctAnswer + shortAnswer(q, displayLetter);
      var body = (!ok && (q.type !== 'mcq' || q.id === 'q5') && q.type !== 'tf' ? '<p class="answer-line">' + esc(U.correctAnswer + q.answerText) + '</p>' : '') + reasonHtml(q.why, true);
      ctx.track('feedback_view', { screen_id: q.screen, item: 'السؤال ' + (def.slot + 1) });
      overlay({ head: ok ? 'green' : 'red', title: title, body: body,
        buttons: [{ label: last ? U.showResult : U.nextQ, icon: 'arrowL', onClick: function () { closeOverlay(true); S.done[def.id] = true; save(); go(ctx.i + 1); } }] });
    });
    function rerender() {
      ctx.dispose();
      var c2 = makeCtx(def, ctx.i);
      cur.ctx = c2; D.host.innerHTML = ''; D.host.appendChild(c2.root);
      c2.root.style.animation = 'none';
      return c2;
    }
    if (locked) setNext(true);
    else if (q.vo) ctx.narrate(q.screen + '.1', q.vo);
  };

  /* ----- quiz result ----- */
  function quizScore() { return M.quiz.questions.filter(function (q) { var a = S.quiz.answers[q.id]; return a && a.correct; }).length; }
  function scores() {
    var all = SC['3.5.2'].cards.concat(SC['3.5.3'].cards);
    return {
      dnd: S.done['3.5.3'] ? all.filter(function (k) { return S.dndFirst[k.id]; }).length : null,
      scenario: S.scen.total, scenarioEnding: S.scen.ending,
      quiz: S.quiz.score, quizPassed: S.quiz.passed, complete: S.moduleDone
    };
  }
  function completionMet() {
    var lesson = ['3.3.1', '3.3.2', '3.3.3', '3.3.4', '3.3.5', '3.3.6'].every(function (id) { return S.done[id]; });
    return lesson && S.video.explainer.done && !!S.done['3.5.3'] && S.scen.total >= 24 && S.quiz.passed;
  }

  R.quizResult = function (def, ctx) {
    var Q = M.quiz, score = quizScore(), passed = score >= Q.passScore;
    var wrong = Q.questions.filter(function (q) { var a = S.quiz.answers[q.id]; return !(a && a.correct); });
    S.quiz.score = score; S.quiz.passed = passed;
    if (S.quiz.logged !== S.quiz.attempt) {
      S.quiz.logged = S.quiz.attempt;
      ctx.track('quiz_complete', { score: score, correct: passed, item: wrong.map(function (q) { return q.id; }).join(','), attempt: S.quiz.attempt });
      sfx(passed ? 'success' : 'wrong');
      if (T.scorm.on) { T.scorm.score(100 * score / 5); }
      if (passed && completionMet() && !S.moduleDone) {
        S.moduleDone = true;
        if (!S.lessonDone) { S.lessonDone = true; ctx.track('lesson_complete', { item: '1.1' }); }
        ctx.track('module_complete', { score: score, correct: true, item: wrong.map(function (q) { return q.id; }).join(',') });
        if (T.scorm.on) T.scorm.status('passed');
        T.post('complete', { step: NSTEPS, percent: 100, scores: scores() });
      } else if (!passed && T.scorm.on) T.scorm.status('failed');
      T.post('score', { scores: scores() });
    }
    S.done[def.id] = true; save();
    ctx.root.classList.add('s-res');
    var list = Q.questions.map(function (q, i) {
      var a = S.quiz.answers[q.id], ok = a && a.correct;
      return '<div class="res-item"><span class="mk ' + (ok ? 'ok' : 'no') + '">' + ic(ok ? 'check' : 'x') + '</span><span class="grow">' + esc('السؤال ' + (i + 1) + ' · ' + q.q) + '</span>' +
        (ok ? '' : '<button type="button" class="linkbtn" data-link="' + q.link + '">' + esc(U.goTo + ' ' + Q.links[q.link]) + '</button>') + '</div>';
    }).join('');
    ctx.root.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px">' + ringHtml(score, 5, Q.scoreCaption) +
      (passed ? '<span style="font-size:40px;color:var(--gold)">' + ic('star') + '</span>' : '') + '</div>' +
      '<div class="res-side"><p class="q-text">' + esc(passed ? Q.pass : fmt(Q.fail, score)) + '</p><div class="res-list" aria-label="' + esc(Q.listTitle) + '">' + list + '</div><div class="btn-row"></div></div>';
    var row = $('.btn-row', ctx.root), markReviewed = null;
    function btn(label, cls, icon, fn, dis) {
      var b = el('<button type="button" class="btn ' + cls + '">' + (icon ? ic(icon) : '') + esc(label) + '</button>');
      if (dis) b.setAttribute('aria-disabled', 'true');
      b.addEventListener('click', function () { if (b.getAttribute('aria-disabled') === 'true') return; fn(b); });
      row.appendChild(b); return b;
    }
    if (passed) {
      btn(U.finish, 'btn-navy', 'star', function () { finishModule(); });
      btn(U.review, 'btn-ghost', 'text', reviewAnswers);
    } else {
      var retake;
      markReviewed = function () { S.quiz.reviewed = true; save(); retake.setAttribute('aria-disabled', 'false'); retake.className = 'btn btn-navy'; retake.focus(); };
      btn(U.reviewVideo, 'btn-navy', 'play', function () { openReviewVideo(markReviewed); });
      retake = btn(U.retakeQuiz, S.quiz.reviewed ? 'btn-navy' : 'btn-ghost', 'replay', function () {
        ctx.track('click', { item: 'retake_quiz' });
        S.quiz.order = shuffle([0, 1, 2, 3, 4]); S.quiz.answers = {}; S.quiz.attempt++; S.quiz.reviewed = false; S.quiz.passed = false; S.quiz.score = null;
        M.steps.forEach(function (s) { if (s.type === 'quiz' || s.type === 'quizResult') { delete S.done[s.id]; delete S.data[s.id]; } });
        save(); go(idx('3.7.1'));
      }, !S.quiz.reviewed);
      btn(U.review, 'btn-ghost', 'text', reviewAnswers);
    }
    ctx.root.addEventListener('click', function (e) {
      var l = e.target.closest('[data-link]'); if (!l) return;
      var k = l.getAttribute('data-link');
      ctx.track('click', { item: 'link_' + k });
      if (k === 'explainer') openReviewVideo(markReviewed);
      else if (k === 'dnd') go(idx('3.5.2'));
      else go(idx('3.6.2'));
    });
    animRing(ctx.root);
    if (passed) ctx.narrate('3.7.6', Q.passVo);
  };

  function reviewAnswers() {
    var Q = M.quiz;
    var body = Q.questions.map(function (q, i) {
      var a = S.quiz.answers[q.id], ok = a && a.correct;
      return '<div class="card" style="padding:12px 16px;box-shadow:none"><p style="font-weight:700">' + ic(ok ? 'check' : 'x') + ' ' + esc('السؤال ' + (i + 1) + ': ' + q.q) + '</p>' +
        '<p>' + esc(U.yourAnswer + (answerText(q, a) || '—')) + '</p>' + (ok ? '' : '<p class="answer-line">' + esc(U.correctAnswer + q.answerText) + '</p>') +
        '<p class="counter">' + esc(q.why) + '</p></div>';
    }).join('');
    T.track('click', { item: 'review_answers' });
    overlay({ head: 'navy', icon: 'text', title: U.review, body: body, cls: 'wide', dismissable: true, buttons: [{ label: U.close, cls: 'btn-gold', onClick: function () { closeOverlay(); } }] });
  }

  /* ----- survey & completion ----- */
  function finishModule() {
    if (!S.moduleDone && completionMet()) { S.moduleDone = true; save(); }
    if (S.survey) return completionCard();
    var ans = { q1: 0, q2: 0, comment: '' };
    function starsHtml(k) {
      return '<div class="stars" role="radiogroup" aria-label="' + esc(k === 'q1' ? U.surveyQ1 : U.surveyQ2) + '">' + [1, 2, 3, 4, 5].map(function (n) {
        return '<button type="button" role="radio" aria-checked="false" aria-label="' + n + ' ' + U.of + ' 5" data-k="' + k + '" data-n="' + n + '">' + ic('star') + '</button>';
      }).join('') + '</div>';
    }
    var body = el('<div style="display:flex;flex-direction:column;gap:14px"><p class="counter">' + esc(U.surveyNote) + '</p>' +
      '<div class="sv-q"><label>' + esc(U.surveyQ1) + '</label>' + starsHtml('q1') + '</div>' +
      '<div class="sv-q"><label>' + esc(U.surveyQ2) + '</label>' + starsHtml('q2') + '</div>' +
      '<div class="sv-q"><label for="sv-c">' + esc(U.surveyQ3) + '</label><textarea id="sv-c" maxlength="200"></textarea><span class="sv-count">0 / 200</span></div></div>');
    body.addEventListener('click', function (e) {
      var b = e.target.closest('.stars button'); if (!b) return;
      var k = b.getAttribute('data-k'), n = +b.getAttribute('data-n'); ans[k] = n;
      $$('.stars button[data-k="' + k + '"]', body).forEach(function (x) {
        var m = +x.getAttribute('data-n'); x.classList.toggle('on', m <= n); x.setAttribute('aria-checked', m === n ? 'true' : 'false');
      });
    });
    var ta = $('textarea', body);
    ta.addEventListener('input', function () { $('.sv-count', body).textContent = ta.value.length + ' / 200'; });
    overlay({
      head: 'navy', icon: 'star', title: U.surveyTitle, body: body,
      buttons: [
        { label: U.surveySend, icon: 'send', onClick: function () {
          ans.comment = ta.value.slice(0, 200);
          S.survey = ans; save();
          T.track('survey', { screen_id: '3.7.6', value: JSON.stringify(ans) });
          completionCard();
        } },
        { label: U.surveySkip, cls: 'btn-ghost', onClick: function () { S.survey = { skipped: true }; save(); completionCard(); } }
      ]
    });
  }
  function completionCard() {
    var sc = scores();
    sfx('success');
    overlay({
      head: 'green', icon: 'star', title: U.doneTitle,
      body: '<div class="done-hero"><span class="bigstar">' + ic('star') + '</span><h3>' + esc(U.doneTitle) + '</h3><p>' + esc(U.doneLine) + '</p>' +
        '<div class="score-grid">' +
        '<div class="score-cell"><b>' + ic('check') + '</b><span>' + esc(U.sumLesson + ' · ' + U.complete) + '</span></div>' +
        '<div class="score-cell"><b>' + (sc.dnd == null ? '—' : sc.dnd) + ' / 11</b><span>' + esc(U.sumDnd) + '</span></div>' +
        '<div class="score-cell"><b>' + (sc.scenario == null ? '—' : sc.scenario) + ' / 30</b><span>' + esc(U.sumScen) + '</span></div>' +
        '<div class="score-cell"><b>' + (sc.quiz == null ? '—' : sc.quiz) + ' / 5</b><span>' + esc(U.sumQuiz) + '</span></div></div></div>',
      buttons: [{ label: U.review, cls: 'btn-ghost', onClick: reviewAnswers }, { label: U.close, cls: 'btn-gold', onClick: function () { closeOverlay(); } }],
      dismissable: true
    });
  }

  /* ================= sign-in ================= */
  function nameOk(n) { n = (n || '').trim().replace(/\s+/g, ' '); return n.length >= 3 && n.length <= 60 ? n : null; }

  function signIn() {
    var box = $('#signin'), form = $('.si-form', box);
    box.hidden = false;
    var stored = storedLearner();
    function welcome(l) {
      form.innerHTML = '<div class="wm">' + ic('bottle') + esc(M.wordmark) + '</div>' +
        '<h2>' + esc(U.welcome + l.name) + '</h2><p class="instr">' + esc(U.signinLine) + '</p>' +
        '<div class="si-actions"><button type="button" class="btn btn-navy go">' + esc(U.start) + ic('arrowL') + '</button>' +
        '<button type="button" class="linkbtn swap">' + esc(U.notYou) + '</button></div><p class="si-privacy">' + esc(U.privacy) + '</p>';
      $('.go', form).addEventListener('click', function () { begin(l, true); });
      $('.swap', form).addEventListener('click', function () { try { localStorage.removeItem(KEY + 'learner'); } catch (err) { /* ignore */ } fresh_form(); });
      $('h2', form).setAttribute('tabindex', '-1'); setTimeout(function () { $('.go', form).focus(); }, 50);
    }
    function fresh_form() {
      form.innerHTML = '<div class="wm">' + ic('bottle') + esc(M.wordmark) + '</div><h2>' + esc(U.signinHeading) + '</h2><p class="instr">' + esc(U.signinLine) + '</p>' +
        '<div class="field"><label for="si-name">' + esc(U.nameLabel) + '</label><input id="si-name" type="text" autocomplete="name" maxlength="60" required aria-required="true" aria-describedby="si-err" placeholder="' + esc(U.namePh) + '"><div class="err" id="si-err" aria-live="polite"></div></div>' +
        '<div class="si-actions"><button type="button" class="btn btn-navy go" aria-disabled="true">' + esc(U.start) + ic('arrowL') + '</button>' +
        (C.DEMO ? '<button type="button" class="btn btn-ghost guest">' + esc(U.guest) + '</button>' : '') + '</div>' +
        '<p class="si-privacy">' + esc(U.privacy) + '</p>';
      var inp = $('#si-name', form), go_ = $('.go', form), err = $('#si-err', form), touched = false;
      function check() {
        var ok = nameOk(inp.value);
        go_.setAttribute('aria-disabled', ok ? 'false' : 'true');
        inp.setAttribute('aria-invalid', ok || !touched ? 'false' : 'true');
        err.textContent = !ok && touched ? U.nameError : '';
        return ok;
      }
      inp.addEventListener('input', check);
      inp.addEventListener('blur', function () { if (inp.value) { touched = true; check(); } });
      function submit() {
        touched = true; var n = check(); if (!n) { inp.focus(); return; }
        var l = { id: 'L-' + T.rand(8), name: n };
        storeLearner(l); begin(l, false);
      }
      go_.addEventListener('click', submit);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      var g = $('.guest', form);
      if (g) g.addEventListener('click', function () { begin({ id: 'GUEST-' + T.rand(8), name: U.guestName, guest: true }, false); });
      setTimeout(function () { inp.focus(); }, 50);
    }
    if (stored && stored.id && stored.name) welcome(stored); else fresh_form();
  }

  function begin(l, returning) {
    learner = l; T.setLearner({ id: l.id, name: l.name });
    var saved = load(l.id);
    T.track('login', { item: l.name, screen_id: 'signin' });
    var progressed = saved && (saved.step > 0 || Object.keys(saved.done || {}).length);
    if (progressed) {
      var form = $('#signin .si-form');
      form.innerHTML = '<div class="wm">' + ic('bottle') + esc(M.wordmark) + '</div><h2 tabindex="-1">' + esc(U.resumeQ) + '</h2><p class="instr">' + esc(U.welcome + l.name) + '</p>' +
        '<div class="si-actions"><button type="button" class="btn btn-navy res">' + esc(U.resume) + ic('arrowL') + '</button><button type="button" class="btn btn-ghost rst">' + esc(U.restart) + '</button></div>';
      $('.res', form).addEventListener('click', function () { start(saved); });
      $('.rst', form).addEventListener('click', function () { var s = fresh(); s.queue = saved.queue || []; start(s, true); });
      setTimeout(function () { $('.res', form).focus(); }, 50);
    } else start(saved || fresh());
  }

  function start(state, reset) {
    S = state;
    if (!S.scen) S = fresh();
    T.setQueue(S.queue || []);
    if (reset) T.track('click', { item: 'restart', screen_id: 'signin' });
    // warm up audio on this user gesture
    Object.keys(SFX).forEach(function (k) { try { SFX[k].load(); } catch (err) { /* ignore */ } });
    $('#signin').hidden = true;
    $('#app').hidden = false;
    save();
    go(Math.min(S.step || 0, NSTEPS - 1));
    T.flush();
  }

  /* ================= boot ================= */
  function boot() {
    refs();
    document.documentElement.classList.toggle('rm', rm());
    if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', function () { document.documentElement.classList.toggle('rm', rm()); });
    buildProgress();
    fit();
    window.addEventListener('resize', fit);
    if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', fit);
    // static icons
    $$('[data-ic]').forEach(function (n) { n.innerHTML = ic(n.getAttribute('data-ic')) + n.innerHTML; });
    var bb = ''; for (var b = 0; b < 7; b++) bb += ic('bottle'); $('#band-bottles').innerHTML = bb;
    D.prev.innerHTML = ic('arrowR') + '<span>' + esc(U.prev) + '</span>';
    D.next.innerHTML = '<span>' + esc(U.next) + '</span>' + ic('arrowL');
    D.replay.innerHTML = ic('replay'); D.replay.setAttribute('aria-label', U.replay);
    D.mute.setAttribute('aria-label', U.mute);
    updMute(); updPlay();

    D.next.addEventListener('click', function () {
      if (D.next.getAttribute('aria-disabled') === 'true') { announce(U.next + ': ' + 'أكمل النشاط أولاً'); return; }
      goNext();
    });
    D.prev.addEventListener('click', function () { if (cur && cur.i > 0) go(cur.i - 1); });
    D.play.addEventListener('click', function () { if (ctl) ctl.toggle(); else N.toggle(); updPlay(); });
    D.replay.addEventListener('click', function () { if (ctl) ctl.replay(); else N.replay(); });
    D.mute.addEventListener('click', function () {
      prefs.mute = !prefs.mute; savePrefs(); updMute(); N.setMute(prefs.mute);
      if (ctl && ctl.mute) ctl.mute(prefs.mute);
      $$('video').forEach(function (v) { v.muted = prefs.mute; });
    });

    // signin static text
    $('#si-title').textContent = M.title;
    $('#si-sub').textContent = M.subtitle;
    $('#si-est').innerHTML = ic('clock') + esc(M.estTime);
    $('#si-art-ic').innerHTML = ic('pyramid');

    T.scorm.init();

    // learner from URL, LMS, or parent page
    var qs = new URLSearchParams(location.search);
    var urlName = nameOk(qs.get('name'));
    var lmsName = T.scorm.on ? nameOk((T.scorm.learnerName() || '').split(',').reverse().join(' ').trim()) : null;
    var given = urlName || lmsName;
    if (given) return autoBegin(given);
    signIn();
    window.addEventListener('message', function (e) {
      var m = e.data; if (!m || typeof m !== 'object' || learner) return;
      if (m.type === 'asaq-learner' || m.type === 'learner') { var n = nameOk(m.name); if (n) autoBegin(n); }
    });
    if (window.parent !== window) T.post('ready', {});
  }
  function autoBegin(name) {
    var st = storedLearner();
    var l = st && st.name === name ? st : { id: 'L-' + T.rand(8), name: name };
    storeLearner(l);
    $('#signin').hidden = false;
    begin(l, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
