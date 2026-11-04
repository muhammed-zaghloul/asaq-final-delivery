/* =====================================================================
   shield.js · Protection layer (deterrence, not security)
   Muhammed Zaghloul · ASAQ final delivery website

   Loaded first on every site page AND injected into every app page
   under /apps/ by scripts/patch-apps.mjs.

   What it does:
   - blocks right-click, text selection, copy/cut, native drag of media,
     print, and the common view-source / developer-tools shortcuts;
   - keeps typing, pasting and selecting inside form fields working;
   - shows an overlay while docked developer tools are detected;
   - sends /apps/... pages opened on their own back to their task page;
   - turns in-app file links into the site's protected file viewer.

   Honest limit: anything a browser displays can still be captured
   (screenshots, disabling JavaScript, reading the network).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Settings (safe to edit) ---------- */
  var DEVTOOLS_GUARD = true;   // set to false to switch the developer-tools overlay off
  var GAP_WIDTH = 400;         // px of extra window width (beyond the page) that counts as "docked tools"
  var GAP_HEIGHT = 300;        // px of extra window height that counts as "docked tools"
  var GAP_TOP_MIN = 24;        // px: a normal browser window always has at least this much toolbar above the page
  var CHECK_EVERY_MS = 1000;

  if (window.__mzShield) return;   // safe to load twice
  window.__mzShield = true;

  var doc = document;
  var framed = (function () { try { return window.top !== window.self; } catch (e) { return true; } })();

  /* ---------- 1. App pages must be used through the website ---------- */
  // Targets are relative to the site root; the way back up is worked out from the app page's
  // own address, so this works on a web server and when the site is opened as local files.
  var APP_HOME = { 'task2-module': 'task-2/index.html#demo', 'task4-game': 'task-4/index.html#demo', 'task5-lms': 'task-5/index.html#demo' };
  var m = location.pathname.match(/\/apps\/(([^\/]+)\/.*)$/);
  if (m && !framed) {
    var up = new Array(m[1].split('/').length + 1).join('../');   // apps/<name>/index.html -> "../../"
    location.replace(up + (APP_HOME[m[2]] || 'index.html'));
    return;
  }
  // Local files (file://) have no shared origin, so messages to the site page use "*" there.
  var MSG_TARGET = location.protocol === 'file:' ? '*' : location.origin;

  /* ---------- 2. CSS: no selection, no callout, print disabled ---------- */
  var css =
    'html{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    'input,textarea,select,[contenteditable],[contenteditable] *{-webkit-user-select:text;-moz-user-select:text;user-select:text;-webkit-touch-callout:default}' +
    'img,video,svg,a{-webkit-user-drag:none}' +
    '@media print{html body *{display:none!important}html body::after{content:"Printing is disabled for this submission. \\00A9  Muhammed Zaghloul";display:block!important;position:fixed;top:45%;left:0;right:0;text-align:center;font:600 16pt/1.4 Poppins,Arial,sans-serif;color:#000;visibility:visible}html body{background:#fff!important}}';
  var style = doc.createElement('style');
  style.setAttribute('data-mz', 'shield');
  style.textContent = css;
  (doc.head || doc.documentElement).appendChild(style);

  /* ---------- helpers ---------- */
  function isField(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest && el.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return true;
    return !!el.isContentEditable;
  }
  function stop(e) { e.preventDefault(); e.stopPropagation(); }
  function opt(capture) { return { capture: capture, passive: false }; }

  /* ---------- 3. Mouse, selection, clipboard, drag ---------- */
  doc.addEventListener('contextmenu', function (e) { stop(e); }, opt(true));
  doc.addEventListener('selectstart', function (e) { if (!isField(e.target)) stop(e); }, opt(true));
  doc.addEventListener('copy', function (e) { if (!isField(e.target)) stop(e); }, opt(true));
  doc.addEventListener('cut', function (e) { if (!isField(e.target)) stop(e); }, opt(true));
  doc.addEventListener('paste', function (e) { if (!isField(e.target)) stop(e); }, opt(true));
  // Only native drag of media and links is blocked; pointer-based drag & drop keeps working.
  doc.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    if (t && t.closest && t.closest('img, a, video, svg')) stop(e);
  }, opt(true));

  /* ---------- 4. Keyboard shortcuts ---------- */
  doc.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var code = e.code || '';
    var mod = e.ctrlKey || e.metaKey;
    var letter = code.indexOf('Key') === 0 ? code.slice(3).toLowerCase() : k;
    var block = false;
    if (k === 'f12' || code === 'F12') block = true;
    else if (mod && e.shiftKey && 'ijck'.indexOf(letter) > -1 && letter.length === 1) block = true;     // Ctrl/Cmd+Shift+I/J/C/K
    else if (e.metaKey && e.altKey && 'ijcu'.indexOf(letter) > -1 && letter.length === 1) block = true; // Cmd+Opt+I/J/C/U
    else if (mod && !e.altKey && (letter === 'u' || letter === 's' || letter === 'p')) block = true;    // view source, save, print
    else if (mod && !e.shiftKey && !e.altKey && (letter === 'a' || letter === 'c' || letter === 'x') && !isField(e.target)) block = true;
    if (block) stop(e);
    // Esc always leaves full screen (also when the focus is inside an app frame).
    if (k === 'escape') {
      try { var td = window.top.document; if (td.fullscreenElement && td.exitFullscreen) td.exitFullscreen(); } catch (err) { /* ignore */ }
    }
  }, opt(true));

  /* ---------- 5. Print ---------- */
  window.addEventListener('beforeprint', function () { doc.documentElement.setAttribute('data-print-blocked', ''); });
  window.addEventListener('afterprint', function () { doc.documentElement.removeAttribute('data-print-blocked'); });

  /* ---------- 6. File links inside apps open the site's protected viewer ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-mz-file], a[href*="viewer/index.html?f="], a[href*="/viewer/?f="]') : null;
    if (!a || !framed) return;
    var key = a.getAttribute('data-mz-file') || decodeURIComponent((a.getAttribute('href').split('f=')[1] || '').split('&')[0]);
    var msg = { source: 'mz-app', type: 'open-file', key: key };
    try {
      if (window.top.MZ && typeof window.top.MZ.openFile === 'function') {
        e.preventDefault();
        window.top.postMessage(msg, MSG_TARGET);
      }
    } catch (err) {
      // Opened as local files, the browser hides the site page from the app frame;
      // ask it by message instead (the site page only accepts this from its own frames).
      if (location.protocol === 'file:') { e.preventDefault(); window.top.postMessage(msg, '*'); }
      /* otherwise fall back to the link itself (target=_top) */
    }
  }, true);

  /* ---------- 7. Console notice ---------- */
  try {
    console.log('%cThis content is protected. © Muhammed Zaghloul.', 'font:600 14px Poppins,Arial,sans-serif;color:#A78BFA;padding:6px 0');
  } catch (e) { /* ignore */ }

  /* ---------- 8. Developer-tools guard ---------- */
  // Browser zoom changes innerWidth but not outerWidth, so a plain "outer - inner"
  // check fires at 125% zoom. Instead we ask: is there a zoom level at which the
  // gap is just normal browser chrome? Docked tools leave a gap no zoom explains.
  var ZOOMS = [0.5, 0.67, 0.75, 0.8, 0.85, 0.9, 1, 1.1, 1.15, 1.2, 1.25, 1.33, 1.5, 1.7, 1.75, 2, 2.4, 2.5, 3];
  function toolsOpen() {
    var ow = window.outerWidth, oh = window.outerHeight, iw = window.innerWidth, ih = window.innerHeight;
    if (!ow || !oh || !iw || !ih) return false;
    for (var i = 0; i < ZOOMS.length; i++) {
      var z = ZOOMS[i], gw = ow - iw * z, gh = oh - ih * z;
      var fullscreen = Math.abs(gw) <= 16 && Math.abs(gh) <= 16;
      if (fullscreen || (gw >= -16 && gw <= GAP_WIDTH && gh >= GAP_TOP_MIN && gh <= GAP_HEIGHT)) return false;
    }
    return true;
  }
  window.__mzToolsOpen = toolsOpen;  // exposed for QA

  var touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  var overlay = null;
  function showOverlay() {
    if (overlay || !doc.body) return;
    overlay = doc.createElement('div');
    overlay.id = 'mz-devtools';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Developer tools are disabled');
    overlay.tabIndex = -1;
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;' +
      'background:rgba(11,8,25,.55);-webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);';
    overlay.innerHTML = '<div style="max-width:440px;padding:28px 26px;border-radius:20px;text-align:center;' +
      'background:rgba(30,16,72,.85);border:1px solid rgba(196,181,253,.25);box-shadow:0 10px 40px rgba(10,4,30,.55);' +
      'color:#EDE9FE;font:500 17px/1.6 Poppins,Arial,sans-serif">' +
      '<div aria-hidden="true" style="width:48px;height:48px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;background:#7C3AED;color:#fff;font-size:22px">&#9888;</div>' +
      'Developer tools are disabled for this submission. Close them to continue.</div>';
    doc.body.appendChild(overlay);
    try { overlay.focus(); } catch (e) { /* ignore */ }
  }
  function hideOverlay() { if (overlay) { overlay.remove(); overlay = null; } }
  function check() { if (toolsOpen()) showOverlay(); else hideOverlay(); }

  if (DEVTOOLS_GUARD && !framed && !touch) {
    var start = function () { check(); setInterval(check, CHECK_EVERY_MS); window.addEventListener('resize', check); };
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
  }
})();
