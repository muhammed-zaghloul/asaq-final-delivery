/* =====================================================================
   ui.js · Shared interface helpers
   Muhammed Zaghloul · ASAQ final delivery website

   window.MZ = {
     icon(name)            -> inline SVG string
     toast(text)           -> short message at the bottom of the screen
     openModal(opts)       -> accessible dialog (focus trap, Esc, focus return)
     openFile(key)         -> protected Drive viewer for a files.js entry, in a modal
     fullscreen(el)        -> Fullscreen API on an element (fills the window if unsupported)
     reveal(root)          -> fade-up on scroll for .reveal elements
   }
   ===================================================================== */
(function () {
  'use strict';

  var I = {
    pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    live: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m10 8.5 4 2-4 2z" fill="currentColor"/>',
    video: '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    sample: '<path d="M12 3 21 12 12 21 3 12z"/><path d="M8 12h8"/>',
    check: '<path d="M5 12.5 10 17l9-10"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    play: '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (I[name] || '') + '</svg>';
  }

  /* ---------- toast ---------- */
  var toastEl = null, toastT = null;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); document.body.appendChild(toastEl); }
    toastEl.textContent = text;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  }

  /* ---------- modal ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';
  function openModal(opts) {
    var opener = document.activeElement;
    var wrap = document.createElement('div');
    wrap.className = 'modal';
    var id = 'm' + Date.now();
    wrap.innerHTML = '<div class="modal-box glass" role="dialog" aria-modal="true" aria-labelledby="' + id + '">' +
      '<div class="modal-head"><h2 id="' + id + '"></h2><button type="button" class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="modal-body"></div><span class="sr-only" tabindex="0" data-end></span></div>';
    wrap.querySelector('h2').textContent = opts.title || '';
    var body = wrap.querySelector('.modal-body');
    document.body.appendChild(wrap);
    document.body.classList.add('modal-open');
    // Everything behind the dialog becomes inert for keyboard and screen readers.
    var siblings = Array.prototype.filter.call(document.body.children, function (c) { return c !== wrap && !c.hasAttribute('inert') && c.tagName !== 'SCRIPT'; });
    siblings.forEach(function (c) { c.setAttribute('inert', ''); c.setAttribute('data-mz-inert', ''); });
    if (opts.build) opts.build(body);

    function close() {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocusIn, true);
      siblings.forEach(function (c) { c.removeAttribute('inert'); c.removeAttribute('data-mz-inert'); });
      wrap.remove();
      document.body.classList.remove('modal-open');
      if (opener && opener.focus) opener.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(wrap.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null || x === document.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !wrap.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !wrap.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    // Focus can leave through an embedded frame; the end sentinel sends it back to the top.
    wrap.querySelector('[data-end]').addEventListener('focus', function () { wrap.querySelector('[data-close]').focus(); });
    var onFocusIn = function (e) { if (!wrap.contains(e.target)) wrap.querySelector('[data-close]').focus(); };
    document.addEventListener('focusin', onFocusIn, true);
    wrap.addEventListener('click', function (e) { if (e.target === wrap || e.target.closest('[data-close]')) close(); });
    wrap.querySelector('[data-close]').focus();
    return { close: close, body: body };
  }

  /* ---------- protected file viewer in a modal ---------- */
  function openFile(key) {
    var f = (window.FILES || {})[key];
    if (!f) return;
    openModal({ title: f.title, build: function (body) { window.MZDrive.mount(body, key, { eager: true }); } });
  }
  // Apps (same origin) ask for a file with postMessage; only this site's own pages are trusted.
  // Opened as local files (file://) every page has an opaque origin, so there a message is
  // trusted only when it comes from one of this page's own frames.
  function trusted(e) {
    if (location.protocol !== 'file:') return e.origin === location.origin;
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) if (frames[i].contentWindow === e.source) return true;
    return false;
  }
  window.addEventListener('message', function (e) {
    if (!trusted(e)) return;
    var d = e.data;
    if (d && d.source === 'mz-app' && d.type === 'open-file' && typeof d.key === 'string' && (window.FILES || {})[d.key]) openFile(d.key);
  });

  /* ---------- fullscreen ---------- */
  function fullscreen(el) {
    var req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) {
      try { var p = req.call(el); if (p && p.catch) p.catch(function () { pseudo(el); }); return; } catch (e) { /* fall through */ }
    }
    pseudo(el);
  }
  function pseudo(el) {
    el.classList.add('pseudo-fs');
    document.body.classList.add('modal-open');
    var btn = el.querySelector('.fs-exit');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'btn sm fs-exit'; btn.innerHTML = icon('close') + ' Exit full screen';
      el.appendChild(btn);
      btn.addEventListener('click', function () { exitPseudo(el); });
    }
    btn.focus();
    var onKey = function (e) { if (e.key === 'Escape') { exitPseudo(el); document.removeEventListener('keydown', onKey, true); } };
    document.addEventListener('keydown', onKey, true);
  }
  function exitPseudo(el) { el.classList.remove('pseudo-fs'); document.body.classList.remove('modal-open'); }

  /* ---------- reveal on scroll ---------- */
  function reveal(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.in)');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { Array.prototype.forEach.call(els, function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  window.MZ = { icon: icon, toast: toast, openModal: openModal, openFile: openFile, fullscreen: fullscreen, reveal: reveal, trusted: trusted };
})();
